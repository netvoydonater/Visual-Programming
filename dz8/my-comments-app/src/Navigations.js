import React from 'react';
import { NavLink } from 'react-router-dom';
import './App.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink to="/posts" activeClassName="active">
            Posts
          </NavLink>
        </li>
        <li>
          <NavLink to="/albums" activeClassName="active">
            Albums
          </NavLink>
        </li>
        <li>
          <NavLink to="/todos" activeClassName="active">
            Todos
          </NavLink>
        </li>
        <li>
          <NavLink to="/users" activeClassName="active">
            Users
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;