import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminLoginPage from '@/app/admin/login/page'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

describe('AdminLoginPage', () => {
  it('renders login form with username and password fields', () => {
    render(<AdminLoginPage />)

    expect(screen.getByPlaceholderText('请输入账号')).toBeTruthy()
    expect(screen.getByPlaceholderText('请输入密码')).toBeTruthy()
    expect(screen.getByRole('button', { name: '登录' })).toBeTruthy()
  })

  it('shows default credentials hint', () => {
    render(<AdminLoginPage />)

    expect(screen.getByText(/默认账号: admin \/ admin123/)).toBeTruthy()
  })

  it('allows entering username and password', () => {
    render(<AdminLoginPage />)

    const usernameInput = screen.getByPlaceholderText('请输入账号')
    const passwordInput = screen.getByPlaceholderText('请输入密码')

    fireEvent.change(usernameInput, { target: { value: 'admin' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })

    expect(usernameInput).toHaveValue('admin')
    expect(passwordInput).toHaveValue('admin123')
  })

  it('shows error message on failed login', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid credentials' }),
    })) as jest.Mock

    render(<AdminLoginPage />)

    const usernameInput = screen.getByPlaceholderText('请输入账号')
    const passwordInput = screen.getByPlaceholderText('请输入密码')
    const submitButton = screen.getByRole('button', { name: '登录' })

    fireEvent.change(usernameInput, { target: { value: 'wrong' } })
    fireEvent.change(passwordInput, { target: { value: 'wrong' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeTruthy()
    })
  })
})