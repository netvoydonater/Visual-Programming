import React, { useState, useEffect } from 'react';
import DataSet from './DataSet';
import AddForm from './AddForm';

const PostsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => { 
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20');
        if (!response.ok) throw new Error('Failed to fetch posts');
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

  const handleAddPost = async (newPost) => {
    const tempId = Date.now();
    try {
      const optimisticPost = { ...newPost, id: tempId, userId: 1 };
      setData(prev => [...prev, optimisticPost]);
      
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({ ...newPost, userId: 1 }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      
      if (!response.ok) throw new Error('Failed to add post');
      const serverPost = await response.json();
      setData(prev => prev.map(p => p.id === tempId ? serverPost : p));
    } catch (err) {
      setError(err.message);
      setData(prev => prev.filter(p => p.id !== tempId));
    }
  };

  const handleDeletePosts = async () => {
    if (selectedRows.length === 0 || !window.confirm('Delete selected posts?')) return;
    const idsToDelete = selectedRows.map(index => data[index].id);
    const originalData = [...data];
    
    try {
      setData(prev => prev.filter((_, index) => !selectedRows.includes(index)));
      setSelectedRows([]);
      
      const deletePromises = idsToDelete.map(id =>
        fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: 'DELETE' })
      );
      await Promise.all(deletePromises);
    } catch (err) {
      setError(err.message);
      setData(originalData);
    }
  };

  const handleUpdatePost = async (updatedPost) => {
    const originalData = [...data];
    try {
      setData(prev => prev.map(post => post.id === updatedPost.id ? updatedPost : post));
      
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(updatedPost),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }
      );
      if (!response.ok) throw new Error('Failed to update post');
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
    { key: 'body', label: 'Body' },
    { key: 'userId', label: 'User ID' },
  ];

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="page">
      <h1>Posts Management</h1>
      
      <AddForm 
        onSubmit={handleAddPost} 
        fields={[
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'body', label: 'Body', type: 'textarea', required: true }
        ]}
      />
      
      <div className="actions">
        <button
          onClick={handleDeletePosts}
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
        onRowEdit={handleUpdatePost}
        onRowSelection={handleRowSelection}
      />
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PostsPage;