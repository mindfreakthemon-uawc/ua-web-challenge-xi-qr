import { LifeArray } from './life-array.class';

const CELL_WIDTH = 10;
const DEFAULT_SCALE = 1;

export class LifeGrid {
    context: CanvasRenderingContext2D = this.canvas.getContext('2d');

    scale: number = DEFAULT_SCALE;
    originX: number = 0;
    originY: number = 0;

    get coefficientX(): number {
        return this.canvas.width / this.canvas.clientWidth;
    }

    get coefficientY(): number {
        return this.canvas.height / this.canvas.clientHeight;
    }

    constructor(public array: LifeArray,
                public canvas: HTMLCanvasElement) {
        canvas.width = 500;
        canvas.height = 500;

        this.draw();
    }

    getPoint(layerX: number, layerY: number): [number, number] {
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

    redraw(): void {
        this.clear();
        this.draw();
    }

    draw(): void {
        this.context.save();


        this.context.translate(
            this.originX * this.coefficientX,
            this.originY * this.coefficientY);

        this.context.scale(
            this.scale * this.coefficientX,
            this.scale * this.coefficientY);

        this.drawGrid();
        this.drawState();

        this.context.restore();
    }

    resetTransform(): void {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }

    reset(): void {
        this.scale = DEFAULT_SCALE;
        this.originX = this.originY = 0;

        this.resetTransform();

        this.clear();
        this.draw();
    }

    clear(): void {
        this.context.clearRect(
            -this.canvas.width,
            -this.canvas.height,
            this.canvas.width * 2,
            this.canvas.height * 2);
    }

    drawGrid(): void {
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

    drawState(): void {
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
