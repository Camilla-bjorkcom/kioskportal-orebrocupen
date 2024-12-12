const Header: React.FC = () => {
  return (
    <header className="container mx-auto py-3 h-32">
      <div className="flex items-center pb-12 ">
        <div className="logoImage">
          <img
            className="h-24"
            src="src\assets\images\tempLogo.svg"
            alt="Kiosk Portalen"
          ></img>
        </div>
      </div>
    </header>
  );
};

export default Header;
