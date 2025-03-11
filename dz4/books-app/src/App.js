import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [books, setBooks] = useState([]);

  const getApiData = async () => {
    const response = await fetch("https://fakeapi.extendsclass.com/books").then((response) => response.json());

    const booksWithImage = await Promise.all(
      response.map(async (book) => {
        // Запрос к Google Books API по ISBN
        const IMGResponse = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`
        );
        const Image = await IMGResponse.json();

        // Если обложка найдена, добавляем её в данные книги
        const thumbnail = Image.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
        return { ...book, img: thumbnail || null }; // Добавляем поле cover
      })
    );

    setBooks(booksWithImage); // Обновляем состояние с книгами и обложками
  };


  // Вызываем getApiData при монтировании компонента
  useEffect(() => {
    getApiData();
  }, []);

  return (
    <div className="app">
      {books.map((book) => (
        <div class="item-container">
          {book.img ? (
            <img src={book.img} alt="Обложка книги" style={{ width: "300px", height: "auto" }} />
          ) : (
            <img
            src="/image.png" 
            alt="Заглушка"
            style={{ width: "300px", height: "auto" }}          />
          )}
          <div class="title">{book.title}</div>
          <div class="autor">{book.authors}</div>
        </div>
      ))}
    </div>
  );
}

export default App;