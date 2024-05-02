  // Xử lý tìm kiếm nước đi hợp lệ cho quân cờ
  function getValidMoves(piece, board) {
    let validMoves = [];
    if (!piece) {
    return [];
    }
    const type = piece.type;
    const color = piece.color;
    const position = piece.position;
    if (typeof position !== 'object' || position.x === undefined || position.y === undefined) {
      return validMoves;
    }
    // Quân xe
  if (type === 'chariot') {
      // Kiểm tra các ô trên cùng một hàng
      for (let i = position.x + 1; i < (10-position.x); i++) {
        if (board[i][position.y] !== null) {
          if (board[i][position.y].color !== color) {
            validMoves.push({x: i, y: position.y});
          }
          break;
        }
        validMoves.push({x: i, y: position.y});
      }
      for (let i = position.x - 1; i >= 0; i--) {
        if (board[i][position.y] !== null) {
          if (board[i][position.y].color !== color) {
            validMoves.push({x: i, y: position.y});
          }
          break;
        }
        validMoves.push({x: i, y: position.y});
      }
  
      // Kiểm tra các ô trên cùng một cột
      for (let j = position.y + 1; j < board[0].length; j++) {
        if (board[position.x][j] !== null) {
          if (board[position.x][j].color !== color) {
            validMoves.push({x: position.x, y: j});
          }
          break;
        }
        validMoves.push({x: position.x, y: j});
      }
      for (let j = position.y - 1; j >= 0; j--) {
        if (board[position.x][j] !== null) {
          if (board[position.x][j].color !== color) {
            validMoves.push({x: position.x, y: j});
          }
          break;
        }
        validMoves.push({x: position.x, y: j});
      }
  }
   // Quân Sĩ
   if (type === 'advisor') {
    // Logic di chuyển cho quân sĩ
    // Kiểm tra các ô chéo
    const deltas = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (let delta of deltas) {
      const newX = position.x + delta[0];
      const newY = position.y + delta[1];
      // Kiểm tra xem vị trí mới có nằm trong bàn cờ không
      if (newX >= 0 && newX < board.length && newY >= 0 && newY < board[0].length) {
        // Kiểm tra xem vị trí mới có nằm trong cung điện không
        if ((color === 'red' && newX >= 0 && newX <= 2 && newY >= 3 && newY <= 5) || 
            (color === 'black' && newX >= 7 && newX <= 9 && newY >= 3 && newY <= 5)) {
          // Kiểm tra xem ô đó có trống hoặc có quân cờ của đối phương không
          if (board[newX][newY] === null || board[newX][newY].color !== color) {
            validMoves.push({x: newX, y: newY});
          }
        }
      }
    }
  }
    // Quân pháo
    if (type === 'cannon') {
      // Logic di chuyển cho quân pháo
      // Kiểm tra các ô trên cùng một hàng
      for (let i = 0; i < board.length; i++) {
        if (i !== position.x) {
          let count = 0;
          let lastPieceColor = null;
          for (let j = Math.min(i, position.x) + 1; j < Math.max(i, position.x); j++) {
            if (board[j][position.y] !== null) {
              count++;
            }
          }
          if ((count === 0 && board[i][position.y] === null) || (count === 1 && board[i][position.y] !== null && board[i][position.y].color !== color)) {
            validMoves.push({x: i, y: position.y});
          }
        }
      }
    
      // Kiểm tra các ô trên cùng một cột
      for (let j = 0; j < board[0].length; j++) {
        if (j !== position.y) {
          let count = 0;
          let lastPieceColor = null;
          for (let i = Math.min(j, position.y) + 1; i < Math.max(j, position.y); i++) {
            if (board[position.x][i] !== null) {
              count++;
            }
          }
          if ((count === 0 && board[position.x][j] === null) || (count === 1 && board[position.x][j] !== null && board[position.x][j].color !== color)) {
            validMoves.push({x: position.x, y: j});
          }
        }
      }
    }
   // Quân Tốt
   if (type === 'soldier') {
    // Logic for soldier movement
    // Check the cell in front
    if (color === 'red' && position.x < board.length - 1 && (board[position.x + 1][position.y] === null || board[position.x + 1][position.y].color !== color)) {
      validMoves.push({x: position.x + 1, y: position.y});
    }
    if (color === 'black' && position.x > 0 && (board[position.x - 1][position.y] === null || board[position.x - 1][position.y].color !== color)) {
      validMoves.push({x: position.x - 1, y: position.y});
    }
  
    // If the soldier has crossed the river, check the cells to the sides
    if ((color === 'red' && position.x > 4) || (color === 'black' && position.x < 5)) {
      if (position.y > 0 && (board[position.x][position.y - 1] === null || board[position.x][position.y - 1].color !== color)) {
        validMoves.push({x: position.x, y: position.y - 1});
      }
      if (position.y < board[0].length - 1 && (board[position.x][position.y + 1] === null || board[position.x][position.y + 1].color !== color)) {
        validMoves.push({x: position.x, y: position.y + 1});
      }
    }
  }
    // Quân Mã
    if (type === 'horse') {
      // Logic di chuyển cho quân mã 
      // Kiểm tra các ô mà quân mã có thể di chuyển đến
      const deltas = [[-1, -2], [-1, 2], [1, -2], [1, 2], [-2, -1], [-2, 1], [2, -1], [2, 1]];
      for (let delta of deltas) {
          const newRow = position.x + delta[0];
          const newCol = position.y + delta[1];
          if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length && (board[newRow][newCol] === null || board[newRow][newCol].color !== color)) {
              // Kiểm tra xem có quân cờ nào cản trở quân mã không
              const blockRow = position.x + (delta[0] === 2 || delta[0] === -2 ? delta[0] / 2 : 0);
              const blockCol = position.y + (delta[1] === 2 || delta[1] === -2 ? delta[1] / 2 : 0);
              if (board[blockRow][blockCol] === null) {
                  validMoves.push({x: newRow, y: newCol});
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
          const newRow = position.x + delta[0];
          const newCol = position.y + delta[1];
          // Kiểm tra xem quân tượng có đang cố gắng đi qua sông không
          if ((color === 'red' && newRow >= 5) || (color === 'black' && newRow < 5)) {
              continue;
          }
          if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length && (board[newRow][newCol] === null || board[newRow][newCol].color !== color)) {
              // Kiểm tra xem có quân cờ nào cản trở quân tượng không
              const blockRow = position.x + delta[0] / 2;
              const blockCol = position.y + delta[1] / 2;
              if (board[blockRow][blockCol] === null) {
                  validMoves.push({x: newRow, y: newCol});
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
        const newRow = position.x + delta[0];
        const newCol = position.y + delta[1];
        // Kiểm tra xem quân tướng có đang cố gắng di chuyển ra khỏi cung điện không
        if ((color === 'red' && newRow >= 0 && newRow <= 2 && newCol >= 3 && newCol <= 5) || (color === 'black' && newRow >= 7 && newRow <= 9 && newCol >= 3 && newCol <= 5)) {
          if (board[newRow][newCol] === null || board[newRow][newCol].color !== color) {
            validMoves.push({x: newRow, y: newCol});   
          }
        }
      }
    
      // Kiểm tra xem có quân tướng nào đối đầu không
      for (let i = 0; i < 10; i++) {
        if (board[i][position.y] && board[i][position.y].type === 'general' && board[i][position.y].color !== color) {
          let clearPath = true;
          for (let j = Math.min(i, position.x) + 1; j < Math.max(i, position.x); j++) {
            if (board[j][position.y]) {
              clearPath = false;
              break;
            }
          }
          if (clearPath) {
            validMoves.push({x: i, y: position.y});
          }
        }
      }
    }
    return validMoves;
  };

  export default getValidMoves;