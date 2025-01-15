import React, { useState } from 'react';
import './App.css';

function App() {
  const [gameMode, setGameMode] = useState(null); // Оюн режими: null, 'friend', 'computer'
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [winner, setWinner] = useState(null); // Жеңүүчүнү сактоо
  const [isDraw, setIsDraw] = useState(false); // Тең чыгуу абалы
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Башкы меню экраны
  function MainMenu({ onSelectMode }) {
    return (
      <div className="main-menu">
        <h1>Тик-Так-Тоо</h1>
        <button onClick={() => onSelectMode('friend')}>Досуң менен ойноо</button>
        <button onClick={() => onSelectMode('computer')}>Компьютер менен ойноо</button>
      </div>
    );
  }

  // Компьютердин жүрүшү
  function computerMove(squares) {
    const emptySquares = squares.map((square, index) => (square === null ? index : null)).filter((index) => index !== null);
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    return emptySquares[randomIndex];
  }

  // Квадрат басылганда
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const gameWinner = calculateWinner(nextSquares);
    if (gameWinner) {
      setWinner(gameWinner); // Жеңүүчүнү белгилөө
    } else if (!nextSquares.includes(null)) {
      setIsDraw(true); // Оюн тең чыкты
    }

    // Компьютер менен оюнда анын жүрүшү
    if (gameMode === 'computer' && !gameWinner && nextSquares.includes(null)) {
      const computerMoveIndex = computerMove(nextSquares);
      nextSquares[computerMoveIndex] = 'O';
      handlePlay(nextSquares);
    }
  }

  // Жеңүүчүнү эсептөө
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  // Модалдык терезе компоненти
  function Modal({ winner, isDraw, onClose, onRestart, onBackToMenu }) {
    return (
      <div className="modal">
        <div className="modal-content">
          {winner && <h2>Жеңүүчү: {winner}</h2>}
          {isDraw && <h2>Оюн тең чыкты!</h2>}
          <button onClick={onRestart}>Кайра ойноо</button>
          <button onClick={onBackToMenu}>Башкы бетке өтүү</button>
        </div>
      </div>
    );
  }

  // Квадрат компоненти
  function Square({ value, onSquareClick }) {
    return (
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    );
  }

  // Борд компоненти
  function Board({ xIsNext, squares, onPlay, onBackToMenu }) {
    function handleClick(i) {
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }
      onPlay(nextSquares);
    }

    let status;
    if (winner) {
      status = 'Жеңүүчү: ' + winner;
    } else if (isDraw) {
      status = 'Оюн тең чыкты!';
    } else {
      status = 'Кийинки оюнчу: ' + (xIsNext ? 'X' : 'O');
    }

    return (
      <>
        <div className="back-to-menu">
          <button onClick={onBackToMenu}>Башкы бетке өтүү</button>
        </div>
        <div className="status">{status}</div>
        <div className="board-row">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </>
    );
  }

  // Модал жабылганда
  function handleModalClose() {
    setGameMode(null);
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setWinner(null);
    setIsDraw(false);
  }

  // Кайра оюн баштоо
  function handleRestart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setWinner(null);
    setIsDraw(false);
  }

  // Башкы бетке өтүү
  function handleBackToMenu() {
    setGameMode(null);
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setWinner(null);
    setIsDraw(false);
  }

  return (
    <div className="game">
      {!gameMode ? (
        <MainMenu onSelectMode={setGameMode} />
      ) : (
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            onBackToMenu={handleBackToMenu} // Артка кайтуу функциясын өткөрүп беребиз
          />
        </div>
      )}
      {(winner || isDraw) && (
        <Modal
          winner={winner}
          isDraw={isDraw}
          onClose={handleModalClose}
          onRestart={handleRestart}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
}

export default App;
