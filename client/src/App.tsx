import { useState, useEffect } from 'react';
import Header from './components/Header';
import PathSelector from './components/PathSelector';
import FileList from './components/FileList';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isPathSelectorOpen, setIsPathSelectorOpen] = useState(false);

  // Verificar si ya hay una ruta configurada al inicio
  useEffect(() => {
    fetch('http://localhost:3001/api/config/path')
      .then(res => res.json())
      .then(data => {
        if (!data.path) {
          setIsPathSelectorOpen(true);
        }
      });
  }, []);

  const handlePathSet = () => {
    // Al configurar una nueva ruta, forzamos la recarga de la lista y el header
    setRefreshTrigger(prev => prev + 1);
    setIsPathSelectorOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        refreshTrigger={refreshTrigger} 
        onChangePath={() => setIsPathSelectorOpen(true)} 
      />
      <main>
        <FileList refreshTrigger={refreshTrigger} />
        
        {isPathSelectorOpen && (
          <PathSelector onPathSet={handlePathSet} />
        )}
      </main>
    </div>
  );
}

export default App;
