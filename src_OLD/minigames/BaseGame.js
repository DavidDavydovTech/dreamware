import DoodleSprite from "../lib/DoodleSprite";

export const GetTypingTestFuncs = () => {
    // Load textures in the array
    const texturesArray = [""];
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

        // typeClickmark (hidden)
        sprites.typeClickmark.alpha = 0;
        sprites.typeClickmark.x = 100;
        sprites.typeClickmark.y = 100;
        sprites.typeClickmark.pivot.set(sprites.typeClickmark.width / 2, sprites.typeClickmark.height / 2);
        //this.addChild(sprites.typeClickmark);
    }

    function update() {
        const { typeCursor } = sprites;
        typeCursor.x = typeCursor.x + (mousePosition.x - typeCursor.x) + 6;
        typeCursor.y = typeCursor.y + (mousePosition.y - typeCursor.y);
    }
    return { init, update };
};

export default GetTypingTestFuncs;
