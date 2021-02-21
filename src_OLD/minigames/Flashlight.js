import DoodleSprite from "../lib/DoodleSprite";

export const GetFlashlightFuncs = () => {
    // Load textures in the array
    const texturesArray = [
        "flashBananaA",
        "flashBananaB",
        "flashDoorOpenA",
        "flashDoorOpenB",
        "flashDoorCloseA",
        "flashDoorCloseB",
        "flashDoorCloseC",
        "flashDoorCloseD",
        "flashFingerA",
        "flashFingerB",
        "flashFloatyManA",
        "flashFloatyManB",
        "flashImpyDarkA",
        "flashImpyDarkB",
        "flashImpyDark2A",
        "flashImpyDark2B",
        "flashImpyLossA",
        "flashImpyLossB",
        "flashImpyWinA",
        "flashImpyWinB",
        "flashMeterA",
        "flashMeterB",
        "flashMeterBumpA",
        "flashMeterBumpB",
        "flashMeterLineA",
        "flashMeterLineB",
        "flashMeterMaskA",
        "flashMeterMaskB",
        "flashMeterShadeA",
        "flashMeterShadeB",
        "flashMonsterA",
        "flashMonsterB",
        "flashMonsterC",
        "flashMonsterD",
        "flashMonsterE",
        "flashMonsterF",
        "flashMouseA",
        "flashMouseB",
        "flashW2A",
        "flashW2B",
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

        // flashBanana (hidden)
        // sprites.flashBanana.x = 240;
        // sprites.flashBanana.y = 180;
        // //sprites.typeClickmark.pivot.set( sprites.typeClickmark.width / 2, sprites.typeClickmark.height / 2);
        // this.addChild(sprites.flashBanana);
        // flashDoorOpen
        sprites.flashDoorOpen.x = 240;
        sprites.flashDoorOpen.y = 100;
        //sprites.typeClickmark.pivot.set( sprites.typeClickmark.width / 2, sprites.typeClickmark.height / 2);
        this.addChild(sprites.flashDoorOpen);
        // flashDoorClose
        // sprites.flashDoorClose.textureOffset = [{x : 0, y : 0}, {x : 4, y : -60}, {x : 0, y : 0}, {x : 0, y : 0}];
        // sprites.flashDoorClose.textureOffsetActive = true;
        // sprites.flashDoorClose.x = 450;
        // sprites.flashDoorClose.y = 140;
        // this.addChild(sprites.flashDoorClose);
        // flashFinger (Unused)
        // sprites.flashFinger.x = 50;
        // sprites.flashFinger.y = 200;
        // this.addChild(sprites.flashFinger);
        // flashFloatyMan (hidden)
        // sprites.flashFloatyMan.x = 200;
        // sprites.flashFloatyMan.y = 0;
        // this.addChild(sprites.flashFloatyMan);
        // flashImpyDark
        // sprites.flashImpyDark.x = 20;
        // sprites.flashImpyDark.y = 380;
        // this.addChild(sprites.flashImpyDark);
        // flashImpyDark2
        // sprites.flashImpyDark2.x = 20;
        // sprites.flashImpyDark2.y = 380;
        // this.addChild(sprites.flashImpyDark2);
        // flashImpyLoss (hidden)
        // sprites.flashImpyLoss.x = 20;
        // sprites.flashImpyLoss.y = 380;
        // this.addChild(sprites.flashImpyLoss)
        // flashImpyWin (hidden)
        // sprites.flashImpyWin.x = 20;
        // sprites.flashImpyWin.y = 380;
        // this.addChild(sprites.flashImpyWin);
        // flashMeter
        sprites.flashMeter.x = 120;
        sprites.flashMeter.y = 100;
        this.addChild(sprites.flashMeter);
        // flashMeterBump

        // flashMeterLine

        // flashMeterMask

        // flashMeterShade

        // flashMonster (not set up properly)
        // sprites.flashMonster.textureOffset = [{x : 0, y : 0}, {x : -10, y : 0}, {x : 0, y : -5}, {x : -30, y : 0}, {x : -160, y : 0}, {x : -170, y : 0}];
        // sprites.flashMonster.textureOffsetActive = true;
        // sprites.flashMonster.x = 430;
        // sprites.flashMonster.y = 140;
        // this.addChild(sprites.flashMonster);
        // flashMouse
        sprites.flashMouse.x = 0;
        sprites.flashMouse.y = 0;
        this.addChild(sprites.flashMouse);
        // flashW2 (hidden)
        sprites.flashW2.x = 270;
        sprites.flashW2.y = 50;
        this.addChild(sprites.flashW2);
    }

    function update() {
        // const { typeCursor } = sprites;
        // typeCursor.x = typeCursor.x + ( mousePosition.x - typeCursor.x ) + 6;
        // typeCursor.y = typeCursor.y + ( mousePosition.y - typeCursor.y );
    }
    return { init, update };
};

export default GetFlashlightFuncs;
