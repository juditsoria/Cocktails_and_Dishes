'use client';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';

const Dishes = () => {
  const [dishes, setDishes] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [customDish, setCustomDish] = useState({
    name: '',
    preparation_steps: '',
    flavor_profile: 'sweet',
    url_image: '',
  });
 // función que sirve para subir las imagenes a cloudinary y mandar la url al back
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.error("No se seleccionó ningún archivo");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "dish"); // Preset de Cloudinary

    try {
      // Subir la imagen a Cloudinary
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
      const cloudinaryUrl = cloudinaryData.secure_url; // URL segura de la imagen en Cloudinary

      if (!cloudinaryUrl) {
        throw new Error("No se recibió una URL válida de Cloudinary");
      }

      // Actualizar el estado local
      setCustomDish((prev) => ({
        ...prev,
        url_image: cloudinaryUrl,
      }));

      console.log("Imagen subida a Cloudinary y cóctel actualizado exitosamente", cloudinaryUrl);
    } catch (error) {
      console.error("Error al manejar la imagen:", error);
    }
  };


  // fetch de la api externa de cócteles
  const fetchDishes = async () => {
    try {
      const dishesPromises = Array.from({ length: 5 }, async () => {
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const data = await response.json();
        return data.dish ? data.dish[0] : null;
      });

      const dishesData = await Promise.all(dishesPromises);
      const validDishes = dishesData.filter((dish) => dish !== null);

      if (validDishes.length === 0) {
        setError('No se encontraron platos.');
      } else {
        setDishes(validDishes);
      }
    } catch (err) {
      setError('Hubo un error al obtener los platos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const refreshDishes = () => {
    setLoading(true);
    setDishes([]);
    setError('');
    fetchDishes();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomDish((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
// manda la informacion del formulario al back
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica si la imagen ha sido cargada correctamente antes de continuar
    if (!customDish.url_image) {
      console.log('Estado antes de enviar:', customDish);
      setError('La imagen es obligatoria');
      return; 
    }

    const dishData = {
      name: customDish.name,
      preparation_steps: customDish.preparation_steps,
      flavor_profile: customDish.flavor_profile,
      url_image: customDish.url_image, // Se captura la URL que el usuario introdujo
      user_id: 2,
    };
      // crear cóckteles propios
    try {
      const response = await fetch("http://127.0.0.1:5000/api/dish", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dishData),
      });
      console.log('Respuesta del servidor:', response);
      if (!response.ok) {
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        setError(data.Error || 'Error al guardar el plato');
      } else {
        console.log('Plato guardado:', dishData);
        setCustomDish({
          name: '',
          preparation_steps: '',
          flavor_profile: 'sweet',
          url_image: '', // Se limpia después de enviar
        });
        console.log('URL de imagen actualizada:', customDish.url_image);
        alert('Cóctel guardado correctamente');
        router.push('/favorites');
      }
    } catch (err) {
      console.error('Error al guardar el plato:', err);
      setError('Hubo un error al guardar el plato.');
    }
  };
  // Añadir un cócktel de la api externa a favoritos
  const addToFavorites = async (dishId: number) => {
    const userId = 1;  // O el ID del usuario logueado, dependiendo de cómo lo manejes

    if (!dishId) {
      alert('No se proporcionó un plato válido');
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
          dish_id: dishId,
        }),
      });

      if (response.ok) {
        alert('Plato añadido a favoritos');
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
    return <p>Cargando cócteles...</p>;
  }

  return (
    <div className="container mt-5">
      {/*Card para mostrar los cóckteles traidos de la api*/}
      <div className="row">
        <div className="col-md-6">
          {error && <p>{error}</p>}
          <div className="mb-3 text-white"> ¿Quieres ideas para crear tus platos?   
            <button className="btn btn-info" onClick={refreshDishes}>
              Ver más platos
            </button>
          </div>
          <div className="card mb-4" style={{ width: '100%' }}>
            <img
              src={dishes[0]?.strDrinkThumb}
              className="card-img-top"
              alt={dishes[0]?.strDrink}
              style={{
                maxHeight: '350px',
                objectFit: 'contain',
                width: '100%',
              }}
            />
            <div className="card-body">
              <h5 className="card-title">{dishes[0]?.strDrink}</h5>
              <p className="card-text">{dishes[0]?.strInstructions}</p>
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-primary"
                  onClick={() => addToFavorites(dishes[0]?.idDrink)} 
                >
                  Añadir a Favoritos
                </button>
                <button className="btn btn-secondary">Crear Maridaje</button>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario para crear cócteles propios */}
        <div className="col-md-6">
          <h4>¿Prefieres crear tu plato propio?</h4>
          <div className="card" style={{ width: '100%' }}>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nombre del Plato
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={customDish.name}
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
                    value={customDish.preparation_steps}
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
                    value={customDish.flavor_profile}
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
                    Añadir Foto
                  </label>
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
                <button type="submit" className="btn btn-success">
                  Guardar Plato
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dishes;
