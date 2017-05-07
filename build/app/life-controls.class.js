"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const life_library_util_1 = require("./life-library.util");
class LifeControls {
    constructor(root, array, grid, clock) {
        this.root = root;
        this.array = array;
        this.grid = grid;
        this.clock = clock;
        this.interactiveBlock = true;
        this.updateBlock = false;
        this.stableFlag = false;
        this.godMode = false;
        this.states = [];
        this.grid.canvas.addEventListener('tick', (e) => this.handleTick(e));
        this.subscribeOnElement('mousedown', 'input, button', (e) => this.handleInputMouseDown());
        document.addEventListener('mouseup', () => this.handleInputMouseUp());
        this.grid.canvas.addEventListener('mousedown', () => this.handleMouseDown());
        document.addEventListener('mouseup', () => this.handleMouseUp());
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.grid.canvas.addEventListener('wheel', (e) => this.handleMouseWheel(e));
        this.subscribeOnElement('click', '#start', (e) => this.handleStart());
        this.subscribeOnElement('click', '#stop', (e) => this.handleStop());
        this.subscribeOnElement('click', '#reset', (e) => this.handleReset());
        this.subscribeOnElement('change', '#interval', (e) => this.handleIntervalChange());
        this.subscribeOnElement('input', '#interval', (e) => this.handleIntervalChangeInstantly());
        this.subscribeOnElement('click', '#resetView', (e) => this.handleResetView());
        this.subscribeOnElement('click', '#state-save', (e) => this.handleSaveState());
        this.subscribeOnElement('click', '#state-clear', () => this.handleClearStates());
        this.subscribeOnElement('click', '.state-restore', (e) => this.handleStateRestore(e));
        this.subscribeOnElement('click', '.state-remove', (e) => this.handleStateRemove(e));
        this.subscribeOnElement('click', '#next', (e) => this.handleNextStep());
        this.subscribeOnElement('click', '#prev', (e) => this.handlePrevStep());
        this.subscribeOnElement('click', '.god-mode', (e) => this.handleGodMode(e));
        this.subscribeOnElement('click', '#randomize', () => this.handleRandomize());
        this.subscribeOnElement('click', '.auto-expansion', (e) => this.handleAutoExpansionToggle(e));
        this.grid.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.updateUI();
    }
    handleTick(e) {
        let changed = e.detail.changed;
        if (changed.length === 0) {
            this.stableFlag = true;
            this.clock.stop();
        }
        this.updateUI();
    }
    handleAutoExpansionToggle(e) {
        let target = e.target;
        this.array.expandBlock = target.dataset.type === 'off';
        this.updateUI();
    }
    // -- god mode --
    handleCanvasClick(e) {
        if (!this.godMode) {
            return;
        }
        let leftBorderWidth = parseInt(getComputedStyle(e.target).borderLeftWidth, 10) | 0;
        let [x, y] = this.grid.getPoint(e.layerX - leftBorderWidth, e.layerY);
        if (x === -1 || y === -1) {
            return;
        }
        let selector = this.root.querySelector('#create-object-type');
        let action = selector.value;
        life_library_util_1.LifeLibrary[action + 'Draw'](x, y, this.array);
        this.grid.redraw();
    }
    handleGodMode(e) {
        let target = e.target;
        this.godMode = target.dataset.type === 'on';
        this.updateUI();
    }
    handleRandomize() {
        this.array.randomize();
        this.grid.redraw();
    }
    // -- /god mode --
    // -- ui --
    handleInputMouseDown() {
        this.updateBlock = true;
    }
    handleInputMouseUp() {
        this.updateBlock = false;
    }
    // -- /ui --
    // -- step --
    handleNextStep() {
        this.clock.tick();
    }
    handlePrevStep() {
        this.clock.untick();
        this.grid.redraw();
    }
    // -- /step --
    // -- states --
    handleSaveState() {
        this.states.push({
            history: [...this.clock.history],
            size: this.array.size,
            array: [...this.array]
        });
        this.updateUI();
    }
    handleClearStates() {
        this.states = [];
        this.updateUI();
    }
    handleStateRestore(e) {
        let target = e.target;
        let state = this.states[+target.dataset.index];
        this.array.splice(0, this.array.length, ...state.array);
        this.array.size = state.size;
        this.clock.history = [...state.history];
        this.updateUI();
        this.grid.redraw();
    }
    handleStateRemove(e) {
        let target = e.target;
        this.states.splice(+target.dataset.index, 1);
        this.updateUI();
    }
    // -- /states --
    // -- view --
    handleMouseMove(e) {
        if (this.interactiveBlock) {
            return;
        }
        this.grid.originX += e.movementX;
        this.grid.originY += e.movementY;
        this.grid.redraw();
    }
    handleMouseWheel(e) {
        e.preventDefault();
        this.grid.scale *= 1 + e.wheelDelta / 10000;
        this.grid.redraw();
    }
    handleMouseUp() {
        this.interactiveBlock = true;
    }
    handleMouseDown() {
        this.interactiveBlock = false;
    }
    handleResetView() {
        this.grid.reset();
    }
    // -- /view --
    // -- time --
    handleStart() {
        this.stableFlag = false;
        this.clock.start();
    }
    handleStop() {
        this.clock.stop();
        this.updateUI();
    }
    handleReset() {
        this.array.reset();
        this.clock.reset();
        this.grid.redraw();
        this.updateUI();
    }
    // -- /time --
    // -- speed --
    handleIntervalChange() {
        let interval = this.root.querySelector('#interval');
        this.clock.speed = interval.valueAsNumber;
        if (this.clock.isRunning()) {
            this.clock.stop();
            this.clock.start();
        }
        this.updateUI();
    }
    handleIntervalChangeInstantly() {
        let output = this.root.querySelector('#interval-label');
        let interval = this.root.querySelector('#interval');
        output.value = interval.value;
    }
    // -- /speed --
    updateUI() {
        if (this.updateBlock) {
            return;
        }
        this.root.querySelector('#controls').innerHTML = templates.controls(this);
    }
    subscribeOnElement(event, selector, handler) {
        this.root
            .addEventListener(event, (e) => {
            let target = e.target;
            if (target.matches(selector)) {
                handler(e);
            }
        });
    }
}
exports.LifeControls = LifeControls;
//# sourceMappingURL=life-controls.class.js.map