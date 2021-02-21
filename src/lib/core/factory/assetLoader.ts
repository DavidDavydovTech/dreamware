import { Loader } from 'pixi.js';

/** @type {import('pixi.js').Loader} */
export const sharedLoader = Loader.shared;

/**
 * @method loadAssets
 * @private
 * @description Queues the loader to load all essential textures and audio.
 * @returns {Promise} Promise resolves when all assets are loaded.
 */
export const loadAssets = async (resourceArray: string[]): Promise<true> => {
    resourceArray.forEach((url) => loadAsset(url));
    return new Promise((resolve, reject) => {
        sharedLoader.onComplete.add(() => {
            console.log('End of Load');
            resolve(true);
        });
        sharedLoader.onError.add((err) => {
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
export const loadAsset = (url: string): void => {
    try {
        const name = url.match(/(?<=\/)[^\/]{0,}(?=\.png$)/);
        if (name === null) {
            throw new Error(`Tried to get a resource at "${url}" but loadAssets could not decode the file name.`);
        } else if (name.length > 1) {
            throw new Error(`Tried to get a resource at "${url}" but loadAssets parsed two file names instead of one.`);
        }
        if (sharedLoader.resources.hasOwnProperty(name[0]) === false) {
            sharedLoader.add(name[0], url);
        }
    } catch (err) {
        throw err;
    }
};
