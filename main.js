class Game {
    
    constructor(board){
       
        this.board = board;
        this.activePlayer = null;
        this.disksPlayed = 0;
        this.message = '';
        this.winner = '';
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
    }

    start(){
        let dice = Math.random();
        this.activePlayer = dice > .5 ? 'yellow' : 'red' ;
    }

    get active(){
        return this.activePlayer;
    }
    
    nextPlayer(){
        this.activePlayer = this.activePlayer === "yellow" ? "red" : "yellow";
        this.disksPlayed += 1;
        console.log('you have played ' + this.disksPlayed + ' times.');
        this.checkForHorizontalWin();
        this.checkForVerticalWin();

    }

    getWholeLine(lineNumber, orientation){
        //get either the whole row or the whole column clicked, default is 'row'
        let attribute = orientation === 'col' ? 'data-col' : 'data-row';
        let lineCells = cells.filter(cell => {
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
                colCells[i].classList.add(this.activePlayer);
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
                for(let i = 1; i < 7; i++){
                    let currentCol = this.getWholeLine(String(i), 'col');
                    let colorStreak = 0;

                    for(let j = 5; j >= 0; j--){
                        if(currentCol[j].dataset.color && currentCol[j].dataset.color === currentCol[j - 1].dataset.color){
                            colorStreak += 1;
                        }

                        if(colorStreak === 3){
                            this.winner = currentCol[j].dataset.color;
                            console.log(`${this.winner} win vertically`)
                            return;
                        }
                    }
                }
            }
        }
        
     

const boardElt = document.getElementById('game-board');
let myGame = new Game(boardElt);
myGame.drawBoard();
const cells = Array.from(document.getElementsByClassName('cell'));

cells.forEach(cell => {
    cell.addEventListener('click', (e) => {
    myGame.colorizeCell(e.target)
    })
})

// user interaction

