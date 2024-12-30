'use client';
import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/favorites');
        if (!response.ok) {
          throw new Error('Error al obtener los favoritos');
        }
        const data = await response.json();
        setFavorites(data);
      } catch (err) {
        setError(err.message);
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
      <h2>Mis Cócteles Favoritos</h2>
      <Carousel>
        {favorites.map((cocktail) => (
          <Carousel.Item key={cocktail.id}>
            <img
              className="d-block w-100"
              src={cocktail.image}
              alt={cocktail.name}
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
            <Carousel.Caption>
              <h3>{cocktail.name}</h3>
              <p>{cocktail.preparation_steps}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Favorites;
