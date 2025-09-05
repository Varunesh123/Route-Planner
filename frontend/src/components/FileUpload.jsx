import React, { useRef } from 'react';

function FileUpload({ onImport }) {
  const fileInputRef = useRef();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/geo+json' || file.name.endsWith('.geojson')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const geojson = JSON.parse(e.target.result);
          onImport(geojson);
        } catch (error) {
          alert('Invalid GeoJSON file format');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid GeoJSON file');
    }
    
    // Reset file input
    event.target.value = '';
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept=".geojson,application/geo+json"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <button 
        onClick={triggerFileSelect}
        className="btn btn-secondary"
      >
        Import GeoJSON
      </button>
    </div>
  );
}

export default FileUpload;