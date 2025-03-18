import React, { useState } from "react";
//import './SearchAndSort.css'

const SearchAndSort = ({ books, onFilterChange }) => {
  const [SearchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("title"); 
  const [sortOrder, setSortOrder] = useState("asc"); 

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchInput(query);
    filterAndSortBooks(query, sortBy, sortOrder);
  };

  const handleSortByChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    filterAndSortBooks(SearchInput, newSortBy, sortOrder);
  };

  const handleSortOrderChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    filterAndSortBooks(SearchInput, sortBy, newSortOrder);
  };

  const filterAndSortBooks = (query, sortBy, sortOrder) => {
    let filteredBooks = [...books];

    if (query) {
      filteredBooks = filteredBooks.filter((book) => {
        const titleMatch = book.title?.toLowerCase().includes(query);
        const authorsMatch = book.authors?.some((author) =>
          author.toLowerCase().includes(query)
        );
        return titleMatch || authorsMatch;
      });
    }

    filteredBooks.sort((a, b) => {
      let valueA, valueB;
      if (sortBy === "title") {
        valueA = a.title?.toLowerCase() || "";
        valueB = b.title?.toLowerCase() || "";
      } else {
        valueA = a.authors?.[0]?.toLowerCase() || "";
        valueB = b.authors?.[0]?.toLowerCase() || "";
      }

      if (sortOrder === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });

    onFilterChange(filteredBooks);
  };

  return (
  <div className="book-filter fixed-filter">
    <h1>Book List</h1>
  <input
    type="text"
    placeholder="Поиск по названию или автору книги"
    value={SearchInput}
    onChange={handleSearchChange}
    className="search-input"
  />
  <div className="sort-controls">
    <label>
      <span>Сортировка: </span>
      <select value={sortBy} onChange={handleSortByChange} className="styled-select">
        <option value="title" className="AA">по названию</option>
        <option value="author" className="AA">по автору</option>
      </select>
    </label>
    <label>
      <select value={sortOrder} onChange={handleSortOrderChange} className="styled-select">
        <option value="asc" className="AA">по возрастанию</option>
        <option value="desc" className="AA">по убыванию</option>
      </select>
    </label>
  </div>
</div>
  );
};

export default SearchAndSort;