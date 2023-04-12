import { Player } from "./script/Player.js";

window.addEventListener("load", load);

let config = null;
const player = new Player({
    x: 50, y: window.innerHeight/2-10-50,
    width: 50, height: 50
});

async function load() {
    await getConfig();
    setScreen();
    draw();

    document.addEventListener("keypress", onKeyPress);
    document.querySelector("div#command > button").addEventListener("click", () => {
        if(player.rotate / 45 % 2 == 0) { playerAnime(); }
    });
    console.log(player);
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
    context.fillRect(0, canvas.height/2-10, canvas.width, 20);
    context.save();
    context.translate(player.x+player.width/2, player.y+player.height/2);
    context.rotate((player.rotate * Math.PI) / 180);
    context.fillRect(-player.width/2, -player.height/2, player.width, player.height);
    context.restore();
}

let up = true;
function playerAnime() {
    if(up) {
        player.move(0, -10, 5);
    } else {
        player.move(0, 10, 5);
    }
    if(Number.isInteger(player.rotate/45) && player.rotate / 45 % 2 == 0) {
        up = true;
    } else if(Number.isInteger(player.rotate/45)) {
        up = false;
    }
    if(player.rotate / 45 % 2 != 0) { setTimeout(playerAnime, 20); }
    draw();

}

function onKeyPress(event) {
    if(event.keyCode == 32) {
        event.preventDefault();
        if(player.rotate / 45 % 2 == 0) { playerAnime(); }
    }
}