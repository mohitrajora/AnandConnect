import { useState, useEffect } from "react";
import { Users, BookOpen, LayoutDashboard, LogOut, Plus } from "lucide-react";
import UserTable from "../components/UserTable";

export default function FacultyDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [newAssignment, setNewAssignment] = useState({
        title: "",
        description: "",
        dueDate: "",
        image: null,
    });

    useEffect(() => {
        fetchStudents();
        fetchAssignments();
    }, []);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://anandconnect.onrender.com/students", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setStudents(data || []);
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    };

    const deleteAssignment = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await fetch(`https://anandconnect.onrender.com/assignments/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchAssignments(); // refresh after delete
        } catch (err) {
            console.error("Error deleting assignment:", err);
        }
    };

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://anandconnect.onrender.com/assignments", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            console.log("Assignments from API:", data); // debug
            setAssignments(data || []); // <-- FIX here
        } catch (err) {
            console.error("Error fetching assignments:", err);
        }
    };

    const addAssignment = async () => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("title", newAssignment.title);
            formData.append("description", newAssignment.description);
            formData.append("dueDate", newAssignment.dueDate);
            if (newAssignment.image) {
                formData.append("assignmentFile", newAssignment.image);
            }

            const res = await fetch("https://anandconnect.onrender.com/assignments/create", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Failed to create assignment: ${errText}`);
            }

            setShowModal(false);
            setNewAssignment({ title: "", description: "", dueDate: "", image: null });
            fetchAssignments();
        } catch (err) {
            console.error("Error posting assignment:", err);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 text-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-xl flex flex-col justify-between">
                <div>
                    <div className="p-6 text-center text-2xl font-bold text-indigo-600 border-b">
                        Faculty Panel
                    </div>
                    <nav className="mt-4">
                        <SidebarItem
                            icon={<LayoutDashboard />}
                            label="Dashboard"
                            active={activeTab === "dashboard"}
                            onClick={() => setActiveTab("dashboard")}
                        />
                        <SidebarItem
                            icon={<Users />}
                            label="Students"
                            active={activeTab === "students"}
                            onClick={() => setActiveTab("students")}
                        />
                        <SidebarItem
                            icon={<BookOpen />}
                            label="Assignments"
                            active={activeTab === "assignments"}
                            onClick={() => setActiveTab("assignments")}
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
                {/* Dashboard Overview */}
                {activeTab === "dashboard" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DashboardCard
                            title="Students"
                            count={students.length}
                            color="bg-blue-500"
                            icon={<Users />}
                        />
                        <DashboardCard
                            title="Assignments"
                            count={assignments.length}
                            color="bg-purple-500"
                            icon={<BookOpen />}
                        />
                    </div>
                )}

                {/* Students Tab */}
                {activeTab === "students" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Students</h2>
                        </div>
                        <UserTable
                            users={students}
                            role="student"
                            refresh={fetchStudents}
                        />
                    </div>
                )}

                {/* Assignments Tab */}
                {activeTab === "assignments" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Assignments</h2>
                            <button
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                                onClick={() => setShowModal(true)}
                            >
                                <Plus /> Post Assignment
                            </button>
                        </div>
                        <ul className="space-y-3">
                            {assignments.map((a) => (
                                <li
                                    key={a._id}
                                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition relative"
                                >
                                    <h3 className="font-bold text-lg">{a.title}</h3>
                                    <p>{a.description}</p>
                                    <p className="text-sm text-gray-500">
                                        Due: {new Date(a.dueDate).toLocaleDateString()}
                                    </p>

                                    {/* Show thumbnail if image exists */}
                                    {a.imageUrl && (
                                        <img
                                            src={`https://anandconnect.onrender.com${a.imageUrl}`}
                                            alt={a.title}
                                            className="mt-2 w-40 h-32 object-cover rounded cursor-pointer"
                                            onClick={() =>
                                                setSelectedImage(`https://anandconnect.onrender.com${a.imageUrl}`)
                                            }
                                        />
                                    )}

                                    {/* Delete button */}
                                    <button
                                        onClick={() => deleteAssignment(a._id)}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>

            {/* Assignment Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Post Assignment</h2>

                        {/* Title */}
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full border p-2 mb-2 rounded"
                            value={newAssignment.title}
                            onChange={(e) =>
                                setNewAssignment({
                                    ...newAssignment,
                                    title: e.target.value,
                                })
                            }
                        />

                        {/* Description */}
                        <textarea
                            placeholder="Description"
                            className="w-full border p-2 mb-2 rounded"
                            value={newAssignment.description}
                            onChange={(e) =>
                                setNewAssignment({
                                    ...newAssignment,
                                    description: e.target.value,
                                })
                            }
                        />

                        {/* Due Date */}
                        <input
                            type="date"
                            className="w-full border p-2 mb-2 rounded"
                            value={newAssignment.dueDate}
                            onChange={(e) =>
                                setNewAssignment({
                                    ...newAssignment,
                                    dueDate: e.target.value,
                                })
                            }
                        />

                        {/* File Upload */}
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full border p-2 mb-4 rounded"
                            onChange={(e) =>
                                setNewAssignment({
                                    ...newAssignment,
                                    image: e.target.files[0], // store file object
                                })
                            }
                        />

                        {/* Image Preview Modal */}
                        {selectedImage && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                                onClick={() => setSelectedImage(null)}
                            >
                                <img
                                    src={selectedImage}
                                    alt="Assignment"
                                    className="max-w-3xl max-h-[80vh] rounded-lg shadow-lg"
                                />
                            </div>
                        )}


                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-indigo-600 text-white rounded"
                                onClick={addAssignment}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

/* SidebarItem */
function SidebarItem({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-6 py-3 text-left transition-all
                ${active
                    ? "bg-indigo-600 text-white font-semibold shadow-md"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
        >
            {icon} {label}
        </button>
    );
}

/* Dashboard Card */
function DashboardCard({ title, count, color, icon }) {
    return (
        <div
            className={`${color} text-white p-6 rounded-xl shadow-xl flex items-center justify-between transform hover:scale-105 transition`}
        >
            <div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-3xl font-bold">{count}</p>
            </div>
            <div className="text-4xl opacity-80">{icon}</div>
        </div>
    );
}
