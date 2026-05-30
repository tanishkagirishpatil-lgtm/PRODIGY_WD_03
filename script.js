const winLine =
document.querySelector(".win-line");

const themeBtn =
document.querySelector(".theme-toggle");
let currentTheme = 0;

const musicBtn =
document.querySelector(".music-toggle");

const volumeSlider =
document.querySelector(".volume-slider");

const muteBtn =
document.querySelector(".mute-btn");

const difficultySelect =
document.querySelector(".difficulty-select");

const playerXInput =
document.querySelector(".player-x-input");

const playerOInput =
document.querySelector(".player-o-input");
  
const achievement =
document.querySelector(".achievement");

const achievementText =
document.querySelector(".achievement-text");

const themes = [

  {
    bg:"#07111f",
    primary:"#00d9ff",
    secondary:"#ff00d4",
    text:"#ffffff",
    glass:"rgba(255,255,255,0.06)"
  },

  {
    bg:"#041b11",
    primary:"#00ff88",
    secondary:"#00cc66",
    text:"#ffffff",
    glass:"rgba(255,255,255,0.05)"
  },

  {
    bg:"#e9eefc",
    primary:"#4f7cff",
    secondary:"#9b5cff",
    text:"#111827",
    glass:"rgba(255,255,255,0.65)"
  }

];


const aiBtn =
document.querySelector(".ai");

const clickSound =
new Audio("assets/sounds/click.mp3");

const winSound =
new Audio("assets/sounds/win.mp3");

const clapSound =
new Audio("assets/sounds/clap.mp3");

const drawSound =
new Audio("assets/sounds/draw.mp3");

const bgMusic =
new Audio("assets/sounds/bg-music.mp3");

bgMusic.loop = true;

bgMusic.volume = 0.4;

const xScore =
document.querySelector("#x-score");

const oScore =
document.querySelector("#o-score");

const drawScore =
document.querySelector("#draw-score");

const cells = document.querySelectorAll(".cell");

const turnIndicator =
document.querySelector(".turn-indicator");

const restartBtn =
document.querySelector(".restart");

const resetScoresBtn =
document.querySelector(".reset-scores");

const winnerModal =
document.querySelector(".winner-modal");

const winnerText =
document.querySelector("#winner-text");

const playAgainBtn =
document.querySelector(".play-again");

let currentPlayer = "X";

let playerXName ="Player X";

let playerOName ="Player O";

let xWins =
localStorage.getItem("xWins")
? parseInt(
    localStorage.getItem("xWins")
  )
: 0;

let oWins =
localStorage.getItem("oWins")
? parseInt(
    localStorage.getItem("oWins")
  )
: 0;

let draws =
localStorage.getItem("draws")
? parseInt(
    localStorage.getItem("draws")
  )
: 0;

xScore.textContent = xWins;
oScore.textContent = oWins;
drawScore.textContent = draws;
let aiMode = false;
let aiDifficulty = "easy";
let musicPlaying = false;

const winningCombinations = [

  [0,1,2],
  [3,4,5],
  [6,7,8],

  [0,3,6],
  [1,4,7],
  [2,5,8],

  [0,4,8],
  [2,4,6]

];

// CLICK EVENTS
cells.forEach(cell => {

  cell.addEventListener(
    "click",
    handleClick
  );

});

function handleClick(e){

  const cell = e.target;

  // Prevent overwrite
  if(cell.textContent !== ""){
    return;
  }

  // Add Symbol
  cell.textContent = currentPlayer;
  clickSound.play();

  // Animation
  cell.classList.add("pop");

  // Neon Colors
  if(currentPlayer === "X"){

   if(!localStorage.getItem(
  "firstWin"
)){

  showAchievement(
    "First Victory"
  );

  localStorage.setItem(
    "firstWin",
    true
  );

} 

    cell.style.color =
getComputedStyle(
document.documentElement
).getPropertyValue("--primary");

  }else{

    cell.style.color =
getComputedStyle(
document.documentElement
).getPropertyValue("--secondary");

  }

  if(checkWinner()){

 // Delay winner popup
setTimeout(() => {

  winnerModal.classList.remove(
    "hidden"
  );

 winnerText.textContent =

currentPlayer === "X"

? `${playerXName} Wins!`

: `${playerOName} Wins!`;

}, 2500);

  // CONFETTI
  confetti({
    particleCount:150,
    spread:90,
    origin:{ y:0.6 }
  });

  winSound.play();
clapSound.currentTime = 0;

clapSound.play();

setTimeout(() => {

  clapSound.pause();

  clapSound.currentTime = 0;

}, 4000);

  // UPDATE SCORE
  if(currentPlayer === "X"){

    xWins++;

 xScore.textContent = xWins;

 localStorage.setItem(
  "xWins",
  xWins
);

  }else{

    oWins++;
    oScore.textContent = oWins;

  }

  disableBoard();

  return;
}

  // DRAW CHECK
 if(checkDraw()){

  winnerModal.classList.remove(
    "hidden"
  );

  winnerText.textContent =
  "It's a Draw!";

 draws++;

drawScore.textContent = draws;

localStorage.setItem(
  "draws",
  draws
);
    drawSound.play();
  return;
}

function randomMove(){

  const emptyCells =
  [...cells].filter(cell => {

    return cell.textContent === "";

  });

  if(emptyCells.length === 0){
    return;
  }

  const randomCell =

  emptyCells[
    Math.floor(
      Math.random() *
      emptyCells.length
    )
  ];

  randomCell.click();

}


function aiMove(){

    if(aiDifficulty === "easy"){

  randomMove();

  return;

}

if(aiDifficulty === "medium"){

  if(Math.random() < 0.5){

    randomMove();

    return;

  }

}

  let bestScore = -Infinity;

  let move;

  cells.forEach((cell,index) => {

    if(cell.textContent === ""){

      cell.textContent = "O";

      let score =
      minimax(cells,false);

      cell.textContent = "";

      if(score > bestScore){

        bestScore = score;

        move = index;

      }

    }

  });

  cells[move].click();

}

function minimax(board,isMaximizing){

  if(checkWinnerForMinimax("O")){
    return 1;
  }

  if(checkWinnerForMinimax("X")){
    return -1;
  }

  if(checkDraw()){
    return 0;
  }

  if(isMaximizing){

    let bestScore = -Infinity;

    cells.forEach(cell => {

      if(cell.textContent === ""){

        cell.textContent = "O";

        let score =
        minimax(board,false);

        cell.textContent = "";

        bestScore =
        Math.max(score,bestScore);

      }

    });

    return bestScore;

  }else{

    let bestScore = Infinity;

    cells.forEach(cell => {

      if(cell.textContent === ""){

        cell.textContent = "X";

        let score =
        minimax(board,true);

        cell.textContent = "";

        bestScore =
        Math.min(score,bestScore);

      }

    });

    return bestScore;

  }

}

function checkWinnerForMinimax(player){

  return winningCombinations.some(
    combination => {

      return combination.every(
        index => {

          return cells[index]
          .textContent === player;

        }
      );

    }
  );

}

  // SWITCH PLAYER
  currentPlayer =
  currentPlayer === "X"
  ? "O"
  : "X";

  turnIndicator.textContent =currentPlayer === "X"

 ? `${playerXName}'s Turn`

 : `${playerOName}'s Turn`;

 if(aiMode && currentPlayer === "O"){

  turnIndicator.textContent =
  "AI is Thinking...";

  setTimeout(() => {

    aiMove();

  }, 700);

}

}

function checkWinner(){

  const winPatterns = [

    // ROWS
    {
      combo:[0,1,2],
      style:{
        width:"100%",
        height:"6px",
        top:"16%",
        left:"0",
        opacity:"1"
      }
    },

    {
      combo:[3,4,5],
      style:{
        width:"100%",
        height:"6px",
        top:"50%",
        left:"0",
        opacity:"1"
      }
    },

    {
      combo:[6,7,8],
      style:{
        width:"100%",
        height:"6px",
        top:"84%",
        left:"0",
        opacity:"1"
      }
    },

    // COLUMNS
    {
      combo:[0,3,6],
      style:{
        width:"6px",
        height:"100%",
        left:"16%",
        top:"0",
        opacity:"1"
      }
    },

    {
      combo:[1,4,7],
      style:{
        width:"6px",
        height:"100%",
        left:"50%",
        top:"0",
        opacity:"1"
      }
    },

    {
      combo:[2,5,8],
      style:{
        width:"6px",
        height:"100%",
        left:"84%",
        top:"0",
        opacity:"1"
      }
    },

    // DIAGONAL LEFT
    {
      combo:[0,4,8],
      style:{
        width:"140%",
        height:"6px",
        top:"50%",
        left:"-20%",
        transform:"rotate(45deg)",
        opacity:"1"
      }
    },

    // DIAGONAL RIGHT
    {
      combo:[2,4,6],
      style:{
        width:"140%",
        height:"6px",
        top:"50%",
        left:"-20%",
        transform:"rotate(-45deg)",
        opacity:"1"
      }
    }

  ];

  for(const pattern of winPatterns){

    const [a,b,c] =
    pattern.combo;

    if(

      cells[a].textContent ===
      currentPlayer &&

      cells[b].textContent ===
      currentPlayer &&

      cells[c].textContent ===
      currentPlayer

    ){

      Object.assign(
        winLine.style,
        pattern.style
      );

      return true;

    }

  }

  return false;

}

function checkDraw(){

  return [...cells].every(cell => {

    return cell.textContent !== "";

  });

}

function disableBoard(){

  cells.forEach(cell => {

    cell.style.pointerEvents =
    "none";

  });

}

function restartGame(){

  cells.forEach(cell => {

    cell.textContent = "";
    cell.classList.remove("win");

    cell.style.pointerEvents =
    "auto";

  });

  currentPlayer = "X";

  turnIndicator.textContent =
  "Player X's Turn";

   winLine.style.opacity = "0";

winLine.style.transform =
"none";
}

restartBtn.addEventListener(
  "click",
  restartGame
);

playAgainBtn.addEventListener(
  "click",
  () => {

    winnerModal.classList.add(
      "hidden"
    );

    restartGame();

  }
);

aiBtn.addEventListener(
  "click",
  () => {

    aiMode = !aiMode;

    if(aiMode){

      aiBtn.textContent =
      "AI: ON";

    }else{

      aiBtn.textContent =
      "AI Mode";

    }

    restartGame();

  }
);

themeBtn.addEventListener(
  "click",
  () => {

    currentTheme++;

    if(currentTheme >= themes.length){
      currentTheme = 0;
    }

    const theme =
    themes[currentTheme];

    document.documentElement
    .style.setProperty(
      "--bg-color",
      theme.bg
    );

    document.documentElement
    .style.setProperty(
      "--primary",
      theme.primary
    );

    document.documentElement
    .style.setProperty(
      "--secondary",
      theme.secondary
      
    );

    document.documentElement
.style.setProperty(
  "--text",
  theme.text
);

 document.documentElement
.style.setProperty(
  "--glass",
  theme.glass
);



loadParticles(currentTheme);

document.body.classList.remove(
  "white-theme"
);

if(currentTheme === 2){

  document.body.classList.add(
    "white-theme"
  );

}

  }
);



const cursorGlow =
document.querySelector(
  ".cursor-glow"
);

document.addEventListener(
  "mousemove",
  e => {

    cursorGlow.style.left =
    e.clientX + "px";

    cursorGlow.style.top =
    e.clientY + "px";

  }
);

function loadParticles(themeIndex){

  // PURPLE CYBER THEME
  if(themeIndex === 0){

    tsParticles.load("particles-js", {

      background:{
        color:{
          value:"transparent"
        }
      },

      interactivity:{

        events:{
          onHover:{
            enable:true,
            mode:"repulse"
          }
        },

        modes:{
          repulse:{
            distance:120
          }
        }

      },

      particles:{

        number:{
          value:200
        },

        color:{
          value:[
            "#00d9ff",
            "#ff00d4"
          ]
        },

        links:{
          enable:true,
          color:"#00d9ff",
          distance:120,
          opacity:0.35
        },

        move:{
          enable:true,
          speed:1.5
        },

        size:{
          value:3
        }

      }

    });

  }

  // GREEN LEAF THEME
  else if(themeIndex === 1){

   tsParticles.load("particles-js", {

  background:{
    color:{
      value:"transparent"
    }
  },

  interactivity:{

    events:{

      onHover:{
        enable:true,
        mode:"repulse"
      }

    },

    modes:{

      repulse:{
        distance:120
      }

    }

  },

  particles:{

    number:{
      value:100
    },

    shape:{
      type:"image",

      image:{
        src:"assets/images/leaf.png",
        width:100,
        height:100
      }

    },

    opacity:{
      value:0.9
    },

    size:{
      value:{
        min:20,
        max:50
      }
    },

    rotate:{
      value:{
        min:0,
        max:360
      },

      animation:{
        enable:true,
        speed:4
      }
    },

    move:{
      enable:true,

      speed:2,

      direction:"bottom",

      random:true,

      straight:false,

      outModes:{
        default:"out"
      }
    }

  }

});

  }

  // WHITE BUBBLE THEME
  else{

    tsParticles.load("particles-js", {

  background:{
    color:{
      value:"transparent"
    }
  },

  interactivity:{

    events:{

      onHover:{
        enable:true,
        mode:"bubble"
      }

    },

    modes:{

      bubble:{
        distance:120,
        size:0,
        duration:0.2,
        opacity:0
      }

    }

  },

  particles:{

    number:{
      value:100
    },

    shape:{
      type:"image",

      image:{
        src:"assets/images/bubble.png",
        width:100,
        height:100
      }

    },

    opacity:{
      value:0.8
    },

    size:{
      value:{
        min:15,
        max:60
      }
    },

    move:{
      enable:true,
      speed:1.2,
      direction:"top",
      random:true,
      outModes:{
        default:"out"
      }
    }

  }

});

  }

}

resetScoresBtn.addEventListener(
  "click",
  () => {

    xWins = 0;
    oWins = 0;
    draws = 0;

    xScore.textContent = 0;
    oScore.textContent = 0;
    drawScore.textContent = 0;

    localStorage.removeItem(
      "xWins"
    );

    localStorage.removeItem(
      "oWins"
    );

    localStorage.removeItem(
      "draws"
    );

  }
);

musicBtn.addEventListener(
  "click",
  () => {

    if(!musicPlaying){

      bgMusic.play();

      musicPlaying = true;

      musicBtn.textContent =
      "🔊";

    }else{

      bgMusic.pause();

      musicPlaying = false;

      musicBtn.textContent =
      "🎵";

    }

  }
);

volumeSlider.addEventListener(
  "input",
  () => {

    bgMusic.volume =
    volumeSlider.value;

  }
);

let muted = false;

muteBtn.addEventListener(
  "click",
  () => {

    muted = !muted;

    bgMusic.muted = muted;

    if(muted){

      muteBtn.textContent =
      "🔇";

    }else{

      muteBtn.textContent =
      "🔊";

    }

  }
);

function showAchievement(text){

  achievementText.textContent =
  text;

  achievement.classList.remove(
    "hidden"
  );

  setTimeout(() => {

    achievement.classList.add(
      "hidden"
    );

  }, 3000);

}

const loader =
document.querySelector(
  ".loader"
);

window.addEventListener(
  "load",
  () => {

    setTimeout(() => {

      loader.classList.add(
        "hidden"
      );

    }, 3000);

  }
);

loadParticles(0);

difficultySelect.addEventListener(
  "change",
  () => {

    aiDifficulty =
    difficultySelect.value;

  }
);

playerXInput.addEventListener(
  "input",
  () => {

    playerXName =

    playerXInput.value ||

    "Player X";

  }
);

playerOInput.addEventListener(
  "input",
  () => {

    playerOName =

    playerOInput.value ||

    "Player O";

  }
);