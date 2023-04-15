import { Obstacle } from "./script/Obstacle.js";
import { Player } from "./script/Player.js";

window.addEventListener("load", load);

let config = null;
const player = new Player({
    x: 50, y: window.innerHeight/2-10-50,
    width: 50, height: 50
});
const obstacles = [];

/* TEST SECTION */
let obs = new Obstacle({
    x: window.innerWidth, y: (window.innerHeight/2 - 10),
    width: 20, height: 20, type: 1
}); // OBS 1
// let obs = new Obstacle({
//     x: window.innerWidth, y: (window.innerHeight/2 - 10),
//     width: 40, height: 60, type: 1
// }); // OBS 2
// let obs = new Obstacle({
//     x: window.innerWidth, y: (window.innerHeight/2 - 120),
//     width: 50, height: 20, type: 2
// }); // OBS 3
// let obs = new Obstacle({
//     x: window.innerWidth, y: (window.innerHeight/2 - 10),
//     width: 60, height: 20, type: 3
// }); // OBS 4

obstacles.push(obs);
/* END TEST */

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

    /* TEST SECTION */
    let context = document.getElementById("screen").getContext("2d");
    let imageData = context.getImageData(player.x, player.y, player.width, player.height).data
    let imageData2 = [];
    for(let i = 0; i < imageData.length; i+=4) {
        imageData2.push(imageData.slice(i, i+4));
    }
    console.log(imageData2);
    obsctacleAnime(obstacles[0]);
    /* END TEST */
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
    canvas.style.backgroundColor = config.secondColor ?? "black";
}

function draw() {
    const canvas = document.getElementById("screen");
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = config.firstColor ?? "white";

    // Platform
    context.fillRect(0, canvas.height/2-10, canvas.width, 20);

    // Obstacle
    obstacles.forEach(obstacle => {
        switch(obs.type) {
            case 2:
                context.fillRect(obs.x, obs.y, obs.width, obs.height);
                break;
            case 3:
                context.beginPath();
                context.moveTo(obs.x, obs.y);
                context.lineTo(obs.x + obs.width/6, obs.y - obs.height);
                context.lineTo(obs.x + obs.width/3, obs.y);
                context.fill();
                context.moveTo(obs.x+obs.width/3, obs.y);
                context.lineTo(obs.x+obs.width/3 + obs.width/6, obs.y - obs.height);
                context.lineTo(obs.x+obs.width/3 + obs.width/3, obs.y);
                context.fill();
                context.moveTo(obs.x+obs.width/3*2, obs.y);
                context.lineTo(obs.x+obs.width/3*2 + obs.width/6, obs.y - obs.height);
                context.lineTo(obs.x+obs.width/3*2 + obs.width/3, obs.y);
                context.fill();
                context.closePath();
                break;
            default:
                context.beginPath();
                context.moveTo(obs.x, obs.y);
                context.lineTo(obs.x + obs.width/2, obs.y - obs.height);
                context.lineTo(obs.x + obs.width, obs.y);
                context.fill();
                context.closePath();
        }
    });

    /* TEST SECTION */
    let imageData = context.getImageData(player.x, player.y, player.width, player.height).data
    let imageData2 = [];
    for(let i = 0; i < imageData.length; i+=4) {
        imageData2.push(imageData.slice(i, i+4));
    }
    imageData2.forEach(data => {
        if(data.some(elmt => elmt != 0)) {
            console.log("contact");
        }
    });
    /* END TEST */

    // Player
    context.save();
    context.translate(player.x+player.width/2, player.y+player.height/2);
    context.rotate((player.rotate * Math.PI) / 180);
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
    if(player.rotate / 45 % 2 != 0) { setTimeout(playerAnime, 30); }
    draw();
}

function obsctacleAnime(obstacle) {
    obstacle.move(-5, 0);
    draw();
    if(obstacle.x+obstacle.width > 0) {
        setTimeout(obsctacleAnime, 15, obstacle);
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