import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState({ show: false, message: "", success: false, fadingOut: false });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("https://anandconnect.onrender.com/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setPopup({
                    show: true,
                    message: data.message || "Login failed",
                    success: false,
                    fadingOut: false,
                });
                return;
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
            } else {
                setPopup({
                    show: true,
                    message: "Login failed! Token not received.",
                    success: false,
                    fadingOut: false,
                });
                return;
            }

            const role = data.user?.role;
            if (role === "admin") {
                window.location.href = "/admin-dashboard";
            } else if (role === "student") {
                window.location.href = "/student-dashboard";
            } else if (role === "faculty") {
                window.location.href = "/faculty-dashboard";
            } else {
                setPopup({
                    show: true,
                    message: "No valid role assigned to this account!",
                    success: false,
                    fadingOut: false,
                });
            }

        } catch (error) {
            setPopup({
                show: true,
                message: "Something went wrong! Please try again later.",
                success: false,
                fadingOut: false,
            });
        } finally {
            setLoading(false);
        }
    };

    // Auto-close popup with fade-out after 3s
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

            {/* Popup Modal */}
            {popup.show && (
                <div className={`fixed inset-0 flex items-center justify-center z-30 transition-opacity duration-500 ${popup.fadingOut ? "opacity-0" : "opacity-100"}`}>
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    <div
                        className={`relative bg-white p-6 rounded-xl shadow-xl border-t-4 w-80 text-center transform transition-all duration-500 ${popup.fadingOut ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
                        style={{ borderColor: popup.success ? "#22c55e" : "#ef4444" }}
                    >
                        <div className="flex justify-center mb-2">
                            {popup.success ? (
                                <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-full animate-bounce">✓</div>
                            ) : (
                                <div className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center rounded-full animate-bounce">✕</div>
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

            {/* Login Card */}
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border-t-4 border-primary z-10">
                <div className="flex flex-col items-center mb-4">
                    <img src={logo} alt="Logo" className="h-16 mb-2" />
                    <h2 className="text-2xl font-bold text-primary">Login</h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <div className="relative">
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none pr-10"
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

                    <button
                        className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
