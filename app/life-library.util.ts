import { LifeArray } from './life-array.class';

export class LifeLibrary {

    static pointDraw(x: number, y: number, array: LifeArray): void {
        let isAlive = array.getCell(x, y);

        array.setCell(x, y, !isAlive);
    }

    static gliderDraw(x: number, y: number, array: LifeArray): void {
        array.setCell(x, y + 2, true);
        array.setCell(x + 1, y + 2, true);
        array.setCell(x + 1, y, true);
        array.setCell(x + 2, y + 1, true);
        array.setCell(x + 2, y + 2, true);
    }
}