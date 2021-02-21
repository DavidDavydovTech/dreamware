import DoodleSprite from "../lib/DoodleSprite";

export const GetIceSkateFuncs = () => {
    // Load textures in the array
    const texturesArray = [
        "iceBgA",
        "iceBgB",
        "iceScreenA",
        "iceScreenB",
        "iceFigure8A",
        "iceCircleA",
        "iceSquareA",
        "iceTriangleA",
        "iceWinA",
        "iceWinB",
        "iceLossA",
        "iceLossB",
        "icePlayerA",
        "icePlayerB",
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

    let positions;
    function init() {
        // Get the properties we need:
        const { _appReference, timeMod } = this;
        // MUST RUN or textures don't come through.
        populateTextures(_appReference.loader.resources);
        populateSprites(textures, { app: _appReference, timeMod });
        populateMousePosition(_appReference);

        // Position Setter
        const shapeDiff = (this.difficulty - 1) % 3;
        if (shapeDiff === 0) {
            positions = positionsTriangle;
        } else if (shapeDiff === 1) {
            positions = positionsCircle;
        } else {
            positions = positionsEight;
        }

        // iceBg
        sprites.iceBg.alpha = 1;
        sprites.iceBg.x = 0;
        sprites.iceBg.y = 300;
        this.addChild(sprites.iceBg);
        // iceScreen
        sprites.iceScreen.alpha = 1;
        sprites.iceScreen.x = 800 / 2 - sprites.iceScreen.width / 2;
        sprites.iceScreen.y = 60;
        this.addChild(sprites.iceScreen);
        // iceFigure8 (hidden)
        sprites.iceFigure8.alpha = shapeDiff === 2 ? 1 : 0;
        sprites.iceFigure8.x = 800 / 2 - sprites.iceFigure8.width / 2;
        sprites.iceFigure8.y = 75;
        this.addChild(sprites.iceFigure8);
        // iceCircle (hidden)
        sprites.iceCircle.alpha = shapeDiff === 1 ? 1 : 0;
        sprites.iceCircle.x = 800 / 2 - sprites.iceFigure8.width / 2 - 10;
        sprites.iceCircle.y = 80;
        this.addChild(sprites.iceCircle);
        // iceSquare (hidden)
        // sprites.iceSquare.alpha = shapeDiff === 1 ? 1 : 0;
        // sprites.iceSquare.x = (800 / 2) - (sprites.iceSquare.width / 2);
        // sprites.iceSquare.y = 85;
        // this.addChild(sprites.iceSquare);
        // iceTriangle (hidden)
        sprites.iceTriangle.alpha = shapeDiff === 0 ? 1 : 0;
        sprites.iceTriangle.x = 800 / 2 - sprites.iceTriangle.width / 2;
        sprites.iceTriangle.y = 85;
        this.addChild(sprites.iceTriangle);
        // icePlayer (dynamic)
        sprites.icePlayer.x = 0;
        sprites.icePlayer.y = 0;
        sprites.icePlayer.pivot.set(sprites.icePlayer.width / 2, sprites.icePlayer.height - 12);
        this.addChild(sprites.icePlayer);
        // iceWin (hidden)
        sprites.iceWin.alpha = 0;
        sprites.iceWin.x = 800 / 2 - sprites.iceWin.width / 2;
        sprites.iceWin.y = 10;
        this.addChild(sprites.iceWin);
        // iceLoss (hidden)
        sprites.iceLoss.alpha = 0;
        sprites.iceLoss.x = 800 / 2 - sprites.iceLoss.width / 2 - 12;
        sprites.iceLoss.y = 60;
        this.addChild(sprites.iceLoss);
    }

    let positionPrev;
    // Done?... TEST!
    let positionsEight = [
        {
            x: (val) => val <= 370,
            y: (val) => val <= 450,
        },
        {
            x: (val) => val >= 470,
            y: (val) => val <= 450,
        },
        {
            x: (val) => val >= 470,
            y: (val) => val >= 550,
        },
        {
            x: (val) => val <= 370,
            y: (val) => val >= 550,
        },
    ];
    // Done
    let positionsCircle = [
        {
            x: (val) => val <= 380,
            y: (val) => val <= 480,
        },
        {
            x: (val) => val >= 420,
            y: (val) => val <= 480,
        },
        {
            x: (val) => val >= 420,
            y: (val) => val >= 520,
        },
        {
            x: (val) => val <= 380,
            y: (val) => val >= 520,
        },
    ];
    // Done
    let positionsTriangle = [
        {
            x: (val) => val >= 100 && val <= 700,
            y: (val) => val <= 450,
        },
        {
            x: (val) => val >= 430 && val <= 600,
            y: (val) => val >= 550,
        },
        {
            x: (val) => val <= 380 && val <= 200,
            y: (val) => val >= 550,
        },
    ];
    let direction = 1;
    let score = 0;
    let didEnd = false;

    function update() {
        const { icePlayer } = sprites;

        // Hold down to drag with slight mouse delay
        icePlayer.x = icePlayer.x + (mousePosition.x - icePlayer.x) / 2;
        icePlayer.y = icePlayer.y + (mousePosition.y - icePlayer.y) / 2;
        if (icePlayer.y < 375) icePlayer.y = 375;

        let validPosition;
        const { x, y } = icePlayer;
        for (let positionIndex in positions) {
            const position = positions[positionIndex];
            if (position.x(x) && position.y(y)) {
                validPosition = parseInt(positionIndex);
                break;
            }
        }

        const { x: mouseX } = mousePosition;
        if (x > mouseX) {
            sprites.icePlayer.scale.set(-1, 1);
        } else {
            sprites.icePlayer.scale.set(1, 1);
        }

        if (typeof positionPrev !== "number") {
            if (typeof positionIndex === "number") {
                positionPrev = (positionIndex - 1) % positions.length;
            } else {
                positionPrev = -1;
            }
        }

        if (typeof validPosition === "number" && validPosition !== positionPrev) {
            const nextValidPosition = (positionPrev + direction) % positions.length;
            const lastValidPosition = (positionPrev - direction) % positions.length;
            if (nextValidPosition === validPosition) {
                score += 1;
            } else if (lastValidPosition === validPosition) {
                // score = 0;
                direction *= -1;
            }
            positionPrev = validPosition;
        }

        if (this.didWin === false) {
            if (!didEnd) {
                sprites.iceBg.alpha = 0;
                sprites.iceScreen.alpha = 0;
                sprites.iceCircle.alpha = 0;
                sprites.iceTriangle.alpha = 0;
                sprites.iceFigure8.alpha = 0;
                sprites.icePlayer.alpha = 0;
                sprites.iceLoss.alpha = 1;
            }
            //console.log('LOST :(')
            didEnd = true;
        } else if (score >= positions.length + 2) {
            //console.log('WON')
            if (!didEnd) {
                sprites.iceBg.alpha = 0;
                sprites.iceScreen.alpha = 0;
                sprites.iceCircle.alpha = 0;
                sprites.iceTriangle.alpha = 0;
                sprites.iceFigure8.alpha = 0;
                sprites.icePlayer.alpha = 0;
                sprites.iceWin.alpha = 1;
                this.winOnTimeout = true;
            }
            didEnd = true;
        }
    }
    return { init, update };
};

export default GetIceSkateFuncs;
