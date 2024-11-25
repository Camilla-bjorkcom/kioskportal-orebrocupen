import React from "react";


const Header: React.FC = () => {
    return (
        <header className="bg bg-slate-300 py-3">
            <div className="container mx-auto px-4 flex items-center ">
                <div className="logoImage">
                    <img src="src\assets\images\tempLogo.svg" alt="Kiosk Portalen"></img>
                </div>         
                              
            </div>
        </header>
    )
};

export default Header;