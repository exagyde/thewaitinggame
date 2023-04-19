import { Obstacle, OBSTACLES } from "./script/Obstacle.js";
import { Player } from "./script/Player.js";

window.addEventListener("load", load);

let config = null;
const PARAMS = {
    firstColor: "firstColor",
    secondColor: "secondColor",
    speed: "speed"
};
const player = new Player({
    x: 50, y: window.innerHeight/2-10-50,
    width: 50, height: 50
});
const obstacles = [];
const queryParams = new URLSearchParams(window.location.search);

async function load() {
    await getConfig();
    setScreen();
    draw();

    document.addEventListener("keypress", onKeyPress);
    document.addEventListener("keyup", onKeyUp); 
    document.addEventListener("resize", setScreen);
    document.querySelector("div#command > button").addEventListener("click", () => {
        if(player.rotate / 45 % 2 == 0) { playerAnime(); }
    });
    console.log(player);


    obstacles.push(new Obstacle(OBSTACLES[Math.floor(Math.random()*OBSTACLES.length)]));
    setInterval(() => {
        obstacles.push(new Obstacle(OBSTACLES[Math.floor(Math.random()*OBSTACLES.length)]));
        obsctacleAnime(obstacles[obstacles.length-1]);
    }, obstacles[obstacles.length-1].width*15/5 + (player.width*1.5*Math.floor(Math.random() * (6-2)+2)*15/5) * player.speed);
    obsctacleAnime(obstacles[0]); 
    /* END TEST */

    setInterval(() => {
        player.updateScore(1);
        document.querySelector("div#score > span").textContent = player.score;
    }, 100 * player.speed);
}

async function getConfig() {
    await fetch("./config.json")
        .then(res => res.json())
        .then(json => config = json);
}

function setScreen() {
    const canvas = document.getElementById("screen");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if(queryParams.has(PARAMS.firstColor)) {
        document.querySelector(":root").style.setProperty("--"+PARAMS.firstColor, queryParams.get(PARAMS.firstColor));
    } else {
        document.querySelector(":root").style.setProperty("--"+PARAMS.firstColor, config.firstColor ?? "white");
    }

    if(queryParams.has(PARAMS.secondColor)) {
        document.querySelector(":root").style.setProperty("--"+PARAMS.secondColor, queryParams.get(PARAMS.secondColor));
    } else {
        document.querySelector(":root").style.setProperty("--"+PARAMS.secondColor, config.secondColor ?? "black");
    }

    if(queryParams.has(PARAMS.speed)) {
        player.speed = queryParams.get(PARAMS.speed);
    } else {
        player.speed = config.speed ?? 1;
    }
}

function draw() {
    const canvas = document.getElementById("screen");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    context.clearRect(0, 0, canvas.width, canvas.height);
    if(queryParams.has(PARAMS.firstColor)) {
        context.fillStyle = queryParams.get(PARAMS.firstColor);
    } else {
        context.fillStyle = config.firstColor ?? "white";
    }

    // Platform
    context.fillRect(0, canvas.height/2-10, canvas.width, 20);

    // Obstacles
    obstacles.forEach(obstacle => {
        switch(obstacle.type) {
            case 2:
                context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                break;
            case 3:
                context.beginPath();
                context.moveTo(obstacle.x, obstacle.y);
                context.lineTo(obstacle.x + obstacle.width/6, obstacle.y - obstacle.height);
                context.lineTo(obstacle.x + obstacle.width/3, obstacle.y);
                context.fill();
                context.moveTo(obstacle.x+obstacle.width/3, obstacle.y);
                context.lineTo(obstacle.x+obstacle.width/3 + obstacle.width/6, obstacle.y - obstacle.height);
                context.lineTo(obstacle.x+obstacle.width/3 + obstacle.width/3, obstacle.y);
                context.fill();
                context.moveTo(obstacle.x+obstacle.width/3*2, obstacle.y);
                context.lineTo(obstacle.x+obstacle.width/3*2 + obstacle.width/6, obstacle.y - obstacle.height);
                context.lineTo(obstacle.x+obstacle.width/3*2 + obstacle.width/3, obstacle.y);
                context.fill();
                context.closePath();
                break;
            default:
                context.beginPath();
                context.moveTo(obstacle.x, obstacle.y);
                context.lineTo(obstacle.x + obstacle.width/2, obstacle.y - obstacle.height);
                context.lineTo(obstacle.x + obstacle.width, obstacle.y);
                context.fill();
                context.closePath();
        }
    });

    // Player
    context.save();
    context.translate(player.x+player.width/2, player.y+player.height/2);
    context.rotate((player.rotate * Math.PI) / 180);

    /* TEST SECTION */
    let imageData = context.getImageData(player.x, player.y, player.width, player.height).data
    let imageData2 = [];
    for(let i = 0; i < imageData.length; i+=4) {
        imageData2.push(imageData.slice(i, i+4));
    }
    imageData2.forEach(data => {
        if(data.some(elmt => elmt != 0)) {
            //window.location.reload();
            player.resetScore();
            //obstacles.splice(0, obstacles.length);
            // console.log(obstacles);
            // obstacles.push(new Obstacle(OBSTACLES[Math.floor(Math.random()*OBSTACLES.length)]));
            // obsctacleAnime(obstacles[0]); 
        }
    });
    /* END TEST */

    context.fillRect(-player.width/2, -player.height/2, player.width, player.height);
    context.restore();
}

let up = true;
function playerAnime() {
    if(up) {
        player.move(0, -15, 5);
    } else {
        player.move(0, 15, 5);
    }
    if(Number.isInteger(player.rotate/45) && player.rotate / 45 % 2 == 0) {
        up = true;
    } else if(Number.isInteger(player.rotate/45)) {
        up = false;
    }
    if(player.rotate / 45 % 2 != 0) { setTimeout(playerAnime, 30 * player.speed); }
    draw();
}

function obsctacleAnime(obstacle) {
    obstacle.move(-5, 0);
    draw();
    if(obstacle.x+obstacle.width > 0) {
        setTimeout(obsctacleAnime, 15 * player.speed, obstacle);
    } else {
        obstacles.splice(obstacles.indexOf(obstacle), 1);
    }
}

function onKeyPress(event) {
    if(event.keyCode == 32) {
        event.preventDefault();
        const button = document.querySelector("div#command > button");
        button.classList.add("active");
        if(player.rotate / 45 % 2 == 0) { playerAnime(); }
    }
}

function onKeyUp(event) {
    if(event.keyCode == 32) {
        event.preventDefault();
        const button = document.querySelector("div#command > button");
        button.classList.remove("active");
    }
}