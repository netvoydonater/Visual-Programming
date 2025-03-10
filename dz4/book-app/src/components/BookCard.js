// src/components/BookCard.js
import React from 'react';

const BookCard = ({ book }) => {
  const { title, authors, image } = book;

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', width: '200px' }}>
      {image && <img src={image} alt={title} style={{ width: '100%' }} />}
      <h3>{title}</h3>
      <p>{authors.join(', ')}</p>
    </div>
  );
};

export default BookCard;