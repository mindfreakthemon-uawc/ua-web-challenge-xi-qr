import { LifeGrid } from './life-grid.class';
import { LifeClock } from './life-clock.class';
import { LifeArray } from './life-array.class';
import { LifeLibrary } from './life-library.util';

export class LifeControls {
    interactiveBlock: boolean = true;

    updateBlock: boolean = false;

    stableFlag: boolean = false;

    godMode: boolean = false;

    states: any[] = [];

    constructor(
        public root: HTMLElement,
        public array: LifeArray,
        public grid: LifeGrid,
        public clock: LifeClock) {

        this.grid.canvas.addEventListener('tick', (e: CustomEvent) => this.handleTick(e));

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

    handleTick(e: CustomEvent): void {
        let changed = e.detail.changed;

        if (changed.length === 0) {
            this.stableFlag = true;

            this.clock.stop();
        }

        this.updateUI();
    }

    handleAutoExpansionToggle(e: MouseEvent): void {
        let target = e.target as HTMLButtonElement;

        this.array.expandBlock = target.dataset.type === 'off';

        this.updateUI();
    }

    // -- god mode --

    handleCanvasClick(e): void {
        if (!this.godMode) {
            return;
        }

        let leftBorderWidth = parseInt(getComputedStyle(e.target).borderLeftWidth, 10) | 0;

        let [x, y] = this.grid.getPoint(e.layerX - leftBorderWidth, e.layerY);

        if (x === -1 || y === -1) {
            return;
        }

        let selector = this.root.querySelector('#create-object-type') as HTMLSelectElement;
        let action = selector.value;

        LifeLibrary[action + 'Draw'](x, y, this.array);

        this.grid.redraw();
    }

    handleGodMode(e: MouseEvent): void {
        let target = e.target as HTMLButtonElement;

        this.godMode = target.dataset.type === 'on';

        this.updateUI();
    }

    handleRandomize(): void {
        this.array.randomize();

        this.grid.redraw();
    }

    // -- /god mode --

    // -- ui --

    handleInputMouseDown(): void {
        this.updateBlock = true;
    }

    handleInputMouseUp(): void {
        this.updateBlock = false;
    }

    // -- /ui --

    // -- step --

    handleNextStep(): void {
        this.clock.tick();
    }

    handlePrevStep(): void {
        this.clock.untick();

        this.grid.redraw();
    }

    // -- /step --

    // -- states --

    handleSaveState(): void {
        this.states.push({
            history: [...this.clock.history],
            size: this.array.size,
            array: [...this.array]
        });

        this.updateUI();
    }

    handleClearStates(): void {
        this.states = [];

        this.updateUI();
    }

    handleStateRestore(e): void {
        let target = e.target as HTMLButtonElement;
        let state = this.states[+target.dataset.index];

        this.array.splice(0, this.array.length, ...state.array);
        this.array.size = state.size;
        this.clock.history = [...state.history];

        this.updateUI();
        this.grid.redraw();

    }

    handleStateRemove(e): void {
        let target = e.target as HTMLButtonElement;

        this.states.splice(+target.dataset.index, 1);

        this.updateUI();
    }

    // -- /states --

    // -- view --

    handleMouseMove(e: MouseEvent): void {
        if (this.interactiveBlock) {
            return;
        }

        this.grid.originX += e.movementX;
        this.grid.originY += e.movementY;
        this.grid.redraw();
    }

    handleMouseWheel(e: MouseWheelEvent): void {
        e.preventDefault();

        this.grid.scale *= 1 + e.wheelDelta / 10000;
        this.grid.redraw();
    }

    handleMouseUp(): void {
        this.interactiveBlock = true;
    }

    handleMouseDown(): void {
        this.interactiveBlock = false;
    }

    handleResetView(): void {
        this.grid.reset();
    }

    // -- /view --

    // -- time --

    handleStart(): void {
        this.stableFlag = false;

        this.clock.start();
    }

    handleStop(): void {
        this.clock.stop();

        this.updateUI();
    }

    handleReset(): void {
        this.array.reset();
        this.clock.reset();

        this.grid.redraw();
        this.updateUI();
    }

    // -- /time --

    // -- speed --

    handleIntervalChange(): void {
        let interval = this.root.querySelector('#interval') as HTMLInputElement;

        this.clock.speed = interval.valueAsNumber;

        if (this.clock.isRunning()) {
            this.clock.stop();
            this.clock.start();
        }

        this.updateUI();
    }

    handleIntervalChangeInstantly(): void {
        let output = this.root.querySelector('#interval-label') as HTMLOutputElement;
        let interval = this.root.querySelector('#interval') as HTMLInputElement;

        output.value = interval.value;
    }

    // -- /speed --

    updateUI(): void {
        if (this.updateBlock) {
            return;
        }

        this.root.querySelector('#controls').innerHTML = templates.controls(this);
    }

    protected subscribeOnElement(event: string, selector: string, handler: Function): void {
        this.root
            .addEventListener(event, (e) => {
                let target = e.target as HTMLElement;

                if (target.matches(selector)) {
                    handler(e);
                }
            });
    }
}