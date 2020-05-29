import React, { useState } from 'react';

function App() {
  const [techs, setTech] = useState(['ReactJS', 'React Native']);
  const [newTech, setNewTech] = useState('');

  function handleAdd() {
    setTech([...techs, newTech]);
    setNewTech('');
  }

  return (
    <>
      <ul>
        {techs.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <input value={newTech} onChange={(e) => setNewTech(e.target.value)} />
      <button type="button" onClick={handleAdd}>
        Adicionar
      </button>
    </>
  );
}

export default App;
