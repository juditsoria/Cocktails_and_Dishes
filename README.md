Cocktails Web App

Descripción

Proyecto dedicado a la creación de una aplicación web enfocada en el maridaje y los cócteles. Este proyecto se centra en ofrecer información detallada sobre cócteles y su combinación con alimentos, así como una experiencia de usuario fluida y moderna.
Imagenes:
- Landing page:
  ![image](https://github.com/user-attachments/assets/aaf2af40-ff5e-4c1d-aa4e-adb76a6cf5a1)

  - Cócteles: (Al darle al botón de ver más cócteles se generan nuevos)
    ![image](https://github.com/user-attachments/assets/aa368130-9729-4a68-9685-cb3c6e504121)
    

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

