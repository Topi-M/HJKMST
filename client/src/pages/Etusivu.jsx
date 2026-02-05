import React from "react";
import { useNavigate } from "react-router-dom";

export default function Etusivu() {
  const navigate = useNavigate();

  const games = [
    { name: 'Palapeli', img: '/puzzle.png', route: '/palapeli' },
    { name: 'Sudoku', img: '/sudoku.png', route: '/placeholder2' },
    { name: 'Nonogram', img: '/nonogram.png', route: '/placeholder3' }
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
                style={{ width: '100%', maxWidth: '320px', borderRadius: '15px' }}
              >
                <div style={{ height: '200px', backgroundColor: '#455a64', borderRadius: '15px 15px 0 0' }}>
                   {/* Jos kuva puuttuu, näkyy harmaa laatikko */}
                  <img 
                    src={game.img} 
                    className="card-img-top w-100 h-100" 
                    alt={game.name} 
                    style={{ objectFit: 'cover' }}
                    onError={(e) => e.target.style.display = 'none'} 
                  />
                </div>
                <div className="card-body d-flex flex-column align-items-center">
                  <h5 className="card-title mb-3">{game.name}</h5>
                  <button 
                    className="btn btn-primary w-100 mt-auto" 
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