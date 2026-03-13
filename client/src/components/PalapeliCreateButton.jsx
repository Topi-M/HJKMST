import Button from "react-bootstrap/Button";

function PalapeliCreateButton({ size = 3, onClick }) {
  return (
    <Button variant="light" onClick={onClick}>
      Luo {size}×{size} palapeli
    </Button>
  );
}

export default PalapeliCreateButton;