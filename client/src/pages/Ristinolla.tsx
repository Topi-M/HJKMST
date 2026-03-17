import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../components/SupaBaseClient";
import { Button, Container } from "react-bootstrap";

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
        
        setPlayersCount(players.length);
        
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
    if (!myPlayer || winner || currentTurn !== myPlayer || board[index]) return;

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

  /*const handleBackToLobby = () => {
    navigate("/Lobby"); 
  };*/

  return (
    <Container className="text-center mt-5">
      <div className="d-flex justify-content-start mb-3">
        <Button variant="outline-secondary" onClick={() => navigate("/Lobby")}>
          ← Takaisin Lobbyyn
        </Button>
      </div>

      <h1>Ristinolla</h1>
      <p className="text-muted">Huoneen ID: {id}</p>
      
      <div className="mb-3">
        <h5>Pelaajia huoneessa: {playersCount}</h5>
        <h4>Sinä olet: <span className="text-primary">{myPlayer || "Katsoja"}</span></h4>
        <h4 className={currentTurn === myPlayer ? "text-success" : "text-danger"}>
          Vuoro: {currentTurn} {currentTurn === myPlayer && "(Sinun vuorosi!)"}
        </h4>
      </div>

      {winner && (
        <div className="alert alert-success">
          <h2>Voittaja: {winner} 🎉</h2>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gap: "10px",
          justifyContent: "center",
          margin: "20px 0"
        }}
      >
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: "100px",
              height: "100px",
              fontSize: "2.5rem",
              fontWeight: "bold",
              cursor: winner || board[i] ? "default" : "pointer",
              backgroundColor: "#e9ecef",
              border: "2px solid #343a40",
              borderRadius: "8px"
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <Button variant="warning" size="lg" onClick={reset}>
          Nollaa peli kaikille
        </Button>
      </div>

      {!myPlayer && playersCount >= 2 && (
        <p className="mt-3 text-warning">Huone on täynnä. Olet katsojatilassa.</p>
      )}
    </Container>
  );
}