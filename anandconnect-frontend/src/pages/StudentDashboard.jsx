import { useState, useEffect } from "react";
import { LayoutDashboard, BookOpen, Calendar, LogOut } from "lucide-react";

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [assignments, setAssignments] = useState([]);
    const [timetable, setTimetable] = useState([]);

    useEffect(() => {
        fetchAssignments();
        fetchTimetable();
    }, []);

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://anandconnect.onrender.com/assignments", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setAssignments(data || []);
        } catch (err) {
            console.error("Error fetching assignments:", err);
        }
    };

    const fetchTimetable = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://anandconnect.onrender.com/timetable", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setTimetable(data || []);
        } catch (err) {
            console.error("Error fetching timetable:", err);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-primary to-secondary text-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-xl flex flex-col justify-between">
                <div>
                    <div className="p-6 text-center text-2xl font-bold text-primary border-b">
                        Student Panel
                    </div>
                    <nav className="mt-4">
                        <SidebarItem
                            icon={<LayoutDashboard />}
                            label="Dashboard"
                            active={activeTab === "dashboard"}
                            onClick={() => setActiveTab("dashboard")}
                        />
                        <SidebarItem
                            icon={<BookOpen />}
                            label="Assignments"
                            active={activeTab === "assignments"}
                            onClick={() => setActiveTab("assignments")}
                        />
                        <SidebarItem
                            icon={<Calendar />}
                            label="Timetable"
                            active={activeTab === "timetable"}
                            onClick={() => setActiveTab("timetable")}
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
                {/* Dashboard cards */}
                {activeTab === "dashboard" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DashboardCard
                            title="Assignments"
                            count={assignments.length}
                            color="bg-blue-500"
                            icon={<BookOpen />}
                        />
                        <DashboardCard
                            title="Classes This Week"
                            count={timetable.length}
                            color="bg-green-500"
                            icon={<Calendar />}
                        />
                    </div>
                )}

                {/* Assignments Table */}
                {activeTab === "assignments" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">My Assignments</h2>
                        <div className="bg-white shadow-lg rounded-xl p-4">
                            {assignments.length === 0 ? (
                                <p className="text-gray-500">No assignments available.</p>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="p-2">Title</th>
                                            <th className="p-2">Subject</th>
                                            <th className="p-2">Due Date</th>
                                            <th className="p-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignments.map((a, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                <td className="p-2">{a.title}</td>
                                                <td className="p-2">{a.subject}</td>
                                                <td className="p-2">{a.dueDate}</td>
                                                <td className="p-2">{a.status || "Pending"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* Timetable */}
                {activeTab === "timetable" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Weekly Timetable</h2>
                        <div className="bg-white shadow-lg rounded-xl p-4">
                            {timetable.length === 0 ? (
                                <p className="text-gray-500">No timetable available.</p>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="p-2">Day</th>
                                            <th className="p-2">Time</th>
                                            <th className="p-2">Subject</th>
                                            <th className="p-2">Faculty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timetable.map((t, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                <td className="p-2">{t.day}</td>
                                                <td className="p-2">{t.time}</td>
                                                <td className="p-2">{t.subject}</td>
                                                <td className="p-2">{t.faculty}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* SidebarItem */
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

/* DashboardCard */
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
