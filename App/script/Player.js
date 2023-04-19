class Player {
    constructor({ x, y, width, height }) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.width = width ?? 20;
        this.height = height ?? 20;
        this.rotate = 0;
        this.score = 0;
    }

    move(x, y, rotate) {
        this.x += x;
        this.y += y;
        this.rotate += rotate;
    }

    resetScore() {
        this.score = -1;
    }

    updateScore(score = 1) {
        this.score += score;
    }
}

export { Player };