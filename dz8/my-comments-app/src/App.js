import React, { useState, useEffect } from 'react';
import DataSet from './DataSet';
import './App.css';

function App() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    body: '',
  });
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=20'); //менять количество выводимых строк в таблице можно в ".../comments?_limit=<кол-во строк>"
        if (!response.ok) throw new Error('Failed to fetch comments');
        const data = await response.json();
        setComments(data);  
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddComment = async () => {
    const tempId = Date.now();
    try {
      const optimisticComment = {
        ...newComment,
        id: tempId,
        postId: 1
      };
      
      setComments(prev => [...prev, optimisticComment]);
      setNewComment({ name: '', email: '', body: '' });

      const response = await fetch('https://jsonplaceholder.typicode.com/comments', {
        method: 'POST',
        body: JSON.stringify({
          ...newComment,
          postId: 1
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) throw new Error('Failed to add comment');
      
      const serverComment = await response.json();
      setComments(prev => prev.map(c => c.id === tempId ? serverComment : c));
    } catch (err) {
      setError(err.message);
      setComments(prev => prev.filter(c => c.id !== tempId));
    }
  };

  const handleDeleteComments = async () => {
    if (selectedRows.length === 0 || !window.confirm('Удалить выбранные комментарии?')) return;

    const idsToDelete = selectedRows.map(index => comments[index].id);
    const originalComments = [...comments];
    
    try {
      // Оптимистичное удаление
      setComments(prev => prev.filter((_, index) => !selectedRows.includes(index)));
      setSelectedRows([]);

      const deletePromises = idsToDelete.map(id => 
        fetch(`https://jsonplaceholder.typicode.com/comments/${id}`, {
          method: 'DELETE',
        })
      );

      await Promise.all(deletePromises);
    } catch (err) {
      setError(err.message);
      setComments(originalComments);
    }
  };

  const handleUpdateComment = async (updatedComment) => {
    const originalComments = [...comments];
    try {
      setComments(prev => 
        prev.map(comment => 
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments/${updatedComment.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(updatedComment),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to update comment');
    } catch (err) {
      setError(err.message);
      setComments(originalComments);
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
      setSelectedRows(prev =>
        prev.includes(rowIndex) ? [] : [rowIndex]
      );
    }
  };

  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'body', label: 'Comment' },
  ];

  if (loading) return <div className="loading">Loading comments...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app">
      <h1>Comments Management</h1>
      
      <div className="add-comment">
        <h2>Add New Comment</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={newComment.name}
            onChange={(e) => setNewComment({...newComment, name: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email"
            value={newComment.email}
            onChange={(e) => setNewComment({...newComment, email: e.target.value})}
          />
          <textarea
            placeholder="Comment text"
            value={newComment.body}
            onChange={(e) => setNewComment({...newComment, body: e.target.value})}
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
      </div>

      <div className="actions">
        <button 
          onClick={handleDeleteComments}
          disabled={selectedRows.length === 0}
          className="delete-btn"
        >
          Delete Selected ({selectedRows.length})
        </button>
      </div>

      <DataSet
        headers={headers}
        data={comments}
        selectedRows={selectedRows}
        onRowEdit={handleUpdateComment}
        onRowSelection={handleRowSelection}
      />

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App;