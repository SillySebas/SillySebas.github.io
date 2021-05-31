//Grabbing The HTML Objects That Need To Be Manipulated Via Code.

//Grabbing Game Board
let game_board_div = document.querySelector(".board")

//Grabbing The Top Display Objects
let player_one_score_h2 = document.querySelector("#player-one-score")
let player_two_score_h2 = document.querySelector("#player-two-score")
let player_turns_h2 = document.querySelector("#player-turns")
let info_display_h1 = document.querySelector("#info-display")

//Grabbing The Bottom Display Objects
let winner_display_h1 = document.querySelector("#winner-display")
let winner_square_display_h2 = document.querySelector("#winner-square-display")

//Creating The Conway Class
//This Class Is Responsible For The Entire Game
class Conway {
  //The Conway Constructor
  constructor() {
    //Initializing The Variables Needed For The Game
    this.size = 0; //How Many Squares Wide The Board Is (Determined After Board Is Created)

    //Player Variables
    this.isPlayerOneTurn = true; //Used To See Whose Turn It Is
    this.playerOneColor = "rgb(256, 0, 0)" //The Color Of Player One's Squares
    this.playerTwoColor = "rgb(0, 0, 256)" //The Color Of Player Two's Squares

    this.playerOneBackgroundColor = "rgb(256, 100, 100)" //The Color Of Player One's Background
    this.playerTwoBackgroundColor = "rgb(100, 100, 256)" //The Color Of Player Two's Background

    this.board_objects = []; //A 2 Dimensional List Of Every Square (HTML Object) In The Board

    this.turns = 0; //The Total Turns Taken By The Players
    this.startingMaxTurns = 12; //The Amount Of Turns Before The Game Actual Starts
    this.maxTurns = 20; //The Amount Of Turns Until The Game Ends

    this.isGameBeginning = true; //Used To See If The Game Is In The Beginning
    this.isGameActive = true; //Used To See If The Game Is Active At All
  }

  //Creates And Inserts The HTML For The Game Board
  createBoardHTML(size) {
    this.size = size; //Finalizes The Board Size
    //Loops Through The Width And Height Of The Board (The Width And Height Equal Size)
    for (let height = 0; height <= size - 1; height++) {
      for (let width = 0; width <= size - 1; width++) {
        //Inserts The Necessary HTML Inside The Board Object
        game_board_div.insertAdjacentHTML("beforeend", "<div class=\"square\" player=\"0\">")
      }
    }
  }
  //Advances The Game After A Player Has Gone
  advanceGame() {
    //Adds 1 To Turn
    this.turns += 1;

    //Calls Update Board Only If Both Players Have Made A Turn
    if (this.turns%2 == 0) this.updateGameBoard(!this.isGameBeginning);

    //Calls Check Turns And Update Top Display
    this.checkTurns();
    this.updateTopDisplay();

    //Updates How Many Neighbors Each Square Displays It Has
    //Loops Through Every Square Of The Board
    for (let height = 0; height <= this.size - 1; height++) {
      for (let width = 0; width <= this.size - 1; width++) 
      {
        //Finds How Many Neighbors The Square We Are Looking At Has
        let neighbors = this.getAmountOfNeighbors(height, width);

        //Changes The Amount Of Neighbors Shown To Be The Total Amount Of Neighbors The Square Has
        this.board_objects[height][width].innerHTML = neighbors.one + neighbors.two
      }
    }
    
  }

  //Finalizes The Game Board By Giving Each Square An Event Listener
  finalizeBoardHTML() {
    //Grabs Every Square In The Game Board
    let unorderedBoard = document.querySelectorAll(".square");

    //Convert The Unordered List Of Squares Into A 2 Dimensional Array
    //Loops Through Every Square
    for (let height = 0; height <= this.size - 1; height++) {
      //Add A New Row To The Board Objects List
      this.board_objects.push( [] )
      for (let width = 0; width <= this.size - 1; width++) {
        //Add The Square To The Correct Position In The Board Objects
        this.board_objects[height].push(unorderedBoard[width*this.size+(height)])
      }
    }

    //Adds An Event Listen For Each Square
    //Iterate Through Each Row
    this.board_objects.forEach((row) => {
      //Iterate Through Each Square In The Row
      row.forEach(square => {
        //Add An Event Listener To The Square For When It's Clicked
        square.addEventListener("click", (obj) => {
          //Check If The Game Is Running
          if(this.isGameActive)
          {
            //If The Square Is Uncolored When Its Clicked
            if (square.style.backgroundColor == "") {
              //Make The Color Of The Square The Correct Color Based On Whoose Turn It Is
              if (this.isPlayerOneTurn) {
                //Make The Square Be Player One's Color
                square.style.backgroundColor = this.playerOneColor;
                //Make The Square Be Player One's
                square.setAttribute("player", "1");
              }
              //If It's Not Player One's Turn
              else {
                //Make The Square Be Player Two's Color
                square.style.backgroundColor = this.playerTwoColor;
                //Make The Square Be Player Two's
                square.setAttribute("player", "2");
              }

              //Make Whose Turn It Is Move To The Next Player
              this.isPlayerOneTurn = !this.isPlayerOneTurn
            }
            //If The Square Is A Player's Colored
            else {
              //Make The Square Die
              //Remove Any Color The Square Has
              square.style.backgroundColor = "";
              //Remove What Player This Square Belongs To
              square.setAttribute("player", "0");

              //Make Whose Turn It Is Move To The Next Player
              this.isPlayerOneTurn = !this.isPlayerOneTurn;
            }
            
            //If It's Now Player One's Turn
            if (this.isPlayerOneTurn) {
              //Change The Background Color To Be Player One's Background Color
              document.body.style.backgroundColor = this.playerOneBackgroundColor;
            }
            //If It's Now Not Player One's Turn
            else {
              //Change The Background Color To Be Player Two's Background Color
              document.body.style.backgroundColor = this.playerTwoBackgroundColor;
            }

            //Advance The Game Now That A Player Has Finished Their Turn
            this.advanceGame();
          }

        });
      });
    });
  }
  //Checks The Amount Of Turns Taken And Updates Accordingly
  checkTurns() {
    //If The Game Is In The Beginning
    if (this.isGameBeginning) {
      //If The Game Has Reached The End Of The Beginning
      if (this.turns >= this.startingMaxTurns) {
        //Reset The Turns Taken
        this.turns = 0;
        //Make It So The Game Isn't In The Beginning
        this.isGameBeginning = false;

        //Change The Info Display Accordingly
        info_display_h1.innerHTML = "Let The Game Begin!";
      }
    }
    //If The Amount Of Turns Taken Is One Less Then The Max
    else if (this.turns == this.maxTurns - 1) {
      //Change The Info Display Accordingly
      info_display_h1.innerHTML = "Last Round!";
    } 
    //If The Amount Of Turns Has Reached The Max Amount Of Turns
    else if (this.turns >= this.maxTurns) {
      //Stop The Game
      this.isGameActive = false;
      //Call Display Winner
      this.displayWinner();
      //Change The Info Display Accordingly
      info_display_h1.innerHTML = "Game Over!";

    }
  }

  //Displays The Winner After The Game Has Ended
  displayWinner()
  {
    //Find The Amount Of Squares Each Player Has On The Board
    let playerOne = this.getAmmountOfSquaresForPlayer(1);
    let playerTwo = this.getAmmountOfSquaresForPlayer(2);

    //See If Player One Has More Squares
    if(playerOne > playerTwo)
    {
      //Update The Winner Display To Show That Red Won
      winner_display_h1.innerHTML = "The Red Player Has Won!";
      //Update The Winner Square Display To Show How Many More Squares Red Has
      winner_square_display_h2.innerHTML = "Red Has " + (playerOne-playerTwo) + " More Squares";
    } 
    //See If Player Two Has More Squares
    else if (playerOne < playerTwo)
    {
      //Update The Display To Show That Blue Won
      winner_display_h1.innerHTML = "The Blue Player Has Won!";
       //Update The Winner Square Display To Show How Many More Squares Red Has
      winner_square_display_h2.innerHTML = "Blue Has " + (playerTwo-playerOne) + " More Squares!";
    } 
    //If The Game Is A Tie
    else {
      //Update The Display To Show That The Game Tied
      winner_display_h1.innerHTML = "Red And Blue Have Tied!"
    }

    //Make The Game Over Container Visible
    document.querySelector(".gameover-container").style.visibility = "visible"
  }

  //Returns The Amount Of Squares A Player Has
  getAmmountOfSquaresForPlayer(player) {
    let amount = 0 //Create The Amount Of Squares
    //Iterate Through Each Row Of The Game Board
    this.board_objects.forEach((row) => {
      //Iterate Through Each Square Of The Row
      row.forEach(square => {
        //If The Sqaure Belongs To The Requested Player
        if (square.getAttribute("player") == player) {
          //Add One To The Amount Of Squares This Player Has
          amount += 1;
        }
      });
    });

    //Return The Amount Of Squares
    return amount;
  }

  //Updates The Game If The Game Is Active And Is Not In The Beginning
  updateGameBoard(isGameActive) {
    //If The Board Should Be Updated
    if (isGameActive) {
      //Create A List Of Every Change To Game Board
      let newBoard = [];

      //Loop Through Every Square In The Game Board
      for (let height = 0; height <= this.size - 1; height++) {
        for (let width = 0; width <= this.size - 1; width++) 
        {
          //Find The Amount Of Neighbors The Square Has
          let neighbors = this.getAmountOfNeighbors(height, width);
          //Condense The Amount Of Player One And Player Two Neighbors The Square Has
          let totalNeighbors = neighbors.one + neighbors.two;

          //If The Alive Square Has >= To 4 Or <= 1 Neighbors
          if (((totalNeighbors >= 4) || (totalNeighbors <= 1)) && (this.board_objects[height][width].getAttribute("player") != 0)) {
            //Push That This Square Should Die After The Board Updates
            newBoard.push(0)
          }
          //If The Alive Square Has 2 Or 3 Neighbors
          else if (((totalNeighbors == 2) || (totalNeighbors == 3)) && (this.board_objects[height][width].getAttribute("player") != 0)) {
            //Push That This Square Should Stay Alive After The Board Updates
            newBoard.push(Number(this.board_objects[height][width].getAttribute("player")))
          }
          //If The Dead Square Should Become Alive
          else if ((totalNeighbors == 3) && (this.board_objects[height][width].getAttribute("player") == 0)) {
            //If This Square Has More Player One Neighbors
            if (neighbors.one > neighbors.two)
            {
              //Push That This Square Should Become Player One's Square After The Board Updates
              newBoard.push(1)
            }
            //If This Square Has More Player Two Neighbors
            else if(neighbors.one < neighbors.two)
            {
              //Push That This Square Should Become Player Two's Square After The Board Updates
              newBoard.push(2)
            }
          }
          //If The 3 Neighbors Somehow Doesn't Have More Of A Player's Squares
          else
          {
            //Push That This Square Should Die After The Board Updates
            newBoard.push(0)
          }
        }
      }

      //Iterate Through Every Change That The New Board Dictates
      for (let height = 0; height <= this.size - 1; height++) {
        for (let width = 0; width <= this.size - 1; width++) 
        {
          //Set Square To The 1 Dimensional Posisition Of The Current Square
          let square = width + (height * this.size)

          //If The Current Square Should Now Be Dead
          if(newBoard[square] == 0)
          {
            //Make The Current Square's Background Be None
            this.board_objects[height][width].style.backgroundColor = "";
            //Make The Current Square Belong To No Player
            this.board_objects[height][width].setAttribute("player", 0)
          }
          //If The Current Square Should Now Belong To Player One
          else if (newBoard[square] == 1)
          {
            //Make The Current Square's Background Be Player One's Background
            this.board_objects[height][width].style.backgroundColor = this.playerOneColor;
            //Make The Current Square's Belong To Belong To Player One
            this.board_objects[height][width].setAttribute("player", 1)
          }
          //If The Current Square Should Now Belong To Player Two
          else if (newBoard[square] == 2)
          {
            //Make The Current Square's Background Be Player Two's Background
            this.board_objects[height][width].style.backgroundColor = this.playerTwoColor;
            //Make The Current Square's Belong To Belong To Player Two
            this.board_objects[height][width].setAttribute("player", 2)
          }
        }
      }
    }
  }

  //Find And Return The Amount Of Neighbors A Square Has
  getAmountOfNeighbors(height, width) {
    //Create Varibles For The Amount Of Neighbors Of Player One And Two
    let playerOneNeighbors = 0;
    let playerTwoNeighbors = 0;

    //Create A List Of The Neighbors That A Square Has
    let neighborList = [];

    //Get The Neighbor For Each Of The 8 Squares Surrounding The Square
    // # # # 
    // # X #
    // # # # //These Neighbors
    neighborList.push(this.getTopLeft(height, width));
    neighborList.push(this.getTopMid(height, width));
    neighborList.push(this.getTopRight(height, width));

    neighborList.push(this.getLeft(height, width));
    neighborList.push(this.getRight(height, width));

    neighborList.push(this.getBottomLeft(height, width));
    neighborList.push(this.getBottomMid(height, width));
    neighborList.push(this.getBottomRight(height, width));


    //Iterate Through Each Neighbor
    neighborList.forEach((player) => {
      //If The Neighbor Belong's To Player One
      if (player == 1) {
        //Add One To The Total Player One Neighbors
        playerOneNeighbors += 1;
      }
      //If The Neighbor Belong's To Player Two
      else if (player == 2){
        //Add One To The Total Player Two Neighbors
        playerTwoNeighbors += 1;
      }
    })

    //Bundle The Amount Neighbors Of Each Player Into An Object
    let neighbors = {
      "one": playerOneNeighbors, 
      "two": playerTwoNeighbors
    }

    //Return The Neighbors
    return neighbors;
  }

  //The 8 Methods Below Are Used To Find An Indivual Neighbor Around A Given Square
  //Each Method Is Very Similar In How They Work
  //
  //They Follow This Pattern
  //
  //getPositionAroundSquare(height, width) {
  //  //Try To Find A Neighbor Around The Square
  //  try {
  //    //Find The Square That Is Around The Square
  //    //If This Square Belongs To Player One
  //    if (this.board_objects[height+(Relative Posisition)][width+(Relative Posisition)].getAttribute("player") == "1") {
  //      //Return That This Neighbor Belong's To Player One
  //      return 1;
  //    }
  //    //If This Square Belongs To Player Two
  //    else if (this.board_objects[height+(Relative Posisition)][width+(Relative Posisition)].getAttribute("player") == "2") {
  //      //Return That This Neighbor Belong's To Player Two
  //      return 2;
  //    } 
  //    //If This Square Doesn't Belongs To A Player
  //    //else {
  //      //Return That This Neighbor Doesn't Belong To A Player
  //       return 0;
  //     }
  //   }
  //   //If This Square Does Not Have A Neighbor In This Position 
  //   catch{ }
  //}
  
  getTopLeft(height, width) {
    try {
      if (this.board_objects[height-1][width-1].getAttribute("player") == "1") {
        return 1;
      }
      else if (this.board_objects[height-1][width-1].getAttribute("player") == "2") {
        return 2;
      } else {
        return 0;
      }
    } catch{ }
  }

  getTopMid(height, width) {
    try {
      if (this.board_objects[height-1][width].getAttribute("player") == "1") {
        return 1;
      }
      else if (this.board_objects[height-1][width].getAttribute("player") == "2") {
        return 2;
      }
      else {
        return 0;
      }
    } catch { }

  }

  getTopRight(height, width) {
    try {
      if (this.board_objects[height-1][width+1].getAttribute("player") == "1") {
        return 1;
      }
      else if (this.board_objects[height-1][width+1].getAttribute("player") == "2") {
        return 2;
      }
      else {
        return 0;
      }
    } catch { }

  }

  getLeft(height, width) {
    try {
      if (this.board_objects[height][width-1].getAttribute("player") == "1") {
        return 1;
      }
      else if (this.board_objects[height][width-1].getAttribute("player") == "2") {
        return 2;
      }
      else {
        return 0;
      }      
    } catch {}


  }

  getRight(height, width) {
    try {
      if (this.board_objects[height][width+1].getAttribute("player") == "1") {
        return 1;
      }
      else if (this.board_objects[height][width+1].getAttribute("player") == "2") {
        return 2;
      }
      else {
        return 0;
      }
    } catch {}

  }

  getBottomLeft(height, width) {
    try {
      if (this.board_objects[height+1][width-1].getAttribute("player") == "1") {
        return 1;
      }
      else if (this.board_objects[height+1][width-1].getAttribute("player") == "2") {
        return 2;
      }
      else {
        return 0;
      }
    } catch {}

  }

  getBottomMid(height, width) {
    try {
      if (this.board_objects[height+1][width].getAttribute("player") == "1") {
        return 1;
      }
      else if (this.board_objects[height+1][width].getAttribute("player") == "2") {
        return 2;
      }
      else {
        return 0;
      }
    } catch {}

  }

  getBottomRight(height, width) {
    try {
      if (this.board_objects[height+1][width+1].getAttribute("player") == "1") {
        return 1;
      }
      else if (this.board_objects[height+1][width+1].getAttribute("player") == "2") {
        return 2;
      }
      else {
        return 0;
      }
    } catch {}

  }

  //Used To Update The Top Display
  updateTopDisplay() {
    //If The Game Is In The Beginning
    if(this.isGameBeginning)
    {
      //Make The Player Turns H2 Be Out Of (#/#) The Starting Max Turns
      player_turns_h2.innerHTML = this.turns + "/" + this.startingMaxTurns;
    }
    //If The game Is Not In The Beginning
    else
    {
      //Make The Player Turns H2 Be Out Of (#/#) The Max Turns
      player_turns_h2.innerHTML = this.turns + "/" + this.maxTurns;
    }
    
    //Make Player One Score H2 Equal The Amount Of Squares Player One Has On The Board
    player_one_score_h2.innerHTML = this.getAmmountOfSquaresForPlayer("1");
    //Make Player Two Score H2 Equal The Amount Of Squares Player Two Has On The Board
    player_two_score_h2.innerHTML = this.getAmmountOfSquaresForPlayer("2")
  }

}

//Begin The Game (Called From A Button)
function beginGame() {
  //Find Each Value Display And Make It Visible
  document.querySelectorAll(".value-display").forEach(display => {
    display.style.visibility = "";
  })

  //Remove The How To Play HTML In The Game Board
  game_board_div.innerHTML = ""
  //Change The Info Display Accordingly
  info_display_h1.innerHTML = "Place Your Starting Army!";

  //Call Create Board HTML
  board.createBoardHTML(10)
  //Call Finilize Board HTML
  board.finalizeBoardHTML()
  //Call Update Top Display
  board.updateTopDisplay()

  //Remove The Background Image
  document.body.style.backgroundImage = "";
  //Set The Background Color To Player One's Background Color
  document.body.style.backgroundColor = board.playerOneBackgroundColor;

}

//Find Each Value Display And Make Them Invisible
document.querySelectorAll(".value-display").forEach(display => {
  display.style.visibility = 'hidden';
})

//Create A New Conway Class
const board = new Conway()