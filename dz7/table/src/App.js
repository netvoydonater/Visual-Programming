import React from 'react';
import DataSet from './DataSet';
import './App.css';

const App = () => {
  const data = [
    { name: 'Sasha', admissionDateUN: '23-05-2005' },
    { name: 'Ksusha', admissionDateUN: '08-07-2005' },
    { name: 'Igor', admissionDateUN: '01-08-2005' },
    { name: 'Maxim', admissionDateUN: '29-03-2006' },
    { name: 'Anton', admissionDateUN: '07-03-2005' },
  ];

  const headers = [
    { key: 'name', label: 'Name' },
    { key: 'admissionDateUN', label: 'Date' },
  ];

  const renderHeader = (header) => header.label;

  const renderCell = (value) => value;

  return (
    <div className="app">
      <h1> </h1>
      <DataSet
        headers={headers}
        data={data}
        renderHeader={renderHeader}
        renderCell={renderCell}
      />
    </div>
  );
};

export default App;