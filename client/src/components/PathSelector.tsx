import { useState } from 'react';

interface PathSelectorProps {
    onPathSet: () => void;
}

export default function PathSelector({ onPathSet }: PathSelectorProps) {
    const [path, setPath] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/config/path', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error setting path');
            }

            onPathSet();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Bienvenido al Gestor de PDFs</h2>
                <p className="text-gray-600 mb-6">Por favor, ingresa la ruta completa de la carpeta donde están tus archivos PDF.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="path" className="block text-sm font-medium text-gray-700">Ruta de la Carpeta</label>
                        <input
                            type="text"
                            id="path"
                            value={path}
                            onChange={(e) => setPath(e.target.value)}
                            placeholder="C:\Documentos\MisPDFs"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Comenzar
                    </button>
                </form>
            </div>
        </div>
    );
}
