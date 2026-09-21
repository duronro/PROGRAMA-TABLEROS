import { useEffect, useState } from "react";
import api from './api/axios';

function App() {
  const [mensaje, setmensaje] = useState<string>('');

  useEffect(() => {
    api.get('/prueba')
    .then((response) => {
      setmensaje(response.data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }, []);

  return (
    <div>
      <h1>TABLERO DE MANTENIMIENTOS</h1>
      <h3>RIKEN MEXICO</h3>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;