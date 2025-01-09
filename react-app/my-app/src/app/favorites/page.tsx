'use client';
import React, { useState, useEffect } from 'react';
import { Carousel, Card } from 'react-bootstrap';

interface Cocktail {
  cocktail_id: number;
  name: string;
  preparation_steps: string;
  url_image?: string;
  flavor_profile: string;
  user_id: number;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Cocktail[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/cocktails');
        if (!response.ok) {
          throw new Error('Error al obtener los favoritos');
        }
        const data = await response.json();
        console.log("Datos recibidos desde el backend:", data);
        setFavorites(data); 
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return <p>Cargando favoritos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mt-5">
    <h2 style={{ color: "white", textAlign: "center" }}>Mis Cócteles Favoritos</h2>
  
    <Carousel>
      {favorites.map((cocktail) => (
        <Carousel.Item key={cocktail.cocktail_id}>
          <Card
            className="text-center"
            style={{
              backgroundColor: "rgba(131, 53, 53, 0.8)", 
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
            }}
          >
            {cocktail.url_image ? (
              <Card.Img
                variant="top"
                src={cocktail.url_image}
                alt={cocktail.name}
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            ) : (
              <div
                style={{
                  height: "400px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f8f9fa",
                }}
              >
                No hay imagen disponible
              </div>
            )}
            <Card.Body>
              <Card.Title>{cocktail.name}</Card.Title>
              <Card.Text>
                <strong>Perfil de sabor:</strong> {cocktail.flavor_profile || "No especificado"}
              </Card.Text>
              <Card.Text>
                <strong>Preparación:</strong> {cocktail.preparation_steps || "No se han proporcionado instrucciones"}
              </Card.Text>
              <Card.Text>
                <strong>ID de usuario:</strong> {cocktail.user_id}
              </Card.Text>
            </Card.Body>
          </Card>
        </Carousel.Item>
      ))}
    </Carousel>
  </div>
  
  );
};

export default Favorites;