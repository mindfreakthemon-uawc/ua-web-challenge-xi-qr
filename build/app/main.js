"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const life_array_class_1 = require("./life-array.class");
const life_grid_class_1 = require("./life-grid.class");
const life_controls_class_1 = require("./life-controls.class");
const life_clock_class_1 = require("./life-clock.class");
let root = document.getElementById('root');
root.innerHTML = templates.canvas();
let canvas = root.querySelector('canvas');
let array = new life_array_class_1.LifeArray();
let grid = new life_grid_class_1.LifeGrid(array, canvas);
let clock = new life_clock_class_1.LifeClock(array, grid);
let controls = new life_controls_class_1.LifeControls(root, array, grid, clock);
//# sourceMappingURL=main.js.map