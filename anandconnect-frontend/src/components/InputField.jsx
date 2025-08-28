export default function InputField({ label, type, value, onChange, name }) {
    return (
        <div className="mb-4">
            <label className="block mb-1 text-gray-700">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
        </div>
    );
}
