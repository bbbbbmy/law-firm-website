/**
 * @jest-environment node
 */
/**
 * /api/admin/careers 的读写测试。
 *
 * 重点是 PUT 的覆盖语义：整份按语言覆盖，缺字段回落到默认文案，
 * cards / jobs 整表替换（sortOrder 上有唯一约束，局部更新容易撞键）。
 *
 * 注：jsdom 环境没有全局 Request，这里传一个只实现 json() 的最小替身，
 *     route handler 只用到 request.json()。
 */

const mockCareersUpsert = jest.fn()
const mockCardDeleteMany = jest.fn()
const mockCardCreateMany = jest.fn()
const mockJobDeleteMany = jest.fn()
const mockJobCreateMany = jest.fn()
const mockCareersFindUnique = jest.fn()

// $transaction 直接执行回调，回调里的 tx 就是同一个 prisma 替身
jest.mock('@/lib/prisma', () => {
  const tx = {
    careersContent: {
      upsert: (...a: unknown[]) => mockCareersUpsert(...a),
      findUnique: (...a: unknown[]) => mockCareersFindUnique(...a),
    },
    careersCard: {
      deleteMany: (...a: unknown[]) => mockCardDeleteMany(...a),
      createMany: (...a: unknown[]) => mockCardCreateMany(...a),
    },
    careersJob: {
      deleteMany: (...a: unknown[]) => mockJobDeleteMany(...a),
      createMany: (...a: unknown[]) => mockJobCreateMany(...a),
    },
  }
  return {
    prisma: {
      ...tx,
      $transaction: (cb: (t: typeof tx) => unknown) => cb(tx),
    },
  }
})

import { GET, PUT } from '@/app/api/admin/careers/route'
import { DEFAULT_CARDS, DEFAULT_CONTENT, DEFAULT_JOBS } from '@/lib/careersContent'

const makeRequest = (body: unknown) =>
  ({ json: async () => body }) as unknown as Request

beforeEach(() => {
  jest.clearAllMocks()
  mockCareersUpsert.mockResolvedValue({ id: 'row-1' })
  mockCareersFindUnique.mockResolvedValue({ id: 'row-1' })
  mockCardDeleteMany.mockResolvedValue({ count: 0 })
  mockCardCreateMany.mockResolvedValue({ count: 0 })
  mockJobDeleteMany.mockResolvedValue({ count: 0 })
  mockJobCreateMany.mockResolvedValue({ count: 0 })
})

describe('GET /api/admin/careers', () => {
  it('returns both language rows', async () => {
    mockCareersFindUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null)
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('zh')
    expect(body).toHaveProperty('en')
  })

  it('falls back to the default copy when the DB read fails', async () => {
    mockCareersFindUnique.mockRejectedValue(new Error('P1000'))
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.fallback.zh.bannerTitle).toBe(DEFAULT_CONTENT.zh.bannerTitle)
    expect(body.fallback.en.jobsTitle).toBe(DEFAULT_CONTENT.en.jobsTitle)
  })
})

describe('PUT /api/admin/careers', () => {
  it('upserts by language and replaces cards + jobs', async () => {
    const res = await PUT(
      makeRequest({
        language: 'zh',
        bannerTitle: '新标题',
        cards: [{ title: '卡一', content: '正文', sortOrder: 0 }],
        jobs: [{ title: '岗一', tags: '标签', requirements: '要求', duties: '', sortOrder: 0 }],
      })
    )

    expect(res.status).toBe(200)
    expect(mockCareersUpsert).toHaveBeenCalledTimes(1)
    expect(mockCareersUpsert.mock.calls[0][0].where).toEqual({ language: 'zh' })

    // 整表替换：先删后建
    expect(mockCardDeleteMany).toHaveBeenCalledWith({ where: { careersId: 'row-1' } })
    expect(mockCardCreateMany).toHaveBeenCalledWith({
      data: [{ careersId: 'row-1', title: '卡一', content: '正文', sortOrder: 0 }],
    })
    expect(mockJobDeleteMany).toHaveBeenCalledWith({ where: { careersId: 'row-1' } })
  })

  it('fills missing text fields from the defaults instead of storing blanks', async () => {
    await PUT(makeRequest({ language: 'zh', bannerTitle: '只改这一个' }))

    const data = mockCareersUpsert.mock.calls[0][0].create
    expect(data.bannerTitle).toBe('只改这一个')
    expect(data.introTitle).toBe(DEFAULT_CONTENT.zh.introTitle)
    expect(data.supportTitle).toBe(DEFAULT_CONTENT.zh.supportTitle)
    expect(data.contactTitle).toBe(DEFAULT_CONTENT.zh.contactTitle)
  })

  it('seeds the default 3 cards and 4 jobs when none are sent', async () => {
    await PUT(makeRequest({ language: 'zh', bannerTitle: '标题' }))

    expect(mockCardCreateMany.mock.calls[0][0].data).toHaveLength(DEFAULT_CARDS.zh.length)
    expect(mockJobCreateMany.mock.calls[0][0].data).toHaveLength(DEFAULT_JOBS.zh.length)
  })

  it('reassigns sortOrder by array position when the client omits it', async () => {
    await PUT(
      makeRequest({
        language: 'zh',
        cards: [
          { title: 'A', content: 'a' },
          { title: 'B', content: 'b' },
          { title: 'C', content: 'c' },
        ],
      })
    )

    const data = mockCardCreateMany.mock.calls[0][0].data
    expect(data.map((c: { title: string; sortOrder: number }) => [c.title, c.sortOrder])).toEqual([
      ['A', 0],
      ['B', 1],
      ['C', 2],
    ])
  })

  it('normalises a blank photoUrl to null', async () => {
    await PUT(
      makeRequest({
        language: 'zh',
        jobs: [{ title: '岗', tags: 't', requirements: 'r', photoUrl: '', sortOrder: 0 }],
      })
    )

    expect(mockJobCreateMany.mock.calls[0][0].data[0].photoUrl).toBeNull()
  })

  it('routes en content to the en row with English defaults', async () => {
    await PUT(makeRequest({ language: 'en', bannerTitle: 'Join' }))

    expect(mockCareersUpsert.mock.calls[0][0].where).toEqual({ language: 'en' })
    expect(mockCareersUpsert.mock.calls[0][0].create.introTitle).toBe(DEFAULT_CONTENT.en.introTitle)
  })

  it('defaults an unknown language to zh rather than corrupting the table', async () => {
    await PUT(makeRequest({ language: 'fr', bannerTitle: 'Bonjour' }))

    expect(mockCareersUpsert.mock.calls[0][0].where).toEqual({ language: 'zh' })
  })

  it('treats an explicitly emptied list as "not sent" and restores defaults', async () => {
    await PUT(makeRequest({ language: 'zh', cards: [], jobs: [] }))

    expect(mockCardCreateMany.mock.calls[0][0].data).toHaveLength(DEFAULT_CARDS.zh.length)
  })

  it('returns 500 when the transaction throws', async () => {
    mockCareersUpsert.mockRejectedValue(new Error('db down'))
    const res = await PUT(makeRequest({ language: 'zh', bannerTitle: 'x' }))
    expect(res.status).toBe(500)
    expect((await res.json()).error).toBeTruthy()
  })
})