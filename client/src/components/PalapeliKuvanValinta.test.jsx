import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import PalapeliKuvanValinta from '../components/PalapeliKuvanValinta'

describe("PalapeliKuvanValinta", () => {

    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn())
    })

    afterEach(() => {
        vi.resetAllMocks()
    })

    it("ei renderöidy visiblen ollessa false", () => {
        render(<PalapeliKuvanValinta visible={false} />)

        expect(screen.queryByText(/Valitse kuva/i)).not.toBeInTheDocument()
    })
    
})