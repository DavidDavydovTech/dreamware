import { Container } from 'pixi.js';
import { loadAssets, sharedLoader, populateSprites, parseTextures } from './factory/assetLoader';
import DoodleSprite from './DoodleSprite';

const resourceArray = [
    'assets/img/world_map/bg1.png',
    'assets/img/world_map/bg2.png',
    'assets/img/world_map/bird1.png',
    'assets/img/world_map/bird2.png',
    'assets/img/world_map/cactus1.png',
    'assets/img/world_map/cactus2.png',
    'assets/img/world_map/city1.png',
    'assets/img/world_map/city2.png',
    'assets/img/world_map/cloud1.png',
    'assets/img/world_map/cloud2.png',
    'assets/img/world_map/house1.png',
    'assets/img/world_map/house2.png',
    'assets/img/world_map/hut1.png',
    'assets/img/world_map/hut2.png',
    'assets/img/world_map/logo.png',
    'assets/img/world_map/moon1.png',
    'assets/img/world_map/moon2.png',
    'assets/img/world_map/zzz1.png',
    'assets/img/world_map/zzz2.png',
];

export class WorldMap extends Container {
    constructor() {
        super();
        this.init();
    }

    /**
     * @method init
     * @private
     * @description Initiates the class by running all methods required to function.
     * @returns {undefined}
     */
    private init = async () => {
        await this.initGraphics();
    };

    private initGraphics = async (): Promise<void> => {
        const propertyArray = await this.loadAssets(resourceArray).catch((err) => {
            throw err;
        });
        const textureArray = parseTextures(propertyArray);
        const spriteCollection = populateSprites(textureArray);
        for (const sprite in spriteCollection) {
            this.addChild(spriteCollection[sprite]);
        }
    };

    /** @type {import('./factory/assetLoader').loadAssets} */
    private loadAssets = loadAssets;
}

export default WorldMap;
