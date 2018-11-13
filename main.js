class Game {
    
    constructor(board){
       
        this.board = board;
        this.activePlayer = null;
        this.prevPlayer;
        this.disksPlayed = 0;
        this.message = '';
        this.winner = '';
        this.cells;
    }

	updateMessage(){
        let display = document.getElementById('display-message');
        let displayWrapper = document.getElementById('display');
        if(this.winner){
           this.message = `${this.winner} won the game!`;
        }else{
            this.message = `${this.activePlayer} are playing`;
        }
        display.textContent = this.message;
        displayWrapper.style.backgroundColor = this.activePlayer;
    }

    drawBoard(){        
        // draw a 6 x 7 board; each cell has a 'data-col' and 'data-row' attribute for coordinates

      for (let i = 0; i < 6; i++){
          for(let j = 0; j < 7; j++){
            let newCell = document.createElement('div');
            newCell.setAttribute('class', 'cell');
            newCell.setAttribute('data-row', i);
            newCell.setAttribute('data-col', j);
            this.board.appendChild(newCell);
          }
      }
      this.start();
      this.cells = Array.from(document.getElementsByClassName('cell'));
      this.activateBoard();
    }

    start(){
        this.winner = null;
        let dice = Math.random();
				this.activePlayer = dice > .5 ? 'yellow' : 'red' ;
				this.updateMessage();
    }

    activateBoard(){
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                this.colorizeCell(e.target);
            })
        })
    }


    get active(){
        return this.activePlayer;
    }
    
    nextPlayer(){
        this.prevPlayer = this.activePlayer;
        this.activePlayer = this.activePlayer === "yellow" ? "red" : "yellow";
        this.disksPlayed += 1;
        console.log('you have played ' + this.disksPlayed + ' times.');
        this.checkForHorizontalWin();
        this.checkForVerticalWin();
        this.checkForDiagonalWin();
        this.updateMessage();
        if(this.winner){
            window.setTimeout(() => {
                alert(this.message)
                this.board.innerHTML = '';
                this.drawBoard();
                
            }, 500)
        }    
    }

    getWholeLine(lineNumber, orientation){
        //get either the whole row or the whole column clicked, default is 'row'
        let attribute = orientation === 'col' ? 'data-col' : 'data-row';
        let lineCells = this.cells.filter(cell => {
            return cell.getAttribute(attribute) === lineNumber;
        })
        return lineCells;
    }

    colorizeCell(cell){
        // console.log(cell, this)
        // get all cells in the clicked column
      let colCells = this.getWholeLine(cell.dataset.col, 'col');
        
        // scan column from the bottom up, looking for a free cell

        for(let i = 5; i >= 0 ; i--){
            if(!colCells[i].dataset.color){ 
                /* if column is not filled up to the top, add and then remove 'yellow' or 'red' successively to cells, from top to bottom, 
                to create the illusion of a dropping disk */
                if(i > 0){
                    let coloredIndex = 0;
                    colCells[0].classList.add(this.activePlayer);
                     console.log(coloredIndex)
                    let dropping  = window.setInterval(() => {
                        colCells[0].classList.remove(this.prevPlayer);

                        colCells[coloredIndex].classList.remove(this.prevPlayer);
                        console.log(coloredIndex)
                      
                        if(coloredIndex < i){
                            coloredIndex++;
                            colCells[coloredIndex].classList.add(this.prevPlayer);
                        }else if(coloredIndex === i){
                            colCells[coloredIndex].classList.add(this.prevPlayer);
                            window.clearInterval(dropping);
                        }
                        
                    }, 25)
                }else{
                    colCells[i].classList.add(this.activePlayer);

                }
                /*

                add css class successively to each blank cell atop the target cell
                */
             // add class 'yellow' or 'red' to first blank cell
                colCells[i].setAttribute('data-color', this.activePlayer);
                this.nextPlayer();
                break;
            }
        }
    }

    checkForHorizontalWin(){
            
        for(let i = 5; i >= 0 ; i--){   
            let currentRow = this.getWholeLine(String(i), 'row');
            let colorStreak = 0;

            for(let j = 1; j < 7; j++){ // starting from second column, compare cell color to previous cell color and adjust colorStreak
                        if(currentRow[j].dataset.color && currentRow[j].dataset.color === currentRow[j - 1].dataset.color){
                            //    debugger;
                                colorStreak += 1;
                                console.log(colorStreak);
                                
                        }else{
													colorStreak = 0;
												}
                        //  if  a player has won
                        if(colorStreak === 3){
                            this.winner = currentRow[j].dataset.color;
                            console.log(`${this.winner} win horizontally!`);
                            return;
                        }
                    }         
                }
            }

    checkForVerticalWin(){
        for(let i = 0; i < 7; i++){
            let currentCol = this.getWholeLine(String(i), 'col');
            let colorStreak = 0;

            for(let j = 5; j > 0; j--){ // starting from bottom row, compare each cell's color to the cell on top of it. Stop at row 1 against row 0: there is no row -1
                
                if(currentCol[j].dataset.color && currentCol[j].dataset.color === currentCol[j - 1].dataset.color){
                    colorStreak += 1;
                }

                if(colorStreak === 3){
                    this.winner = currentCol[j].dataset.color;
                    console.log(`${this.winner} win vertically`)
                    return ;
                }
            }
        }
    }
    checkForDiagonalWin(){

        for(let i = 5; i >= 3; i--){
						let currentRow = this.getWholeLine(String(i), 'row');
						let currentColor;
						let winner;
						
            // console.log(currentRow);

            for(let j = 0; j <= 6; j++){
							let colorStreak = 0;
								if(currentRow[j].dataset.color){ // if cell has a color
									currentColor = currentRow[j].dataset.color;
                    if(j <= 3){ // target first three rows, four columns, check for top right diagonal
											for(let k = 1; k <= 3; k++){
												let currentCell = this.getWholeLine(String(i - k))[j+k];
												if(currentCell.dataset.color && currentCell.dataset.color === currentColor){
													colorStreak += 1;
													console.log('color streak: ', colorStreak)
												}else{
													console.log("streak broken: ", colorStreak);
													break;
												}
											}
										}else if(j >= 3){
											for(let k = 1; k <= 3; k++){
												let currentCell = this.getWholeLine(String(i - k))[j - k]; //  we check the cell on the top left [-1, -1], then [-2, -2] and so on..
												if(currentCell.dataset.color && currentCell.dataset.color === currentColor){
													colorStreak += 1;
													// console.log('color streak: ', colorStreak)
												}else{
													// console.log("streak broken: ", colorStreak);
													break;
												}
										}              
                }
                else{
                    console.log("no color")
								}
								if(colorStreak === 3){
									let winner = this.activePlayer === 'red' ? 'yellow' : 'red';
                                    this.winner = winner;
                                    return ;
								}
                    }
                }
            }
        }
    }

        
const boardElt = document.getElementById('game-board');
let myGame = new Game(boardElt);
myGame.drawBoard();





// user interaction

