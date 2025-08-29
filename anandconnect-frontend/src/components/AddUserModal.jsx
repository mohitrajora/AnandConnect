import { useState } from "react";

export default function AddUserModal({ role, onClose, refresh, setPopup }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        enrollment: "",
        phone: "",
        course: "",
        department: "",
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Save user
    const handleSave = async () => {
        try {
            let url = "";
            let payload = {};

            if (role === "student") {
                url = "https://anandconnect.onrender.com/students/create-student";
                payload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    enrollment: formData.enrollment,
                    phone: formData.phone,
                    course: formData.course,
                };
            } else {
                url = "https://anandconnect.onrender.com/faculty/create";
                payload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    department: formData.department,
                };
            }

            const token = localStorage.getItem("token"); // 👈 Get token
            if (!token) {
                setPopup({ type: "error", message: "No token found. Please login again." });
                return;
            }

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // 👈 Send token
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to add user");
            }

            setPopup({ type: "success", message: `${role} added successfully!` });
            refresh();
            onClose();
        } catch (error) {
            setPopup({ type: "error", message: error.message });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add {role}</h2>

                {/* Common fields */}
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2"
                />

                {/* Student-specific fields */}
                {role === "student" && (
                    <>
                        <input
                            type="text"
                            name="enrollment"
                            placeholder="Enrollment"
                            value={formData.enrollment}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="text"
                            name="course"
                            placeholder="Course"
                            value={formData.course}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-2"
                        />
                    </>
                )}

                {/* Faculty-specific fields */}
                {role === "faculty" && (
                    <input
                        type="text"
                        name="department"
                        placeholder="Department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-2"
                    />
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}