import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PalapeliSizeMenu from '../components/PalapeliSizeMenu'

describe("PalapeliSizeMenu", () => {
    
    it("näyttää tekstin 'Valitse koko' kun selectedSize on null", () => {
        render(<PalapeliSizeMenu selectedSize={null} onSelectSize={vi.fn()} />)

        expect(screen.getByRole("button", { name: /Valitse koko/i })).toBeInTheDocument()
    })

    it("näyttää koon 3x3 kun selectedSize on 3", () => {
        render(<PalapeliSizeMenu selectedSize={3} onSelectSize={vi.fn()} />)

        expect(screen.getByRole("button", { name: /Valitse koko: 3x3/i })).toBeInTheDocument()
    })

    it("näyttää koon 5x5 kun selectedSize on 5", () => {
        render(<PalapeliSizeMenu selectedSize={5} onSelectSize={vi.fn()} />)

        expect(screen.getByRole("button", { name: /Valitse koko: 5x5/i })).toBeInTheDocument()
    })

    it("näyttää koon 7x7 kun selectedSize on 7", () => {
        render(<PalapeliSizeMenu selectedSize={7} onSelectSize={vi.fn()} />)

        expect(screen.getByRole("button", { name: /Valitse koko: 7x7/i })).toBeInTheDocument()
    })

    it("renderöi vaihtoehdot 3x3, 5x5 ja 7x7 kun dropdown klikataan auki", async () => {
        render(<PalapeliSizeMenu selectedSize={null} onSelectSize={vi.fn()} />)

        const toggle = screen.getByRole("button", { name: /Valitse koko/i })
        fireEvent.click(toggle)

        
        expect(screen.getByText("3x3")).toBeInTheDocument()
        expect(screen.getByText("5x5")).toBeInTheDocument()
        expect(screen.getByText("7x7")).toBeInTheDocument()
        expect(screen.queryByText("1x1")).not.toBeInTheDocument()
    })

    it("merkitsee valitun koon aktiiviseksi dropdown-valikossa", async () => {
        render(<PalapeliSizeMenu selectedSize={7} onSelectSize={vi.fn()} />)

        fireEvent.click(screen.getByRole("button", { name: /Valitse koko/i }))

        const aktiivinenKoko = await screen.findByText("7x7")
        expect(aktiivinenKoko).toHaveClass("active")
    })

    it("ei merkitse mitään kokoa aktiiviseksi, jos selectedSize on virheellinen", async() => {
        render(<PalapeliSizeMenu selectedSize={1} onSelectSize={vi.fn()} />)

        fireEvent.click(screen.getByRole("button", { name: /Valitse koko/i }))

        expect(screen.queryByText("1x1")).not.toBeInTheDocument()

        expect(screen.queryByText("3x3")).not.toHaveClass("active")
        expect(screen.queryByText("5x5")).not.toHaveClass("active")
        expect(screen.queryByText("7x7")).not.toHaveClass("active")
    })

    it("kutsuu onSelectSize-funktiota haluttua kokoa klikatessa", async () => {
        const mockSelect = vi.fn()
        render(<PalapeliSizeMenu selectedSize={null} onSelectSize={mockSelect} />)

        fireEvent.click(screen.getByRole("button", { name: /Valitse koko/i }))

        const option = await screen.findByText("5x5")
        fireEvent.click(option)

        expect(mockSelect).toHaveBeenCalledWith(5)
    })

}) 