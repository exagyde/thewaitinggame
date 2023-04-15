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

export { Obstacle };