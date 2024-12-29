'use client';
import React from 'react';
import { Inter } from 'next/font/google'

// Configuración de la fuente
const inter = Inter({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const WelcomeSection = () => {
  return (
    <div
      className={`container-fluid position-relative text-center text-white py-5 ${inter.className}`}

    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      ></div>
      <div className="position-relative">
        <h1 className="display-4 fw-bold">
          ¡Bienvenido a nuestra comunidad de amantes de la gastronomía y la coctelería!
        </h1>
        <p className="lead mb-4">
          Estamos encantados de tenerte con nosotros. Aquí podrás descubrir y compartir recetas de cócteles y platos favoritos, crear maridajes perfectos, participar en foros y chats, unirte a grupos de interés y compartir tus experiencias con otros entusiastas.
        </p>
        <h2 className="h3 mb-3">¿Cómo empezar?</h2>
        <ul className="list-unstyled">
          <li>
            <strong style={{ fontSize: '1.2em' }}>Añade tus recetas favoritas:</strong> Comparte tus cócteles y platos preferidos con la comunidad.
          </li>
          <li>
            <strong style={{ fontSize: '1.2em' }}>Crea maridajes perfectos:</strong> Combina tus recetas con bebidas y platos que realcen su sabor.
          </li>
          <li>
            <strong style={{ fontSize: '1.2em' }}>Participa en el foro y chat:</strong> Conversa con otros miembros, comparte consejos y resuelve dudas.
          </li>
          <li>
            <strong style={{ fontSize: '1.2em' }}>Únete a grupos de interés:</strong> Conecta con personas que comparten tus pasiones culinarias.
          </li>
        </ul>
        <p className="mb-4">¡Disfruta de tu experiencia con nosotros!</p>
        <button className="btn btn-danger m-2">Iniciar sesión</button>
        <button className="btn btn-dark m-2">Registrarse</button>
      </div>
    </div>
  );
};

export default WelcomeSection;
