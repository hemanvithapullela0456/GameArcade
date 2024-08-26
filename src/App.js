// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // Import the Home component
import SudokuGrid from './SudokuGrid';
import SimonSays from './SimonSays';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sudoku" element={<SudokuGrid />} />
        <Route path="/simon" element={<SimonSays />} />
      </Routes>
    </Router>
  );
}

export default App;
