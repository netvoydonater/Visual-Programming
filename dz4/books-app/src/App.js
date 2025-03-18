import React, { useState, useEffect } from "react";
import BookCard from './BookCard';
import SearchAndSort  from "./SearchAndSort";
//import "./App.css"
function App() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]); 
  
  const getApiData = async () => {
    const response = await fetch("https://fakeapi.extendsclass.com/books").then((response) => response.json());

    const booksWithImage = await Promise.all(
      response.map(async (book) => {
        const IMGResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`);
        const Image = await IMGResponse.json();
        const thumbnail = Image.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
        return { ...book, img: thumbnail || null };
      })
    );

    setBooks(booksWithImage);
    setFilteredBooks(booksWithImage);
  };

  useEffect(() => {
    getApiData();
  }, []);

  const handleFilterChange = (filteredBooks) => {
    setFilteredBooks(filteredBooks);
  };
  const click =()=>{
    setFilteredBooks(books);
  }
  if (filteredBooks.length === 0 && books.length > 0) {
    return (
      <div className="butt">
        <button onClick={click}>Назад</button>
        <p>Книги не найдены...</p>
      </div>
    );
  };
  return (
    <div className="app">
      <SearchAndSort books={books} onFilterChange={handleFilterChange} />
      <div className="book-list">
        {filteredBooks.length === 0
          ? books.map((book) => <BookCard key={book} book={book} />)
          : filteredBooks.map((book) => <BookCard key={book} book={book} />)
        }
      </div>
    </div>
  );
}

export default App;