"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CELL_WIDTH = 10;
const DEFAULT_SCALE = 1;
class LifeGrid {
    constructor(array, canvas) {
        this.array = array;
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.scale = DEFAULT_SCALE;
        this.originX = 0;
        this.originY = 0;
        canvas.width = 500;
        canvas.height = 500;
        this.draw();
    }
    get coefficientX() {
        return this.canvas.width / this.canvas.clientWidth;
    }
    get coefficientY() {
        return this.canvas.height / this.canvas.clientHeight;
    }
    getPoint(layerX, layerY) {
        let x = -1;
        let y = -1;
        let hitArea = CELL_WIDTH;
        let limit = this.array.size * hitArea * this.scale;
        if (layerX > this.originX && layerX < (this.originX + limit)) {
            x = Math.floor((layerX - this.originX) / hitArea / this.scale);
        }
        if (layerY > this.originY && layerY < (this.originY + limit)) {
            y = Math.floor((layerY - this.originY) / hitArea / this.scale);
        }
        return [x, y];
    }
    redraw() {
        this.clear();
        this.draw();
    }
    draw() {
        this.context.save();
        this.context.translate(this.originX * this.coefficientX, this.originY * this.coefficientY);
        this.context.scale(this.scale * this.coefficientX, this.scale * this.coefficientY);
        this.drawGrid();
        this.drawState();
        this.context.restore();
    }
    resetTransform() {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
    reset() {
        this.scale = DEFAULT_SCALE;
        this.originX = this.originY = 0;
        this.resetTransform();
        this.clear();
        this.draw();
    }
    clear() {
        this.context.clearRect(-this.canvas.width, -this.canvas.height, this.canvas.width * 2, this.canvas.height * 2);
    }
    drawGrid() {
        this.context.save();
        this.context.beginPath();
        for (let i = 0; i <= this.array.size; i++) {
            let offset = i * CELL_WIDTH;
            this.context.moveTo(offset, 0);
            this.context.lineTo(offset, CELL_WIDTH * this.array.size);
            this.context.moveTo(0, offset);
            this.context.lineTo(CELL_WIDTH * this.array.size, offset);
        }
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 1;
        this.context.stroke();
        this.context.restore();
    }
    drawState() {
        this.context.save();
        this.context.fillStyle = 'black';
        this.array.forEachCell((v, x, y) => {
            if (!v) {
                return;
            }
            this.context.moveTo(x * CELL_WIDTH, y * CELL_WIDTH);
            this.context.fillRect(x * CELL_WIDTH, y * CELL_WIDTH, CELL_WIDTH, CELL_WIDTH);
        });
        this.context.restore();
    }
}
exports.LifeGrid = LifeGrid;
//# sourceMappingURL=life-grid.class.js.map