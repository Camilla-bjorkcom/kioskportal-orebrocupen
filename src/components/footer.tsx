const Footer: React.FC = () => {

    const currentYear = new Date().getFullYear();
    const footerTitle = "© Kiosk Portal";

    return (
        <footer className="bg">
            <div className="container mx-auto px-4 flex">
               
                <div>
                    <h1> {footerTitle} {currentYear}</h1>
                </div>
            </div>
        </footer>
    )
};

export default Footer;


