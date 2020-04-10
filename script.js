// Game turn global variable
var turn = true;


// Gameboard module
const gameBoard = (()=>{
    let _gameBoardArray=['','','','','','','','',''];
    addMark = function(mark, position) {
        if(_gameBoardArray[position]==''){
            _gameBoardArray[position] = mark;
        }   
    }
    clearBoard = function(){
        _gameBoardArray = ['','','','','','','','',''];
    }
    getBoard = () => {return _gameBoardArray};
    return {getBoard, addMark, clearBoard};
})();


// Player object
const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    let positions = [];
    let score = 0;
    return {getName, getMark, positions, score};
}

const controlFlow = (()=>{
    let player1; 
    let player2;
    let currentPlayer;
    let containerItems = document.querySelectorAll('.container-item');
    const newGame = function(){
        player1 = Player('Player 1', 'X');
        player2 = Player('Player 2', 'O');
        currentPlayer = player1;
        console.log(`${currentPlayer.getName()} is your turn`);
    }
    const _changeTurn = function(){
        turn=!turn;
    }
    // newGame();
    const placeMark = function(){
        containerItems.forEach(item => {
            item.addEventListener('click',(event)=>{
                console.log(event);
                let position = event.target.id;
                let mark = currentPlayer.getMark();
                let tempGameboard =gameBoard.getBoard();
                // Avoid marking the same square twice
                if(tempGameboard[position]==''){
                    gameBoard.addMark(mark, position);
                    // Saving players moves on board
                    if(currentPlayer==player1){
                        player1.positions.push(position);
                        console.log(player1.positions);
                    }else{
                        player2.positions.push(position);
                    }
                    displayController.renderContent();
                    _changeTurn();
                    nextTurn();
                }
            })
        })
    }
    const nextTurn = function(){
        if(turn==true){
            currentPlayer = player1;
        }else{
            currentPlayer = player2;
        }
        console.log(`${currentPlayer.getName()} is your turn`);
        winRound();
    }

    const winRound = function(){
        const NUMBER_OF_SQUARES = 3
        // Create a variable to check if the game is a tie
        let tieFlag = false;
        const winCombinations = ['012', '345', '678', '036', '147', '258', '048', '246'];
        let player1Combinations = combine(player1.positions, NUMBER_OF_SQUARES);
        let player2Combinations = combine(player2.positions, NUMBER_OF_SQUARES);
        // Check if player1's combinations or player2's
        // match the win combinations and display the winner
        player1Combinations.forEach(combination => {
            if(winCombinations.find(element => element == combination.join(''))!==undefined){
                // console.log(combination.join(''));
                alert('Player 1 won the round!');
                player1.score++;
                gameBoard.clearBoard();
                tieFlag = true;
            }
        });
        player2Combinations.forEach(combination => {
            if(winCombinations.find(element => element == combination.join(''))!==undefined){
                // console.log(combination.join(''));
                alert('Player 2 won the round!');
                player2.score++;
                gameBoard.clearBoard()
                tieFlag = true
            }
        });
        // Check if match is a tie
        if(player1.positions.length + player2.positions.length == 9 && tieFlag == false){
            alert("It's a tie");
        }else if(player1.positions.length + player2.positions.length == 9 && tieFlag == true){
            tieFlag = true;
        }
    }
    // 
    // From stackoverflow
    // Gives all possible combinations, given an array a, with
    // a minimum length min
    let combine = function(a, min) {
        var fn = function(n, src, got, all) {
            if (n == 0) {
                if (got.length > 0) {
                    all[all.length] = got;
                }
                return;
            }
            for (var j = 0; j < src.length; j++) {
                fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
            }
            return;
        }
        var all = [];
        for (var i = min; i < a.length; i++) {
            fn(i, a, [], all);
        }
        all.push(a);
        return all;
    }
    // 
    return {newGame, placeMark, winRound};
})();

// Display Controller module
const displayController =(()=>{
    const playButton = document.getElementById('play');
    let containerItems = document.querySelectorAll('.container-item');
    let _gameBoardArray = gameBoard.getBoard();
    const renderContent = function(){
        for(let i=0; i<containerItems.length; i++){
            containerItems[i].textContent = _gameBoardArray[i];
        }
    }
    const startGame = function(){
        controlFlow.newGame();
        controlFlow.placeMark();
        renderContent();
    }
    // Click play button
    playButton.addEventListener('click', startGame);
    return {renderContent, containerItems}
})();

