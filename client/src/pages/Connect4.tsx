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
        <Container className="text-center mt-4 d-flex flex-column align-items-center c4-container">
            <Button variant="outline-dark" size="sm" onClick={() => navigate("/Lobby")} className="mb-3">
                ← Takaisin Lobbyyn
            </Button>

            <h2 className="c4-title">Neljän Suora</h2>
            <small className="text-muted mb-3">Pelaajia huoneessa: {playersCount}</small>

            <div className="mb-3">
                Olet: <Badge
                    bg={myPlayer === "Punainen" ? "danger" : myPlayer === "Keltainen" ? "warning" : "secondary"}
                    className="text-dark c4-status-badge"
                >
                    {myPlayer}
                </Badge>
            </div>

            <h4 className="mb-4" style={{ minHeight: "40px" }}>
                {winner ? (
                    <Badge bg="success" className="p-2 shadow">VOITTO: {winner.toUpperCase()}!</Badge>
                ) : (
                    <span className={currentTurn === myPlayer ? "text-success fw-bold" : "text-secondary"}>
                        Vuoro: {currentTurn} {currentTurn === myPlayer && "(Sinä)"}
                    </span>
                )}
            </h4>

            <div className="c4-game-wrapper">
                {/* Pudotuspainikkeet */}
                <div className="c4-drop-row">
                    {Array(COLS).fill(null).map((_, col) => (
                        <Button
                            key={col}
                            variant="outline-primary"
                            disabled={!!winner || myPlayer === "Katsoja" || currentTurn !== myPlayer || findLowestFreeRow(col, board) === -1}
                            onClick={() => dropDisc(col)}
                            className="c4-drop-btn"
                        >
                            ↓
                        </Button>
                    ))}
                </div>

                {/* Pelilauta */}
                <div className="c4-board shadow">
                    {board.map((cell, i) => (
                        <div
                            key={i}
                            className={`c4-cell 
                            ${cell === "Punainen" ? "red" : cell === "Keltainen" ? "yellow" : "empty"} 
                            ${winInfo?.line?.includes(i) ? "winner" : ""}`
                            }
                        />
                    ))}
                </div>
            </div>

            <div className="mt-4 pb-5">
                <Button variant="warning" onClick={reset} className="shadow px-4">
                    Nollaa Pelilauta
                </Button>
            </div>
        </Container>
    );
}