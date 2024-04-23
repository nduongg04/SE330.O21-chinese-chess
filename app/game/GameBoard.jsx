import React, { useState } from 'react';
import ChessPiece from './ChessPiece';
import './GameBoard.css';

function GameBoard() {
  const initialBoard = [
    ['chariot', 'horse', 'elephant', 'advisor', 'general', 'advisor', 'elephant', 'horse', 'chariot'],
    [null, null, null, null, null, null, null, null, null],
    [null, 'cannon', null, null, null, null, null, 'cannon', null],
    ['soldier', null, 'soldier', null, 'soldier', null, 'soldier', null, 'soldier'],
    Array(9).fill(null),
    Array(9).fill(null),
    ['soldier', null, 'soldier', null, 'soldier', null, 'soldier', null, 'soldier'],
    [null, 'cannon', null, null, null, null, null, 'cannon', null],
    ['chariot', 'horse', 'elephant', 'advisor', 'general', 'advisor', 'elephant', 'horse', 'chariot'],
  ].map((row, rowIndex) => row.map((piece, colIndex) => {
    const color = rowIndex < 5 ? 'red' : 'black';
    return piece ? { type: piece, color } : null;
  }));

  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [isCheck, setIsCheck] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const capture = (position) => {
    let newBoard = [...board];
    newBoard[position[0]][position[1]] = null;
    setBoard(newBoard);
  }

  const movePiece = (currentPosition, newPosition) => {
    let newBoard = [...board];
    let piece = newBoard[currentPosition[0]][currentPosition[1]];
    newBoard[newPosition[0]][newPosition[1]] = piece;
    newBoard[currentPosition[0]][currentPosition[1]] = null;
    setBoard(newBoard);
  }

  getPieceAtPosition = (x, y) => {
    if (x >= 0 && x < board.length && y >= 0 && y < board[0].length) {
        return board[x][y];
    }
    return null;
  }

  isCheck = (currentPlayer) => {
    // Get the opponent's color
    const opponentColor = currentPlayer === 'red' ? 'black' : 'red';

    // Loop through all the positions on the board
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const piece = board[i][j];

            // If there is a piece at this position and it is the current player's
            if (piece && piece.color === currentPlayer) {
                // Get the valid moves for this piece
                const validMoves = piece.getValidMoves();

                // Loop through all the positions on the board again
                for (let x = 0; x < board.length; x++) {
                    for (let y = 0; y < board[x].length; y++) {
                        const opponentPiece = board[x][y];

                        // If there is a piece at this position and it is the opponent's general
                        if (opponentPiece && opponentPiece.type === 'general' && opponentPiece.color === opponentColor) {
                            // If one of the valid moves for the current player's piece is this position, return true
                            if (validMoves.some(move => move[0] === x && move[1] === y)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }

    // If none of the valid moves for any of the current player's pieces are the position of the opponent's general, return false
    return false;
  } 

  handleClick = (e) => {
     // Get the piece that was clicked
     var clickedPiece = getPieceAtPosition(e.clientX, e.clientY);

     // If no piece is currently selected, select the clicked piece
     if (!selectedPiece) {
      setSelectedPiece(clickedPiece);
    
      // Highlight the valid moves
      const validMoves = clickedPiece.getValidMoves();
      validMoves.forEach(move => {
        const cell = document.getElementById(`cell-${move.x}-${move.y}`);
        if (cell) {
          cell.classList.add('valid-move');
        }
      });
    
      return;
    }
 
     // Get the valid moves for the selected piece
     var validMoves = selectedPiece.getValidMoves();
    // Check if the move captures an opponent's piece
    var opponentPiece = getPieceAtPosition(clickedPiece.newX, clickedPiece.newY);
    if (opponentPiece && validMoves.includes(opponentPiece.position)) {
        // Capture the opponent's piece
        opponentPiece.capture();
    }
    // If none of the above conditions are true, move the piece to the new position
    if (!opponentPiece && !isCheck(currentPlayer) && !isChecked) {
        clickedPiece.move(clickedPiece.newX, clickedPiece.newY);
    }
    const check = isCheck(currentPlayer);
    if (check) {
        // If the opponent's general is in check, alert the user
        setIsCheck(true);
        alert('Check!'); 
    } else {
      setIsCheck(false);
    }

    // Unselect the piece and remove the highlights
    setSelectedPiece(null);
    document.querySelectorAll('.valid-move').forEach(cell => {
      cell.classList.remove('valid-move');
    });
  }

  return (
    <div className="chess-board">
      {board.map((row, i) => (
        <div key={i}>
          {row.map((piece, j) => (
            piece ? (
              <ChessPiece
                key={j}
                type={piece.type}
                position={{ x: i, y: j }}
                board={board}
                movePiece={movePiece}
                color={piece.color}
                onClick={handleClick}
              />
            ) : null
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;