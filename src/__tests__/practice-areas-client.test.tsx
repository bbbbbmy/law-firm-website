import PracticeAreasClient from '@/components/admin/PracticeAreasClient'
import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

const mockPracticeAreas = [
  {
    id: '1',
    imageUrl: 'https://example.com/image1.jpg',
    titleZh: '民商事纠纷',
    titleEn: 'Civil Disputes',
    descZh: '民事诉讼、合同纠纷',
    descEn: 'Litigation, Contract',
    sortOrder: 0,
  },
  {
    id: '2',
    imageUrl: 'https://example.com/image2.jpg',
    titleZh: '刑事辩护',
    titleEn: 'Criminal Defense',
    descZh: '刑事辩护、取保候审',
    descEn: 'Defense, Bail',
    sortOrder: 1,
  },
]

describe('PracticeAreasClient', () => {
  it('renders practice areas list', () => {
    render(<PracticeAreasClient practiceAreas={mockPracticeAreas} />)

    expect(screen.getByText('业务领域管理')).toBeTruthy()
    expect(screen.getByText('民商事纠纷')).toBeTruthy()
    expect(screen.getByText('刑事辩护')).toBeTruthy()
  })

  it('shows add button', () => {
    render(<PracticeAreasClient practiceAreas={mockPracticeAreas} />)

    expect(screen.getByRole('link', { name: '添加业务领域' })).toBeTruthy()
  })

  it('shows empty state when no practice areas', () => {
    render(<PracticeAreasClient practiceAreas={[]} />)

    expect(screen.getByText(/暂无业务领域/)).toBeTruthy()
  })

  it('shows edit and delete buttons for each practice area', () => {
    render(<PracticeAreasClient practiceAreas={mockPracticeAreas} />)

    const editLinks = screen.getAllByText('编辑')
    const deleteButtons = screen.getAllByText('删除')

    expect(editLinks).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
  })
})