import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../components/SupaBaseClient";
import { Button, Container } from "react-bootstrap";
import "../css/Ristinolla.css"

type Player = "X" | "O";
type Cell = Player | null;

export default function Ristinolla() {
  const { id } = useParams<{ id: string }>();
  const myId = useRef(crypto.randomUUID());

  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<Player>("X");
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [playersCount, setPlayersCount] = useState(0);
  const channelRef = useRef<any>(null);

  const calculateWinner = (currentBoard: Cell[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);

  useEffect(() => {
    if (!id) return;

    const channel = supabase.channel(`room-${id}`, {
      config: { presence: { key: myId.current } }
    });
    channelRef.current = channel;

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const players = Object.values(state)
          .flat()
          .map((p: any) => p.playerId)
          .sort();

        // TALLENNETAAN AIEMPI PELAAJAMÄÄRÄ VERTAILUA VARTEN
        setPlayersCount((prevCount) => {
          const newCount = players.length;

          // JOS PELAAJA POISTUU (määrä vähenee), NOLLATAAN PELI PAIKALLISESTI
          // JA LÄHETETÄÄN RESET-VIESTI MUILLE
          if (newCount < prevCount && newCount > 0) {
            reset();
          }
          return newCount;
        });

        const index = players.indexOf(myId.current);
        if (index === 0) setMyPlayer("X");
        else if (index === 1) setMyPlayer("O");
        else setMyPlayer(null);
      })
      .on("broadcast", { event: "move" }, ({ payload }) => {
        setBoard(prev => {
          if (prev[payload.index]) return prev;
          const copy = [...prev];
          copy[payload.index] = payload.player;
          return copy;
        });
        setCurrentTurn(payload.player === "X" ? "O" : "X");
      })
      .on("broadcast", { event: "reset" }, () => {
        setBoard(Array(9).fill(null));
        setCurrentTurn("X");
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ playerId: myId.current });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [id]);

  function handleClick(index: number) {
    if (playersCount < 2 || !myPlayer || winner || currentTurn !== myPlayer || board[index]) {
      return;
    }
    if (playersCount < 2 || !myPlayer || winner || currentTurn !== myPlayer || board[index]) {
      return;
    }

    const nextTurn = myPlayer === "X" ? "O" : "X";
    setBoard(prev => {
      const copy = [...prev];
      copy[index] = myPlayer;
      return copy;
    });
    setCurrentTurn(nextTurn);

    channelRef.current.send({
      type: "broadcast",
      event: "move",
      payload: { index, player: myPlayer }
    });
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setCurrentTurn("X");
    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "reset"
      });
    }
  }


  const navigate = useNavigate();

  return (
    <div className="ristinolla-root"> {/* Lisätty wrapperi taustaa varten */}
      <Container className="text-center mt-0">
        <div className="d-flex justify-content-start mb-3">
          <Button
            className="btn-back-lobby"
            onClick={() => navigate("/Lobby")}
          >
            ← Takaisin Lobbyyn
          </Button>
        </div>

        <h1 className="fw-bold">Ristinolla</h1>
        <p className="text-muted">Huoneen ID: {id}</p>

        <div className="mb-3">
          <h5>Pelaajia huoneessa: {playersCount}</h5>
          <h4>Sinä olet: <span className="fw-bold">{myPlayer || "Katsoja"}</span></h4>

          {playersCount < 2 ? (
            <h4 className="text-warning fw-bold animate-pulse">
              Odotetaan vastustajaa...
            </h4>
          ) : (
            <h4 className={currentTurn === myPlayer ? "text-success fw-bold" : "text-danger fw-bold"}>
              Vuoro: {currentTurn} {currentTurn === myPlayer && "(Sinun vuorosi!)"}
            </h4>
          )}
        </div>

        {winner && (
          <div className="alert lobby-card border-2 shadow-sm mb-4">
            <h2 className="mb-0 text-dark">Voittaja: {winner} 🎉</h2>
          </div>
        )}
        <div className="game-grid"> {/* Käytetään CSS-tiedoston gridiä */}
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!!winner || !!board[i]}
              className="cell-button" // Uusi tyyli tässä
            >
              {cell}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <Button className="btn-reset-game" size="lg" onClick={reset}>
            Nollaa peli kaikille
          </Button>
        </div>
        {!myPlayer && playersCount >= 2 && (
          <p className="mt-3 text-warning fw-bold">Huone on täynnä. Olet katsojatilassa.</p>
        )}
      </Container>
    </div>
  );
}