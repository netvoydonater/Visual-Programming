import React from 'react';
//import './BookCard.css'

function BookCard({ book }) {
  return (
    <div className="item-container">
      {book.img ? (
        <img src={book.img} alt="Обложка книги" style={{ width: "300px", height: "auto" }} />
      ) : (
        <img src="/image.png" alt="Заглушка" style={{ width: "300px", height: "auto" }} />
      )}
      <div className="title">{book.title}</div>
      <div className="autor">{book.authors}</div>
    </div>
  );
}

export default BookCard;