// Game turn global variable
var turn = true;

// Gameboard module
const gameBoard = (()=>{
    let gameBoardArray=['','','','','','','','',''];
    addMark = function(mark, position) {
        if(gameBoardArray[position]==''){
            gameBoardArray[position] = mark;
        }   
    }
    clearBoard = function(){
        gameBoardArray = ['','','','','','','','',''];
    }
    getBoard = () => {return gameBoardArray};
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

// Creating the game logic
const controlFlow = (()=>{
    let player1; 
    let player2;
    let currentPlayer;
    let containerItems = document.querySelectorAll('.container-item');
    const newGame = function(){
        player1 = Player('Player 1', 'X');
        player2 = Player('Player 2', 'O');
        currentPlayer = player1;
        displayController.messageInfo[0].innerHTML = `${currentPlayer.getName()} is your turn`;
    }
    const changeTurn = function(){
        turn=!turn;
    }
  
    const placeMark = function(){
        containerItems.forEach(item => {
            item.addEventListener('click',handleMarking)
        });
    }

    function handleMarking(event){
            console.log(event);
            let position = event.target.id;
            let mark = currentPlayer.getMark();
            let tempGameboard =gameBoard.getBoard();
            // Avoid marking the same square twice
            if(tempGameboard[position]==''){
                gameBoard.addMark(mark, position);
                // Saving players' moves on board
                if(currentPlayer==player1){
                    player1.positions.push(position);
                    console.log(player1.positions);
                }else{
                    player2.positions.push(position);
                }
                displayController.renderContent();
                changeTurn();
                nextTurn();
            }
    }

    const nextTurn = function(){
        if(turn==true){
            currentPlayer = player1;
        }else{
            currentPlayer = player2;
        }
        displayController.messageInfo[0].innerHTML = `${currentPlayer.getName()} is your turn`;
        winRound();
    }

    const winRound = function(){
        const NUMBER_OF_SQUARES = 3
        // Create a variable to check if the game is a tie
        let tieFlag = false;
        const winCombinations = ['012', '345', '678', '036', '147', '258', '048', '246'];
        let player1Combinations = combine(player1.positions.sort(), NUMBER_OF_SQUARES);
        let player2Combinations = combine(player2.positions.sort(), NUMBER_OF_SQUARES);
        // Check if player1's combinations or player2's
        // match the win combinations and display the winner
        player1Combinations.forEach(combination => {
            if(winCombinations.find(element => element == combination.join(''))!==undefined){
                // console.log(combination.join(''));
                displayController.messageInfo[0].innerHTML = 'Player 1 won the round!';
                player1.score++;
                tieFlag = true;
                stopGame();
            }
        });
        player2Combinations.forEach(combination => {
            if(winCombinations.find(element => element == combination.join(''))!==undefined){
                // console.log(combination.join(''));
                displayController.messageInfo[0].innerHTML = 'Player 2 won the round!';
                player2.score++;
                tieFlag = true
                stopGame();
            }
        });
        // Check if match is a tie
        if(player1.positions.length + player2.positions.length == 9 && tieFlag == false){
            displayController.messageInfo[0].innerHTML = "It's a tie!";
            stopGame();
        }else if(player1.positions.length + player2.positions.length == 9 && tieFlag == true){
            tieFlag = true;
        }
        displayController.updateScore(player1, player2);
    }

    // 
    // From stackoverflow
    // Gives all possible combinations, given an array 'a', with
    // a minimum length 'min'
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

    const resetGame = function(){
        player1.score=0;
        player1.positions=[];
        player2.score=0;
        player2.positions=[];
        gameBoard.clearBoard();
        displayController.updateScore(player1, player2);
        displayController.clearDisplay();
        displayController.messageInfo[0].innerHTML = "Resetting the game. Click 'Play' button to play again."
    }

    const restartGame = function(){
        player1.positions=[];
        player2.positions=[];
        gameBoard.clearBoard();
        displayController.clearDisplay();
        currentPlayer = player1;
        turn = true;
        displayController.messageInfo[0].innerHTML = `New round. ${currentPlayer.getName()} is your turn.`
    }

    const stopGame = function(){
        containerItems.forEach(item =>{
            item.removeEventListener('click', handleMarking, false);
        })
    }
    return {newGame, placeMark, winRound, restartGame, resetGame};
})();

// Display Controller module
// UI-DOM manipulation
const displayController =(()=>{
    const playButton = document.getElementById('play');
    const resetGameButton = document.getElementById('reset');
    let containerItems = document.querySelectorAll('.container-item');
    let player1Score = document.getElementById('score1');
    let player2Score = document.getElementById('score2');
    let messageInfo = document.getElementsByClassName('display-message');
    
    const renderContent = function(){
        let gameBoardArray = gameBoard.getBoard();
        for(let i=0; i<containerItems.length; i++){
            containerItems[i].textContent = gameBoardArray[i];
        }
    }
    const startGame = function(event){
        if(playButton.innerHTML == "Play"){
            controlFlow.newGame();
        }else{
            controlFlow.restartGame();
            console.log(event);
        }
        playButton.innerHTML = "Restart Game";
        controlFlow.placeMark();
        renderContent();
    }
    const clearDisplay = function(){
        containerItems.forEach(containerItem =>{
            containerItem.textContent = '';
        })
    }
    const resetGame = function(event){
        console.log(event);
        controlFlow.resetGame();
        playButton.innerHTML = "Play";
    }
    const updateScore = function(player1, player2){
        player1Score.textContent = player1.score;
        player2Score.textContent = player2.score;
    }

    // Click play button
    playButton.addEventListener('click', startGame);
    // Click reset button
    resetGameButton.addEventListener('click', resetGame);
    return {renderContent, clearDisplay, updateScore, messageInfo}
})();

