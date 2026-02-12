import { Dropdown } from "react-bootstrap";

const SIZES = [3, 5, 7];

const PalaPeliSizeMenu = ({ selectedSize, onSelectSize }) => {
  const label = selectedSize
  ? `Valitse koko: ${selectedSize}x${selectedSize}`
  : "Valitse koko";

  return (
    <Dropdown onSelect={(eventKey) => onSelectSize(Number(eventKey))}>
      <Dropdown.Toggle variant="success" id="puzzle-size-dropdown">
        {label}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {SIZES.map((size) => (
          <Dropdown.Item
            key={size}
            eventKey={String(size)}
            as="button"
            active={selectedSize === size}
          >
            {size}x{size}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default PalaPeliSizeMenu;