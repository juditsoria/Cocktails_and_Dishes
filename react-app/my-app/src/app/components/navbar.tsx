'use client';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
      <a className="navbar-brand" href="/">Home</a>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item active mx-2">
            <a className="nav-link" href="/cocktails">Cockteles</a>
          </li>
          <li className="nav-item mx-2">
            <a className="nav-link" href="/dishes">Platos</a>
          </li>
          <li className="nav-item active mx-2">
            <a className="nav-link" href="/login">Tus maridajes perfectos</a>
          </li>
          <li className="nav-item active mx-2">
            <a className="nav-link" href="/favorites">Favoritos</a>
          </li>
          <li className="nav-item active mx-2">
            <a className="nav-link" href="/login">Chat</a>
          </li>
          <li className="nav-item active mx-2">
            <a className="nav-link" href="/posts">Comparte tus ideas</a>
          </li>
        </ul>
        <ul className="navbar-nav"> {/* Lista separada para "Cerrar sesión" */}
          <li className="nav-item mx-2">
            <a className="nav-link" href="/login">Cerrar sesión</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
