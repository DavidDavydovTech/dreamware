import { Container } from "pixi.js";
import GameHUD from "./GameHUD";
// import * as PixiSound from 'pixi-sound';
// import Keyboard from './keyboard';
// const sound = PixiSound.default.sound;

class MiniGameController extends Container {
    constructor({ difficulty = 1, maxDifficulty = 3, textureArray = [] }) {
        super();

        switch (true) {
            case !app: {
                throw new Error("Warning app not supplied.");
            }
            case !timeMod: {
                throw new Error("Warning timeMod not supplied.");
            }
            case !MGArray: {
                throw new Error("Warning update not supplied.");
            }
            case !MGBoss: {
                throw new Error("Warning update not supplied.");
            }
        }

        this.textures = {};
        this.textureArray = textureArray;
        const populateTextures = (resources) => {
            for (let texture of texturesArray) {
                if (resources.hasOwnProperty(texture)) {
                    textures[texture] = resources[texture].texture;
                } else {
                    throw new Error(`Tried to get ${texture} but it did not exist on the given resources.`);
                }
            }
        };
    }
}

export default MiniGameController;
