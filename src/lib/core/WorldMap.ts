import { Container, Loader } from 'pixi.js';

export class WorldMap extends Container {
    private loader: Loader = new Loader();

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
        await this.loadAssets;
    };

    /**
     * @method loadAssets
     * @private
     * @description Queues the loader to load all essential textures and audio.
     * @returns {Promise} Promise resolves when all assets are loaded.
     */
    private loadAssets = (): Promise<true> => {
        return new Promise((resolve) => {
            this.loader.onComplete.add(() => {
                resolve(true);
            });
        });
    };

    // private loadAsset = () => {

    // }
}

export default WorldMap;
