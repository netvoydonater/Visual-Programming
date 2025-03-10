// src/App.js
import React, { useEffect, useState } from 'react';
import BookCard from './components/BookCard';

const App = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://fakeapi.extendsclass.com/books.JSON');
        const data = await response.json();
        const booksWithImages = await Promise.all(data.map(async (book) => {
          const image = await fetchBookCover(book.isbn);
          return { ...book, image };
        }));
        setBooks(booksWithImages);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const fetchBookCover = async (isbn) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await response.json();
      return data.items[0].volumeInfo.imageLinks?.thumbnail || null;
    } catch (error) {
      console.error('Error fetching book cover:', error);
      return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default App;