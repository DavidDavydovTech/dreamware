import { Sprite, Texture, Ticker } from 'pixi.js';
// import * as PixiSound from 'pixi-sound';
// import Keyboard from './keyboard';
// const sound = PixiSound.default.sound;

type offset = {
    x: number;
    y: number;
};

export interface DoodleSpriteOptions {
    textureOffset?: offset[] | undefined;
    stopOnLastFrame: boolean;
    destroyOnLoop: boolean;
    swapMS: number;
}

/** @type {import('pixi.js').Sprite}
 * @description The game's method for controlling 'wiggling' sprites.
 */
class DoodleSprite extends Sprite {
    private _destroy;
    protected maxMS: number;
    protected swapMS: number;
    protected trueX: number;
    protected trueY: number;
    protected ticker: Ticker = Ticker.shared;
    protected textureOffsetActive: boolean;
    public offset: offset = { x: 0, y: 0 };
    public destroyOnLoop: boolean;
    public stopOnLastFrame: boolean;
    public textureArray: Texture[];
    public textureOffset: offset[];
    public textureIndex: number;
    public swapQueued: boolean;

    /**
     * @param {object} options
     * @param {import('pixi.js').Texture|[import('pixi.js').Texture]} texture A single texture or array of textures.
     * @param {}
     */
    constructor(
        texture: Texture[],
        { textureOffset, stopOnLastFrame = false, destroyOnLoop = false, swapMS = 500 }: DoodleSpriteOptions = {
            stopOnLastFrame: false,
            destroyOnLoop: false,
            swapMS: 500,
        }
    ) {
        super(texture[0]);
        // We need to keep a refrence to the original destroy method.
        this._destroy = this.destroy;
        // ...and replace it with a wrapper/thunk
        this.destroy = (options) => {
            this.ticker.remove(this._tick);
            this._destroy(options);
        };

        this.trueX = 0;
        this.trueY = 0;
        this.offset = textureOffset && textureOffset[0] ? textureOffset[0] : { x: 0, y: 0 };

        this.maxMS = swapMS;
        this.swapMS = 0;
        this.destroyOnLoop = destroyOnLoop;
        this.stopOnLastFrame = stopOnLastFrame;

        this.textureArray = texture;
        this.textureOffset = textureOffset || [{ x: 0, y: 0 }];
        this.textureOffsetActive = false;
        if (Array.isArray(textureOffset)) {
            this.textureOffsetActive = true;
        }
        this.textureIndex = 0;
        this.swapQueued = false;

        this._init();
    }

    /* tslint:disable-next-line */
    // @ts-ignore
    get y(): number {
        return this.trueY;
    }

    set y(y: number) {
        this.trueY = y;
        this.position.y = this.trueY + this.offset.y;
    }

    /* tslint:disable-next-line */
    // @ts-ignore
    get x(): number {
        return this.trueX;
    }

    set x(x: number) {
        this.trueX = x;
        this.position.x = this.trueX + this.offset.x;
    }

    protected _init = (): void => {
        this.ticker.add(this._tick);
    };

    protected _tick = (): void => {
        this.renderSwap();
    };

    protected renderSwap = (): void => {
        let swapQueued = false;
        if (this.swapMS > this.maxMS) {
            this.swapMS -= this.maxMS;
            if (
                this.stopOnLastFrame === false ||
                this.textureIndex % this.textureArray.length !== this.textureArray.length - 1
            ) {
                this.textureIndex++;
            }
            swapQueued = true;
        }

        if (this.destroyOnLoop && this.textureIndex > this.textureArray.length) {
            this.alpha = 0;
            this.destroy();
            return;
        }

        if (swapQueued === true) {
            const currentIndex = this.textureIndex % this.textureArray.length;
            this.texture = this.textureArray[currentIndex];
            if (this.textureOffsetActive) {
                const offset = this.textureOffset[currentIndex];
                this.offset = offset;
                this.y = this.y;
                this.x = this.x;
            }
        }

        this.swapMS += this.ticker.deltaMS;
    };
}

export default DoodleSprite;
