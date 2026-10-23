import {
  DEFAULT_CARDS,
  DEFAULT_CONTENT,
  DEFAULT_JOBS,
  sortByOrder,
  splitParagraphs,
} from '@/lib/careersContent'

describe('careersContent', () => {
  describe('splitParagraphs', () => {
    it('splits on blank lines', () => {
      expect(splitParagraphs('第一段。\n\n第二段。')).toEqual(['第一段。', '第二段。'])
    })

    it('collapses single newlines into spaces within a paragraph', () => {
      // 后台手抖敲了软回车，不应该多出一个只有几个字的段落
      expect(splitParagraphs('第一句。\n第二句。')).toEqual(['第一句。 第二句。'])
    })

    it('tolerates whitespace around the blank line', () => {
      expect(splitParagraphs('甲。\n   \n乙。')).toEqual(['甲。', '乙。'])
    })

    it('drops empty segments', () => {
      expect(splitParagraphs('甲。\n\n\n\n乙。')).toEqual(['甲。', '乙。'])
    })

    it('returns empty array for empty / null / undefined input', () => {
      expect(splitParagraphs('')).toEqual([])
      expect(splitParagraphs('   ')).toEqual([])
      expect(splitParagraphs(null)).toEqual([])
      expect(splitParagraphs(undefined)).toEqual([])
    })
  })

  describe('sortByOrder', () => {
    it('sorts ascending by sortOrder', () => {
      const items = [
        { id: 'c', sortOrder: 2 },
        { id: 'a', sortOrder: 0 },
        { id: 'b', sortOrder: 1 },
      ]
      expect(sortByOrder(items).map(i => i.id)).toEqual(['a', 'b', 'c'])
    })

    it('does not mutate the input array', () => {
      const items = [
        { id: 'b', sortOrder: 1 },
        { id: 'a', sortOrder: 0 },
      ]
      const copy = [...items]
      sortByOrder(items)
      expect(items).toEqual(copy)
    })
  })

  describe('default content completeness (zh)', () => {
    const zh = DEFAULT_CONTENT.zh

    it('has all banner fields the design calls for', () => {
      expect(zh.bannerTitle).toBe('加入我们')
      expect(zh.bannerSubtitle).toContain('青年法律人培育计划')
      expect(zh.bannerQuote).toContain('青年兴，则法治事业兴')
    })

    it('has every section title and its English label', () => {
      expect(zh.introTitle).toBe('党建引领・筑造纯粹执业温床')
      expect(zh.environmentTitle).toBe('优渥环境，筑牢成长根基')
      expect(zh.environmentLabel).toBe('ENVIRONMENT')
      expect(zh.supportTitle).toBe('重磅扶持：10% 点位，全包成本')
      expect(zh.supportLabel).toBe('SUPPORT')
      expect(zh.creationTitle).toBe('初心如磐，打造执业温床')
      expect(zh.creationLabel).toBe('CREATION')
      expect(zh.invitationTitle).toBe('招募邀约')
      expect(zh.invitationLabel).toBe('INVITATION')
      expect(zh.jobsTitle).toBe('热招岗位')
      expect(zh.contactTitle).toBe('联系我们')
    })

    it('keeps the lead paragraph verbatim (it names the pain point, not the 10% figure)', () => {
          // 方案里的前置引导段本身不含「10%」字样，比例出现在板块标题和卡片 1/2 里
          expect(zh.supportLead).toContain('首开让利青年的先河')
          expect(zh.supportTitle).toContain('10%')
          expect(DEFAULT_CARDS.zh[0].content).toContain('10%')
          expect(DEFAULT_CARDS.zh[1].content).toContain('10%')
        })

    it('splits the long-form sections into multiple paragraphs', () => {
      // 三段 / 两段 / 两段 —— 设计稿里就是分段的，渲染要能拆开
      expect(splitParagraphs(zh.environmentContent)).toHaveLength(2)
      expect(splitParagraphs(zh.creationContent)).toHaveLength(3)
      expect(splitParagraphs(zh.invitationContent)).toHaveLength(2)
    })
  })

  describe('default support cards', () => {
    it('has the 3 cards from the design in order', () => {
      expect(DEFAULT_CARDS.zh.map(c => c.title)).toEqual([
        '低点位分成，收益归己',
        '全包运营杂费，零成本执业',
        '轻管理模式，自主发展',
      ])
      expect(DEFAULT_CARDS.zh.map(c => c.sortOrder)).toEqual([0, 1, 2])
    })

    it('has a matching English set', () => {
      expect(DEFAULT_CARDS.en).toHaveLength(DEFAULT_CARDS.zh.length)
      expect(DEFAULT_CARDS.en.every(c => c.title && c.content)).toBe(true)
    })
  })

  describe('default jobs', () => {
    it('has the 4 positions from the design in order', () => {
      expect(DEFAULT_JOBS.zh.map(j => j.title)).toEqual([
        '执业律师',
        '授薪律师',
        '实习律师',
        '法务专员',
      ])
      expect(DEFAULT_JOBS.zh.map(j => j.sortOrder)).toEqual([0, 1, 2, 3])
    })

    it('gives 实习律师 and 法务专员 duties; the two lawyer roles have none', () => {
      const byTitle = Object.fromEntries(DEFAULT_JOBS.zh.map(j => [j.title, j]))
      expect(byTitle['实习律师'].duties).toContain('参与案件的调查和处理过程')
      expect(byTitle['法务专员'].duties).toContain('驻点合作顾问单位')
      expect(byTitle['执业律师'].duties).toBe('')
      expect(byTitle['授薪律师'].duties).toBe('')
    })

    it('carries the tag line for each position', () => {
      const byTitle = Object.fromEntries(DEFAULT_JOBS.zh.map(j => [j.title, j]))
      expect(byTitle['执业律师'].tags).toContain('A 证')
      expect(byTitle['执业律师'].tags).toContain('提成制')
      expect(byTitle['授薪律师'].tags).toContain('授薪制')
      expect(byTitle['法务专员'].tags).toContain('合同管理')
    })

    it('states no salary figures anywhere in the job copy', () => {
      // 需求明确写了「不写薪资」——防止以后有人把薪资加回来
      const salaryPattern = /(底薪|月薪|年薪|薪资|薪酬|元\/月|k\/月|以上)\s*[:：]?\s*\d/
      for (const job of [...DEFAULT_JOBS.zh, ...DEFAULT_JOBS.en]) {
        expect(`${job.title}${job.tags}${job.requirements}${job.duties}`).not.toMatch(salaryPattern)
      }
    })

    it('has a matching English set with the same 4 positions', () => {
      expect(DEFAULT_JOBS.en).toHaveLength(4)
      expect(DEFAULT_JOBS.en.map(j => j.sortOrder)).toEqual([0, 1, 2, 3])
      expect(DEFAULT_JOBS.en.every(j => j.title && j.requirements)).toBe(true)
    })
  })

  describe('en content', () => {
    it('is populated for every field zh has', () => {
      const en = DEFAULT_CONTENT.en
      expect(en.bannerTitle).toBeTruthy()
      expect(en.bannerSubtitle).toBeTruthy()
      expect(en.bannerQuote).toBeTruthy()
      expect(en.introTitle).toBeTruthy()
      expect(en.introContent).toBeTruthy()
      expect(en.supportTitle).toBeTruthy()
      expect(en.creationContent).toBeTruthy()
      expect(en.invitationContent).toBeTruthy()
      expect(en.jobsTitle).toBeTruthy()
      expect(en.contactTitle).toBeTruthy()
    })

    it('keeps the English section labels as the design specifies', () => {
      const en = DEFAULT_CONTENT.en
      expect(en.environmentLabel).toBe('ENVIRONMENT')
      expect(en.supportLabel).toBe('SUPPORT')
      expect(en.creationLabel).toBe('CREATION')
      expect(en.invitationLabel).toBe('INVITATION')
    })

    it('translates the 10% support promise rather than dropping it', () => {
      expect(DEFAULT_CONTENT.en.supportTitle).toContain('10%')
    })
  })
})