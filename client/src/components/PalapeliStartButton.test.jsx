import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PalapeliStartButton from '../components/PalapeliStartButton'

describe("PalapeliStartButton", () => {

    it("Aloita nappi renderöityy, kun visible on true", () => {
        render(<PalapeliStartButton visible={true} />)
        
        const aloitaButton = screen.getByRole("button", { name: /Aloita/i })

        expect(aloitaButton).toBeInTheDocument()
    })

    it("Aloita nappi ei renderöidy, kun visible on asetettu false", () => {
        render(<PalapeliStartButton visible={false} />)
        
        const aloitaButton = screen.queryByRole("button", { name: /Aloita/i })

        expect(aloitaButton).not.toBeInTheDocument()
    })

    it("Aloita nappia klikatessa kutsutaan onClick-funktiota", () => {
        const mockStart = vi.fn()

        render(<PalapeliStartButton visible={true} onStart={mockStart} />)

        const aloitaButton = screen.getByRole("button", { name: /Aloita/i })
        fireEvent.click(aloitaButton)
        expect(mockStart).toHaveBeenCalledTimes(1)
    })

})