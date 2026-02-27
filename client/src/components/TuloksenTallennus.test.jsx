import { vi, describe, it, expect, beforeEach } from "vitest";
import { tallennaTulos } from "../components/TuloksenTallennus";
import { supabase } from "../components/SupaBaseClient";


vi.mock("../components/SupaBaseClient", () => ({
  supabase: {
    auth: { getSession: vi.fn() },
    from: vi.fn(),
  },
}));
const mockInsert = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  supabase.from.mockReturnValue({ insert: mockInsert });
});
describe("tallennaTulos", () => {
  
  it("returns error if user is not logged in", async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });

    const result = await tallennaTulos(1, 1000, 5000, "Easy");
    expect(result).toEqual({
      success: false,
      message: 'Kirjaudu sisään tallentaaksesi tuloksen.',
    });
  });

  it("returns error if getSession throws", async () => {
    supabase.auth.getSession.mockRejectedValue(new Error("Auth error"));

    const result = await tallennaTulos(1, 1000, 5000);
    expect(result.success).toBe(false);
    expect(result.error).toBe("Auth error");
  });

  it("inserts result into Supabase with calculated score", async () => {
    
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: "user_123" } } },
      error: null,
    });

    
    mockInsert.mockResolvedValue({
      data: [{ id: 42 }],
      error: null,
    });

    const start = 1000;
    const end = 5500;

    const result = await tallennaTulos(1, start, end, "Medium");

    expect(mockInsert).toHaveBeenCalledWith([{
      minigame_id: 1,
      score: end - start,
      start_time_ms: start,
      end_time_ms: end,
      difficulty: "Medium",
    }]);

    expect(result).toEqual({ success: true, data: [{ id: 42 }] });
  });

  it("inserts result using provided score", async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: "user_456" } } },
      error: null,
    });

    mockInsert.mockResolvedValue({ data: [{ id: 99 }], error: null });

    const result = await tallennaTulos(2, 0, 0, "Hard", 1234);

    expect(mockInsert).toHaveBeenCalledWith([{
      minigame_id: 2,
      score: 1234,
      start_time_ms: 0,
      end_time_ms: 0,
      difficulty: "Hard",
    }]);

    expect(result).toEqual({ success: true, data: [{ id: 99 }] });
  });

  it("returns error if insert fails", async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: "user_789" } } },
      error: null,
    });

    mockInsert.mockResolvedValue({
      data: null,
      error: { message: "Insert failed" },
    });

    const result = await tallennaTulos(3, 1000, 2000);

    expect(result).toEqual({ success: false, error: "Insert failed" });
  });

});