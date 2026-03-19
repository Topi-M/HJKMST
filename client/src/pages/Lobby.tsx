import React, { useEffect, useState } from "react";
import { supabase } from "../components/SupaBaseClient";
import { useNavigate } from "react-router-dom";
import { Button, Form, Card, ListGroup, Container, Row, Col, Badge } from "react-bootstrap";

interface Room {
  id: string;
  code: string;
  status: string;
  created_at: string;
  minigame_id: number;
}

export default function Lobby() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [gameType, setGameType] = useState<string>("ristinolla");
  const navigate = useNavigate();

  const GAME_MAP = {
    "ristinolla": 7,
    "shakki": 8,
    "pokeri": 9
  };

  useEffect(() => {
    fetchRooms();

    const channel = supabase
      .channel("lobby-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms" },
        () => fetchRooms()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    console.log("--- Aloitetaan huoneen luonti ---");

    if (!name) {
      console.warn("Keskeytetään: Nimi puuttuu.");
      return alert("Anna huoneelle nimi");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth-virhe tai käyttäjä ei ole kirjautunut:", authError);
      return alert("Et ole kirjautunut sisään!");
    }

    console.log("Käyttäjä tunnistettu:", user.id);
    console.log("Lähetettävä data:", { name: name });

    const { data, error } = await supabase
      .from("rooms")
      .insert([
        {
          name: name,
          code: password,
          minigame_id: GAME_MAP[gameType as keyof typeof GAME_MAP],
          status: 'waiting'
        }
      ])
      .select()
      .single();


    if (error) {
      console.error("Supabase palautti virheen:");
      console.error("- Viesti:", error.message);
      console.error("- Koodi (hint):", error.hint);
      console.error("- Details:", error.details);
      alert("Virhe: " + error.message);
      return;
    }

    if (data) {
      console.log("Huone luotu onnistuneesti:", data);
      navigate(`/${gameType}/${data.id}`);
    }
  }

  {
    rooms.map((room) => (
      <ListGroup.Item key={room.id} className="d-flex justify-content-between align-items-center p-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0">
              {(room as any).name || room.code || "Nimetön huone"}
            </h5>
            <Badge bg="info" className="text-uppercase">
              {(room as any).game_type || "Ristinolla"}
            </Badge>
          </div>

          <small className="text-muted d-block mt-1">
            Luotu: {new Date(room.created_at).toLocaleString('fi-FI', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit'
            })}
          </small>

          <small className="text-success d-block">
            Tila: {room.status === 'waiting' ? 'Odottaa pelaajia' : 'Käynnissä'}
          </small>
        </div>

        <Button variant="success" size="lg" onClick={() => handleJoin(room)}>
          Liity peliin
        </Button>
      </ListGroup.Item>
    ))
  }

  function handleJoin(room: Room) {
    // Jos huoneella on salasana (code-sarakkeessa)
    if (room.code && room.code !== "") {
      const inputPassword = prompt("Syötä huoneen salasana:");
      if (inputPassword !== room.code) {
        alert("Väärä salasana!");
        return;
      }
    }
    let targetPath = "";

    // Tunnistetaan peli ID:n perusteella
    switch (Number(room.minigame_id)) {
      case 7: targetPath = "ristinolla"; break;
      case 9: targetPath = "pokeri"; break;
      case 8: targetPath = "shakki"; break;
      default: targetPath = "ristinolla";
    }

    navigate(`/${targetPath}/${room.id}`);
  }


  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card className="p-3 mb-4 shadow-sm">
            <h4>Luo uusi huone</h4>
            <Form.Group className="mb-2">
              <Form.Label>Huoneen nimi</Form.Label>
              <Form.Control
                placeholder="Esim. Matin peli"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Valitse peli</Form.Label>
              <Form.Select value={gameType} onChange={(e) => setGameType(e.target.value)}>
                <option value="ristinolla">Ristinolla</option>
                <option value="pokeri">Pokeri</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Salasana (valinnainen)</Form.Label>
              <Form.Control
                type="password"
                placeholder="Salasana"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button onClick={createRoom} variant="primary" className="w-100">
              Luo ja aloita peli
            </Button>
          </Card>
        </Col>

        <Col md={8}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Avoimet pelihuoneet</h4>
            <Button variant="outline-primary" size="sm" onClick={fetchRooms}> Päivitä </Button>
          </div>

          <ListGroup className="shadow-sm">
            {rooms.length === 0 ? (
              <ListGroup.Item className="text-center p-5 text-muted">
                Ei avoimia huoneita. Ole ensimmäinen ja luo uusi peli!
              </ListGroup.Item>
            ) : (
              rooms.map((room) => (
                <ListGroup.Item key={room.id} className="d-flex justify-content-between align-items-center p-3">
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h5 className="mb-0">
                        {(room as any).name || room.code || "Nimetön huone"}
                      </h5>
                      <Badge bg="info" className="text-uppercase">
                        {(room as any).game_type || "Ristinolla"}
                      </Badge>
                    </div>

                    <small className="text-muted d-block mt-1">
                      Luotu: {new Date(room.created_at).toLocaleString('fi-FI', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </small>

                    <small className="text-success d-block">
                      Tila: {room.status || 'Odottaa pelaajia'}
                    </small>
                  </div>

                  <Button variant="success" size="lg" onClick={() => handleJoin(room)}>
                    Liity peliin
                  </Button>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}