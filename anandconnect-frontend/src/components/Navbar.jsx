import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gradient-to-r from-primary to-secondary shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-10 w-10 object-contain"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <span className="text-white font-bold text-xl tracking-wide">Anand Connect</span>
                    </Link>

                    <div className="hidden md:flex space-x-6">
                        <Link to="/register" className="text-white font-medium hover:text-accent transition">
                            Register
                        </Link>
                        <Link
                            to="/login"
                            className="bg-accent text-black px-4 py-1 rounded-full font-semibold hover:bg-white hover:text-secondary transition"
                        >
                            Login
                        </Link>
                    </div>

                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-gradient-to-r from-primary to-secondary px-4 pb-3 space-y-2">
                    <Link to="/register" className="block text-white hover:text-accent" onClick={() => setIsOpen(false)}>
                        Register
                    </Link>
                    <Link
                        to="/login"
                        className="block bg-accent text-black px-3 py-1 rounded-full font-semibold hover:bg-white hover:text-secondary"
                        onClick={() => setIsOpen(false)}
                    >
                        Login
                    </Link>
                </div>
            )}
        </nav>
    );
}
