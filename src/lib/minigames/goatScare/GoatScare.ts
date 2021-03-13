import { Texture, Loader } from 'pixi.js';
import DoodleSprite, { DoodleSpriteOptions } from '../../core/DoodleSprite';
import MiniGameInstance from '../../core/MiniGameInstance';
import { parseTextures, populateSprites } from '../../core/factory/assetLoader';
import { texturesArray } from './GoatScare.assets';

export class Goat extends DoodleSprite {
  public isScared = false;
  public gotScared = false;
  public scareNext = false;
  public desiredAngle = Math.PI / 3;
  public rotationMS = 3000 / 16.66;
  public goatArrayRefrence: Array<Goat>;
  constructor(
    goatArrayRefrence: Array<Goat>,
    textures: Texture[] = [Loader.shared.resources.goatCalmA.texture, Loader.shared.resources.goatCalmB.texture],
    doodleParams: DoodleSpriteOptions = {}
  ) {
    super(textures, doodleParams);
    this.pivot.set(this.width / 2, this.height);
    this._init();
    this.goatArrayRefrence = goatArrayRefrence;
    this.goatArrayRefrence.push(this);
  }

  _init = (): void => {
    this.y = 653;
    this.x = 400 + 140 * this.goatArrayRefrence.length;
  };

  update = (deltaTime: number): void => {
    const { isScared, desiredAngle, rotationMS, gotScared } = this;
    if (isScared === true && this.rotation <= desiredAngle) {
      const movement = deltaTime / rotationMS;
      this.rotation += movement * (Math.PI / 3);
      if (this.rotation > Math.PI / 4) {
        this.rotationMS = 3500 / 16.66;
        this.scareNext = true;
      } else {
        this.rotationMS *= 0.97;
      }
    }

    if (isScared && !gotScared) {
      this.textureArray = [Loader.shared.resources.goatScaredA.texture, Loader.shared.resources.goatScaredB.texture];
      this.texture = this.textureArray[this.textureIndex % 2];
      this.gotScared = true;
    }
  };
}

export async function init(this: MiniGameInstance): Promise<void> {
  // Generate all required sprites.
  const textures = await parseTextures(texturesArray);
  this.textures = textures;
  const sprites = populateSprites(textures);
  this.sprites = sprites;
  // Create a storage object on the class
  this.game = {};
  const game = this.game;
  game.goatIndex = 0;
  game.positionPrev = 0;
  game.positions = [
    {
      x: (val: number) => val <= 380,
      y: (val: number) => val <= 380,
    },
    {
      x: (val: number) => val >= 420,
      y: (val: number) => val <= 380,
    },
    {
      x: (val: number) => val >= 420,
      y: (val: number) => val >= 420,
    },
    {
      x: (val: number) => val <= 380,
      y: (val: number) => val >= 420,
    },
  ];
  game.direction = 1;
  game.power = 0;
  game.powerLoss;
  // Set up interactivity
  this.on('pointermove', (val: any) => {
    console.log(val);
  });
  // How quickly the player loses "shout" power.
  game.powerLoss = 1300 / 16.66 - (this.difficulty * 300) / 16.66;
  // Background
  sprites.goatBg.x = 0;
  sprites.goatBg.y = 150;
  this.addChild(sprites.goatBg);
  // Ground
  sprites.goatGround.x = 0;
  sprites.goatGround.y = 650;
  this.addChild(sprites.goatGround);
  // Bush
  sprites.goatBush.x = 0;
  sprites.goatBush.y = 505;
  sprites.goatBush.textureOffset = [
    { x: 0, y: 6 },
    { x: 0, y: 0 },
  ];
  sprites.goatBush.textureOffsetActive = true;
  this.addChild(sprites.goatBush);
  // goatSpin
  sprites.goatSpin.x = 800 / 2 - sprites.goatSpin.width / 2;
  sprites.goatSpin.y = 100;
  this.addChild(sprites.goatSpin);
  // Person Sneak
  sprites.goatSneak.x = 95 + sprites.goatSneak.width / 2;
  sprites.goatSneak.y = 395 + sprites.goatSneak.height;
  sprites.goatSneak.pivot.set(sprites.goatSneak.width / 2, sprites.goatSneak.height);
  sprites.goatSneak.textureOffset = [
    { x: 0, y: 6 },
    { x: 0, y: 4 },
  ];
  sprites.goatSneak.textureOffsetActive = true;
  this.addChild(sprites.goatSneak);
  // Person Spook
  sprites.goatSpook.x = 30;
  sprites.goatSpook.y = 356;
  sprites.goatSpook.textureOffset = [
    { x: 0, y: 0 },
    { x: -2, y: -14 },
  ];
  sprites.goatSpook.textureOffsetActive = true;
  this.addChild(sprites.goatSpook);
  sprites.goatSpook.alpha = 0;
  // Goat setup
  game.goats = [];
  for (let i = 0; i < 5; i++) {
    const newGoat = new Goat(game.goats);
    this.addChild(newGoat);
  }
}

export async function update(this: MiniGameInstance, deltaTime: number): Promise<void> {
  const { goats, goatIndex: currentGoatIndex, power } = this.game;
  const game = this.game;

  goats.forEach((goat: any) => goat.update(deltaTime));
  if (goats[currentGoatIndex].scareNext) {
    if (currentGoatIndex + 1 < goats.length) {
      goats[++game.goatIndex].isScared = true;
    } else {
      goats[currentGoatIndex].scareNext = false;
    }
  }

  // let validPosition;
  // const { x, y } = mousePosition;
  // for (const positionIndex in positions) {
  //   const position = positions[positionIndex];
  //   if (position.x(x) && position.y(y)) {
  //     validPosition = parseInt(positionIndex);
  //     break;
  //   }
  // }

  // if (typeof validPosition === 'number' && validPosition !== positionPrev) {
  //   const nextValidPosition = (positionPrev + direction) % positions.length;
  //   const lastValidPosition = (positionPrev - direction) % positions.length;
  //   if (nextValidPosition === validPosition) {
  //     this.game.power += 1;
  //   } else if (lastValidPosition === validPosition) {
  //     direction *= -1;
  //   }
  //   positionPrev = validPosition;
  // }

  // if (power < 0) {
  //   power = 0;
  // } else if (power > 10) {
  //   power = 10;
  //   goats[0].isScared = true;
  //   sprites.goatSneak.alpha = 0;
  //   sprites.goatSpook.alpha = 1;
  //   if (!didWin) {
  //     this.winOnTimeout = true;
  //   }
  //   didWin = true;
  // } else {
  //   power -= deltaMS / powerLossMS;
  //   sprites.goatSneak.scale.set(1 + 0.05 * (power / 10), 0.5 + 0.5 * (1 - power / 10));
  // }
}
