Cocktails Web App

Descripción

Proyecto dedicado a la creación de una aplicación web enfocada en el maridaje y los cócteles. Este proyecto se centra en ofrecer información detallada sobre cócteles y su combinación con alimentos, así como una experiencia de usuario fluida y moderna.
Imagenes:
- Landing page:
 <img width="929" alt="image" src="https://github.com/user-attachments/assets/b982e6ec-ebac-4cff-858d-9716130d8b82" />

- Registro
<img width="600" alt="image" src="https://github.com/user-attachments/assets/d25c69f8-5966-4659-be51-99f4077d1f20" />

- Login
- <img width="570" alt="image" src="https://github.com/user-attachments/assets/57f873e9-5806-4aac-a669-9e6ac44632e8" />



  - Cócteles: 
   <img width="911" alt="image" src="https://github.com/user-attachments/assets/ec02f9bf-4103-4463-b9c6-34986b88ffaf" />

    - Cócteler que vienen de la api externa, si le das al botón "Ver más cócteles" que hay en la parte de arriba de la card, se refresca la página y aparece un nuevo cóctel, y si le das a añadir favoritos se guarda el cócktel  como favorito.
   
    - <img width="664" alt="image" src="https://github.com/user-attachments/assets/21d716a9-9499-4fc5-91a4-b2a1de2ccc02" />

    - Formulario por si el usuario prefiere crear sus propios cócteles, almacenandose en la BBDD y guardandose en favoritos.

- Favoritos:
    ![image](https://github.com/user-attachments/assets/756552d1-f6f7-4f24-bacf-1ba15e578402)
      -Cuando se crea un cóctel mediante el formulario anterior, los datos se almacenan en la base de datos. La imagen asociada al cóctel se sube a Cloudinary, y la URL correspondiente de Cloudinary se guarda             también en la base de datos. Posteriormente, toda la información, incluida la imagen, se presenta adecuadamente.


    

Tecnologías Utilizadas

Frontend: Next.js con TypeScript

Backend: Flask para la gestión de la lógica de negocio y la comunicación con la base de datos.

Base de datos: SQLite

Estructura del Proyecto

Frontend

Next.js:

Generación de páginas estáticas y dinámicas con TypeScript.

Diseño de componentes reutilizables para una interfaz moderna y responsiva.

Backend

Flask:

Creación de una API propia para interactuar con la base de datos.

Integración con APIs externas para obtener información de cócteles y platos.

Gestión de modelos para almacenar información personalizada en la base de datos.

Progreso Actual

Frontend:

Configuración inicial con Next.js y TypeScript.

Creación de páginas y componentes base para estructurar la interfaz.

Backend:

Desarrollo de la API para operaciones CRUD en la base de datos.

Integración de APIs externas para obtener información sobre cócteles y platos.

Configuración de SQLite y definición de modelos con SQLAlchemy.

Siguientes Pasos

Frontend:

Implementar formularios para la creación de cócteles y platos propios.

Diseñar la interfaz para el chat entre usuarios.

Backend:

Ampliar la API para permitir la gestión de cócteles y platos creados por los usuarios.

Desarrollar endpoints para funcionalidades de chat y foro.

Plataforma Social:

Crear un foro para que los usuarios compartan y comenten maridajes, platos y cócteles.

Crear un chat para hablar con otros usuarios, o crear grupos.

Instalación y Configuración

Requisitos Previos

Node.js instalado en el sistema para ejecutar el frontend.

Python instalado para correr el backend.

Pasos

Clonar este repositorio.

Instalar las dependencias del frontend:

cd cocktails/frontend
npm install
npm run dev

Configurar y ejecutar el backend:

cd cocktails/backend
pip install -r requirements.txt
python app.py

Contribuciones

Si deseas contribuir a este proyecto, por favor crea un fork del repositorio, realiza tus cambios en una rama nueva, y envía un pull request.


