import React, { useState, useEffect } from 'react';
import DataSet from './DataSet';
import AddForm from './AddForm';

const TodosPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=20');
        if (!response.ok) throw new Error('Failed to fetch todos');
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

  const handleAddTodo = async (newTodo) => {
    const tempId = Date.now();
    try {
      const optimisticTodo = { ...newTodo, id: tempId, userId: 1, completed: false };
      setData(prev => [...prev, optimisticTodo]);
      
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({ ...newTodo, userId: 1, completed: false }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      
      if (!response.ok) throw new Error('Failed to add todo');
      const serverTodo = await response.json();
      setData(prev => prev.map(t => t.id === tempId ? serverTodo : t));
    } catch (err) {
      setError(err.message);
      setData(prev => prev.filter(t => t.id !== tempId));
    }
  };

  const handleDeleteTodos = async () => {
    if (selectedRows.length === 0 || !window.confirm('Delete selected todos?')) return;
    const idsToDelete = selectedRows.map(index => data[index].id);
    const originalData = [...data];
    
    try {
      setData(prev => prev.filter((_, index) => !selectedRows.includes(index)));
      setSelectedRows([]);
      
      const deletePromises = idsToDelete.map(id =>
        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, { method: 'DELETE' })
      );
      await Promise.all(deletePromises);
    } catch (err) {
      setError(err.message);
      setData(originalData);
    }
  };

  const handleUpdateTodo = async (updatedTodo) => {
    const originalData = [...data];
    try {
      setData(prev => prev.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
      
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(updatedTodo),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }
      );
      if (!response.ok) throw new Error('Failed to update todo');
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
    { key: 'completed', label: 'Completed', renderCell: (value) => value ? 'Yes' : 'No' },
    { key: 'userId', label: 'User ID' },
  ];

  if (loading) return <div className="loading">Loading todos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="page">
      <h1>Todos Management</h1>
      
      <AddForm 
        onSubmit={handleAddTodo} 
        fields={[
          { name: 'title', label: 'Title', type: 'text', required: true }
        ]}
      />
      
      <div className="actions">
        <button
          onClick={handleDeleteTodos}
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
        onRowEdit={handleUpdateTodo}
        onRowSelection={handleRowSelection}
      />
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default TodosPage;