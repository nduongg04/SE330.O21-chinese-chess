import React, { useState } from 'react';
import ChessPiece from './ChessPiece';
import './GameBoard.css';

function GameBoard() {
  const initialBoard = [
    ['chariot', 'horse', 'elephant', 'advisor', 'general', 'advisor', 'elephant', 'horse', 'chariot'],
    [null, 'cannon', null, null, null, null, null, 'cannon', null],
    ['soldier', null, 'soldier', null, 'soldier', null, 'soldier', null, 'soldier'],
    Array(9).fill(null),
    Array(9).fill(null),
    ['soldier', null, 'soldier', null, 'soldier', null, 'soldier', null, 'soldier'],
    [null, 'cannon', null, null, null, null, null, 'cannon', null],
    ['chariot', 'horse', 'elephant', 'advisor', 'general', 'advisor', 'elephant', 'horse', 'chariot'],
  ];

  const [board, setBoard] = useState(initialBoard);

  const movePiece = (fromPosition, toPosition) => {
    // Implement the logic to move a piece from fromPosition to toPosition
    // and update the board state.
  };
  const capturePiece = (position) => {
    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      const [x, y] = position;
      newBoard[x][y] = null;
      return newBoard;
    });
  };

  return (
    <div className="chess-board">
      {board.map((row, i) => (
        <div key={i}>
          {row.map((piece, j) => (
            <ChessPiece
              key={j}
              type={piece}
              position={{ x: i, y: j }}
              board={board}
              movePiece={movePiece}
              capturePiece ={capturePiece}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;