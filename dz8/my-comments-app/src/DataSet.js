import React, { useState } from 'react';
import './DataSet.css';

const DataSet = ({
  headers = [],
  data = [],
  selectedRows = [],
  renderHeader = (header) => header.label || header.key,
  renderCell = (value) => value,
  onRowEdit = () => {},
  onRowSelection = () => {}
}) => {
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});

  const computedHeaders = headers.length > 0
    ? headers
    : data.length > 0
      ? Object.keys(data[0]).map((key) => ({ key, label: key }))
      : [];

  const handleEditStart = (rowIndex, rowData) => {
    setEditingRow(rowIndex);
    setEditData({ ...rowData });
  };

  const handleEditChange = (key, value) => {
    setEditData(prev => ({ ...prev, [key]: value }));
  };

  const handleEditSave = () => {
    onRowEdit(editData);
    setEditingRow(null);
  };

  const handleEditCancel = () => {
    setEditingRow(null);
  };

  return (
    <table className="dataset-table">
      <thead>
        <tr>
          <th className="selection-column"></th>
          {computedHeaders.map((header, index) => (
            <th key={index}>{renderHeader(header)}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={row.id || rowIndex}
            className={selectedRows.includes(rowIndex) ? 'selected' : ''}
          >
            <td
              className="selection-column"
              onClick={(event) => onRowSelection(rowIndex, event)}
            >
              {selectedRows.includes(rowIndex) && '✓'}
            </td>
            {computedHeaders.map((header, colIndex) => (
              <td key={colIndex}>
                {editingRow === rowIndex ? (
                  <input
                    type="text"
                    value={editData[header.key] || ''}
                    onChange={(e) => handleEditChange(header.key, e.target.value)}
                  />
                ) : (
                  renderCell(row[header.key], row, header.key)
                )}
              </td>
            ))}
            <td className="actions-cell">
              {editingRow === rowIndex ? (
                <>
                  <button className="save-btn" onClick={handleEditSave}>Save</button>
                  <button className="cancel-btn" onClick={handleEditCancel}>Cancel</button>
                </>
              ) : (
                <button className="edit-btn" onClick={() => handleEditStart(rowIndex, row)}>Edit</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataSet;