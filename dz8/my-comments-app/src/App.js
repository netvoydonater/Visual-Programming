import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './Navigations';
import PostsPage from './PostPage';
import AlbumsPage from './AlbumsPage';
import TodosPage from './Todos';
import UsersPage from './UsersPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <div className="content">
          <Routes>
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/todos" element={<TodosPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/" element={<PostsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;