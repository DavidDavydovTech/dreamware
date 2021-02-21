import DoodleSprite from "../lib/DoodleSprite";

export const GetImpastaFuncs = () => {
    // Load textures in the array
    const texturesArray = [
        "snailBgA",
        "snailBgB",
        "snailImposterA",
        "snailImposterB",
        "snailLossA",
        "snailLossB",
        "snailWinA",
        "snailWinB",
        "snailSnailsA",
        "snailSnailsB",
        "snailPointA",
        "snailPointB",
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
    let imposterClicked = false;
    let innocentClicked = false;
    function init() {
        // Get the properties we need:
        const { _appReference, timeMod } = this;
        // MUST RUN or textures don't come through.
        populateTextures(_appReference.loader.resources);
        populateSprites(textures, { app: _appReference, timeMod });
        populateMousePosition(_appReference);

        // Sprites

        // snailBg
        sprites.snailBg.textureOffset = [
            { x: 0, y: 0 },
            { x: -4, y: 0 },
        ];
        sprites.snailBg.textureOffsetActive = true;
        sprites.snailBg.x = 10;
        sprites.snailBg.y = 100;
        this.addChild(sprites.snailBg);
        // snailLoss (hidden)
        sprites.snailLoss.alpha = 0;
        sprites.snailLoss.textureOffset = [
            { x: 0, y: 0 },
            { x: -6, y: -2 },
        ];
        sprites.snailLoss.textureOffsetActive = true;
        sprites.snailLoss.x = 800 / 2 - sprites.snailLoss.width / 2;
        sprites.snailLoss.y = 90;
        this.addChild(sprites.snailLoss);
        // snailWin (hidden)
        sprites.snailWin.alpha = 0;
        sprites.snailWin.x = sprites.snailImposter.x;
        sprites.snailWin.y = sprites.snailImposter.y - 90;
        this.addChild(sprites.snailWin);
        // snailSnails
        sprites.snailSnails.interactive = true;
        sprites.snailSnails.on("pointerdown", function () {
            innocentClicked = true;
        });
        sprites.snailSnails.x = 210;
        sprites.snailSnails.y = 350;
        this.addChild(sprites.snailSnails);
        // snailImposter
        sprites.snailImposter.interactive = true;
        sprites.snailImposter.on("pointerdown", function () {
            imposterClicked = true;
        });
        sprites.snailImposter.alpha = 1;
        sprites.snailImposter.x = 350;
        sprites.snailImposter.y = 400;
        this.addChild(sprites.snailImposter);
        // snailPoint (dynamic)
        sprites.snailPoint.x = 0;
        sprites.snailPoint.y = 0;
        sprites.snailPoint.pivot.set(sprites.snailPoint.width / 2, sprites.snailPoint.height / 2);
        this.addChild(sprites.snailPoint);
    }

    let didEnd = false;

    function update() {
        const { snailPoint } = sprites;
        const { deltaMS } = this;
        snailPoint.x = snailPoint.x + (mousePosition.x - snailPoint.x) + 10;
        snailPoint.y = snailPoint.y + (mousePosition.y - snailPoint.y) + 55;

        if (this.totalMS >= this.maxMS - 100 || innocentClicked === true) {
            if (didEnd === false) {
                this.maxMS = this.maxMS + 2000;
                //console.log('lost!')
                sprites.snailPoint.alpha = 0;
                sprites.snailBg.alpha = 0;
                sprites.snailSnails.alpha = 0;
                sprites.snailImposter.alpha = 0;
                sprites.snailLoss.alpha = 1;
                didEnd = true;
            }
        } else if (this.didWin === true || imposterClicked === true) {
            if (didEnd === false) {
                didEnd = true;
                this.winOnTimeout = true;
                //console.log('win screen');
                sprites.snailImposter.alpha = 0;
                sprites.snailPoint.alpha = 0;
                sprites.snailWin.x = sprites.snailImposter.x;
                sprites.snailWin.y = sprites.snailImposter.y - 90;
                sprites.snailWin.alpha = 1;
            }
        }
    }
    return { init, update };
};

export default GetImpastaFuncs;
