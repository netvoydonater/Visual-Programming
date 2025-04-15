import React, { useState, useEffect } from 'react';
import DataSet from './DataSet';
import AddForm from './AddForm';

const UsersPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=20');
        if (!response.ok) throw new Error('Failed to fetch users');
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

  const handleAddUser = async (newUser) => {
    const tempId = Date.now();
    try {
      const optimisticUser = { 
        ...newUser, 
        id: tempId, 
        address: { city: '' }, 
        company: { name: '' } 
      };
      setData(prev => [...prev, optimisticUser]);
      
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      
      if (!response.ok) throw new Error('Failed to add user');
      const serverUser = await response.json();
      setData(prev => prev.map(u => u.id === tempId ? serverUser : u));
    } catch (err) {
      setError(err.message);
      setData(prev => prev.filter(u => u.id !== tempId));
    }
  };

  const handleDeleteUsers = async () => {
    if (selectedRows.length === 0 || !window.confirm('Delete selected users?')) return;
    const idsToDelete = selectedRows.map(index => data[index].id);
    const originalData = [...data];
    
    try {
      setData(prev => prev.filter((_, index) => !selectedRows.includes(index)));
      setSelectedRows([]);
      
      const deletePromises = idsToDelete.map(id =>
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { method: 'DELETE' })
      );
      await Promise.all(deletePromises);
    } catch (err) {
      setError(err.message);
      setData(originalData);
    }
  };

  const handleUpdateUser = async (updatedUser) => {
    const originalData = [...data];
    try {
      setData(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
      
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${updatedUser.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(updatedUser),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }
      );
      if (!response.ok) throw new Error('Failed to update user');
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
    { key: 'name', label: 'Name' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'address.city', label: 'City', renderCell: (_, row) => row.address?.city },
    { key: 'company.name', label: 'Company', renderCell: (_, row) => row.company?.name },
  ];

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="page">
      <h1>Users Management</h1>
      
      <AddForm 
        onSubmit={handleAddUser} 
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'username', label: 'Username', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'address.city', label: 'City', type: 'text' },
          { name: 'company.name', label: 'Company', type: 'text' }
        ]}
      />
      
      <div className="actions">
        <button
          onClick={handleDeleteUsers}
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
        onRowEdit={handleUpdateUser}
        onRowSelection={handleRowSelection}
      />
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default UsersPage;