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

    it("fetch onnistuu, jolloin kuvat renderöityy", async () => {

        const fakeFiles = [
            { name: "testi1.jpg", metadata: {} },
            { name: "testi2.png", metadata: {} }
        ]

        fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => JSON.stringify(fakeFiles)
        })

        render(
            <PalapeliKuvanValinta 
                visible={true}
                onClose={vi.fn()}
                onSelect={vi.fn()}
            />
        )

        expect(await screen.findByAltText("Kuva 1")).toBeInTheDocument()
        expect(await screen.findByAltText("Kuva 2")).toBeInTheDocument()
    })

    it("kutsuu onSelect-funktiota kun kuvaa klikataan", async () => {
        const fakeFiles = [{ name: "test.jpg", metadata: {} }]

        fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => JSON.stringify(fakeFiles)
        })

        const mockSelect = vi.fn()

        render(
            <PalapeliKuvanValinta
                visible={true}
                onClose={vi.fn()}
                onSelect={mockSelect}
            />
        )

        const image = await screen.findByAltText("Kuva 1")
        fireEvent.click(image)

        expect(mockSelect).toHaveBeenCalledTimes(1)
    })

    it("virheilmoitus kun fetchaus epäonnistuu", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: async () => "Server error"
        })

        render(
            <PalapeliKuvanValinta
                visible={true}
                onClose={vi.fn()}
                onSelect={vi.fn()}
            />
        )

        expect(await screen.findByText(/Storage list failed/i)).toBeInTheDocument()
    })

    it("kutsuu onClose kun overlaytä klikataan", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => JSON.stringify([])
        })

        const mockClose = vi.fn()

        const { container } = render(
            <PalapeliKuvanValinta
            visible={true}
            onClose={mockClose}
            onSelect={vi.fn()}
            />
        )

        const overlay = container.querySelector(".kuva-modal-overlay")
        fireEvent.click(overlay)

        expect(mockClose).toHaveBeenCalledTimes(1)
    })

    it("ei kutsu onClose kun modaalin sisälle klikataan", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => JSON.stringify([])
        })

        const mockClose = vi.fn()

        render(
            <PalapeliKuvanValinta
                visible={true}
                onClose={mockClose}
                onSelect={vi.fn()}
            />
        )

        const modal = document.querySelector(".kuva-modal")
        fireEvent.click(modal)

        expect(mockClose).not.toHaveBeenCalled()
    })
    
})