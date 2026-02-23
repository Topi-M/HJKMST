import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AuthForm from '../components/AuthFrom.jsx'

describe('AuthForm', () => {
  let mockSupabase
  let mockSetError

  beforeEach(() => {
    mockSetError = vi.fn()

    mockSupabase = {
      auth: {
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
      },
    }
  })

  it('renders login mode by default', () => {
    render(<AuthForm supabase={mockSupabase} setError={mockSetError} />)

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/username/i)).not.toBeInTheDocument()
  })

  it('switches to signup mode and shows username input', () => {
    render(<AuthForm supabase={mockSupabase} setError={mockSetError} />)

    fireEvent.click(screen.getByText(/sign up/i))
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
  })

  it('calls signInWithPassword on login submit', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null })

    render(<AuthForm supabase={mockSupabase} setError={mockSetError} />)

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: '123456' },
    })

    // Scope search to the form only
    const form = screen.getByRole('form')
    const submitButton = within(form).getByRole('button', { name: /login/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: '123456',
      })
    })
  })

  it('sets error if login fails', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      error: { message: 'Invalid credentials' },
    })

    render(<AuthForm supabase={mockSupabase} setError={mockSetError} />)

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'wrong@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpass' },
    })

    const form = screen.getByRole('form')
    const submitButton = within(form).getByRole('button', { name: /login/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('Invalid credentials')
    })
  })

  it('calls signUp in signup mode with username metadata', async () => {
    mockSupabase.auth.signUp.mockResolvedValue({ error: null })

    render(<AuthForm supabase={mockSupabase} setError={mockSetError} />)

    fireEvent.click(screen.getByText(/sign up/i))

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'new@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'newuser' },
    })
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: '123456' },
    })

    const form = screen.getByRole('form')
    const submitButton = within(form).getByRole('button', { name: /sign up/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: '123456',
        options: {
          data: { username: 'newuser' },
        },
      })
    })
  })

  it('shows loading state while submitting', async () => {
    mockSupabase.auth.signInWithPassword.mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve({ error: null }), 100)
        )
    )

    render(<AuthForm supabase={mockSupabase} setError={mockSetError} />)

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: '123456' },
    })

    const form = screen.getByRole('form')
    const submitButton = within(form).getByRole('button', { name: /login/i })
    fireEvent.click(submitButton)

    expect(within(form).getByText(/loading/i)).toBeInTheDocument()
  })
})