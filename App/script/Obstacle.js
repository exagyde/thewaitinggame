const OBSTACLES = [
    {
        x: window.innerWidth, y: (window.innerHeight/2 - 10), width: 20, height: 20, type: 1
    },
    {
        x: window.innerWidth, y: (window.innerHeight/2 - 10), width: 40, height: 60, type: 1
    },
    {
        x: window.innerWidth, y: (window.innerHeight/2 - 120), width: 50, height: 20, type: 2
    },
    {
        x: window.innerWidth, y: (window.innerHeight/2 - 10), width: 60, height: 20, type: 3
    }
];

class Obstacle {
    constructor({ x, y, width, height, type }) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.width = width ?? 10;
        this.height = height ?? 20;
        this.type = type ?? 1;
    }

    move(x, y) {
        this.x += x;
        this.y += y;
    }
}

// const OBSTACLES = [
//     new Obstacle({
//         x: window.innerWidth, y: (window.innerHeight/2 - 10),
//         width: 20, height: 20, type: 1
//     }),
//     new Obstacle({
//         x: window.innerWidth, y: (window.innerHeight/2 - 10),
//         width: 40, height: 60, type: 1
//     }),
//     new Obstacle({
//         x: window.innerWidth, y: (window.innerHeight/2 - 120),
//         width: 50, height: 20, type: 2
//     }),
//     new Obstacle({
//         x: window.innerWidth, y: (window.innerHeight/2 - 10),
//         width: 60, height: 20, type: 3
//     })
// ];

export { OBSTACLES, Obstacle };