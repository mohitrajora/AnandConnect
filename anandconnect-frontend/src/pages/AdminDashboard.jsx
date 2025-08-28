import { useState, useEffect } from "react";
import { Users, GraduationCap, LayoutDashboard, LogOut, UserPlus } from "lucide-react"; // Lucide icons
import AdminSidebar from "../components/AdminSidebar"; // We'll upgrade this too
import UserTable from "../components/UserTable";
import AddUserModal from "../components/AddUserModal";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [students, setStudents] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [popup, setPopup] = useState({ show: false, message: "", success: false, fadingOut: false });

    useEffect(() => {
        fetchData();
    }, []);

    // 👉 Add Student Function
    const addStudent = async (studentData) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setPopup({ show: true, message: "No token found! Please login again.", success: false, fadingOut: false });
                return;
            }

            const res = await fetch("https://anandconnect.onrender.com/students/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(studentData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to add student");
            }

            // ✅ Success
            setPopup({ show: true, message: "Student added successfully!", success: true, fadingOut: false });
            fetchData(); // refresh list
        } catch (err) {
            setPopup({ show: true, message: err.message || "Failed to add student", success: false, fadingOut: false });
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setPopup({ show: true, message: "No token found! Please login again.", success: false, fadingOut: false });
                setLoading(false);
                return;
            }

            const res = await fetch("https://anandconnect.onrender.com/students", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to fetch data");
            }

            const data = await res.json();
            setStudents(data || []);
            setFaculties(data || []);
        } catch (err) {
            setPopup({ show: true, message: err.message || "Failed to load data", success: false, fadingOut: false });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex min-h-screen bg-gradient-to-br from-primary to-secondary text-gray-900">
            {/* Stylish Sidebar */}
            <div className="w-64 bg-white shadow-xl flex flex-col justify-between">
                <div>
                    <div className="p-6 text-center text-2xl font-bold text-primary border-b">
                        Admin Panel
                    </div>
                    <nav className="mt-4">
                        <SidebarItem
                            icon={<LayoutDashboard />}
                            label="Dashboard"
                            active={activeTab === "dashboard"}
                            onClick={() => setActiveTab("dashboard")}
                        />
                        <SidebarItem
                            icon={<GraduationCap />}
                            label="Students"
                            active={activeTab === "students"}
                            onClick={() => setActiveTab("students")}
                        />
                        <SidebarItem
                            icon={<Users />}
                            label="Faculties"
                            active={activeTab === "faculties"}
                            onClick={() => setActiveTab("faculties")}
                        />
                    </nav>
                </div>
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => (window.location.href = "/logout")}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
                    >
                        <LogOut /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                {/* Dashboard */}
                {activeTab === "dashboard" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DashboardCard title="Students" count={students.length} color="bg-blue-500" icon={<GraduationCap />} />
                        <DashboardCard title="Faculties" count={faculties.length} color="bg-green-500" icon={<Users />} />
                    </div>
                )}

                {/* Students Table */}
                {["students", "faculties"].map(tab => (
                    activeTab === tab && (
                        <div key={tab} className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">
                                    {tab === "students" ? "Students" : "Faculties"}
                                </h2>
                                <button
                                    className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition"
                                    onClick={() => setShowModal(true)}
                                >
                                    <UserPlus /> Add {tab === "students" ? "Student" : "Faculty"}
                                </button>
                            </div>

                            <UserTable
                                users={tab === "students" ? students : faculties}
                                role={tab === "students" ? "student" : "faculty"}
                                refresh={fetchData}
                                setPopup={setPopup}
                            />
                        </div>
                    )
                ))}

            </div>

            {/* Add User Modal */}
            {showModal && (
                <AddUserModal
                    role={activeTab === "students" ? "student" : "faculty"}
                    onClose={() => setShowModal(false)}
                    refresh={fetchData}
                    setPopup={setPopup}
                />
            )}

        </div>
    );
}

/* --- SidebarItem Component --- */
function SidebarItem({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-6 py-3 text-left transition-all
                ${active ? "bg-primary text-white font-semibold shadow-md" : "hover:bg-gray-100 text-gray-700"}`}
        >
            {icon} {label}
        </button>
    );
}

/* --- Dashboard Card --- */
function DashboardCard({ title, count, color, icon }) {
    return (
        <div className={`${color} text-white p-6 rounded-xl shadow-xl flex items-center justify-between transform hover:scale-105 transition`}>
            <div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-3xl font-bold">{count}</p>
            </div>
            <div className="text-4xl opacity-80">{icon}</div>
        </div>
    );
}
