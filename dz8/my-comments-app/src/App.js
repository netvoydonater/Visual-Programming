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
  const [selectedRows, setSelectedRows] = useState([]); // Добавлено состояние для выбранных строк

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/comments');
        if (!response.ok) throw new Error('Failed to fetch');
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
    const tempId = Date.now(); // Перемещено внутрь функции
    try {
      // Оптимистичное обновление
      const optimisticComment = { ...newComment, id: tempId };
      setComments(prev => [...prev, optimisticComment]);
      setNewComment({ name: '', email: '', body: '' });

      // Отправка на сервер
      const response = await fetch('https://jsonplaceholder.typicode.com/comments', {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const serverComment = await response.json();
      // Заменяем временный ID на серверный
      setComments(prev => prev.map(c => c.id === tempId ? serverComment : c));
    } catch (err) {
      setError(err.message);
      // Откатываем изменения при ошибке
      setComments(prev => prev.filter(c => c.id !== tempId));
    }
  };

  const handleDeleteComments = async () => { // Упростим функцию
    const selectedIds = comments
      .filter((_, index) => selectedRows.includes(index))
      .map(comment => comment.id);
      
    if (selectedIds.length === 0) return;

    try {
      // Оптимистичное удаление
      setComments(prev => prev.filter(comment => !selectedIds.includes(comment.id)));

      // Отправка на сервер
      const responses = await Promise.all(
        selectedIds.map(id => 
          fetch(`https://jsonplaceholder.typicode.com/comments/${id}`, {
            method: 'DELETE',
          })
        )
      );

      if (responses.some(r => !r.ok)) throw new Error('Failed to delete some comments');
    } catch (err) {
      setError(err.message);
      // Восстанавливаем данные при ошибке
      const response = await fetch('https://jsonplaceholder.typicode.com/comments');
      const data = await response.json();
      setComments(data);
    }
  };

  const handleUpdateComment = async (updatedComment) => {
    try {
      // Оптимистичное обновление
      setComments(prev => 
        prev.map(comment => 
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );

      // Отправка на сервер
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
      // Восстанавливаем данные при ошибке
      const response = await fetch('https://jsonplaceholder.typicode.com/comments');
      const data = await response.json();
      setComments(data);
    }
  };

  const handleRowSelection = (rowIndex, event) => {
    const isCtrlPressed = event.ctrlKey || event.metaKey;

    if (isCtrlPressed) {
      setSelectedRows((prev) =>
        prev.includes(rowIndex)
          ? prev.filter((index) => index !== rowIndex)
          : [...prev, rowIndex]
      );
    } else {
      setSelectedRows((prev) =>
        prev.includes(rowIndex) ? [] : [rowIndex]
      );
    }
  };

  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'body', label: 'Body' },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app">
      <h1>Comments Table</h1>
      
      <div className="add-comment">
        <h2>Add New Comment</h2>
        <div>
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
            placeholder="Body"
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
        >
          Delete Selected
        </button>
      </div>

      <DataSet
        headers={headers}
        data={comments}
        onRowEdit={handleUpdateComment}
        onRowSelection={handleRowSelection} // Передаем обработчик выбора строк
      />

      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;