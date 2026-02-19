import React from 'react';
import { useNavigate } from 'react-router-dom';

const Etusivu = () => {
  const navigate = useNavigate();

  const pelit = [
    { 
      id: 'palapeli',
      name: 'Palapeli', 
      img: "https://zzeyhenubyohhtzbeoyv.supabase.co/storage/v1/object/sign/pelien%20pikkukuvat/hjkmst_palapeli.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81NWY3OWU2Ny1iM2U5LTRlNDQtYTZiMy0zY2QzYThiMTdkNzAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwZWxpZW4gcGlra3VrdXZhdC9oamttc3RfcGFsYXBlbGkucG5nIiwiaWF0IjoxNzcxNDE1NTE4LCJleHAiOjE4MDI5NTE1MTh9.tAJgGgw6WT6cRfiVarjg0ZRuOxcQlJMfK7n0ZRj5bq8",
      route: '/palapeli',
      description: 'Ratkaise kuvioita logiikan avulla.'
    },
    { 
      id: 'sudoku',
      name: 'Sudoku', 
      img: "https://zzeyhenubyohhtzbeoyv.supabase.co/storage/v1/object/sign/pelien%20pikkukuvat/sudoku.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81NWY3OWU2Ny1iM2U5LTRlNDQtYTZiMy0zY2QzYThiMTdkNzAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwZWxpZW4gcGlra3VrdXZhdC9zdWRva3UucG5nIiwiaWF0IjoxNzcxNTAwMTExLCJleHAiOjQ5MjUxMDAxMTF9.OyuWx0a5Un6TPH5QJu8aXFFwwr-tK91CpNJU3UulqSQ", // Lisää URL myöhemmin
      route: '/sudoku',
      description: 'Täytä ruudukko numeroilla.'
    },
    { 
      id: 'nonogram',
      name: 'Nonogram', 
      img: "https://zzeyhenubyohhtzbeoyv.supabase.co/storage/v1/object/sign/pelien%20pikkukuvat/nonogram.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81NWY3OWU2Ny1iM2U5LTRlNDQtYTZiMy0zY2QzYThiMTdkNzAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwZWxpZW4gcGlra3VrdXZhdC9ub25vZ3JhbS5wbmciLCJpYXQiOjE3NzE1MDAwODMsImV4cCI6NDkyNTEwMDA4M30.4ZQ_jhEYliyaXibsn6b1Ws6ap55UB5zA_jZqL7aNpp4", // lisää url myöhemmin
      route: '/nonogram',
      description: 'Paljasta piilotettu kuva loogisella päättelyllä.'
    }
  ];

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#0b0c10', minHeight: '100vh', color: 'white' }}>
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold text-info">Valitse peli</h1>
        <p className="lead text-secondary"></p>
      </header>

      {/* row-cols varmistaa, että kortit ovat samanlevyisiä ja h-100 pitää ne samanpituisina */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center px-md-5">
        {pelit.map((peli) => (
          <div key={peli.id} className="col" style={{ maxWidth: '350px' }}>
            <div 
              className="card h-100 border-0 shadow-lg" 
              onClick={() => navigate(peli.route)}
              style={{ 
                cursor: 'pointer', 
                backgroundColor: '#1f2833', 
                borderRadius: '15px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Kuva-alue vakiokorkeudella */}
              <div className="d-flex align-items-center justify-content-center" style={{ 
                height: '200px', 
                backgroundColor: '#1c1e22', 
                borderTopLeftRadius: '15px', 
                borderTopRightRadius: '15px',
                overflow: 'hidden' 
              }}>
                {peli.img ? (
                  <img 
                    src={peli.img} 
                    alt={peli.name}
                    style={{ 
                      maxHeight: '100%', 
                      maxWidth: '100%', 
                      objectFit: 'contain',
                      imageRendering: 'pixelated'
                    }} 
                  />
                ) : (
                  <div className="text-muted">Ei kuvaa</div>
                )}
              </div>

              <div className="card-body d-flex flex-column text-center">
                <h5 className="card-title fw-bold text-info">{peli.name}</h5>
                <p className="card-text text-secondary flex-grow-1">{peli.description}</p>
                <button className="btn btn-outline-info w-100 mt-auto">Pelaa</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Etusivu;