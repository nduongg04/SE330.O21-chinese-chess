import React, { useEffect, useState } from 'react';
import ChessPiece from './ChessPiece';
import './GameBoard.css';
import getValidMoves from './getValidMoves';
import Swal from 'sweetalert2'
import { useSocket } from '@/hook/SocketHook';
import { useSession } from '@/hook/AuthHook';
import { useRouter } from "next/navigation";
import axios from 'axios';

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
  
  const [isYourTurn, setIsYourTurn] = useState(false);
 // const [isCheckMate, setIsCheckMate]= useState(false);
  let isSelected = false;
  let selectedPiece = null;
  let validMoves = [];
  // Socket
  const matchData = useSocket((state)=>state.matchData)
  const socket = useSocket((state)=> state.socket)
  const user = useSession((state)=> state.user)
  const baseUrl = "https://se330-o21-chinese-game-be.onrender.com";
	//

  const socketIDOponent=()=>{
    console.log(matchData)
    if(matchData === null) return
    if(matchData.user1.user.id== user.id){
      return matchData.user2.socketID
    }
    return matchData.user1.socketID
  }

  const myColor = ()=>{
    if(matchData.user1.user.id== user.id){
      return matchData.user1.color
    }
    return matchData.user2.color
  }
  const currentPlayer= myColor();
  
  useEffect(()=>{
    if(currentPlayer ==='red' ) setIsYourTurn(true)
  })

  const handleClickSocket=(event)=>{
    console.log(isYourTurn)
    if(isYourTurn === false){
      return
    }
    else {
      handleClick(event)
    }
  }

  useEffect(()=>{
    if(socket===null) return
    console.log("Board change")
    socket.on("getTurn", (newBoard)=>{
      console.log("Socket:",newBoard)
      setBoard(newBoard)
      setIsYourTurn(true)
    })

    return()=>{
      socket.off("getTurn")
    }
  },[])

  

 // End Socket
  const movePiece = (currentPosition, newPosition) => {
    board[newPosition.x][newPosition.y] = null;
    board[newPosition.x][newPosition.y]=board[currentPosition.x][currentPosition.y];
    board[currentPosition.x][currentPosition.y] = null;
    board[newPosition.x][newPosition.y].position = {x: newPosition.x, y: newPosition.y};
    console.log(board);
    document.querySelectorAll('.valid-move').forEach(cell => {
      cell.classList.remove('valid-move');
    });
  }

  function isChecking (currentPlayer, board) {
    // Get the opponent's color
    const opponentColor = currentPlayer === 'red' ? 'black' : 'red';
    let opponentGeneralPositon = {x: 0, y:0};
    // Get position of opponent general
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board[x].length; y++) {
          const opponentPiece = board[x][y];
          // If there is a piece at this position and it is the opponent's general
          if ((opponentPiece && opponentPiece.type === 'general' && opponentPiece.color === opponentColor)) {
            opponentGeneralPositon = {x: x, y: y};
            console.log(opponentPiece)
            break;
          }
      }
    }
    // Loop through all the positions on the board
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
          const piece = board[i][j];
          // If there is a piece at this position and it is the current player's
          if (piece && piece.color === currentPlayer) {
            // Get the valid moves for this piece
            let piecevalidMoves = getValidMoves(piece,board);
            console.log("currentPiece", piece);
            // If one of the valid moves for the current player's piece is this position, return true
            if (piecevalidMoves.some(move => move.x === opponentGeneralPositon.x && move.y === opponentGeneralPositon.y)) {
              console.log("Check:",piece)
              return true;
          } 
        }
      }
    }
    // If none of the valid moves for any of the current player's pieces are the position of the opponent's general, return false
    return false;
  } 

  function isCheckMate(currentPlayer, board){
    // Get the opponent's color
    const opponentColor = currentPlayer === 'red' ? 'black' : 'red';
    const allValidMoves = [];
    // Loop through all the positions on the board
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const piece = board[i][j];
        // If there is a piece at this position and it is the current player's
        if (piece && piece.color === opponentColor) {
          // Get the valid moves for this piece
          let validMoves = getValidMoves(piece,board);
          validMoves = filterCheckMoves(opponentColor,validMoves,piece);
          if(validMoves.length!= 0) allValidMoves.push(validMoves);
        }
      }
    }
    if(allValidMoves.length == 0) return true;
    return false;
  }


  function filterCheckMoves(currentPlayer, validMoves, pieceInSelect) {
    // Copy the current board to a new variable to simulate the moves
    const opponentColor = currentPlayer === 'red' ? 'black' : 'red';
    console.log('OPC',opponentColor)
    const piece = { ...pieceInSelect };
    return validMoves.filter(move => {
        // Simulate the move
        let simulatedBoard = board.map(row => row.map(piece => {
          return piece ? { ...piece, position: { ...piece.position } } : null;
        }));
        simulatedBoard[move.x][move.y] = piece;
        simulatedBoard[piece.position.x][piece.position.y] = null;
        console.log(simulatedBoard)
        // Check if the move would put the player in check
        const wouldBeCheck = isChecking(opponentColor,simulatedBoard)
        // If the move would not put the player in check, it's a valid move
        return !wouldBeCheck;
    });
}
  

  const handleOnMove = ( position) =>{
      // Move the piece and switch the current player
      // If none of the above conditions are true, move the piece to the new position
      // Only try to move the piece if one is selected
      movePiece(selectedPiece.position, position); 
      //  setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
      // Unselect the piece and remove the highlights
      console.log("board: ", board)
      isSelected = false;
      validMoves.forEach(move => {
        const cell = document.getElementById(`cell-${move.x}-${move.y}`);
        if (cell) {
          cell.classList.remove('valid-move');
        }
      });
      validMoves = [];
      const checkmate = isCheckMate(currentPlayer, board);
      if(checkmate){
        console.log('win');
        Swal.fire({
          title: "You win the match!",
          width: 600,
          padding: "3em",
          color: "#716add",
          background: "#fff url(https://sweetalert2.github.io/images/trees.png)",
          backdrop: `
            rgba(0,0,123,0.4)
            url("https://sweetalert2.github.io/images/nyan-cat.gif")
            left top
            no-repeat
          `
        }).then((result)=>{
          if(result.isConfirmed){
            console.log("the win");
            const createHistory = async () => {
              let user2ID = matchData.user1.user.id;
              if(matchData.user1.user.id== user.id){
                user2ID = matchData.user2.user.id;
              }
              try {
                const response = await axios({
                  method: 'post',
                  url: `${baseUrl}/api/v1/history/create?winScore=10&loseScore=1`,
                  headers: {},
                  data: {
                    user1Id: user.id,
                    user2Id: user2ID,
                    user1Score: 1,
                    user2Score: 0
                  }
                });
            
                console.log(response.data);
              } catch (error) {
                console.log("Error", error);
              }
            };
          }
        })
      } else {
        const check = isChecking(currentPlayer,board);
        if(check){
          console.log("check");
        }
      }
      if(checkmate){
        const router = useRouter();
        router.push("/lobby");
      }
    // Unselect the piece and remove the highlights
    isSelected = false; setIsYourTurn(false);
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
      if((board[x][y] && (board[x][y].position != selectedPiece.position && board[x][y].color === currentPlayer ))){
        selectedPiece = board[x][y];
      console.log(selectedPiece);
      validMoves.forEach(move => {
        const cell = document.getElementById(`cell-${move.x}-${move.y}`);
        if (cell) {
          cell.classList.remove('valid-move');
        }
      });
      validMoves = [];
      //Highlight the valid moves
      validMoves = getValidMoves(selectedPiece, board); 
      validMoves= filterCheckMoves(currentPlayer,validMoves,selectedPiece);
      console.log("filter here:", validMoves)
      if(validMoves.length === 0){
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
          handleOnMove(position);
          if(socket !== null){
            console.log("socket:", board)
          const socketID = socketIDOponent()
          console.log(socketID)
          const data = {
            board: board,
            socketID: socketID
          }
          console.log(data.board)
          socket.emit("completeTurn", data)
          }
        }   
      }
     
    } else if( (board[x][y] && selectedPiece === null && board[x][y].color === currentPlayer) )
    {
      isSelected = true;
      selectedPiece = board[x][y];
      console.log(selectedPiece);
      //Highlight the valid moves
      validMoves = getValidMoves(selectedPiece, board);
      validMoves = filterCheckMoves(currentPlayer,validMoves, selectedPiece);
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
                onClick={handleClickSocket}
              >
                {piece ? (
                  <ChessPiece
                    type={piece.type}
                    position={{ x: i, y: j }}
                    color={piece.color}
                    onClick={handleClickSocket}
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