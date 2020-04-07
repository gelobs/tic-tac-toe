// Game turn global variable
var turn = true;


// Gameboard module
const gameBoard = (()=>{
    const gameboard=['', '', '', '','','','','',''];
    addMark = function(mark, id) {
        gameboard[id] = mark;
    }
    gameOver = function(){
        
    }
    return {gameboard, addMark};
})();


// Player 
const Player = (name, mark) => {
    playerMove = function(){
        var id;
        let containerItems = document.querySelectorAll('.container-item');
        for(let i=0; i < containerItems.length; i++){
            containerItems[i].addEventListener('click', (e) => {
                id = e.target.id;
                // Prevent marking an existing mark on board
                if(gameBoard.gameboard[id]==''){
                    gameBoard.addMark(mark, id);
                    console.log(e.target.id);
                }
                render();
            }); 
        }
    }
    return {name, mark, playerMove};
}

// render function
function render(){
    var containerItems = document.querySelectorAll('.container-item');
    var gameboard = gameBoard.gameboard;
    for(var i=0; i < containerItems.length; i++){
        containerItems[i].textContent = gameboard[i];
    }
}

const controlFlow = (()=>{
    const player1 = Player('Miranda', 'O');
    const player2 = Player('Sotos', 'X');
    changeTurn = function(){
        turn = !turn;
    }
    selectPlayer = function(){
        if (turn == true) {
            alert(`${player1.name} make your move`);
            player1.playerMove();
            controlFlow.changeTurn;
        }else{
            alert(`${player2.name} make your move`);
            player2.playerMove();
            controlFlow.changeTurn;
        }
        // turn = !turn;
    }
    return {selectPlayer, changeTurn};
})();


// Display Controller module
const displayController =(()=>{
    controlFlow.selectPlayer();
})();

