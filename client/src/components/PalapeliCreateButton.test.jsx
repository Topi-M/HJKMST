import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PalapeliCreateButton from '../components/PalapeliCreateButton'

describe("PalapeliCreateButton", () => {

    it("renderöi Luo 3x3 palapeli -napin defaulttina", () => {
        render(<PalapeliCreateButton />)

        expect(
            screen.getByRole("button", { name: /Luo 3×3 palapeli/i })
        ).toBeInTheDocument()
    })

    it("renderöi Luo 5x5 palapeli -napin, kun size on 5", () => {
        render(<PalapeliCreateButton size={5}/>)

        expect(
            screen.getByRole("button", { name: /Luo 5×5 palapeli/i })
        ).toBeInTheDocument()
    })

    it("renderöi Luo 7x7 palapeli -napin, kun size on 7", () => {
        render(<PalapeliCreateButton size={7}/>)

        expect(
            screen.getByRole("button", { name: /Luo 7×7 palapeli/i })
        ).toBeInTheDocument()
    })

})