import React from "react";
import { useNavigate } from "react-router-dom";

// Polku selitetty: 
// ../ nousee pois 'pages' kansiosta 'src' tasolle
// assets/ menee 'assets' kansioon
import palapeliKuva from "../assets/hjkmst_palapeli.png";

export default function Etusivu() {
  const navigate = useNavigate();

  const games = [
    { name: 'Palapeli', img: palapeliKuva, route: '/palapeli' },
    { name: 'Sudoku', img: '/sudoku.png', route: '/sudoku' },
    { name: 'Nonogram', img: '/nonogram.png', route: '/nonogram' }
  ];

  return (
    <div
      style={{
        width: '100vw', 
        minHeight: 'calc(100vh - 56px)', 
        backgroundColor: '#0b0c10',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0',
        padding: '2rem 0',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)'
      }}
    >
      <h1 className="display-4 fw-bold mb-5 text-center">Valitse peli</h1>
      
      <div className="container">
        <div className="row justify-content-center g-4">
          {games.map((game, idx) => (
            <div className="col-lg-4 col-md-6 d-flex justify-content-center" key={idx}>
              <div 
                className="card bg-dark text-white border-secondary shadow-lg h-100" 
                style={{ 
                  width: '100%', 
                  maxWidth: '320px', 
                  borderRadius: '15px',
                  border: '1px solid #455a64'
                }}
              >
                <div style={{ 
                  height: '200px', 
                  backgroundColor: '#1c1e22',
                  borderRadius: '15px 15px 0 0', 
                  overflow: 'hidden' 
                }}>
                  <img 
                    src={game.img} 
                    className="card-img-top w-100 h-100" 
                    alt={game.name} 
                    style={{ 
                      objectFit: 'cover',
                      display: game.img ? 'block' : 'none'
                    }}
                  />
                </div>
                <div className="card-body d-flex flex-column align-items-center">
                  <h5 className="card-title mb-3 fw-bold">{game.name}</h5>
                  <button 
                    className="btn btn-primary w-100 mt-auto shadow" 
                    onClick={() => navigate(game.route)}
                  >
                    Pelaa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}