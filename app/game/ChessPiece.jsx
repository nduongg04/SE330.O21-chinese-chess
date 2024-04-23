import React from 'react';
import './GameBoard.css';

const ChessPiece = ({ type, position, board, movePiece, color }) => {
  const display = {
    'chariot': {
        'red': '/path/to/red/chariot/image',
        'black': '/path/to/black/chariot/image'
      },
      'advisor': {
        'red': '/path/to/red/advisor/image',
        'black': '/path/to/black/advisor/image'
      },
      'cannon': {
        'red': '/path/to/red/cannon/image',
        'black': '/path/to/black/cannon/image'
      },
      'soldier': {
        'red': '/path/to/red/soldier/image',
        'black': '/path/to/black/soldier/image'
      },
      'horse': {
        'red': '/path/to/red/horse/image',
        'black': '/path/to/black/horse/image'
      },
      'elephant': {
        'red': '/path/to/red/elephant/image',
        'black': '/path/to/black/elephant/image'
      },
      'general': {
        'red': '/path/to/red/general/image',
        'black': '/path/to/black/general/image'
      },
      // Thêm các quân cờ khác ở đây
    // Thêm các quân cờ khác ở đây
  };

  // Xử lý tìm kiếm nước đi hợp lệ cho quân cờ
  const getValidMoves = () => {
    const validMoves = [];
    // Quân xe
    if (type === 'chariot') {
        // Kiểm tra các ô trên cùng một hàng
        for (let i = position[0] + 1; i < board.length; i++) {
          if (board[i][position[1]] !== null) {
            if (board[i][position[1]].color !== color) {
              validMoves.push([i, position[1]]);
            }
            break;
          }
          validMoves.push([i, position[1]]);
        }
        for (let i = position[0] - 1; i >= 0; i--) {
          if (board[i][position[1]] !== null) {
            if (board[i][position[1]].color !== color) {
              validMoves.push([i, position[1]]);
            }
            break;
          }
          validMoves.push([i, position[1]]);
        }
    
        // Kiểm tra các ô trên cùng một cột
        for (let j = position[1] + 1; j < board[0].length; j++) {
          if (board[position[0]][j] !== null) {
            if (board[position[0]][j].color !== color) {
              validMoves.push([position[0], j]);
            }
            break;
          }
          validMoves.push([position[0], j]);
        }
        for (let j = position[1] - 1; j >= 0; j--) {
          if (board[position[0]][j] !== null) {
            if (board[position[0]][j].color !== color) {
              validMoves.push([position[0], j]);
            }
            break;
          }
          validMoves.push([position[0], j]);
        }
    }
   // Quân Sĩ
if (type === 'advisor') {
    // Logic di chuyển cho quân sĩ
    // Kiểm tra các ô chéo
    const deltas = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (let delta of deltas) {
      const newRow = position[0] + delta[0];
      const newCol = position[1] + delta[1];
      // Kiểm tra xem quân sĩ có đang cố gắng di chuyển ra khỏi cung điện không
      if (color === 'red' && newRow >= 7 && newRow <= 9 && newCol >= 3 && newCol <= 5 && (board[newRow][newCol] === null || board[newRow][newCol].color !== color)) {
        validMoves.push([newRow, newCol]);
      }
      if (color === 'black' && newRow >= 0 && newRow <= 2 && newCol >= 3 && newCol <= 5 && (board[newRow][newCol] === null || board[newRow][newCol].color !== color)) {
        validMoves.push([newRow, newCol]);
      }
    }
  }
    // Quân pháo
    if (type === 'cannon') {
        // Logic di chuyển cho quân pháo
        // Kiểm tra các ô trên cùng một hàng
        for (let i = 0; i < board.length; i++) {
            if (i !== position[0]) {
                let count = 0;
                let lastPieceColor = null;
                for (let j = Math.min(i, position[0]); j <= Math.max(i, position[0]); j++) {
                    if (board[j][position[1]] !== null) {
                        count++;
                        lastPieceColor = board[j][position[1]].color;
                    }
                }
                if ((count === 0 && board[i][position[1]] === null) || (count === 2 && board[i][position[1]] !== null && lastPieceColor !== color)) {
                    validMoves.push([i, position[1]]);
                }
            }
        }
    
        // Kiểm tra các ô trên cùng một cột
        for (let j = 0; j < board[0].length; j++) {
            if (j !== position[1]) {
                let count = 0;
                let lastPieceColor = null;
                for (let i = Math.min(j, position[1]); i <= Math.max(j, position[1]); i++) {
                    if (board[position[0]][i] !== null) {
                        count++;
                        lastPieceColor = board[position[0]][i].color;
                    }
                }
                if ((count === 0 && board[position[0]][j] === null) || (count === 2 && board[position[0]][j] !== null && lastPieceColor !== color)) {
                    validMoves.push([position[0], j]);
                }
            }
        }
    }
   // Quân Tốt
    if (type === 'soldier') {
        // Logic di chuyển cho quân tốt 
        // Kiểm tra ô phía trước
        if (color === 'red' && position[0] < board.length - 1 && (board[position[0] + 1][position[1]] === null || board[position[0] + 1][position[1]].color !== color)) {
            validMoves.push([position[0] + 1, position[1]]);
        }
        if (color === 'black' && position[0] > 0 && (board[position[0] - 1][position[1]] === null || board[position[0] - 1][position[1]].color !== color)) {
            validMoves.push([position[0] - 1, position[1]]);
        }

        // Nếu đã vượt qua sông, kiểm tra các ô bên cạnh
        if ((color === 'red' && position[0] >= 5) || (color === 'black' && position[0] <= 4)) {
            if (position[1] > 0 && (board[position[0]][position[1] - 1] === null || board[position[0]][position[1] - 1].color !== color)) {
                validMoves.push([position[0], position[1] - 1]);
            }
            if (position[1] < board[0].length - 1 && (board[position[0]][position[1] + 1] === null || board[position[0]][position[1] + 1].color !== color)) {
                validMoves.push([position[0], position[1] + 1]);
            }
        }
    }
    // Quân Mã
    if (type === 'horse') {
        // Logic di chuyển cho quân mã 
        // Kiểm tra các ô mà quân mã có thể di chuyển đến
        const deltas = [[-1, -2], [-1, 2], [1, -2], [1, 2], [-2, -1], [-2, 1], [2, -1], [2, 1]];
        for (let delta of deltas) {
            const newRow = position[0] + delta[0];
            const newCol = position[1] + delta[1];
            if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length && (board[newRow][newCol] === null || board[newRow][newCol].color !== color)) {
                // Kiểm tra xem có quân cờ nào cản trở quân mã không
                const blockRow = position[0] + (delta[0] === 2 || delta[0] === -2 ? delta[0] / 2 : 0);
                const blockCol = position[1] + (delta[1] === 2 || delta[1] === -2 ? delta[1] / 2 : 0);
                if (board[blockRow][blockCol] === null) {
                    validMoves.push([newRow, newCol]);
                }
            }
        }
    }
    // Quân Tượng
    if (type === 'elephant') {
        // Logic di chuyển cho quân tượng
        // Kiểm tra các ô mà quân tượng có thể di chuyển đến
        const deltas = [[-2, -2], [-2, 2], [2, -2], [2, 2]];
        for (let delta of deltas) {
            const newRow = position[0] + delta[0];
            const newCol = position[1] + delta[1];
            // Kiểm tra xem quân tượng có đang cố gắng đi qua sông không
            if ((color === 'red' && newRow >= 5) || (color === 'black' && newRow < 5)) {
                continue;
            }
            if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length && (board[newRow][newCol] === null || board[newRow][newCol].color !== color)) {
                // Kiểm tra xem có quân cờ nào cản trở quân tượng không
                const blockRow = position[0] + delta[0] / 2;
                const blockCol = position[1] + delta[1] / 2;
                if (board[blockRow][blockCol] === null) {
                    validMoves.push([newRow, newCol]);
                }
            }
        }
    }
    // Quân Tướng
    if (type === 'general') {
        // Logic di chuyển cho quân tướng
        // Kiểm tra các ô mà quân tướng có thể di chuyển đến
        const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (let delta of deltas) {
            const newRow = position[0] + delta[0];
            const newCol = position[1] + delta[1];
            // Kiểm tra xem quân tướng có đang cố gắng di chuyển ra khỏi cung điện không
            if ((color === 'red' && newRow >= 0 && newRow <= 2 && newCol >= 3 && newCol <= 5) || (color === 'black' && newRow >= 7 && newRow <= 9 && newCol >= 3 && newCol <= 5)) {
                if (board[newRow][newCol] === null || board[newRow][newCol].color !== color) {
                    validMoves.push([newRow, newCol]);
                }
            }
        }
    }
  };

  return (
    <div>
      <img src={display[type][color]} alt={type} />
    </div>
  );
};

export default ChessPiece;