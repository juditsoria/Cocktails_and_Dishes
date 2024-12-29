'use client';
import React from 'react';

import WelcomeSection from "./components/welcome.tsx"

const Page = () => {
  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: 'url("/conjunto-cocteles-colores-conjunto-limonadas-barra-bar-bebidas-banner-sobre-fondo-negro_187166-61427.avif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }}
    >
      <WelcomeSection />
    </div>
  );
};

export default Page;
