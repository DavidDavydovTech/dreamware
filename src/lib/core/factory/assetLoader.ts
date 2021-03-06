import { Loader, Texture } from 'pixi.js';
import DoodleSprite, { DoodleSpriteOptions } from '../DoodleSprite';

/** @type {import('pixi.js').Loader} */
export const sharedLoader = Loader.shared;

/** @type {RegExp} */

/**
 * @method loadAssets
 * @private
 * @description Queues the loader to load all essential textures and audio.
 * @returns {Promise} Promise resolves when all assets are loaded.
 */
export const loadAssets = async (resourceArray: string[]): Promise<string[]> => {
  const resourceProperties: string[] = resourceArray.map((url) => loadAsset(url));
  return new Promise((resolve, reject) => {
    sharedLoader.onComplete.add(() => {
      console.log('End of Load');
      resolve(resourceProperties);
    });
    sharedLoader.onError.add((err) => {
      console.error('Loader error:', err);
      reject(err);
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
export const loadAsset = (url: string): string => {
  try {
    const name = url.match(/(?<=\/)[^\/]{0,}(?=\.png$)/);
    if (name === null) {
      throw new Error(`Tried to get a resource at "${url}" but loadAssets could not decode the file name.`);
    } else if (name.length > 1) {
      throw new Error(`Tried to get a resource at "${url}" but loadAssets parsed two file names instead of one.`);
    }
    const resourceName = name[0];
    if (sharedLoader.resources.hasOwnProperty(resourceName) === false) {
      sharedLoader.add(resourceName, url);
    }
    return resourceName;
  } catch (err) {
    throw err;
  }
};

interface TextureCollection {
  [prop: string]: Texture;
}

/**
 * @type {function}
 * @description Uses an array of resource properties to access the loader's existing resources and returns a object with those resource's textures.
 * @param {string[]} resourceArray A array of resource property names.
 */
export const parseTextures = (resourceArray: string[]): TextureCollection => {
  const textureObj: TextureCollection = {};
  for (const texture of resourceArray) {
    if (sharedLoader.resources.hasOwnProperty(texture)) {
      textureObj[texture] = sharedLoader.resources[texture].texture;
    } else {
      throw new Error(`Tried to get ${texture} but it did not exist on the given loader's resources.`);
    }
  }
  return textureObj;
};

// interface SpriteTextureGroups {
//     [prop: string]: Texture[];
// }

interface PopulateSpritesOptions {
  defaultOptions?: DoodleSpriteOptions;
  regex?: RegExp;
}

interface DoodleSpriteCollection {
  [prop: string]: DoodleSprite;
}

/**
 * @description Takes a texture collection and generates a collection full of DoodleSprites based on REGEX rules.
 * @param {textureCollection} textureCollection A texture collection generated by parseTextures.
 * @param {PopulateSpritesOptions} options Options for running this function.
 * @param {DoodleSpriteOptions} defaultOptions Modifications to the default options for DoodleSprites. If left blank DoodleSprites will use default options.
 * @param {RegExp} regex The regular expression used to decide how to group up textures for DoodleSprite. Your regular expresion should only return one result.
 */
export const populateSprites = (
  textureCollection: TextureCollection,
  { defaultOptions, regex = /[^0-9]{0,}(?=[0-9]{0,})/ }: PopulateSpritesOptions = {}
): DoodleSpriteCollection => {
  const groups: { [prop: string]: Texture[] } = {};
  const result: DoodleSpriteCollection = {};

  for (const textureName in textureCollection) {
    const groupName = textureName.match(regex);
    if (groupName === null) {
      throw new Error(
        `Tried to get a group name from "${textureName}" but populateSprites could not convert the texture name in to a group name.`
      );
    } else if (groupName.length > 1) {
      throw new Error(
        `Tried to get a group name from "${textureName}" but populateSprites parsed two or more group names instead of one. (double check your regular expression: "${regex}")`
      );
    }
    console.log(groupName[0]);
    if (groups.hasOwnProperty(groupName[0]) === false) {
      groups[groupName[0]] = [];
    }

    groups[groupName[0]].push(textureCollection[textureName]);
  }

  for (const group in groups) {
    result[group] = new DoodleSprite(groups[group], defaultOptions);
  }

  return result;
};

export async function loadGameAssets(assetsObject: { [prop: string]: string }, callback?: () => void): Promise<void> {
  return new Promise((res, rej) => {
    sharedLoader.add(assetsObject);

    sharedLoader.onComplete.once(() => {
      callback && callback();
      res();
    });

    sharedLoader.onError.once(() => {
      rej();
    });

    sharedLoader.load();
  });
}
