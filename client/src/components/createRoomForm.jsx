import React, { useState } from 'react';

export default function CreateRoomForm({ onCreate }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onCreate({ name, password });
    setName('');
    setPassword('');
  };

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
      <h2>Create New Room</h2>
      <input
        type="text"
        placeholder="Room name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ marginRight: '0.5rem' }}
      />
      <input
        type="password"
        placeholder="Password (optional)"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ marginRight: '0.5rem' }}
      />
      <button onClick={handleSubmit}>Create Room</button>
    </div>
  );
}