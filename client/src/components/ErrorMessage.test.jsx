import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ErrorMessage from '../components/ErrorMessage'


describe('ErrorMessage', ()=> {
    it('Should show error message', () => {
        render(<ErrorMessage message = "Something went wrong here!"/>)
        expect(
            screen.getByText(/Something went wrong/i)
        ).toBeInTheDocument()
        
    })
})