import { useState, useEffect } from 'react';

interface HeaderProps {
    refreshTrigger: number;
    onChangePath: () => void;
}

export default function Header({ refreshTrigger, onChangePath }: HeaderProps) {
    const [currentPath, setCurrentPath] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/api/config/path')
            .then(res => res.json())
            .then(data => setCurrentPath(data.path || 'No configurado'));
    }, [refreshTrigger]);

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-gray-900">Bibliotecas PDF</h1>
                        <div className="hidden sm:block h-6 w-px bg-gray-200"></div>
                        <div className="text-sm text-gray-500 truncate max-w-xs md:max-w-md">
                            <span className="font-semibold">Ruta:</span> {currentPath}
                        </div>
                    </div>
                    <button
                        onClick={onChangePath}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        Cambiar Carpeta
                    </button>
                </div>
            </div>
        </header>
    );
}
