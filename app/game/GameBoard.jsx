import React, { useEffect, useState } from 'react';
import ChessPiece from './ChessPiece';
import './GameBoard.css';
import getValidMoves from './getValidMoves';

const GameBoard = ()=> {
  const [board, setBoard]  = useState( [
    ['chariot', 'horse', 'elephant', 'advisor', 'general', 'advisor', 'elephant', 'horse', 'chariot'],
    [null, null, null, null, null, null, null, null, null],
    [null, 'cannon', null, null, null, null, null, 'cannon', null],
    ['soldier', null, 'soldier', null, 'soldier', null, 'soldier', null, 'soldier'],
    Array(9).fill(null),
    Array(9).fill(null),
    ['soldier', null, 'soldier', null, 'soldier', null, 'soldier', null, 'soldier'],
    [null, 'cannon', null, null, null, null, null, 'cannon', null],
    [null, null, null, null, null, null, null, null, null],
    ['chariot', 'horse', 'elephant', 'advisor', 'general', 'advisor', 'elephant', 'horse', 'chariot'],
  ].map((row, rowIndex) => row.map((piece, colIndex) => {
    const color = rowIndex < 5 ? 'red' : 'black';
    return piece ? { type: piece, position: {x: rowIndex, y: colIndex}, color: color} : null;
  })))
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [isCheck,setIsCheck] = useState(false);
  const [beingCheck, setBeingCheck]= useState(false);
  let isSelected = false;
  let selectedPiece = null;
  let validMoves = [];

  const movePiece = (currentPosition, newPosition) => {
    board[newPosition.x][newPosition.y]=board[currentPosition.x][currentPosition.y];
    board[currentPosition.x][currentPosition.y] = null;
    board[newPosition.x][newPosition.y].position = {x: newPosition.x, y: newPosition.y};
    console.log(board)
    document.querySelectorAll('.valid-move').forEach(cell => {
      cell.classList.remove('valid-move');
    });
  }
  function isBeingCheck (currentPlayer, board) {
    // Get the opponent's color
    const opponentColor = currentPlayer === 'red' ? 'black' : 'red';

    // Loop through all the positions on the board
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const piece = board[i][j];

            // If there is a piece at this position and it is the current player's
            if (piece && piece.color === currentPlayer) {
                // Get the valid moves for this piece
                const validMoves = getValidMoves(piece,board);

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

//   function filterCheckMoves(currentPlayer, validMoves, piece) {
//     // Copy the current board to a new variable to simulate the moves
//     let simulatedBoard = board.map(row => row.map(piece => {
//       return piece ? { ...piece, position: { ...piece.position } } : null;
//     }));
//     console.log(simulatedBoard)
//     return validMoves.filter(move => {
//         // Simulate the move
//         simulatedBoard[move[0]][move[1]] = piece;
//         simulatedBoard[piece.position[0]][piece.position[1]] = null;
//         // Check if the move would put the player in check
//         const wouldBeCheck = isBeingCheck(currentPlayer, simulatedBoard);

//         // If the move would not put the player in check, it's a valid move
//         return wouldBeCheck;
//     });
// }
  

  const handleOnMove = (event, position) =>{
        // Move the piece and switch the current player
        // If none of the above conditions are true, move the piece to the new position
        if (!isBeingCheck(currentPlayer, board)) {
          if (selectedPiece) {
            // Only try to move the piece if one is selected
            movePiece(selectedPiece.position, position);
            setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
          }
        }
      // Unselect the piece and remove the highlights
      console.log("board: ", board)
      isSelected = false;
      validMoves.forEach(move => {
        const cell = document.getElementById(`cell-${move.x}-${move.y}`);
        if (cell) {
          cell.classList.remove('valid-move');
        }
      });
      const check = isBeingCheck(currentPlayer, board);
      console.log(check)
      if (check) {
        // If the opponent's general is in check, alert the user
        setIsCheck(true);
        alert('Check!');
      } else {
        setIsCheck(false);
      }
    // Unselect the piece and remove the highlights
    isSelected = false; 
    document.querySelectorAll('.valid-move').forEach(cell => {
      cell.classList.remove('valid-move');
    });
  }
  
  const handleClick = (event) => {
    // Get the piece that was clicked 
    let id = event.currentTarget.id;
    let parts = id.split('-');
    let x = parseInt(parts[1]);
    let y = parseInt(parts[2]);
    console.log(`Coordinates are (${x}, ${y})`);
    console.log(board)
    console.log(board[x][y])
    if(isSelected && selectedPiece){
      if((board[x][y] && (board[x][y].position != selectedPiece.position))){
        selectedPiece = board[x][y];
      console.log(selectedPiece);
      validMoves.forEach(move => {
        const cell = document.getElementById(`cell-${move.x}-${move.y}`);
        if (cell) {
          cell.classList.remove('valid-move');
        }
      });
      //Highlight the valid moves
      validMoves = getValidMoves(selectedPiece, board);
      //validMoves = filterCheckMoves(currentPlayer,validMoves, selectedPiece);
      if(validMoves.length == 0){
        isSelected = false;
        selectedPiece = null;
      }
       console.log(validMoves)
       validMoves.forEach(move => {
         const cell = document.getElementById(`cell-${move.x}-${move.y}`);
         if (cell) {
           cell.classList.add('valid-move');
         }
       }
       );
      } else{
           // If a piece is selected and the clicked cell is a valid move
        console.log(validMoves)
        const id = event.currentTarget.id;
        const parts = id.split('-');
        const x = parseInt(parts[1]);
        const y = parseInt(parts[2]);
        let position = {x: x, y: y}
        console.log(position);
        const isValidMove = validMoves.some(move => position.x === move.x && position.y === move.y);
        console.log(isValidMove)
        if(isValidMove){
          handleOnMove(event,position);
        }   
      }
     
    } else if( (board[x][y] && selectedPiece === null) )
    {
      isSelected = true;
      selectedPiece = board[x][y];
      console.log(selectedPiece);
      //Highlight the valid moves
      validMoves = getValidMoves(selectedPiece, board);
      //validMoves = filterCheckMoves(currentPlayer,validMoves, selectedPiece);
      if(validMoves.length == 0){
        isSelected = false;
        selectedPiece = null;
      }
       console.log(validMoves)
       validMoves.forEach(move => {
         const cell = document.getElementById(`cell-${move.x}-${move.y}`);
         if (cell) {
           cell.classList.add('valid-move');
         }
       }
       );
    } 
    
    
  }

  
  return (
    <div className="container">
      <div className="chess-board">
        {board.map((row, i) => (
          row.map((piece, j) => {
            const isValidMove = validMoves.some(move => move[0] === i && move[1] === j);
            return (
              <div
                id={`cell-${i}-${j}`}
                className={`cell ${isValidMove ? 'valid-move' : ''}`}
                onClick={handleClick}
              >
                {piece ? (
                  <ChessPiece
                    type={piece.type}
                    position={{ x: i, y: j }}
                    color={piece.color}
                    onClick={handleClick}
                  />
                ) : null}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
}

export default GameBoard;