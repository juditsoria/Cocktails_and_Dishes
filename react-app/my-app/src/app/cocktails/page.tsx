'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css";

const Cocktails = () => {
  const [cocktails, setCocktails] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [customCocktail, setCustomCocktail] = useState({
    name: '',
    preparation_steps: '',
    flavor_profile: 'sweet',
    url_image: '',
  });

  // Función para subir imágenes a Cloudinary y actualizar el estado
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.error("No se seleccionó ningún archivo");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "judittt"); // Preset de Cloudinary

    try {
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dxqbmbj3j/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error(`Error al subir la imagen: ${cloudinaryResponse.statusText}`);
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const cloudinaryUrl = cloudinaryData.secure_url;

      if (!cloudinaryUrl) {
        throw new Error("No se recibió una URL válida de Cloudinary");
      }

      setCustomCocktail((prev) => ({
        ...prev,
        url_image: cloudinaryUrl,
      }));

      console.log("Imagen subida a Cloudinary:", cloudinaryUrl);
    } catch (error) {
      console.error("Error al manejar la imagen:", error);
    }
  };

  // Fetch de la API externa de cócteles
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

  useEffect(() => {
    fetchCocktails();
  }, []);

  const refreshCocktails = () => {
    setLoading(true);
    setCocktails([]);
    setError('');
    fetchCocktails();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomCocktail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Envía la información del formulario al back
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customCocktail.url_image) {
      console.log('Estado antes de enviar:', customCocktail);
      setError('La imagen es obligatoria');
      return; 
    }

    const cocktailData = {
      name: customCocktail.name,
      preparation_steps: customCocktail.preparation_steps,
      flavor_profile: customCocktail.flavor_profile,
      url_image: customCocktail.url_image,
      user_id: 2,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/cocktail", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cocktailData),
      });
      console.log('Respuesta del servidor:', response);
      if (!response.ok) {
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        setError(data.Error || 'Error al guardar el cóctel');
      } else {
        console.log('Cóctel guardado:', cocktailData);
        setCustomCocktail({
          name: '',
          preparation_steps: '',
          flavor_profile: 'sweet',
          url_image: '',
        });
        alert('Cóctel guardado correctamente');
        router.push('/favorites');
      }
    } catch (err) {
      console.error('Error al guardar el cóctel:', err);
      setError('Hubo un error al guardar el cóctel.');
    }
  };

  // Añade un cóctel de la API externa a favoritos
  const addToFavorites = async (cocktailId: number) => {
    const userId = 1; // Ajusta según el usuario logueado

    if (!cocktailId) {
      alert('No se proporcionó un cóctel válido');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          cocktail_id: cocktailId,
          dish_id: null,  
        }),
      });

      if (response.ok) {
        alert('Cóctel añadido a favoritos');
      } else {
        const result = await response.json();
        alert(result.Error || 'Hubo un error al añadir a favoritos');
      }
    } catch (error) {
      console.error('Error al añadir a favoritos:', error);
      alert('Hubo un error de conexión');
    }
  };

  if (loading) {
    return <p className="loading-message">Cargando cócteles...</p>;
  }

  return (
    <div className="cocktails-container">
      {/* Sección Hero: muestra un cóctel sugerido con imagen de fondo */}
      <section 
  className="hero-section"
  style={{
    backgroundImage: `url(${cocktails[0]?.strDrinkThumb || '/ruta-de-fallback.jpg'})`
  }}
>
  <div className="hero-overlay">
    <div className="hero-content">
      <h1 className="hero-title">{cocktails[0]?.strDrink}</h1>
      <p className="hero-text">{cocktails[0]?.strInstructions}</p>
      <div className="hero-buttons">
        <button className="btn btn-info" onClick={refreshCocktails}>
          Ver otro cóctel
        </button>
        <button 
          className="btn btn-warning" 
          onClick={() => addToFavorites(cocktails[0]?.idDrink)}
        >
          Añadir a Favoritos
        </button>
      </div>
    </div>
  </div>
</section>


      {/* Sección Formulario: crea tu propio cóctel */}
      <section className="form-section container">
        <h2 className="form-title">Crea tu propio cóctel</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nombre del Cóctel</label>
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
              <label htmlFor="flavor_profile" className="form-label">Perfil de Sabor</label>
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
              <label htmlFor="image" className="form-label">Añadir Foto</label>
              <input
                type="file"
                className="form-control"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Guardar Cóctel
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Cocktails;
