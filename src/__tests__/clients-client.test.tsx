import ClientsClient from '@/components/admin/ClientsClient'
import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

const mockClients = [
  {
    id: '1',
    name: '阿里巴巴',
    logoUrl: 'https://example.com/alibaba.png',
    website: 'https://alibaba.com',
    sortOrder: 0,
  },
  {
    id: '2',
    name: '腾讯',
    logoUrl: 'https://example.com/tencent.png',
    website: 'https://tencent.com',
    sortOrder: 1,
  },
]

describe('ClientsClient', () => {
  it('renders clients list', () => {
    render(<ClientsClient clients={mockClients} />)

    expect(screen.getByText('服务客户管理')).toBeTruthy()
    expect(screen.getByText('阿里巴巴')).toBeTruthy()
    expect(screen.getByText('腾讯')).toBeTruthy()
  })

  it('shows add button', () => {
    render(<ClientsClient clients={mockClients} />)

    expect(screen.getByRole('link', { name: '添加客户' })).toBeTruthy()
  })

  it('shows empty state when no clients', () => {
    render(<ClientsClient clients={[]} />)

    expect(screen.getByText(/暂无客户/)).toBeTruthy()
  })

  it('shows edit and delete buttons for each client', () => {
    render(<ClientsClient clients={mockClients} />)

    const editLinks = screen.getAllByText('编辑')
    const deleteButtons = screen.getAllByText('删除')

    expect(editLinks).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
  })
})