'use client';
import React, { useState, useEffect } from 'react';
import { Carousel, Card } from 'react-bootstrap';

// tipado de datos de cócktel
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
        // Llamada para obtener los cócteles creados por el usuario
        const cocktailsResponse = await fetch('http://127.0.0.1:5000/api/cocktails');
        if (!cocktailsResponse.ok) {
          throw new Error('Error al obtener los cócteles creados');
        }
        const cocktailsData = await cocktailsResponse.json();

        // Llamada para obtener los cócteles en favoritos
        const favoritesResponse = await fetch('http://127.0.0.1:5000/api/favorites');
        if (!favoritesResponse.ok) {
          throw new Error('Error al obtener los favoritos');
        }
        const favoritesData = await favoritesResponse.json();

        // Combinar ambos resultados 
        const combinedFavorites = [...cocktailsData, ...favoritesData];
        console.log("Datos combinados recibidos desde el backend:", combinedFavorites);

        // Actualizar el estado 
        setFavorites(combinedFavorites);
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
                height: "100vh", // La tarjeta ocupará el 100% de la altura de la ventana
                display: "flex",
                flexDirection: "column", // Asegura que el contenido esté en columna
                overflow: "hidden", // Evita que el contenido se desborde
              }}
            >
              {/* Sección de la imagen */}
              <div style={{ height: "80%", overflow: "hidden" }}>
                {cocktail.url_image ? (
                  <Card.Img
                    variant="top"
                    src={cocktail.url_image}
                    alt={cocktail.name}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "contain", // Asegura que la imagen se vea entera, sin recorte ni distorsión
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    No hay imagen disponible
                  </div>
                )}
              </div>

              {/* Sección de descripción */}
              <div
                style={{
                  height: "50%",
                  overflowY: "auto", // Habilita el scroll si la descripción es demasiado larga
                  padding: "10px",
                }}
              >
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
              </div>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Favorites;
