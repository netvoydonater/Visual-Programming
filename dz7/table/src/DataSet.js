import React, { useState } from 'react';
import './DataSet.css';

const DataSet = ({
  headers = [],
  data = [],
  renderHeader = (header) => header.label || header.key,
  renderCell = (value) => value,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const computedHeaders = headers.length > 0
    ? headers
    : data.length > 0
      ? Object.keys(data[0]).map((key) => ({ key, label: key }))
      : [];

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

  return (
    <table className="dataset-table">
      <thead>
        <tr>
          <th className="selection-column"></th>
          {computedHeaders.map((header, index) => (
            <th key={index}>{renderHeader(header)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={selectedRows.includes(rowIndex) ? 'selected' : ''}
          >
            <td
              className="selection-column"
              onClick={(event) => handleRowSelection(rowIndex, event)}
            >
            </td>
            {computedHeaders.map((header, colIndex) => (
              <td key={colIndex}>
                {renderCell(row[header.key], row, header.key)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataSet;