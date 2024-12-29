'use client';

import React, { useEffect, useState } from 'react';

const TestComponent: React.FC = () => {
  const [message, setMessage] = useState<string>(''); // Almacenamos el mensaje de la API

  useEffect(() => {
    // Hacer la solicitud GET al endpoint /test de Flask
    fetch('http://127.0.0.1:5000/test') // La URL correcta según tu ruta Flask
      .then(response => response.json())
      .then(data => setMessage(data.message)) // Usamos data.message para actualizar el estado
      .catch(error => console.error('Error fetching test:', error));
  }, []);

  return (
    <h1>{message}</h1> // Mostramos el mensaje
  );
};

export default TestComponent;
