import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PalapeliFetchKuvaButton from '../components/PalapeliFetchKuvaButton'

describe("PalapeliFetchKuvaButton", () => {

    it("renderöi 'Valitse kuva' -napin", () => {
        render(<PalapeliFetchKuvaButton />)

        expect(
            screen.getByRole("button", { name: /Valitse kuva/i })
        ).toBeInTheDocument()
    })

    it("kutsuu onClick-funktiota, kun 'Valitse kuva' -nappia klikataan", async () => {
        const mockStart = vi.fn()

        render(<PalapeliFetchKuvaButton onClick={mockStart} />)

        const valitseButton = screen.getByRole("button", { name: /Valitse kuva/i })
        fireEvent.click(valitseButton)
        expect(mockStart).toHaveBeenCalledTimes(1)
    })
    
})