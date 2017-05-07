export interface LifeArrayChange {
    x: number;
    y: number;
    isAlive: boolean;
}

const DEFAULT_SIZE = 100;

export class LifeArray extends Array<boolean> {
    public size: number = DEFAULT_SIZE;

    expandBlock: boolean = true;

    constructor() {
        super();

        this.length = Math.pow(this.size, 2);

        this.fill(false);
    }

    getCell(x: number, y: number): boolean {
        if (x < 0 || y < 0) {
            return false;
        }

        return this[x * this.size + y];
    }

    setCell(x: number, y: number, value: boolean): void {
        if (x < 0 || y < 0) {
            return;
        }

        this[x * this.size + y] = value;
    }

    getNeighboursSum(x: number, y: number): number {
        let neighbours = [
            [x - 1, y - 1], [x - 1, y], [x - 1, y + 1],
            [x, y - 1], /* [x, y], */ [x, y + 1],
            [x + 1, y - 1], [x + 1, y], [x + 1, y + 1]
        ];

        return neighbours
            .map(([x, y]) => this.getCell(x, y))
            .reduce((sum, v) => sum + (v ? 1 : 0), 0);
    }

    getCoordinates(index: number): [number, number] {
        let x = Math.floor(index / this.size);
        let y = index % this.size;

        return [x, y];
    }

    forEachCell(fn: (v: number, x: number, y: number, index: number, array: number[]) => void, thisArg?: any): void {
        this
            .forEach((isAlive, index) => {
                let [x, y] = this.getCoordinates(index);

                fn.call(thisArg, isAlive, x, y, index, this);
            });
    }

    tick(): LifeArrayChange[] {
        let changed: LifeArrayChange[] = [];

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
                } else if (sum === 3) {
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

    expandSpace(): void {
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

    reset(): void {
        this.fill(false);
    }

    randomize(): void {
        this.splice(0, this.length, ...Array.from(Array(this.length), () => Math.random() > 0.5));
    }
}