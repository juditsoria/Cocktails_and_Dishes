'use client';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';


const Cocktails = () => {
  const [cocktails, setCocktails] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [customCocktail, setCustomCocktail] = useState({
    name: '',
    preparation_steps: '',
    image: '',
    flavor_profile: 'sweet',
  });
 // fetch de la api externa de cocteles
  const fetchCocktails = async () => {
    try {
      const cocktailPromises = Array.from({ length: 5 }, async () => {
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const data = await response.json();
        return data.drinks ? data.drinks[0] : null;
      });

      const cocktailsData = await Promise.all(cocktailPromises);
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
//muestra el coctel
  useEffect(() => {
    fetchCocktails();
  }, []);
// refresca la pagina para que se muestre un coctel diferente
  const refreshCocktails = () => {
    setLoading(true);
    setCocktails([]);
    setError('');
    fetchCocktails();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomCocktail((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cocktailData = {
      name: customCocktail.name,
      preparation_steps: customCocktail.preparation_steps, // Usamos preparation_steps ahora
      flavor_profile: customCocktail.flavor_profile,
      user_id: 2,
      // advertencia!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// esto modificarlo mas adelante cuando se cree el login y el registr!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    };
    // Agregar console.log para verificar los datos antes de enviarlos
  console.log('Datos del cóctel:', cocktailData);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/cocktail", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cocktailData),
      });

      if (!response.ok) {
        const data = await response.json();
        console.log('Respuesta del servidor:', data); // Log de la respuesta completa
        setError(data.Error || 'Error al guardar el cóctel');
      } else {
        console.log('Cóctel guardado:', cocktailData);
        setCustomCocktail({
          name: '',
          preparation_steps: '',
          flavor_profile: 'sweet',
        });
        alert('Cóctel guardado correctamente');
        router.push('/favorites');
      }
    } catch (err) {
        console.error('Error al guardar el cóctel:', err);
      setError('Hubo un error al guardar el cóctel.');
    }
  };

  if (loading) {
    return <p>Cargando cócteles...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Card del cóctel actual */}
        <div className="col-md-6">
          {error && <p>{error}</p>}
          <div className="mb-3">
            <button className="btn btn-info" onClick={refreshCocktails}>
              Ver más cócteles
            </button>
          </div>
          <div className="card mb-4" style={{ width: '100%' }}>
            <img
              src={cocktails[0]?.strDrinkThumb}
              className="card-img-top"
              alt={cocktails[0]?.strDrink}
              style={{
                maxHeight: '350px',
                objectFit: 'contain',
                width: '100%',
              }}
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

        {/* Formulario para crear cócteles propios */}
        <div className="col-md-6">
          <h4>¿Prefieres crear tu cóctel propio?</h4>
          <div className="card" style={{ width: '100%' }}>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nombre del Cóctel
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={customCocktail.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="preparation_steps" className="form-label">
                    Descripción / Pasos de Preparación
                  </label>
                  <textarea
                    className="form-control"
                    id="preparation_steps"
                    name="preparation_steps"
                    rows={3}
                    value={customCocktail.preparation_steps}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="flavor_profile" className="form-label">
                    Perfil de Sabor
                  </label>
                  <select
                    className="form-control"
                    id="flavor_profile"
                    name="flavor_profile"
                    value={customCocktail.flavor_profile}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="sweet">Dulce</option>
                    <option value="sour">Ácido</option>
                    <option value="bitter">Amargo</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    URL de la Imagen
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="image"
                    name="image"
                    value={customCocktail.image}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success">
                  Guardar Cóctel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cocktails;
