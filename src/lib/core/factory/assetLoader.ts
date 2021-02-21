import { Loader } from 'pixi.js';
const sharedLoader = Loader.shared;

const loadAssets = async (resourceArray: string[], loader: Loader = sharedLoader): Promise<true> => {
    resourceArray.forEach((url) => loadAsset(url));
    return new Promise((resolve, reject) => {
        loader.onComplete.add(() => {
            console.log('End of Load');
            resolve(true);
        });
        loader.onError.add((err) => {
            console.error('Loader error:', err);
            reject(false);
        });
    });
};

const loadAsset = (url: string, loader: Loader = sharedLoader): void => {
    try {
        const name = url.match(/(?<=\/)[^\/]{0,}(?=\.png$)/);
        if (name === null) {
            throw new Error(`Tried to get a resource at "${url}" but loadAssets could not decode the file name.`);
        } else if (name.length > 1) {
            throw new Error(`Tried to get a resource at "${url}" but loadAssets parsed two file names instead of one.`);
        }
        loader.add(name[0], url);
    } catch (err) {
        throw err;
    }
};
