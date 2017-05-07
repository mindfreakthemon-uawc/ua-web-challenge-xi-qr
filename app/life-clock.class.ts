import { LifeArray, LifeArrayChange } from './life-array.class';
import { LifeGrid } from './life-grid.class';

const DEFAULT_TIME = 500;

export class LifeClock {

    interval: number = -1;

    speed: number = DEFAULT_TIME;

    history: LifeArrayChange[][] = [];

    isRunning(): boolean {
        return this.interval > 0;
    }

    constructor(
        public array: LifeArray,
        public grid: LifeGrid) {

    }

    start(): void {
        this.interval = setInterval(() => this.tick(), this.speed);

        this.tick();

    }

    stop(): void {
        clearInterval(this.interval);

        this.interval = -1;
    }

    reset(): void {
        this.history = [];
    }

    tick(): void {
        let changed = this.array.tick();

        this.grid.clear();
        this.grid.draw();

        this.history.push(changed);

        this.grid.canvas.dispatchEvent(new CustomEvent('tick', {
            detail: { changed }
        }));
    }

    untick(): void {
        let changed = this.history.pop();

        if (!changed) {
            return;
        }

        changed.forEach((change: LifeArrayChange) => this.array.setCell(change.x, change.y, !change.isAlive));

        this.grid.canvas.dispatchEvent(new CustomEvent('tick', {
            detail: { changed }
        }));
    }
}