"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_TIME = 500;
class LifeClock {
    constructor(array, grid) {
        this.array = array;
        this.grid = grid;
        this.interval = -1;
        this.speed = DEFAULT_TIME;
        this.history = [];
    }
    isRunning() {
        return this.interval > 0;
    }
    start() {
        this.interval = setInterval(() => this.tick(), this.speed);
        this.tick();
    }
    stop() {
        clearInterval(this.interval);
        this.interval = -1;
    }
    reset() {
        this.history = [];
    }
    tick() {
        let changed = this.array.tick();
        this.grid.clear();
        this.grid.draw();
        this.history.push(changed);
        this.grid.canvas.dispatchEvent(new CustomEvent('tick', {
            detail: { changed }
        }));
    }
    untick() {
        let changed = this.history.pop();
        if (!changed) {
            return;
        }
        changed.forEach((change) => this.array.setCell(change.x, change.y, !change.isAlive));
        this.grid.canvas.dispatchEvent(new CustomEvent('tick', {
            detail: { changed }
        }));
    }
}
exports.LifeClock = LifeClock;
//# sourceMappingURL=life-clock.class.js.map