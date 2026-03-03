import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import PalapeliKuvanValinta from '../components/PalapeliKuvanValinta'

describe("PalapeliKuvanValinta", () => {

    beforeEach(() => {
        vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co')
        vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY', 'test-key')
        
        vi.stubGlobal("fetch", vi.fn())
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("ei renderöidy visiblen ollessa false", () => {
        const { container } = render(<PalapeliKuvanValinta visible={false} />)
        expect(container.firstChild).toBeNull()
    })

    it("näyttää latausilmoituksen aluksi", async () => {
        // Ikuisesti lataava fetch (ei resolvoidu heti)
        fetch.mockReturnValue(new Promise(() => {}))
        
        render(<PalapeliKuvanValinta visible={true} />)
        expect(screen.getByText(/Ladataan kuvia…/i)).toBeInTheDocument()
    })

    it("lataa ja näyttää kuvat onnistuneesti", async () => {
        const mockData = [
            { name: "kuva1.jpg", metadata: { isDirectory: false } },
            { name: "kuva2.png", metadata: { isDirectory: false } }
        ];

        fetch.mockResolvedValue({
            ok: true,
            text: () => Promise.resolve(JSON.stringify(mockData))
        });

        const onSelectMock = vi.fn()
        render(<PalapeliKuvanValinta visible={true} onSelect={onSelectMock} />)

        // Odotetaan että kuvat ilmestyvät (findBy palauttaa Promisen)
        const img = await screen.findByAltText("Kuva 1")
        expect(img).toBeInTheDocument()
        expect(img.src).toContain("kuva1.jpg")

        // Testataan valinta
        fireEvent.click(img)
        expect(onSelectMock).toHaveBeenCalledWith(expect.stringContaining("kuva1.jpg"))
    })

    it("näyttää virheilmoituksen, jos haku epäonnistuu", async () => {
        fetch.mockResolvedValue({
            ok: false,
            status: 403,
            text: () => Promise.resolve("Forbidden")
        });

        render(<PalapeliKuvanValinta visible={true} />)

        const errorMsg = await screen.findByText(/Storage list failed: 403/i)
        expect(errorMsg).toBeInTheDocument()
    })

    it("kutsuu onClose-funktiota kun sulkunappia painetaan", () => {
        const onCloseMock = vi.fn()
        render(<PalapeliKuvanValinta visible={true} onClose={onCloseMock} />)

        const closeBtn = screen.getByText("×")
        fireEvent.click(closeBtn)

        expect(onCloseMock).toHaveBeenCalledTimes(1)
    })

    it("suodattaa pois tiedostot, jotka eivät ole kuvia", async () => {
        const mockData = [
            { name: "ohje.pdf", metadata: { isDirectory: false } },
            { name: "lomake.docx", metadata: { isDirectory: false } },
            { name: "oikea_kuva.webp", metadata: { isDirectory: false } }
        ];

        fetch.mockResolvedValue({
            ok: true,
            text: () => Promise.resolve(JSON.stringify(mockData))
        });

        render(<PalapeliKuvanValinta visible={true} />)

        // Vain webp-kuvan pitäisi löytyä
        await waitFor(() => {
            const images = screen.queryAllByRole("img")
            expect(images).toHaveLength(1)
        })
        expect(screen.getByAltText("Kuva 1").src).toContain("oikea_kuva.webp")
    })
})