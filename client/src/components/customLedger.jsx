"use client"
import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Ledgertable = () => {
  const [columns, setColumns] = useState([
    { id: 'date', name: 'Date', type: 'date', editable: true },
    { id: 'description', name: 'Description', type: 'text', editable: true },
    { id: 'amount', name: 'Amount', type: 'number', editable: true }
  ]);

  const [rows, setRows] = useState([{ id: 1, date: '', description: '', amount: '' }]);
  const [newColumn, setNewColumn] = useState({ name: '', type: 'text' });

  const addRow = () => {
    const newRowId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows([...rows, { id: newRowId, ...columns.reduce((acc, col) => ({ ...acc, [col.id]: '' }), {}) }]);
  };

  const addColumn = () => {
    if (newColumn.name) {
      const newColumnObj = {
        id: newColumn.name.toLowerCase().replace(/\s+/g, '_'),
        name: newColumn.name,
        type: newColumn.type,
        editable: true
      };
      setColumns([...columns, newColumnObj]);
      setRows(rows.map(row => ({ ...row, [newColumnObj.id]: '' })));
      setNewColumn({ name: '', type: 'text' });
    }
  };

  const updateCell = (rowId, columnId, value) => {
    setRows(rows.map(row => (row.id === rowId ? { ...row, [columnId]: value } : row)));
  };

  const saveLedger = async () => {
    try {
      const response = await axios.post('/api/ledger', { columns, data: rows });
      if (response.data.success) {
        alert('Ledger saved successfully!');
      }
    } catch (error) {
      console.error('Error saving ledger:', error);
      alert('Failed to save ledger');
    }
  };

  const removeRow = (rowId) => {
    setRows(rows.filter(row => row.id !== rowId));
  };

  const removeColumn = (columnId) => {
    if (['date', 'description', 'amount'].includes(columnId)) {
      alert('Cannot remove default columns');
      return;
    }
    setColumns(columns.filter(col => col.id !== columnId));
    setRows(rows.map(row => {
      const { [columnId]: removedColumn, ...rest } = row;
      return rest;
    }));
  };

  return (
    <div className="ledger-container">
      <Typography variant="h4" gutterBottom>
        Customizable Ledger Table
      </Typography>
      <div className="column-creator">
        <TextField
          label="New Column Name"
          variant="outlined"
          value={newColumn.name}
          onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
        />
        <Select
          value={newColumn.type}
          onChange={(e) => setNewColumn({ ...newColumn, type: e.target.value })}
        >
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="number">Number</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </Select>
        <Button variant="contained" onClick={addColumn}>Add Column</Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id}>
                  {column.name}
                  {!['date', 'description', 'amount'].includes(column.id) && (
                    <IconButton onClick={() => removeColumn(column.id)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                {columns.map(column => (
                  <TableCell key={column.id}>
                    <TextField
                      type={column.type}
                      value={row[column.id] || ''}
                      onChange={(e) => updateCell(row.id, column.id, e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => removeRow(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="table-actions">
        <Button variant="contained" onClick={addRow}>Add Row</Button>
        <Button variant="contained" color="primary" onClick={saveLedger}>Save Ledger</Button>
      </div>
    </div>
  );
};

export default Ledgertable;