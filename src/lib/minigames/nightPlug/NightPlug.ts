import MiniGameInstance from '../../core/MiniGameInstance';
import { parseTextures, populateSprites } from '../../core/factory/assetLoader';
import { texturesArray } from './NightPlug.assets';

export async function init(this: MiniGameInstance): Promise<void> {
  // Generate all required sprites.
  const textures = await parseTextures(texturesArray);
  this.textures = textures;
  const sprites = populateSprites(textures, { regex: /.{1,}(?=[A-Z]{1,})/ });
  this.sprites = sprites;
  // Create a storage object on the class
  this.game = {};
  const game = this.game;
  game.plugPivotY = 30;
  game.didWinRan = false;
  // Sprites
  // plugDarkness
  this.addChild(sprites.plugDarkness);
  // plugSocket
  sprites.plugSocket.pivot.set(sprites.plugSocket.width / 2, (sprites.plugSocket.height / 6) * 5);
  sprites.plugSocket.x = Math.floor(Math.random() * (800 - sprites.plugSocket.width) + sprites.plugSocket.width / 2);
  sprites.plugSocket.y = Math.floor(Math.random() * (800 - sprites.plugSocket.height) + sprites.plugSocket.height / 2);
  this.addChild(sprites.plugSocket);
  // plugArmDark
  sprites.plugArmDark.x = 400;
  sprites.plugArmDark.y = 400;
  sprites.plugArmDark.pivot.set(sprites.plugArmDark.width / 2 + 10, game.plugPivotY);
  this.addChild(sprites.plugArmDark);
}

export async function update(this: MiniGameInstance, deltaTime: number): Promise<void> {
  const { didWin, sprites } = this;
  const { x, y } = this.interactiveData;
  const { plugPivotY, didWinRan } = this.game;

  if (!didWin) {
    const { plugArmDark, plugSocket } = sprites;

    plugArmDark.x = plugArmDark.x + (x - plugArmDark.x) / 5 + 5 * this.difficulty;
    plugArmDark.y = plugArmDark.y + (y - plugArmDark.y) / 5 + 5 * this.difficulty;
    if (plugArmDark.y < plugPivotY + 50) plugArmDark.y = plugPivotY + 50;

    const distToPlug = (Math.abs(plugArmDark.x - plugSocket.x) + Math.abs(plugArmDark.y - plugSocket.y)) / 1.45;
    const plugMaxRange = 225 - 50 * this.difficulty;
    const plugAlpha = plugMaxRange / distToPlug - 1;
    plugSocket.alpha = distToPlug > plugMaxRange ? 0 : plugAlpha;
    if (
      Math.abs(plugArmDark.x - plugSocket.x) <= 40 &&
      Math.abs(plugArmDark.y - plugSocket.y) <= 40 &&
      Math.abs(x - plugSocket.x) <= 20 &&
      Math.abs(y - plugSocket.y) <= 20
    ) {
      this.didWin = true;
      return;
    }
  } else if (!didWinRan) {
    const {
      plugSocket,
      plugArmDark,
      plugDarkness,

      plugBg,
      plugArmLightPlugged,
      plugSocketLight,
    } = sprites;
    plugSocket.alpha = 0;
    plugArmDark.alpha = 0;
    plugDarkness.alpha = 0;
    // plugArmDark
    plugArmLightPlugged.x = plugSocket.trueX;
    plugArmLightPlugged.y = plugSocket.trueY;
    plugArmLightPlugged.pivot.set(plugArmDark.width / 2 - 5, plugPivotY + 25);
    this.addChild(plugArmLightPlugged);
    // plugBg
    plugBg.x = 400;
    plugBg.y = 800;
    plugBg.pivot.set(plugBg.width / 2, plugBg.height);
    this.addChild(plugBg);
    plugSocketLight.x = plugSocket.trueX;
    plugSocketLight.y = plugSocket.trueY;
    plugSocketLight.pivot.set(plugSocketLight.width / 2, (plugSocketLight.height / 6) * 5);
    this.addChild(plugSocketLight);
    this.timeoutDelay = 300;
    this.didWin = true;
    this.game.didWinRan = true;
  }
}
