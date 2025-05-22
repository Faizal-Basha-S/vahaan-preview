
import React from "react";

const SignInHero = () => {
  return (
    <div 
      className="relative lg:h-full h1/2 lg:w-1/2 w-full overflow-hidden rounded-l-lg bg-cover bg-center lg:block"
      style={{ 
        backgroundImage: `url('/resource-uploads/34d3d5e5-cad4-4b3b-9abc-dd06f637bf79.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
    </div>
  );
};

export default SignInHero;
