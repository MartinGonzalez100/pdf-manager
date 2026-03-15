import { useState, useEffect, useMemo } from 'react';

interface PdfFile {
    name: string;
    path: string;
    size: number;
    date: string;
}

interface FileListProps {
    refreshTrigger: number;
}

type ViewMode = 'grid' | 'column';
type SortField = 'name' | 'date';
type SortOrder = 'asc' | 'desc';

export default function FileList({ refreshTrigger }: FileListProps) {
    const [files, setFiles] = useState<PdfFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:3001/api/files')
            .then(res => {
                if (!res.ok) throw new Error('Error al obtener archivos');
                return res.json();
            })
            .then(data => {
                setFiles(data.files);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('No se pudieron cargar los archivos. Asegúrate de haber configurado una ruta válida.');
                setLoading(false);
            });
    }, [refreshTrigger]);

    const sortedFiles = useMemo(() => {
        return [...files].sort((a, b) => {
            let comparison = 0;
            if (sortField === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortField === 'date') {
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [files, sortField, sortOrder]);

    const handleOpenFile = async (filename: string) => {
        try {
            const res = await fetch('http://localhost:3001/api/open', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename }),
            });
            if (!res.ok) throw new Error('Error al abrir el archivo');
        } catch (err) {
            alert('Error al intentar abrir el archivo');
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
    };

    if (loading) return <div className="text-center p-8 text-gray-500">Cargando archivos...</div>;

    if (files.length === 0 && !loading && !error) {
        return (
            <div className="text-center p-8 text-gray-500">
                <p>No se encontraron archivos PDF en la carpeta seleccionada.</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Controles de vista y ordenamiento */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-4 py-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Cuadrícula
                    </button>
                    <button
                        onClick={() => setViewMode('column')}
                        className={`px-4 py-2 rounded-md ${viewMode === 'column' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Columna
                    </button>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Ordenar por:</span>
                        <select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value as SortField)}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
                        >
                            <option value="name">Nombre</option>
                            <option value="date">Fecha</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                        title={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
                    >
                        {sortOrder === 'asc' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h10M3 12h10M3 16h10M17 4v16m0 0l-4-4m4 4l4-4" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h10M3 12h10M3 16h10M17 20V4m0 0l-4 4m4-4l4 4" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Listado de archivos */}
            <div className={viewMode === 'grid' ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col space-y-2"}>
                {sortedFiles.map((file) => (
                    <div
                        key={file.name}
                        onClick={() => handleOpenFile(file.name)}
                        className={`bg-white overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-100 ${viewMode === 'grid' ? 'rounded-lg' : 'rounded-md'}`}
                    >
                        <div className={viewMode === 'grid' ? "px-4 py-5 sm:p-6" : "px-4 py-3"}>
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 bg-indigo-100 rounded-md ${viewMode === 'grid' ? 'p-3' : 'p-2'}`}>
                                    <svg className={`${viewMode === 'grid' ? 'h-6 w-6' : 'h-5 w-5'} text-indigo-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4 flex-1 flex flex-col md:flex-row md:items-center md:justify-between">
                                    <h3 className={`text-gray-900 truncate font-medium ${viewMode === 'grid' ? 'text-lg' : 'text-base'}`} title={file.name}>
                                        {file.name}
                                    </h3>
                                    <div className={`flex justify-between mt-1 md:mt-0 md:space-x-4 ${viewMode === 'grid' ? '' : 'text-xs'}`}>
                                        <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                                        <p className="text-xs text-gray-400 self-center">{formatDate(file.date)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
