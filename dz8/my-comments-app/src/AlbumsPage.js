import React, { useState, useEffect } from 'react';
import DataSet from './DataSet';
import AddForm from './AddForm';

const AlbumsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/albums?_limit=20');
        if (!response.ok) throw new Error('Failed to fetch albums');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddAlbum = async (newAlbum) => {
    const tempId = Date.now();
    try {
      const optimisticAlbum = { ...newAlbum, id: tempId, userId: 1 };
      setData(prev => [...prev, optimisticAlbum]);
      
      const response = await fetch('https://jsonplaceholder.typicode.com/albums', {
        method: 'POST',
        body: JSON.stringify({ ...newAlbum, userId: 1 }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      
      if (!response.ok) throw new Error('Failed to add album');
      const serverAlbum = await response.json();
      setData(prev => prev.map(a => a.id === tempId ? serverAlbum : a));
    } catch (err) {
      setError(err.message);
      setData(prev => prev.filter(a => a.id !== tempId));
    }
  };

  const handleDeleteAlbums = async () => {
    if (selectedRows.length === 0 || !window.confirm('Delete selected albums?')) return;
    const idsToDelete = selectedRows.map(index => data[index].id);
    const originalData = [...data];
    
    try {
      setData(prev => prev.filter((_, index) => !selectedRows.includes(index)));
      setSelectedRows([]);
      
      const deletePromises = idsToDelete.map(id =>
        fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, { method: 'DELETE' })
      );
      await Promise.all(deletePromises);
    } catch (err) {
      setError(err.message);
      setData(originalData);
    }
  };

  const handleUpdateAlbum = async (updatedAlbum) => {
    const originalData = [...data];
    try {
      setData(prev => prev.map(album => album.id === updatedAlbum.id ? updatedAlbum : album));
      
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/albums/${updatedAlbum.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(updatedAlbum),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }
      );
      if (!response.ok) throw new Error('Failed to update album');
    } catch (err) {
      setError(err.message);
      setData(originalData);
    }
  };

  const handleRowSelection = (rowIndex, event) => {
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    if (isCtrlPressed) {
      setSelectedRows(prev =>
        prev.includes(rowIndex)
          ? prev.filter(index => index !== rowIndex)
          : [...prev, rowIndex]
      );
    } else {
      setSelectedRows(prev => (prev.includes(rowIndex) ? [] : [rowIndex]));
    }
  };

  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'userId', label: 'User ID' },
  ];

  if (loading) return <div className="loading">Loading albums...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="page">
      <h1>Albums Management</h1>
      
      <AddForm 
        onSubmit={handleAddAlbum} 
        fields={[
          { name: 'title', label: 'Title', type: 'text', required: true }
        ]}
      />
      
      <div className="actions">
        <button
          onClick={handleDeleteAlbums}
          disabled={selectedRows.length === 0}
          className="delete-btn"
        >
          Delete Selected ({selectedRows.length})
        </button>
      </div>
      
      <DataSet
        headers={headers}
        data={data}
        selectedRows={selectedRows}
        onRowEdit={handleUpdateAlbum}
        onRowSelection={handleRowSelection}
      />
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AlbumsPage;