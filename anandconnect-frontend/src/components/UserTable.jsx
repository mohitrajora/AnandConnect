import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

export default function UserTable({ users, role, refresh }) {
    const [loadingId, setLoadingId] = useState(null);

    const confirmRemove = (collegeId, onConfirm, onCancel) => {
        toast((t) => (
            <div className="flex items-center gap-3">
                <span>
                    Remove <b>{collegeId}</b>?
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            onConfirm();
                        }}
                        className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            onCancel?.();
                        }}
                        className="px-2 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
                    >
                        No
                    </button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    const handleRemove = async (enrollment, collegeId) => {
        setLoadingId(enrollment);

        confirmRemove(collegeId, async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Unauthorized! Please log in again.");
                    setLoadingId(null);
                    return;
                }

                // fallback: if enrollment is missing, use _id
                const endpoint = enrollment
                    ? `https://anandconnect.onrender.com/students/delete-student/${enrollment}`
                    : `https://anandconnect.onrender.com/students/delete-student/${collegeId}`;

                const res = await fetch(endpoint, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (res.ok) {
                    toast.success(`${role} removed successfully 🚀`);
                    refresh();
                } else {
                    const data = await res.json();
                    toast.error(data.message || "Failed to remove user ❌");
                }
            } catch (err) {
                toast.error("Server error. Please try again later ⚡");
            } finally {
                setLoadingId(null);
            }
        }, () => setLoadingId(null));
    };


    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-left border-collapse">
                <thead className="bg-indigo-600 text-white">
                    <tr>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">College ID</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Number</th>
                        <th className="py-3 px-4">Course</th>
                        <th className="py-3 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user._id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">{user.name}</td>
                                <td className="py-2 px-4">{user.enrollment}</td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4">{user.number}</td>
                                <td className="py-2 px-4">{user.course}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => handleRemove(user._id, user.collegeId)}
                                        disabled={loadingId === user._id}
                                        className="flex items-center gap-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {loadingId === user._id ? "..." : "Remove"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="6"
                                className="py-4 px-4 text-center text-gray-500"
                            >
                                No {role === "faculty" ? "faculty" : "students"} found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
