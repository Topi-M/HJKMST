
import {supabase} from '../components/SupaBaseClient'


const { data } = supabase
  .storage
  .from("muistipeliKuvat") 
  .getPublicUrl("muistipeli1.jpg") 

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