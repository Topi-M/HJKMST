import Button from "react-bootstrap/Button";

function PalapeliFetchKuvaButton({ size = 3, onClick }) {
  return (
    <Button variant="primary" onClick={onClick}>
      Valitse kuva
    </Button>
  );
}

export default PalapeliFetchKuvaButton;