import React, { useState, useEffect, useRef } from 'react';
import './SudokuGrid.css';
import { useNavigate } from 'react-router-dom';

const SudokuGrid = () => {
  const [grid, setGrid] = useState(Array(9).fill().map(() => Array(9).fill('')));
  const [isSolved, setIsSolved] = useState(false);
  const [history, setHistory] = useState([]); 
  const [redoHistory, setRedoHistory] = useState([]);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null); 
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    if (!isSolved) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isSolved]);

  const handleChange = (row, col, value) => {
    if (isSolved) return;
    if (!/^[1-9]$/.test(value) && value !== '') return; // Input validation
    const newGrid = grid.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? value : c))
    );
    setHistory([...history, grid]); // Save the current grid to history before changing
    setRedoHistory([]); // Clear redo history after a new change
    setGrid(newGrid);
  };

  const solveSudoku = () => {
    const newGrid = grid.map(row => row.map(cell => (cell === '' ? 0 : parseInt(cell, 10))));
    if (backtrackSolve(newGrid)) {
      setGrid(newGrid.map(row => row.map(cell => (cell === 0 ? '' : cell))));
      setIsSolved(true);
    } else {
      alert("No solution exists for the given Sudoku puzzle.");
    }
  };

  const clearGrid = () => {
    setGrid(Array(9).fill().map(() => Array(9).fill('')));
    setIsSolved(false);
    setHistory([]);
    setRedoHistory([]);
    setTimer(0);
  };

  const undo = () => {
    if (history.length > 0) {
      const previousGrid = history.pop();
      setRedoHistory([...redoHistory, grid]); // Save the current grid to redo history
      setGrid(previousGrid);
    }
  };

  const redo = () => {
    if (redoHistory.length > 0) {
      const nextGrid = redoHistory.pop();
      setHistory([...history, grid]); // Save the current grid to history
      setGrid(nextGrid);
    }
  };

  const backtrackSolve = (grid) => {
    const findEmptyCell = () => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (grid[i][j] === 0) {
            return [i, j];
          }
        }
      }
      return null;
    };

    const isValid = (grid, row, col, num) => {
      for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num || grid[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
          return false;
        }
      }
      return true;
    };

    const emptyCell = findEmptyCell();
    if (!emptyCell) return true;
    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
      if (isValid(grid, row, col, num)) {
        grid[row][col] = num;
        if (backtrackSolve(grid)) {
          return true;
        }
        grid[row][col] = 0;
      }
    }

    return false;
  };

  const handleKeyDown = (e, row, col) => {
    const moveFocus = (newRow, newCol) => {
      const nextInput = document.querySelector(
        `input[data-row="${newRow}"][data-col="${newCol}"]`
      );
      if (nextInput) nextInput.focus();
    };

    switch (e.key) {
      case 'ArrowUp':
        moveFocus(row > 0 ? row - 1 : 8, col);
        break;
      case 'ArrowDown':
        moveFocus(row < 8 ? row + 1 : 0, col);
        break;
      case 'ArrowLeft':
        moveFocus(row, col > 0 ? col - 1 : 8);
        break;
      case 'ArrowRight':
        moveFocus(row, col < 8 ? col + 1 : 0);
        break;
      default:
        break;
    }
  };

  const isConflict = (row, col, value) => {
    const checkRow = grid[row].some((cell, idx) => cell === value && idx !== col);
    const checkCol = grid.some((r, idx) => r[col] === value && idx !== row);
    const subgridRowStart = Math.floor(row / 3) * 3;
    const subgridColStart = Math.floor(col / 3) * 3;
    let checkSubgrid = false;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[subgridRowStart + i][subgridColStart + j] === value &&
            (subgridRowStart + i !== row || subgridColStart + j !== col)) {
          checkSubgrid = true;
        }
      }
    }
    return checkRow || checkCol || checkSubgrid;
  };

  return (
    <div className="sudoku-container">
      <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>
      <h1 className="heading">Sudoku Solver</h1>
      <div className="timer">Time: {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}</div>
      <div className="sudoku-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((value, colIndex) => (
              <input
                key={colIndex}
                type="text"
                value={value}
                maxLength="1"
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                data-row={rowIndex}
                data-col={colIndex}
                className={`cell ${value !== '' ? 'has-value' : ''} ${isConflict(rowIndex, colIndex, value) ? 'conflict' : ''}`}
                disabled={isSolved && value !== ''}
                placeholder=" "
              />
            ))}
          </div>
        ))}
      </div>
      <div className="buttons">
        <button onClick={solveSudoku}>Solve</button>
        <button onClick={clearGrid}>Clear</button>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>
    </div>
  );
};

export default SudokuGrid;
