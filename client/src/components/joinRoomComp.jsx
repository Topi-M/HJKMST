import React, { useState } from 'react';

export default function JoinRoom({ room, onConfirm, onClose }) {
  const [password, setPassword] = useState('');

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Join {room.name}</h2>
      {room.password && (
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      )}
      <button onClick={() => onConfirm(room, password)}>Confirm</button>
      <button onClick={onClose} style={{ marginLeft: '1rem' }}>Cancel</button>
    </div>
  );
}