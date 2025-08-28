// components/UserTable.jsx
export default function UserTable({ users, role, refresh }) {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-left border-collapse">
                <thead className="bg-indigo-600 text-white">
                    <tr>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">College ID</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Course</th>
                        <th className="py-3 px-4">Year</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.length > 0 ? (
                        users.map((student) => (
                            <tr key={student._id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">{student.name}</td>
                                <td className="py-2 px-4">{student.collegeId}</td>
                                <td className="py-2 px-4">{student.email}</td>
                                <td className="py-2 px-4">{student.course}</td>
                                <td className="py-2 px-4">{student.year}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                                No students found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
