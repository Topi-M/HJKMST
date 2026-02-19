import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const { data } = supabase
  .storage
  .from("kuvat") 
  .getPublicUrl("testikuva.png") 

const imageUrl = data.publicUrl

function Card({ card, onClick }) {
  return (
    <div
      className={`memory-card${card.isFlipped ? " flip" : ""}`}
      onClick={onClick}
      style={{ order: card.order }}
      data-testid={card.id}
    >
      <img className="front-face" src={card.image} alt="Card" />
      <img className="back-face" src={imageUrl} alt="Card" />
    </div>
  );
}

export default Card;