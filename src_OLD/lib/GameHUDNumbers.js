import { Container } from "pixi.js";
import DoodleSprite from "./DoodleSprite";
// import * as PixiSound from 'pixi-sound';
// import Keyboard from './keyboard';
// const sound = PixiSound.default.sound;

/** Class that renders numbers for the HUD */
class GameHUDNumbers extends Container {
    /**
     * Constructor for GameHUDNumbers
     * @param {object} props - The main props for the HUD
     * @param {import('pixi.js').Application} props.app - A refrence to the main app, required.
     * @param {integer} props.timeMod - How much faster/slower the minigame should play (twice as fast = a timeMod of 2).
     * @param {number} props.number - The number that needs to be rendered.
     * @param {number} props.swapMS - The milliseconds to wait until the texture swaps to another variant.
     */
    constructor({ app, timeMod = 1, number = 0, swapMS = 500 }) {
        super();

        switch (true) {
            case !app: {
                throw new Error("Warning app not supplied.");
            }
            case !timeMod: {
                throw new Error("Warning timeMod not supplied.");
            }
            case !number: {
                throw new Error("Warning number not supplied.");
            }
            case !swapMS: {
                throw new Error("Warning swapMS not supplied.");
            }
        }

        this._appReference = app;
        this._tickerReference = app.ticker;

        this.timeMod = timeMod;
        this.swapMS = swapMS;

        this.number = number;

        this._init();
    }

    _init = () => {
        this._initPrepNumber();
        this.number.forEach((number) => this._addNumber(number));
    };

    _initPrepNumber = () => {
        if (typeof this.number === "number" || typeof this.number === "string") {
            this.number = parseInt(this.number).toString();
        }
        if (isNaN(this.number)) {
            throw new Error('Got NaN for "number" in GameHUDNumbersNumbers. Aborting.');
        }
        this.number = this.number.split("");
    };

    _addNumber = (number) => {
        const { _appReference: app, timeMod, swapMS, children } = this;
        const texture = this._convertNumberToTextureArray(number);
        const newNumber = new DoodleSprite({ texture, app, timeMod, swapMS });
        if (children.length > 0) {
            const lastNumber = children[children.length - 1];
            newNumber.x = lastNumber.x + lastNumber.width + 10;
        }
        this.addChild(newNumber);
    };

    _convertNumberToTextureArray = (number) => {
        const {
            _appReference: {
                loader: { resources },
            },
        } = this;
        const {
            zeroA,
            zeroB,
            oneA,
            oneB,
            twoA,
            twoB,
            threeA,
            threeB,
            fourA,
            fourB,
            fiveA,
            fiveB,
            sixA,
            sixB,
            sevenA,
            sevenB,
            eightA,
            eightB,
            nineA,
            nineB,
        } = resources;
        let textureArray = [];

        switch (number) {
            case "0": {
                textureArray = [zeroA.texture, zeroB.texture];
                break;
            }
            case "1": {
                textureArray = [oneA.texture, oneB.texture];
                break;
            }
            case "2": {
                textureArray = [twoA.texture, twoB.texture];
                break;
            }
            case "3": {
                textureArray = [threeA.texture, threeB.texture];
                break;
            }
            case "4": {
                textureArray = [fourA.texture, fourB.texture];
                break;
            }
            case "5": {
                textureArray = [fiveA.texture, fiveB.texture];
                break;
            }
            case "6": {
                textureArray = [sixA.texture, sixB.texture];
                break;
            }
            case "7": {
                textureArray = [sevenA.texture, sevenB.texture];
                break;
            }
            case "8": {
                textureArray = [eightA.texture, eightB.texture];
                break;
            }
            case "9": {
                textureArray = [nineA.texture, nineB.texture];
                break;
            }
            default: {
                throw new Error(`Expected a number 0 - 9 but got ${e}.`);
            }
        }

        return textureArray;
    };
}

export default GameHUDNumbers;
