import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [popup, setPopup] = useState({ show: false, message: "", success: false, fadingOut: false });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("https://anandconnect.onrender.com/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            setPopup({ show: true, message: data.message || "Registered successfully!", success: res.ok, fadingOut: false });
        } catch (error) {
            setPopup({ show: true, message: "Something went wrong!", success: false, fadingOut: false });
        } finally {
            setLoading(false);
        }
    };

    // Auto-close popup after 3 seconds with fade-out animation
    useEffect(() => {
        if (popup.show) {
            const timer = setTimeout(() => {
                setPopup((prev) => ({ ...prev, fadingOut: true }));
                setTimeout(() => setPopup((prev) => ({ ...prev, show: false, fadingOut: false })), 500);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [popup.show]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-secondary relative">

            {/* Centered Modal Popup with Icons */}
            {popup.show && (
                <div className={`fixed inset-0 flex items-center justify-center z-30 transition-opacity duration-500 ${popup.fadingOut ? "opacity-0" : "opacity-100"}`}>
                    {/* Dimmed Background */}
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    {/* Modal Box */}
                    <div className={`relative bg-white p-6 rounded-xl shadow-xl border-t-4 w-80 text-center transform transition-all duration-500 ${popup.fadingOut ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
                        style={{ borderColor: popup.success ? "#22c55e" : "#ef4444" }}>

                        {/* Animated Icon */}
                        <div className="flex justify-center mb-2">
                            {popup.success ? (
                                <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-full animate-bounce">
                                    ✓
                                </div>
                            ) : (
                                <div className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center rounded-full animate-bounce">
                                    ✕
                                </div>
                            )}
                        </div>

                        <h3 className={`text-lg font-semibold ${popup.success ? "text-green-600" : "text-red-600"}`}>
                            {popup.success ? "Success" : "Error"}
                        </h3>
                        <p className="mt-2 text-gray-700">{popup.message}</p>
                        <button
                            onClick={() => setPopup((prev) => ({ ...prev, fadingOut: true }))}
                            className="mt-4 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Register Card */}
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border-t-4 border-primary z-10">
                <div className="flex flex-col items-center mb-4">
                    <img src={logo} alt="Logo" className="h-16 mb-2" />
                    <h2 className="text-2xl font-bold text-primary">Create an Account</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    {/* Password with Show/Hide */}
                    <div className="relative">
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2 text-sm text-primary font-semibold"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <select
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                    >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button
                        className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
}
