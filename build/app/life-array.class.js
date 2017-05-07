"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_SIZE = 100;
class LifeArray extends Array {
    constructor() {
        super();
        this.size = DEFAULT_SIZE;
        this.expandBlock = true;
        this.length = Math.pow(this.size, 2);
        this.fill(false);
    }
    getCell(x, y) {
        if (x < 0 || y < 0) {
            return false;
        }
        return this[x * this.size + y];
    }
    setCell(x, y, value) {
        if (x < 0 || y < 0) {
            return;
        }
        this[x * this.size + y] = value;
    }
    getNeighboursSum(x, y) {
        let neighbours = [
            [x - 1, y - 1], [x - 1, y], [x - 1, y + 1],
            [x, y - 1], /* [x, y], */ [x, y + 1],
            [x + 1, y - 1], [x + 1, y], [x + 1, y + 1]
        ];
        return neighbours
            .map(([x, y]) => this.getCell(x, y))
            .reduce((sum, v) => sum + (v ? 1 : 0), 0);
    }
    getCoordinates(index) {
        let x = Math.floor(index / this.size);
        let y = index % this.size;
        return [x, y];
    }
    forEachCell(fn, thisArg) {
        this
            .forEach((isAlive, index) => {
            let [x, y] = this.getCoordinates(index);
            fn.call(thisArg, isAlive, x, y, index, this);
        });
    }
    tick() {
        let changed = [];
        let minX = this.size;
        let minY = this.size;
        let maxX = 0;
        let maxY = 0;
        this
            .forEach((value, index) => {
            let [x, y] = this.getCoordinates(index);
            let sum = this.getNeighboursSum(x, y);
            if (sum < 2 || sum > 3) {
                if (value) {
                    changed.push({ x, y, isAlive: false });
                }
                return;
            }
            else if (sum === 3) {
                if (!value) {
                    changed.push({ x, y, isAlive: true });
                }
            }
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        });
        for (let { x, y, isAlive } of changed) {
            this.setCell(x, y, isAlive);
        }
        if (minX === 0 || minY === 0 || maxX >= this.size - 1 || maxY >= this.size - 1) {
            this.expandSpace();
        }
        return changed;
    }
    expandSpace() {
        if (this.expandBlock) {
            return;
        }
        let space = Array.from(Array(this.size + 1), () => false);
        // OLD:
        // expand top and bottom
        // this.push(...space);
        // this.unshift(...space);
        //
        // this.size += 2;
        // expand sides
        for (let i = this.size; i >= 0; i--) {
            this.splice(i * this.size, 0, false, false);
            // OLD:
            // this.splice(i * this.size, 0, false);
            // this.splice((i + 1) * this.size - 2, 0, false);
        }
        // expand top and bottom
        this.push(...space);
        this.unshift(...space);
        this.size += 2;
    }
    reset() {
        this.fill(false);
    }
    randomize() {
        this.splice(0, this.length, ...Array.from(Array(this.length), () => Math.random() > 0.5));
    }
}
exports.LifeArray = LifeArray;
//# sourceMappingURL=life-array.class.js.map