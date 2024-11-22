import React from "react";


const Header: React.FC = () => {
    return (
        <header className="bg bg-slate-300 py-3">
            <div className="container mx-auto px-4 flex items-center ">
                <div className="logoImage">
                    <img src="src\assets\images\tempLogo.svg" alt="Kiosk Portalen"></img>
                </div>
                
                    <h1 className="w-full mx-auto text-center text-2xl font-bold">Välkommen till Kiosk Portalen</h1>
                
            </div>
        </header>
    )
};

export default Header;