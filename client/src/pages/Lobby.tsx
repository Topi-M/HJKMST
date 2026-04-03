import React, { useEffect, useState } from "react";
import { supabase } from "../components/SupaBaseClient";
import { useNavigate } from "react-router-dom";
import { Button, Form, Card, ListGroup, Container, Row, Col, Badge } from "react-bootstrap";
import "../css/lobby.css";

interface Room {
  id: string;
  code: string;
  status: string;
  created_at: string;
  minigame_id: number; // Lisätty minigame_id
  name?: string;
}

export default function Lobby() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [gameType, setGameType] = useState<string>("ristinolla");
  const navigate = useNavigate();

  // Määritellään ID:t, jotka vastaavat tietokantasi minigames-taulua
  const GAME_MAP: Record<string, number> = {
    "ristinolla": 7,
    "connect4": 9
  };

  useEffect(() => {
    fetchRooms();
    const channel = supabase
      .channel("lobby-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, () => fetchRooms())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchRooms() {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Haku epäonnistui:", error.message);
    setRooms((data as Room[]) || []);
  }

  async function createRoom() {
    if (!name) {
      return alert("Anna huoneelle nimi");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return alert("Et ole kirjautunut sisään!");

    // Haetaan oikea ID valitulle pelille
    const selectedId = GAME_MAP[gameType as keyof typeof GAME_MAP];

    const { data, error } = await supabase
      .from("rooms")
      .insert([
        {
          name: name,
          code: password,
          minigame_id: selectedId, // TÄRKEÄ: Tallentaa pelin tyypin
          status: 'waiting'
        }
      ])
      .select()
      .single();

    if (error) return alert("Virhe: " + error.message);

    if (data) {
      navigate(`/${gameType}/${data.id}`);
    }
  }

  function handleJoin(room: Room) {
    if (room.code && room.code !== "") {
      const inputPassword = prompt("Syötä huoneen salasana:");
      if (inputPassword !== room.code) return alert("Väärä salasana!");
    }

    // Tunnistetaan peli ID:n perusteella
    let targetPath = "ristinolla";
    if (Number(room.minigame_id) === 9) targetPath = "connect4";

    navigate(`/${targetPath}/${room.id}`);
  }

  return (
    <div className="lobby-root">
      <Container className="pt-4">
        <Row>
          {/* VASEN SARAKE: Huoneen luonti */}
          <Col md={4}>
            <Card className="p-3 mb-4 lobby-card shadow-sm">
              <h4 className="fw-bold mb-3">Luo uusi huone</h4>

              <Form.Group className="mb-2">
                <Form.Label>Huoneen nimi</Form.Label>
                <Form.Control
                  className="lobby-input"
                  placeholder="Esim. Matin peli"
                  value={name} // Hyvä lisätä hallitun inputin takia
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Valitse peli</Form.Label>
                <Form.Select
                  className="lobby-select"
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value)}
                >
                  {/* Käytetään numeroita arvoina, jotta ne vastaavat tietokantaa */}
                  <option value="ristinolla">Ristinolla</option>
                  <option value="connect4">Connect 4 (Neljän suora)</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Salasana (valinnainen)</Form.Label>
                <Form.Control
                  className="lobby-input"
                  type="password"
                  placeholder="Salasana"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button onClick={createRoom} className="lobby-button w-100">
                Luo ja aloita peli
              </Button>
            </Card>
          </Col>

          {/* OIKEA SARAKE: Huonelistaus */}
          <Col md={8}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold">Avoimet pelihuoneet</h4>
              <Button className="lobby-button-sm" size="sm" onClick={fetchRooms}>
                Päivitä
              </Button>
            </div>

            <ListGroup className="shadow-sm lobby-card">
              {rooms.length === 0 ? (
                <ListGroup.Item className="text-center p-4 text-muted">
                  Ei avoimia huoneita.
                </ListGroup.Item>
              ) : (
                rooms.map((room) => (
                  <ListGroup.Item
                    key={room.id}
                    className="d-flex justify-content-between align-items-center p-3 lobby-list-item"
                  >
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <h5 className="mb-0 fw-bold">
                          {room.name || "Nimetön huone"}
                        </h5>
                        <Badge
                          bg={Number(room.minigame_id) === 9 ? "primary" : "info"}
                          className="text-uppercase"
                        >
                          {Number(room.minigame_id) === 9 ? "Connect 4" : "Ristinolla"}
                        </Badge>
                      </div>
                      <small className="text-muted d-block mt-1">
                        Luotu: {new Date(room.created_at).toLocaleTimeString("fi-FI")}
                      </small>
                    </div>
                    <Button
                      className="lobby-button"
                      size="lg"
                      onClick={() => handleJoin(room)}
                    >
                      Liity peliin
                    </Button>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}