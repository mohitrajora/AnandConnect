import { useState, useEffect } from "react";

export default function FacultyList() {
    const [faculties, setFaculties] = useState([]);

    useEffect(() => {
        fetch("https://anandconnect.onrender.com/faculty") 
            .then((res) => res.json())
            .then((data) => setFaculties(data))
            .catch((err) => console.error("Error fetching faculties:", err));
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Faculty List</h2>
            <table className="w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">Faculty ID</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Department</th>
                    </tr>
                </thead>
                <tbody>
                    {faculties.map((faculty) => (
                        <tr key={faculty._id} className="border-t">
                            <td className="p-2">{faculty.facultyId}</td>
                            <td className="p-2">{faculty.name}</td>
                            <td className="p-2">{faculty.department}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
