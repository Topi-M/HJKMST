import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import PelienTimer from "../components/PelienTimer";

describe("PelienTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  const setup = (props = {}) => {
    const defaultProps = {
      isRunning: false,
      onFinish: vi.fn(),
      resetTrigger: false,
      setGameStartTime: vi.fn(),
    };

    return render(<PelienTimer {...defaultProps} {...props} />);
  };

  it("renders initial time as 00:00:00", () => {
    setup();
    expect(screen.getByText("00:00:00")).toBeInTheDocument();
  });

  it("increments time when running", () => {
    setup({ isRunning: true });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // 100ms = 00:00:10 (centiseconds)
    expect(screen.getByText("00:00:10")).toBeInTheDocument();
  });

  it("calls setGameStartTime when timer starts", () => {
    const setGameStartTime = vi.fn();

    setup({ isRunning: true, setGameStartTime });

    expect(setGameStartTime).toHaveBeenCalledTimes(1);
    expect(typeof setGameStartTime.mock.calls[0][0]).toBe("number");
  });

  it("calls onFinish when stopped", () => {
    const onFinish = vi.fn();

    const { rerender } = setup({
      isRunning: true,
      onFinish,
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Stop timer
    rerender(
      <PelienTimer
        isRunning={false}
        onFinish={onFinish}
        resetTrigger={false}
        setGameStartTime={vi.fn()}
      />
    );

    expect(onFinish).toHaveBeenCalledTimes(1);

    const [elapsedTime, startTime] = onFinish.mock.calls[0];
    expect(elapsedTime).toBeGreaterThan(0);
    expect(typeof startTime).toBe("number");
  });

  it("resets timer when resetTrigger changes", () => {
    const { rerender } = setup({ isRunning: true, resetTrigger: false });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByText("00:00:20")).toBeInTheDocument();

    // Trigger reset
    rerender(
      <PelienTimer
        isRunning={true}
        onFinish={vi.fn()}
        resetTrigger={true}
        setGameStartTime={vi.fn()}
      />
    );

    expect(screen.getByText("00:00:00")).toBeInTheDocument();
  });
  it("does not increment when not running", () => {
  setup({ isRunning: false });

  act(() => {
    vi.advanceTimersByTime(500);
  });

  expect(screen.getByText("00:00:00")).toBeInTheDocument();
});

});