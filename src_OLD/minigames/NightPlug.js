import DoodleSprite from "../lib/DoodleSprite";

export const GetNightPlugFuncs = () => {
    // Load textures in the array
    const texturesArray = [
        "plugArmDarkA",
        "plugArmDarkB",
        "plugArmLightPluggedA",
        "plugArmLightPluggedB",
        "plugSocketLightA",
        "plugSocketLightB",
        "plugBgA",
        "plugBgB",
        "plugDarknessA",
        "plugSocketA",
        "plugSocketB",
    ];
    const textures = {};
    const populateTextures = (resources) => {
        for (let texture of texturesArray) {
            if (resources.hasOwnProperty(texture)) {
                textures[texture] = resources[texture].texture;
            } else {
                throw new Error(`Tried to get ${texture} but it did not exist on the given resources.`);
            }
        }
    };
    // Sprite stuff
    const sprites = {};
    const populateSprites = (texturesObject, defaults) => {
        const groups = {};
        texturesArray.forEach((textureName) => {
            let group = textureName;
            let lastLetter = group[group.length - 1];
            if (lastLetter === lastLetter.toUpperCase()) group = group.slice(0, textureName.length - 1);
            if (groups.hasOwnProperty(group) === false) {
                groups[group] = [];
            }
            groups[group].push(textures[textureName]);
        });
        for (let group in groups) {
            sprites[group] = new DoodleSprite({ texture: groups[group], ...defaults });
        }
    };
    // Mouse
    let mousePosition = null;
    const populateMousePosition = (app) => {
        mousePosition = app.renderer.plugins.interaction.mouse.global;
    };
    // Extras
    const plugPivotY = 30;
    function init() {
        // Get the properties we need:
        const { _appReference, timeMod } = this;
        // MUST RUN or textures don't come through.
        populateTextures(_appReference.loader.resources);
        populateSprites(textures, { app: _appReference, timeMod });
        populateMousePosition(_appReference);

        // Sprites
        // plugDarkness
        this.addChild(sprites.plugDarkness);
        // plugSocket
        sprites.plugSocket.pivot.set(sprites.plugSocket.width / 2, (sprites.plugSocket.height / 6) * 5);
        sprites.plugSocket.x = Math.floor(
            Math.random() * (800 - sprites.plugSocket.width) + sprites.plugSocket.width / 2
        );
        sprites.plugSocket.y = Math.floor(
            Math.random() * (800 - sprites.plugSocket.height) + sprites.plugSocket.height / 2
        );
        this.addChild(sprites.plugSocket);
        // plugArmDark
        sprites.plugArmDark.x = 400;
        sprites.plugArmDark.y = 400;
        sprites.plugArmDark.pivot.set(sprites.plugArmDark.width / 2 + 10, plugPivotY);
        this.addChild(sprites.plugArmDark);
    }

    let didWin = false;
    let didWinRan = false;
    function update() {
        if (!didWin) {
            const { plugArmDark, plugArmLightPlugged, plugSocket } = sprites;

            plugArmDark.x = plugArmDark.x + (mousePosition.x - plugArmDark.x) / 5 + 5 * this.difficulty;
            plugArmDark.y = plugArmDark.y + (mousePosition.y - plugArmDark.y) / 5 + 5 * this.difficulty;
            if (plugArmDark.y < plugPivotY + 50) plugArmDark.y = plugPivotY + 50;

            const distToPlug = (Math.abs(plugArmDark.x - plugSocket.x) + Math.abs(plugArmDark.y - plugSocket.y)) / 1.45;
            const plugMaxRange = 225 - 50 * this.difficulty;
            const plugAlpha = plugMaxRange / distToPlug - 1;
            plugSocket.alpha = distToPlug > plugMaxRange ? 0 : plugAlpha;
            if (
                Math.abs(plugArmDark.x - plugSocket.x) <= 40 &&
                Math.abs(plugArmDark.y - plugSocket.y) <= 40 &&
                Math.abs(mousePosition.x - plugSocket.x) <= 20 &&
                Math.abs(mousePosition.y - plugSocket.y) <= 20
            ) {
                didWin = true;
                // this.winMG();
                return;
            }
        } else if (!didWinRan) {
            const {
                plugSocket,
                plugArmDark,
                plugDarkness,

                plugBg,
                plugArmLightPlugged,
                plugSocketLight,
            } = sprites;
            plugSocket.alpha = 0;
            plugArmDark.alpha = 0;
            plugDarkness.alpha = 0;
            // plugArmDark
            plugArmLightPlugged.x = plugSocket.trueX;
            plugArmLightPlugged.y = plugSocket.trueY;
            plugArmLightPlugged.pivot.set(plugArmDark.width / 2 - 5, plugPivotY + 25);
            this.addChild(plugArmLightPlugged);
            // plugBg
            plugBg.x = 400;
            plugBg.y = 800;
            plugBg.pivot.set(plugBg.width / 2, plugBg.height);
            this.addChild(plugBg);
            plugSocketLight.x = plugSocket.trueX;
            plugSocketLight.y = plugSocket.trueY;
            plugSocketLight.pivot.set(plugSocketLight.width / 2, (plugSocketLight.height / 6) * 5);
            this.addChild(plugSocketLight);
            this.winMG();
            didWinRan = true;
        }
    }
    return { init, update };
};

export default GetNightPlugFuncs;
