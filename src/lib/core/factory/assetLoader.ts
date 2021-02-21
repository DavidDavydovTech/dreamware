import { Loader } from 'pixi.js';

export const sharedLoader = Loader.shared;

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
