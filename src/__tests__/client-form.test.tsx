import ClientFormClient from '@/components/admin/ClientFormClient'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

describe('ClientFormClient', () => {
  it('renders form for new client', () => {
    render(<ClientFormClient mode="new" />)

    expect(screen.getByText('添加客户')).toBeTruthy()
    expect(screen.getAllByPlaceholderText('https://...')).toHaveLength(2) // Logo URL and Website
    expect(screen.getByRole('button', { name: '保存' })).toBeTruthy()
  })

  it('renders form for editing client with initial data', () => {
    const initialData = {
      id: '1',
      name: '阿里巴巴',
      logoUrl: 'https://example.com/logo.png',
      website: 'https://alibaba.com',
      sortOrder: 0,
    }

    render(<ClientFormClient mode="edit" initialData={initialData} />)

    expect(screen.getByText('编辑客户')).toBeTruthy()
    expect(screen.getByDisplayValue('阿里巴巴')).toBeTruthy()
  })

  it('allows entering form data', () => {
    render(<ClientFormClient mode="new" />)

    const inputs = screen.getAllByRole('textbox')

    fireEvent.change(inputs[0], { target: { value: '测试客户' } })
    fireEvent.change(inputs[1], { target: { value: 'https://example.com/logo.png' } })

    expect(inputs[0]).toHaveValue('测试客户')
  })

  it('shows cancel and save buttons', () => {
    render(<ClientFormClient mode="new" />)

    expect(screen.getByRole('button', { name: '取消' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '保存' })).toBeTruthy()
  })
})