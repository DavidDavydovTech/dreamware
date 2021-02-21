import { Container, Loader } from 'pixi.js';
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
    private loader: Loader = Loader.shared;

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
        console.log('Start');
        const didLoad = await this.loadAssets();
        console.log('did load?', didLoad);
        console.log('LOADER:', this.loader);
    };

    /**
     * @method loadAssets
     * @private
     * @description Queues the loader to load all essential textures and audio.
     * @returns {Promise} Promise resolves when all assets are loaded.
     */
    private loadAssets = async (): Promise<true> => {
        resourceArray.forEach((url) => this.loadAsset(url));
        return new Promise((resolve, reject) => {
            this.loader.onComplete.add(() => {
                console.log('End of Load');
                resolve(true);
            });
            this.loader.onError.add((err) => {
                console.error('Loader error:', err);
                reject(false);
            });
        });
    };

    /**
     * @method loadAsset
     * @private
     * @description Queues a single resource to be loaded by the loader.
     * @param {string} url The path to the asset from the root of the assets folder (ex: `<root>/assets/img/image.png` becomes `img/image.png`).
     * @returns {undefined} Promise resolves when all assets are loaded.
     */
    private loadAsset = (url: string): void => {
        try {
            const name = url.match(/(?<=\/)[^\/]{0,}(?=\.png$)/);
            if (name === null) {
                throw new Error(`Tried to get a resource at "${url}" but loadAssets could not decode the file name.`);
            } else if (name.length > 1) {
                throw new Error(
                    `Tried to get a resource at "${url}" but loadAssets parsed two file names instead of one.`
                );
            }
            this.loader.add(name[0], url);
        } catch (err) {
            throw err;
        }
    };
}

export default WorldMap;
