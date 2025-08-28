const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
            <div className="container mx-auto">
                <p className="text-sm">
                    All Rights Reserved. Nikos © {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
};

export default Footer;