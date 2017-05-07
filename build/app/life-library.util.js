"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LifeLibrary {
    static pointDraw(x, y, array) {
        let isAlive = array.getCell(x, y);
        array.setCell(x, y, !isAlive);
    }
    static gliderDraw(x, y, array) {
        array.setCell(x, y + 2, true);
        array.setCell(x + 1, y + 2, true);
        array.setCell(x + 1, y, true);
        array.setCell(x + 2, y + 1, true);
        array.setCell(x + 2, y + 2, true);
    }
}
exports.LifeLibrary = LifeLibrary;
//# sourceMappingURL=life-library.util.js.map