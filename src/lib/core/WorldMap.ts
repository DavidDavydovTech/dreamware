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
    public sprites: { [prop: string]: DoodleSprite } | undefined;

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
        this.sprites = populateSprites(textureArray);
        for (const sprite in this.sprites) {
            this.addChild(this.sprites[sprite]);
        }

        const { logo, zzz, cloud, moon, hut, city, house, cactus, bird } = this.sprites;

        logo.alpha = 0;
        zzz.alpha = 0;
        cloud.alpha = 0;
        moon.x = 80;
        moon.y = 25;
        hut.x = 330 + hut.width / 2;
        hut.y = 230 + hut.height / 2;
        city.x = 400 + city.width / 2;
        city.y = 370 + city.height / 2;
        house.x = 230;
        house.y = 630;
        cactus.x = 80;
        cactus.y = 610;
        bird.x = 300;
        bird.y = 70;

        house.pivot.set(house.width / 2, house.height / 2);
        house.buttonMode = true;
        house.interactive = true;
        house.on('pointerover', () => house.scale.set(1.1, 1.1));
        house.on('pointerout', () => house.scale.set(1, 1));

        city.pivot.set(city.width / 2, city.height / 2);
        city.buttonMode = true;
        city.interactive = true;
        city.on('pointerover', () => city.scale.set(1.1, 1.1));
        city.on('pointerout', () => city.scale.set(1, 1));

        hut.pivot.set(hut.width / 2, hut.height / 2);
        hut.buttonMode = true;
        hut.interactive = true;
        hut.on('pointerover', () => hut.scale.set(1.1, 1.1));
        hut.on('pointerout', () => hut.scale.set(1, 1));
    };

    /** @type {import('./factory/assetLoader').loadAssets} */
    private loadAssets = loadAssets;
}

export default WorldMap;
