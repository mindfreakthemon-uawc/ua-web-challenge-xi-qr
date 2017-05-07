import { LifeArray } from './life-array.class';
import { LifeGrid } from './life-grid.class';
import { LifeControls } from './life-controls.class';
import { LifeClock } from './life-clock.class';

let root = document.getElementById('root');
root.innerHTML = templates.canvas();

let canvas = root.querySelector('canvas');

let array = new LifeArray();
let grid = new LifeGrid(array, canvas);
let clock = new LifeClock(array, grid);

let controls = new LifeControls(root, array, grid, clock);
