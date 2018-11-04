

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
        this.activePlayer = myGame.active === "yellow" ? "red" : "yellow";
        this.disksPlayed += 1;
        console.log('you have played ' + myGame.disksPlayed + ' times.');
        this.checkForHorizontalWin();
    }

    getWholeLine(lineNumber, orientation){
        //get either the whole row or the whole column clicked, default is 'row'
        let attribute = orientation === 'col' ? 'data-col' : 'data-row';
        let lineCells = cells.filter(cell => {
            return cell.getAttribute(attribute) === lineNumber;
        })
        return lineCells;
    }

    colorizeCell(e){
        // get all cells in the clicked column
      let colCells = myGame.getWholeLine(e.target.dataset.col, 'col');
        
        //scan column from the bottom up, looking for a free cell

        for(let i = 5; i >= 0 ; i--){
            if(!colCells[i].dataset.color){
                colCells[i].classList.add(myGame.activePlayer);
                colCells[i].setAttribute('data-color', myGame.activePlayer);
                myGame.nextPlayer();
                break;
            }
        }
    }

    checkForHorizontalWin(){
      
        for(let i = 5; i >= 0 ; i--){   
            let currentRow = this.getWholeLine(String(i), 'row');
            let currentColor = '' ;
            let colorStreak = 0;
            for(let j = 0; j < 7; j++){
                    
                    if (currentRow[j].dataset.color && currentRow[j].dataset.color === currentColor){
                        colorStreak += 1;
                    }else if(currentRow[j].dataset.color && !currentRow[j].dataset.color === currentColor){
                        currentColor = currentRow[j].dataset.color;
                        colorStreak = 0;
                    }else if(!currentRow[j].dataset.color){
                        currentColor='';
                        console.log(' no color!');
                    }                  
                 }
               
                if(colorStreak === 3){
                    this.winner = currentColor;
                    console.log('you win horizontally');
                    return;
                }
            }
        }
    }

const boardElt = document.getElementById('game-board');
let myGame = new Game(boardElt);
myGame.drawBoard();
const cells = Array.from(document.getElementsByClassName('cell'));

cells.forEach(cell => {
    cell.addEventListener('click', myGame.colorizeCell)
})

// user interaction

