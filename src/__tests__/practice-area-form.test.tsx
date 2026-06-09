import PracticeAreaFormClient from '@/components/admin/PracticeAreaFormClient'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

describe('PracticeAreaFormClient', () => {
  it('renders form for new practice area', () => {
    render(<PracticeAreaFormClient mode="new" />)

    expect(screen.getByText('添加业务领域')).toBeTruthy()
    expect(screen.getByRole('button', { name: '保存' })).toBeTruthy()
  })

  it('renders form for editing practice area with initial data', () => {
    const initialData = {
      id: '1',
      imageUrl: 'https://example.com/image.jpg',
      titleZh: '民商事纠纷',
      titleEn: 'Civil Disputes',
      descZh: '民事诉讼',
      descEn: 'Litigation',
      sortOrder: 0,
    }

    render(<PracticeAreaFormClient mode="edit" initialData={initialData} />)

    expect(screen.getByText('编辑业务领域')).toBeTruthy()
    expect(screen.getByDisplayValue('民商事纠纷')).toBeTruthy()
    expect(screen.getByDisplayValue('Civil Disputes')).toBeTruthy()
  })

  it('allows entering form data', () => {
    render(<PracticeAreaFormClient mode="new" />)

    const inputs = screen.getAllByRole('textbox')
    const urlInputs = screen.getAllByPlaceholderText('https://...')

    // First input is image URL
    fireEvent.change(urlInputs[0], { target: { value: 'https://example.com/test.jpg' } })
    // Next inputs are title fields
    fireEvent.change(inputs[1], { target: { value: '测试业务' } })

    expect(urlInputs[0]).toHaveValue('https://example.com/test.jpg')
  })

  it('shows cancel and save buttons', () => {
    render(<PracticeAreaFormClient mode="new" />)

    expect(screen.getByRole('button', { name: '取消' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '保存' })).toBeTruthy()
  })
})