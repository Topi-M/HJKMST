import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../components/SupaBaseClient";
import { Button, Container, Badge } from "react-bootstrap";
import "../css/pokeri.css";

export default function Pokeri() {
    const { id } = useParams(); // Poistettu tyyppimäärittely
    const navigate = useNavigate();
    const myId = useRef(crypto.randomUUID());

    // PELIN TILA
    const [players, setPlayers] = useState([]);
    const [myPlayerIndex, setMyPlayerIndex] = useState(-1);
    const [communityCards, setCommunityCards] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [pot, setPot] = useState(0);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [currentBet, setCurrentBet] = useState(0);
    const [balance, setBalance] = useState(1000);
    const [minBet, setMinBet] = useState(10) // Pelaajan rahasaldo
    const [dealerIndex, setDealerIndex] = useState(0); // Kuka on jakaja
    const [round, setRound] = useState("preflop");    // preflop, flop, turn, river
    const [playerStatus, setPlayerStatus] = useState({}); // Kuka on foldannut jne.
    const channelRef = useRef(null);
    const [countdown, setCountdown] = useState(null);
    const [gameActive, setGameActive] = useState(false);
    const timerRef = useRef(null);


    useEffect(() => {
        if (!id) return;

        const setupUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            let finalUsername = "Pelaaja";

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', user.id)
                    .single();
                if (profile) finalUsername = profile.username;
            }

            const channel = supabase.channel(`poker-${id}`, {
                config: { presence: { key: myId.current } }
            });
            channelRef.current = channel;

            channel
                .on("presence", { event: "sync" }, () => {
                    const state = channel.presenceState();
                    const connectedPlayers = Object.values(state)
                        .flat()
                        .map((p) => ({
                            playerId: p.playerId,
                            name: p.name
                        }));
                    setPlayers(connectedPlayers);

                    const myIdx = connectedPlayers.findIndex(p => p.playerId === myId.current);
                    setMyPlayerIndex(myIdx);
                })

                .on("broadcast", { event: "poker-start" }, ({ payload }) => {
                    console.log("Viesti saatu muualta:", payload);
                    handleStartGame(payload);
                })

                // --------------------------------------------
                // Etsi tämä kohta useEffectistäsi
                .on("broadcast", { event: "poker-move" }, ({ payload }) => {
                    const { playerId, addedPot, nextTurn, newRound, moveType } = payload;

                    setPot(prev => prev + addedPot);
                    setCurrentTurn(nextTurn);

                    // Päivitetään kuka on foldannut
                    if (moveType === "fold") {
                        setPlayerStatus(prev => ({
                            ...prev,
                            [playerId]: { folded: true }
                        }));
                    }

                    if (newRound) setRound(newRound);
                    if (playerId === myId.current) setBalance(prev => prev - addedPot);

                    // TARKISTUS: Onko vain yksi pelaaja jäljellä?
                    // (Tämä vaatii pienen viiveen, jotta tila ehtii päivittyä tai laskennan suoraan payloadista)
                    if (newRound === "showdown") {
                        ratkaiseVoittaja();
                    }
                })
                .on("broadcast", { event: "poker-reveal" }, ({ payload }) => {
                    const { allHands } = payload;
                    setPlayerStatus(prev => ({ ...prev, revealedHands: { ...prev.revealedHands, ...allHands } }));
                })

                .on("broadcast", { event: "poker-winner" }, ({ payload }) => {
                    const { winnerIdx, amount, winnerId } = payload;

                    // 1. Näytetään voittaja (tämä estää "Kortit jaetaan pian" -jumin välittömästi)
                    alert(`Voittaja on ${players[winnerIdx]?.name}! Potti: $${amount}`);

                    // 2. Päivitetään saldo vain voittajalle
                    if (myId.current === winnerId) {
                        setBalance(prev => prev + amount);
                    }

                    // 3. ODOTETAAN hetki, että pelaajat näkevät tuloksen, ja SITTEN nollataan
                    setTimeout(() => {
                        setGameActive(false);
                        setPot(0);
                        setCommunityCards([]);
                        setPlayerHand([]); // Tyhjennetään käsi vasta tässä
                        setRound("preflop");
                        setPlayerStatus({});
                        // Tämän jälkeen se useEffectin laskuri (15s) käynnistyy automaattisesti uudestaan
                    }, 5000); // 5 sekunnin tauko ennen uutta jakoa
                })

                .subscribe(async (status) => {
                    if (status === "SUBSCRIBED") {
                        await channel.track({ playerId: myId.current, name: finalUsername });
                    }
                });
        };

        setupUser();
        return () => { channelRef.current?.unsubscribe(); };
    }, [id]);

    useEffect(() => {
        // 1. Jos pelaajia on alle 2, nollataan tilanne
        if (players.length < 2) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = null;
            setCountdown(null);

            if (gameActive && players.length === 1) {
                // Tähän voisi lisätä pienen ilmoituksen voitosta
                setGameActive(false);
                setCommunityCards([]);
                setPlayerHand([]);
            }
            return;
        }

        // 2. Jos pelaajia on 2+ eikä peli ole käynnissä, aloitetaan laskuri
        if (players.length >= 2 && !gameActive && !timerRef.current) {
            setCountdown(15);

            timerRef.current = setTimeout(() => {
                // VAIN HOST (Index 0) ajaa tämän
                if (myPlayerIndex === 0) {
                    console.log("Aika loppui, isäntä jakaa kortit...");
                    jaaKortit();
                }
                timerRef.current = null;
                setCountdown(null);
            }, 15000);
        }
    }, [players, gameActive, myId.current, myPlayerIndex]);

    // Apufunktio sekuntien näyttämiseen ruudulla
    useEffect(() => {
        if (countdown === null) return;
        if (countdown <= 0) return;

        const interval = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown]);

    const sekoitaPakka = () => {
        const maat = ['♠', '♣', '♥', '♦'];
        const arvot = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        let uusiPakka = [];

        for (let maa of maat) {
            for (let arvo of arvot) {
                uusiPakka.push({ suit: maa, value: arvo });
            }
        }

        // Fisher-Yates shuffle
        for (let i = uusiPakka.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [uusiPakka[i], uusiPakka[j]] = [uusiPakka[j], uusiPakka[i]];
        }
        return uusiPakka;
    };

    // Apufunktio, joka ajaa pelin aloituksen (sama logiikka kuin broadcastissa)
    const handleStartGame = (data) => {
        const { fullDeck, allIds, sbIdx, bbIdx } = data;
        const omaPaikka = allIds.indexOf(myId.current);

        if (omaPaikka === -1) return;

        setMyPlayerIndex(omaPaikka);
        setPot(30);
        setGameActive(true);
        setRound("preflop");
        setPlayerStatus({});
        setPlayerHand([fullDeck[omaPaikka * 2], fullDeck[omaPaikka * 2 + 1]]);
        setCommunityCards([fullDeck[40], fullDeck[41], fullDeck[42], fullDeck[43], fullDeck[44]]);

        if (omaPaikka === sbIdx) setBalance(prev => prev - 10);
        if (omaPaikka === bbIdx) setBalance(prev => prev - 20);

        setCurrentTurn(sbIdx);
    };

    const jaaKortit = () => {
        const pakka = sekoitaPakka();
        const pelaajaIds = players.map(p => p.playerId);

        const data = {
            fullDeck: pakka,
            allIds: pelaajaIds,
            sbIdx: dealerIndex,
            bbIdx: (dealerIndex + 1) % pelaajaIds.length
        };

        // 1. Lähetetään muille
        channelRef.current.send({
            type: "broadcast",
            event: "poker-start",
            payload: data
        });

        // 2. Päivitetään isäntä itse välittömästi!
        handleStartGame(data);
    };
    const ratkaiseVoittaja = () => {
        // 1. Kerätään tiedot ketkä eivät foldanneet
        // Tässä vaiheessa (v2) voitetaan se, jolla on suurin kortti (High Card), 
        // ellet halua lisätä täyttä pokerikäsi-kirjastoa heti.

        if (myPlayerIndex === 0) { // Vain Host laskee ja lähettää tuloksen
            let voittajaIndex = 0;
            // Esimerkki: katsotaan kummalla on isompi kortti kädessä (yksinkertaistettu v2)
            // Oikeassa pelissä tässä kohtaa käytettäisiin kirjastoa kuten 'pokersolver'

            // Lähetetään tieto voittajasta kaikille
            channelRef.current.send({
                type: "broadcast",
                event: "poker-winner",
                payload: {
                    winnerIdx: 0, // Tähän logiikka kuka voitti
                    amount: pot
                }
            });
        }
    };

    const teeSiirto = (summa, moveType = "bet") => {
        if (balance < summa) return alert("Rahat ei riitä!");

        let seuraavaVuoro = (currentTurn + 1) % players.length;
        let uusiVaihe = round;

        // Yksinkertainen check: jos vuoro palaa jakajalle, vaihdetaan vaihetta
        if (seuraavaVuoro === dealerIndex && round !== "showdown") {
            const kierrokset = ["preflop", "flop", "turn", "river", "showdown"];
            const nykyinenIdx = kierrokset.indexOf(round);
            uusiVaihe = kierrokset[nykyinenIdx + 1];
            seuraavaVuoro = dealerIndex;
        }

        channelRef.current.send({
            type: "broadcast",
            event: "poker-move",
            payload: {
                playerId: myId.current,
                addedPot: summa,
                nextTurn: seuraavaVuoro,
                newRound: uusiVaihe,
                moveType: moveType // "fold", "check" tai "bet"
            }
        });
    };

    return (
        <div className="poker-container">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Button variant="outline-light" onClick={() => navigate("/Lobby")}>← Takaisin</Button>
                    <div className="glass-header px-4 py-2">
                        <h2 className="poker-title m-0">TEXAS HOLD'EM</h2>
                    </div>
                    <Badge bg="dark" className="p-2">Huone: {id}</Badge>
                </div>

                <div className="poker-table">
                    <div className="table-center">
                        <div className="pot-info">
                            <span className="pot-label">POTTI</span>
                            <span className="pot-amount">${pot}</span>
                        </div>

                        {countdown !== null && (
                            <div className="countdown-overlay text-center">
                                <h3 className="m-0 text-warning">Peli alkaa {countdown}s</h3>
                                <small className="text-white-50">Odotetaan pelaajia...</small>
                            </div>
                        )}

                        <div className="community-cards-area">
                            {communityCards.map((card, i) => {
                                if (round === "preflop") return null;
                                if (round === "flop" && i > 2) return null;
                                if (round === "turn" && i > 3) return null;
                                return (
                                    <div key={i} className={`poker-card ${card.suit === '♥' || card.suit === '♦' ? 'red' : ''}`}>
                                        <span className="card-value">{card.value}</span>
                                        <span className="card-suit">{card.suit}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="opponents-list">
                        {players.map((p, i) => (
                            <div key={i} className={`player-box ${currentTurn === i ? 'active' : ''}`}>
                                <div className="player-info">
                                    <strong>{p.name}</strong>
                                    <div className="badges">
                                        {dealerIndex === i && <Badge bg="warning" text="dark">D</Badge>}
                                        {(dealerIndex + 1) % players.length === i && <Badge bg="info">SB</Badge>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="player-controls-area">
                    <div className="balance-info text-center mb-3">
                        <h4 className="text-white">Saldo: <span className="text-success">${balance}</span></h4>
                    </div>

                    <div className="my-hand">
                        {playerHand.length > 0 ? (
                            playerHand.map((card, i) => (
                                <div key={i} className={`poker-card my-card ${card.suit === '♥' || card.suit === '♦' ? 'red' : ''}`}>
                                    <span className="card-value">{card.value}</span>
                                    <span className="card-suit">{card.suit}</span>
                                </div>
                            ))
                        ) : (
                            <div className="empty-hand-placeholder">Kortit jaetaan pian</div>
                        )}
                    </div>

                    <div className="action-buttons glass-header py-3 px-5 mt-3 d-flex align-items-center justify-content-center">
                        {gameActive ? (
                            <>
                                <Button variant="danger" className="mx-2 px-4"
                                    disabled={myPlayerIndex !== currentTurn}
                                    onClick={() => teeSiirto(0, "fold")}>FOLD</Button>

                                <Button variant="outline-info" className="mx-2 px-4"
                                    disabled={myPlayerIndex !== currentTurn}
                                    onClick={() => teeSiirto(0, "check")}>CHECK</Button>

                                <Button variant="primary" className="mx-2"
                                    disabled={myPlayerIndex !== currentTurn}
                                    onClick={() => teeSiirto(minBet)}>CALL (${minBet})</Button>

                                <Button variant="warning" className="mx-2"
                                    disabled={myPlayerIndex !== currentTurn}
                                    onClick={() => teeSiirto(minBet * 2)}>RAISE (${minBet * 2})</Button>
                            </>
                        ) : (
                            <div className="text-center text-white-50 small">
                                {countdown !== null ? `JAKO ALKAA: ${countdown}s` : "Odotetaan peliä..."}
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
}