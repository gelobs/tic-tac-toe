// Gameboard module
const gameBoard = ((mark, index)=>{
    const gameboard=['', '', '', '','','','','',''];
    gameboard[index]=mark;
    return gameboard;
})();

// Display Controller module
const displayController =(()=>{
    let id;
    let containerItems = document.querySelectorAll('.container-item');
    for(let i=0; i < containerItems.length; i++){
        containerItems[i].addEventListener('click', (e) => {
            console.log(e.target.id);
            id = e.target.id;
        }) 
    }
    return id;
})();

// Player 
const Player = (name, mark) => {
    let id = displayController;
    console.log(id);
    return {name, mark, id};
}

// render function
function render(player){
    var containerItems = document.querySelectorAll('.container-item');
    var gameboard = gameBoard(player.mark, player.id);
    for(var i=0; i < containerItems.length; i++){
        containerItems[i].textContent = gameboard[i];
    }
}
const player1 = Player('Miranda', 'O');
const player2 = Player('Sotos', 'X');


render(player1);

