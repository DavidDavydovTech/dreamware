import DoodleSprite from "../lib/DoodleSprite";

export const GetGoatScareFuncs = () => {
    // Load textures in the array
    const texturesArray = [
        "goatBgA",
        "goatBgB",
        "goatBushA",
        "goatBushB",
        "goatCalmA",
        "goatCalmB",
        "goatGroundA",
        "goatGroundB",
        "goatScaredA",
        "goatScaredB",
        "goatSneakA",
        "goatSneakB",
        "goatSpookA",
        "goatSpookB",
        "goatSpinA",
        "goatSpinB",
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
    const goats = [];
    let goatIndex = 0;
    let positionPrev = 0;
    let positions = [
        {
            x: (val) => val <= 380,
            y: (val) => val <= 380,
        },
        {
            x: (val) => val >= 420,
            y: (val) => val <= 380,
        },
        {
            x: (val) => val >= 420,
            y: (val) => val >= 420,
        },
        {
            x: (val) => val <= 380,
            y: (val) => val >= 420,
        },
    ];
    let direction = 1;
    let power = 0;
    let powerLossMS;
    let didWin = false;
    function init() {
        // Get the properties we need:
        const { _appReference, timeMod } = this;
        // MUST RUN or textures don't come through.
        populateTextures(_appReference.loader.resources);
        populateSprites(textures, { app: _appReference, timeMod });
        populateMousePosition(_appReference);

        powerLossMS = 1200 - this.difficulty * 300;
        // Background
        sprites.goatBg.x = 0;
        sprites.goatBg.y = 150;
        this.addChild(sprites.goatBg);
        // Ground
        sprites.goatGround.x = 0;
        sprites.goatGround.y = 650;
        this.addChild(sprites.goatGround);
        // Bush
        sprites.goatBush.x = 0;
        sprites.goatBush.y = 505;
        sprites.goatBush.textureOffset = [
            { x: 0, y: 6 },
            { x: 0, y: 0 },
        ];
        sprites.goatBush.textureOffsetActive = true;
        this.addChild(sprites.goatBush);
        // goatSpin
        sprites.goatSpin.x = 800 / 2 - sprites.goatSpin.width / 2;
        sprites.goatSpin.y = 100;
        this.addChild(sprites.goatSpin);
        // Person Sneak
        sprites.goatSneak.x = 95 + sprites.goatSneak.width / 2;
        sprites.goatSneak.y = 395 + sprites.goatSneak.height;
        sprites.goatSneak.pivot.set(sprites.goatSneak.width / 2, sprites.goatSneak.height);
        sprites.goatSneak.textureOffset = [
            { x: 0, y: 6 },
            { x: 0, y: 4 },
        ];
        sprites.goatSneak.textureOffsetActive = true;
        this.addChild(sprites.goatSneak);
        // Person Spook
        sprites.goatSpook.x = 30;
        sprites.goatSpook.y = 356;
        sprites.goatSpook.textureOffset = [
            { x: 0, y: 0 },
            { x: -2, y: -14 },
        ];
        sprites.goatSpook.textureOffsetActive = true;
        this.addChild(sprites.goatSpook);
        sprites.goatSpook.alpha = 0;
        // Goat Example
        for (let i = 0; i < 5; i++) {
            const newGoat = new Goat(
                {},
                {
                    app: _appReference,
                    timeMod,
                    texture: [textures.goatCalmA, textures.goatCalmB],
                }
            );
            this.addChild(newGoat);
        }
        // sprites.goatSprite = new DoodleSprite({
        //   texture: [goatScaredA.texture, goatScaredB.texture, goatCalmA.texture],
        //   app: _appReference,
        //   timeMod: timeMod
        // });
        // this.addChild(sprites.goatCalm);
        // sprites.goatCalm.x = 100;
        // sprites.goatCalm.y = 100;
    }

    class Goat extends DoodleSprite {
        constructor({}, doodleParams) {
            super(doodleParams);
            this.isScared = false;
            this.gotScared = false;
            this.scareNext = false;
            this.pivot.set(this.width / 2, this.height);
            this.desiredAngle = Math.PI / 3;
            this.rotationMS = 3000;
            this._init();
            goats.push(this);
        }

        _init = () => {
            this.y = 653;
            this.x = 400 + 140 * goats.length;
        };

        update = (deltaMS) => {
            const { isScared, desiredAngle, rotationMS, gotScared } = this;
            if (isScared === true && this.rotation <= desiredAngle) {
                const movement = deltaMS / rotationMS;
                this.rotation += movement * (Math.PI / 3);
                if (this.rotation > Math.PI / 4) {
                    this.rotationMS = 3500;
                    this.scareNext = true;
                } else {
                    this.rotationMS *= 0.97;
                }
            }

            if (isScared && !gotScared) {
                // custom logic.
                this.textureArray = [textures.goatScaredA, textures.goatScaredB];
                this.texture = this.textureArray[this.textureIndex % 2];
                // dont remove
                this.gotScared = true;
            }
            // const ghostDeltaY = (deltaMS / this.speedY) * 100;
            // const ghostDeltaX = (deltaMS / this.speedX) * 800;
            // this.y += this.directionY * ghostDeltaY;
            // this.x += this.directionX * ghostDeltaX;
            // if (this.x > 800 + this.width) { this.directionX = -1; }
            // else if (this.x < -this.width) { this.directionX = 1; }
            // if (this.y > this.yOriginal + this.ySeed) { this.directionY = -1; }
            // else if (this.y < this.yOriginal - this.ySeed) { this.directionY = 1; }
        };
    }

    function update() {
        const { deltaMS } = this;
        goats.forEach((goat) => goat.update(deltaMS));
        if (goats[goatIndex].scareNext) {
            if (goatIndex + 1 < goats.length) {
                goatIndex += 1;
                goats[goatIndex].isScared = true;
            } else {
                goats[goatIndex].scareNext = false;
            }
        }

        let validPosition;
        const { x, y } = mousePosition;
        for (let positionIndex in positions) {
            const position = positions[positionIndex];
            if (position.x(x) && position.y(y)) {
                validPosition = parseInt(positionIndex);
                break;
            }
        }

        if (typeof validPosition === "number" && validPosition !== positionPrev) {
            const nextValidPosition = (positionPrev + direction) % positions.length;
            const lastValidPosition = (positionPrev - direction) % positions.length;
            if (nextValidPosition === validPosition) {
                power += 1;
            } else if (lastValidPosition === validPosition) {
                direction *= -1;
            }
            positionPrev = validPosition;
        }

        if (power < 0) {
            power = 0;
        } else if (power > 10) {
            power = 10;
            goats[0].isScared = true;
            sprites.goatSneak.alpha = 0;
            sprites.goatSpook.alpha = 1;
            if (!didWin) {
                this.winOnTimeout = true;
            }
            didWin = true;
        } else {
            power -= deltaMS / powerLossMS;
            sprites.goatSneak.scale.set(1 + 0.05 * (power / 10), 0.5 + 0.5 * (1 - power / 10));
        }
    }

    return { init, update };
};

export default GetGoatScareFuncs;
