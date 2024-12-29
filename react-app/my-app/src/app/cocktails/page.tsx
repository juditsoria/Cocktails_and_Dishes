'use client'
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  // Asegúrate de tener importados los estilos de Bootstrap

const Cocktails = () => {
  const [cocktails, setCocktails] = useState<any[]>([]);  // Asegúrate de que sea un array vacío por defecto
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCocktails = async () => {
    try {
      // Obtener varios cócteles aleatorios
      const cocktailPromises = Array.from({ length: 5 }, async () => {
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const data = await response.json();
        return data.drinks ? data.drinks[0] : null;
      });

      const cocktailsData = await Promise.all(cocktailPromises);

      // Filtramos los cócteles nulos (si no se obtuvo uno válido)
      const validCocktails = cocktailsData.filter((cocktail) => cocktail !== null);

      if (validCocktails.length === 0) {
        setError('No se encontraron cócteles.');
      } else {
        setCocktails(validCocktails);
      }
    } catch (err) {
      setError('Hubo un error al obtener los cócteles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCocktails();
  }, []);  // Llamada inicial cuando el componente se monta

  const refreshCocktails = () => {
    setLoading(true);
    setCocktails([]);
    setError('');
    fetchCocktails();  // Ahora esta función está disponible aquí
  };

  if (loading) {
    return <p>Cargando cócteles...</p>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center flex-column" style={{ minHeight: '100vh' }}>
      {error && <p>{error}</p>}

      <div className="mb-3">
        <button className="btn btn-info" onClick={refreshCocktails}>
          Ver más cócteles
        </button>
      </div>

      <div className="card" style={{ width: '18rem' }}>
        <img
          src={cocktails[0]?.strDrinkThumb}
          className="card-img-top"
          alt={cocktails[0]?.strDrink}
        />
        <div className="card-body">
          <h5 className="card-title">{cocktails[0]?.strDrink}</h5>
          <p className="card-text">{cocktails[0]?.strInstructions}</p>
          <div className="d-flex justify-content-between">
            <button className="btn btn-primary">Añadir a Favoritos</button>
            <button className="btn btn-secondary">Crear Maridaje</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cocktails;
