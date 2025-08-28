export default function AdminSidebar() {
    return (
        <div className="w-64 h-screen bg-primary text-white p-4">
            <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
            <ul className="space-y-2">
                <li><a href="/admin" className="hover:underline">Dashboard</a></li>
                <li><a href="/admin/students" className="hover:underline">Manage Students</a></li>
                <li><a href="/admin/faculties" className="hover:underline">Manage Faculties</a></li>
            </ul>
        </div>
    );
}
