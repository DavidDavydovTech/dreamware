import DoodleSprite from "../lib/DoodleSprite";

export const GetHotdogFuncs = () => {
    // Load textures in the array
    const texturesArray = [
        "hdAngerFaceA",
        "hdAngerFaceB",
        "hdBaconA",
        "hdBaconB",
        "hdBubbleA",
        "hdBubbleB",
        "hdBunForwardA",
        "hdBunForwardB",
        "hdMeatA",
        "hdMeatB",
        "hdCheeseA",
        "hdCheeseB",
        "hdCounterA",
        "hdCounterB",
        "hdHandA",
        "hdHandB",
        "hdClickContentsA",
        "hdClickContentsB",
        "hdKetchupSplatA",
        "hdKetchupSplatB",
        "hdMustardSplatA",
        "hdMustardSplatB",
        "hdMustardA",
        "hdMustardB",
        "hdKetchupA",
        "hdKetchupB",
        "hdOnionsA",
        "hdOnionsB",
        "hdThingA",
        "hdThingB",
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

    function init() {
        // Get the properties we need:
        const { _appReference, timeMod } = this;
        // MUST RUN or textures don't come through.
        populateTextures(_appReference.loader.resources);
        populateSprites(textures, { app: _appReference, timeMod });
        populateMousePosition(_appReference);

        // Sprites

        // hdHand
        sprites.hdHand.x = 0;
        sprites.hdHand.y = 0;
        sprites.hdHand.pivot.set(sprites.hdHand.width / 2, sprites.hdHand.height - 790);
        this.addChild(sprites.hdHand);

        // hdCounter
        sprites.hdCounter.textureOffset = [
            { x: 0, y: 0 },
            { x: 0, y: 200 },
        ];
        sprites.hdCounter.textureOffsetActive = true;
        sprites.hdCounter.x = 800 / 2 - sprites.hdCounter.width / 2;
        sprites.hdCounter.y = 100;
        this.addChild(sprites.hdCounter);
        // hdClickContents
        sprites.hdClickContents.x = 800 / 2 - sprites.hdClickContents.width / 2;
        sprites.hdClickContents.y = 330;
        this.addChild(sprites.hdClickContents);
        // sprites.hdAngerFace.x = 0;
        // sprites.hdAngerFace.y = 0;
        // this.addChild(sprites.hdAngerFace);
        // hdBacon (hidden)
        // hdMeat (hidden)
        // hdCheese (hidden)
        // hdKetchupSplat (hidden)
        // hdMustardSplat (hidden)
        // hdOnions (hidden) (dynamic)
        // hdMustard (hidden) (dynamic)
        // hdKetchup (hidden) (dynamic)
        // hdBunForward (hidden)
        // hdThing (hidden) (dynamic) <-- ACTUAL HOTDOG BUNS
        // hdBubble (hidden)
        sprites.hdBubble.alpha = 0;
        sprites.hdBubble.x = 800 / 2 - sprites.hdBubble.width / 2;
        sprites.hdBubble.y = 0;
        this.addChild(sprites.hdBubble);

        // sprites.hdBunForward.x = 0;
        // sprites.hdBunForward.y = 0;
        // this.addChild(sprites.hdBunForward);
        // hdAngerFace (Hidden)
        sprites.hdAngerFace.alpha = 0;
        sprites.hdAngerFace.x = 800 / 2 - sprites.hdAngerFace.width / 2;
        sprites.hdAngerFace.y = 100;
        this.addChild(sprites.hdAngerFace);
    }

    // class Order extends Container{
    //   constructor (sprite) {
    //     super()
    //     this.yOriginal = 0;
    //     this.ySeed = Math.floor( Math.random() * 30 + 20);
    //     this.directionX = 1;
    //     this.directionY = 1;
    //     this.speedX = Math.floor( Math.random() * 1000 + 1150) + 2;
    //     this.speedY = Math.floor( Math.random() * 250 + 750) + 2;
    //     this.addChild(sprite);
    //     ghosts.push(this);
    //     this._init();
    //   }
    //   _init = () => {
    //     this.interactive = true;
    //     this.y = Math.floor( Math.random() * ( 800 - this.height ) );
    //     this.yOriginal = this.y;
    //     this.x = Math.floor( Math.random() * ( 800 + this.width * 2) - this.width );
    //   }
    //   update = (deltaMS) => {
    //     const ghostDeltaY = (deltaMS / this.speedY) * 100;
    //     const ghostDeltaX = (deltaMS / this.speedX) * 800;
    //     this.y += this.directionY * ghostDeltaY;
    //     this.x += this.directionX * ghostDeltaX;
    //     if (this.x > 800 + this.width) { this.directionX = -1; }
    //     else if (this.x < -this.width) { this.directionX = 1; }
    //     if (this.y > this.yOriginal + this.ySeed) { this.directionY = -1; }
    //     else if (this.y < this.yOriginal - this.ySeed) { this.directionY = 1; }
    //   }
    // }

    function update() {
        const { hdHand } = sprites;
        sprites.hdHand.x = hdHand.x + (mousePosition.x - hdHand.x);
        // Restrict hdHandY from going past counter
        sprites.hdHand.y = hdHand.y + (mousePosition.y - hdHand.y);

        // Show random prompt

        // Wait for player to send finished hot dog out

        // Determine if player makes the right hotdog
    }
    return { init, update };
};

export default GetHotdogFuncs;
