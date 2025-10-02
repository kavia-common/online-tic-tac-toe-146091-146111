import React, { useState, useMemo } from 'react';
import './App.css';

// Square/Cell component
// PUBLIC_INTERFACE
export function Square({ value, onClick, highlight }) {
  /** A single Tic Tac Toe square (cell) with interactive styles. */
  return (
    <button
      className={`ttt-square ${highlight ? 'ttt-square--highlight' : ''}`}
      onClick={onClick}
      aria-label={`Square ${value ? value : 'empty'}`}
    >
      <span className={`ttt-square__value ${value === 'X' ? 'ttt-x' : value === 'O' ? 'ttt-o' : ''}`}>
        {value}
      </span>
    </button>
  );
}

// Board component
// PUBLIC_INTERFACE
export function Board({ squares, onSquareClick, winningLine }) {
  /** The 3x3 Tic Tac Toe board rendering 9 squares. */
  const renderSquare = (i) => {
    const isWinning = winningLine?.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={isWinning}
      />
    );
  };

  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      <div className="ttt-row" role="row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="ttt-row" role="row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="ttt-row" role="row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

// Winner calculation helper
function calculateWinner(sq) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diags
  ];
  for (const [a,b,c] of lines) {
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
      return { winner: sq[a], line: [a,b,c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  /** Main App component for Tic Tac Toe with Ocean Professional theme. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const result = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(() => !result && squares.every(Boolean), [result, squares]);

  const statusText = useMemo(() => {
    if (result?.winner) {
      return `Winner: ${result.winner}`;
    }
    if (isDraw) {
      return "It's a draw!";
    }
    return `Current Turn: ${xIsNext ? 'X' : 'O'}`;
  }, [result, isDraw, xIsNext]);

  const statusType = useMemo(() => {
    if (result?.winner) return 'success';
    if (isDraw) return 'warning';
    return 'info';
  }, [result, isDraw]);

  const handleSquareClick = (i) => {
    if (squares[i] || result) return; // ignore if filled or game over
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    /** Reset the Tic Tac Toe game to initial state. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="app-shell">
      <div className="ocean-gradient" />
      <header className="app-header">
        <div className="brand">
          <div className="brand__mark" aria-hidden="true">◎</div>
          <div className="brand__copy">
            <h1 className="title">Tic Tac Toe</h1>
            <p className="subtitle">Ocean Professional</p>
          </div>
        </div>
        <div className="actions">
          <button
            className="btn btn--secondary"
            onClick={resetGame}
            aria-label="Restart Game"
          >
            ↻ Restart
          </button>
        </div>
      </header>

      <main className="main">
        <section className="game-card">
          <div className={`status status--${statusType}`} role="status" aria-live="polite">
            {statusText}
          </div>

          <Board
            squares={squares}
            onSquareClick={handleSquareClick}
            winningLine={result?.line}
          />

          <div className="legend">
            <div className="legend__item">
              <span className="badge badge--x">X</span>
              <span className="legend__text">Player One</span>
            </div>
            <div className="legend__item">
              <span className="badge badge--o">O</span>
              <span className="legend__text">Player Two</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span className="hint">Tip: Click any empty cell to make a move.</span>
      </footer>
    </div>
  );
}

export default App;
