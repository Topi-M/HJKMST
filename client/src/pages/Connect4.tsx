import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../components/SupaBaseClient";
import { Button, Container, Badge } from "react-bootstrap";
import "../css/connect4.css";

const COLS = 7;
const ROWS = 6;

// Tyypit pelaajille
type Player = "Punainen" | "Keltainen" | "Katsoja";

export default function Connect4() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const myId = useRef(crypto.randomUUID());

    const [board, setBoard] = useState<(Player | null)[]>(Array(COLS * ROWS).fill(null));
    const [currentTurn, setCurrentTurn] = useState<Player>("Punainen");
    const [myPlayer, setMyPlayer] = useState<Player | null>(null);
    const [playersCount, setPlayersCount] = useState(0);
    const channelRef = useRef<any>(null);

    // Voiton tarkistuslogiikka
    const calculateWinner = (currentBoard: (Player | null)[]) => {
        const checkLine = (a: number, b: number, c: number, d: number) => {
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] &&
                currentBoard[a] === currentBoard[c] && currentBoard[a] === currentBoard[d]) {
                return [a, b, c, d];
            }
            return null;
        };

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const i = r * COLS + c;
                const lines = [
                    c <= COLS - 4 ? [i, i + 1, i + 2, i + 3] : null,
                    r <= ROWS - 4 ? [i, i + COLS, i + COLS * 2, i + COLS * 3] : null,
                    (c <= COLS - 4 && r <= ROWS - 4) ? [i, i + COLS + 1, i + COLS * 2 + 2, i + COLS * 3 + 3] : null,
                    (c >= 3 && r <= ROWS - 4) ? [i, i + COLS - 1, i + COLS * 2 - 2, i + COLS * 3 - 3] : null
                ];
                for (const line of lines) {
                    if (line) {
                        const winLine = checkLine(line[0], line[1], line[2], line[3]);
                        if (winLine) return { winner: currentBoard[line[0]], line: winLine };
                    }
                }
            }
        }
        return null;
    };

    const winInfo = calculateWinner(board);
    const winner = winInfo?.winner;

    useEffect(() => {
        if (!id) return;

        const channel = supabase.channel(`connect4_room_${id}`, {
            config: { presence: { key: myId.current } }
        });
        channelRef.current = channel;

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState();
                // Muutetaan pelaajien haku varmemmaksi
                const players = Object.values(state)
                    .flat()
                    .map((p: any) => p.playerId)
                    .sort();

                setPlayersCount(players.length);

                const index = players.indexOf(myId.current);
                if (index === 0) setMyPlayer("Punainen");
                else if (index === 1) setMyPlayer("Keltainen");
                else setMyPlayer("Katsoja");
            })
            .on("broadcast", { event: "move" }, ({ payload }) => {
                setBoard(payload.newBoard);
                setCurrentTurn(payload.nextTurn);
            })
            .on("broadcast", { event: "reset" }, () => {
                setBoard(Array(COLS * ROWS).fill(null));
                setCurrentTurn("Punainen");
            });

        channel.subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
                await channel.track({
                    playerId: myId.current,
                    online_at: new Date().toISOString()
                });
            }
        });

        return () => {
            channel.unsubscribe();
        };
    }, [id]);

    const findLowestFreeRow = (col: number, currentBoard: (Player | null)[]) => {
        for (let r = ROWS - 1; r >= 0; r--) {
            if (!currentBoard[r * COLS + col]) return r;
        }
        return -1;
    };

    const dropDisc = (col: number) => {
        if (myPlayer === "Katsoja" || winner || currentTurn !== myPlayer) return;

        const row = findLowestFreeRow(col, board);
        if (row === -1) return;

        const nextBoard = [...board];
        nextBoard[row * COLS + col] = myPlayer;
        const nextTurn = myPlayer === "Punainen" ? "Keltainen" : "Punainen";

        setBoard(nextBoard);
        setCurrentTurn(nextTurn);

        channelRef.current?.send({
            type: "broadcast",
            event: "move",
            payload: { newBoard: nextBoard, nextTurn }
        });
    };

    const reset = () => {
        setBoard(Array(COLS * ROWS).fill(null));
        setCurrentTurn("Punainen");
        channelRef.current?.send({ type: "broadcast", event: "reset" });
    };

    return (
        <div className="c4-page-wrapper">
            {/* Lasikupla otsikolle */}
            <div className="c4-glass-header">
                <h1 className="c4-title">Connect 4</h1>
            </div>

            <Button
                variant="link"
                onClick={() => navigate("/Lobby")}
                className="c4-back-btn"
            >
                Takaisin valikkoon
            </Button>

            {/* Vuoro- ja tilannetiedot */}
            <div className="c4-status-box text-center">
                {winner ? (
                    <div className="c4-winner-announcement shadow">
                        <h3 className={`c4-winner-text ${winner === "Punainen" ? "red-wins" : "yellow-wins"}`}>
                            VOITTAJA: {winner}!
                        </h3>
                    </div>
                ) : (
                    <span>
                        <span className="h5">Vuoro: {currentTurn}</span>
                        <br />
                        <small className="opacity-75">Olet: {myPlayer} | Pelaajia: {playersCount}</small>
                    </span>
                )}
            </div>

            <div className="c4-game-area">
                {/* Pudotusnapit */}
                <div className="c4-drop-row">
                    {Array(COLS).fill(null).map((_, col) => (
                        <button
                            key={col}
                            className="c4-btn-drop"
                            disabled={!!winner || myPlayer === "Katsoja" || currentTurn !== myPlayer}
                            onClick={() => dropDisc(col)}
                        >
                            ↓
                        </button>
                    ))}
                </div>

                {/* Pelilauta */}
                <div className="c4-board-container shadow-lg">
                    <div className="c4-board">
                        {board.map((cell, i) => {
                            // Tarkistetaan, onko tämä solu osa voittosuoraa
                            // winInfo sisältää yleensä tiedon 'line', joka on taulukko indekseistä (esim. [10, 11, 12, 13])
                            const isWinnerCell = winInfo?.line?.includes(i);

                            return (
                                <div
                                    key={i}
                                    className={`c4-cell 
                        ${cell === "Punainen" ? "red" : cell === "Keltainen" ? "yellow" : ""} 
                        ${isWinnerCell ? "winner-highlight" : ""}`}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bugien varalta: Nollausnappi */}
            <button className="c4-reset-btn" onClick={reset}>
                Nollaa Pelilauta
            </button>
        </div>
    );

}