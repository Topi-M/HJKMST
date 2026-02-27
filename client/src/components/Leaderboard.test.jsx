import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Leaderboard from "../components/Leaderboard.jsx";
import { supabase } from "./SupaBaseClient.jsx";


const mockData = [
  { username: "Alice", best_time: 5000, rank: 1, difficulty: 4 },
  { username: "Bob", best_time: 10000, rank: 2, difficulty: 4 },
  { username: "Charlie", best_time: 7000, rank: 1, difficulty: 6 },
];

 const mockDataString = [
  { username: "Xander", best_time: 7000, rank: 1, difficulty: 'Easy' },
  { username: "Yara", best_time: 9000, rank: 2, difficulty: 'Medium' },
  { username: "Zoe", best_time: 12000, rank: 3, difficulty: 'Hard' },
];

  const table = "leaderboard";

vi.mock("../components/SupaBaseClient", () => ({
  supabase: { from: vi.fn() },
}));

beforeEach(() => vi.clearAllMocks());

describe("Leaderboard Component with scale format (numeric difficulties)", () => {
  beforeEach(() => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    });
  });

  it("renders first entry", async () => {
    render(<Leaderboard table={table} difficulty={4} time_conversion={true} format="scale" />);
    expect(await screen.findByText(/1\. Alice/i)).toBeInTheDocument();
  });

  it("switches difficulty", async () => {
    render(<Leaderboard table={table} difficulty={4} time_conversion={true} />);
    await screen.findByText(/1\. Alice/i);

    const button6 = screen.getByRole("button", { name: "6" }); // numeric
    fireEvent.click(button6);

    expect(await screen.findByText(/1\. Charlie/i)).toBeInTheDocument();
  });
});

describe("Leaderboard Component with string difficulties", () => {
  beforeEach(() => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: mockDataString, error: null }),
    });
  });

  it("renders first entry", async () => {
    render(<Leaderboard table={table} difficulty="Easy" time_conversion={true} />);
    expect(await screen.findByText(/1\. Xander/i)).toBeInTheDocument();
  });

  it("switches difficulty", async () => {
    render(<Leaderboard table={table} difficulty="Easy" time_conversion={true} />);
    await screen.findByText(/1\. Xander/i);

    const buttonMedium = screen.getByRole("button", { name: "Medium" });
    fireEvent.click(buttonMedium);

    expect(await screen.findByText(/1\. Yara/i)).toBeInTheDocument();
  });
});