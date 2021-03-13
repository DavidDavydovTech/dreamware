import { Application, Loader, settings, SCALE_MODES } from 'pixi.js';
// import WorldMap from './lib/core/WorldMap';
import MiniGame from './lib/core/MiniGame';
import { assetsObject } from './lib/minigames/goatScare/GoatScare.assets';
import { init, update } from './lib/minigames/goatScare/GoatScare';
import './style.css';

const gameWidth = 800;
const gameHeight = 800;
settings.SCALE_MODE = SCALE_MODES.NEAREST;

const app = new Application({
  backgroundColor: 0xffffff, // 0xd3d3d3
  width: gameWidth,
  height: gameHeight,
});

const stage = app.stage;

window.onload = async (): Promise<void> => {
  await loadGameAssets();

  document.body.appendChild(app.view);

  resizeCanvas();

  // const mainMenu = new WorldMap();
  // stage.addChild(mainMenu);
  const minigame = new MiniGame(init, update);
  stage.addChild(minigame.instance);
};

async function loadGameAssets(): Promise<void> {
  return new Promise((res, rej) => {
    const loader = Loader.shared;
    for (const asset in assetsObject) {
      // @ts-ignore - Typescript is stupid and insists that using the key name of a known key-value pair produces a type of any...
      const url = `assets/${assetsObject[asset]}`;
      loader.add(asset, url);
    }

    loader.onComplete.once(() => {
      res();
    });

    loader.onError.once(() => {
      rej();
    });

    loader.load();
  });
}

// Source: https://gist.github.com/Beefster09/7264303ee4b4b2086f372f1e70e8eddd
// const glslShader = `#version 330 core

// in vec2 frag_uv;

// uniform sampler2D virtual_screen;
// uniform float sharpness = 2.0;

// out vec4 frag_color;

// float sharpen(float pix_coord) {
//     float norm = (fract(pix_coord) - 0.5) * 2.0;
//     float norm2 = norm * norm;
//     return floor(pix_coord) + norm * pow(norm2, sharpness) / 2.0 + 0.5;
// }

// void main() {
//     vec2 vres = textureSize(virtual_screen, 0);
//     frag_color = texture(virtual_screen, vec2(
//         sharpen(frag_uv.x * vres.x) / vres.x,
//         sharpen(frag_uv.y * vres.y) / vres.y
//     ));
//     // To visualize how this makes the grid:
//     // frag_color = vec4(
//     //     fract(sharpen(frag_uv.x * vres.x)),
//     //     fract(sharpen(frag_uv.y * vres.y)),
//     //     0.5, 1.0
//     // );
// }
// `;
// const scaleFilter = new Filter(undefined, glslShader);
// app.stage.filters = [scaleFilter];

function resizeCanvas(): void {
  const gameRatio = gameWidth / gameHeight;
  const resize = () => {
    let w, h, scale;
    const windowRatio = window.innerWidth / window.innerHeight;
    if (windowRatio >= gameRatio) {
      h = window.innerHeight || gameHeight;
      scale = h / gameHeight;
      w = gameWidth * scale;
    } else {
      w = window.innerWidth || gameWidth;
      scale = w / gameWidth;
      h = gameHeight * scale;
    }
    app.renderer.resize(w, h);
    app.stage.scale.set(scale, scale);
  };

  resize();

  window.addEventListener('resize', resize);
}
