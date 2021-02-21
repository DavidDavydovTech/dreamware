import { Application, AnimatedSprite, Texture, Loader } from 'pixi.js';
import WorldMap from './lib/core/WorldMap';

import './style.css';

const gameWidth = 800;
const gameHeight = 800;

const app = new Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

const stage = app.stage;

window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);

    resizeCanvas();

    const birdFromSprite = getBird();
    birdFromSprite.anchor.set(0.5, 0.5);
    birdFromSprite.position.set(400, 400);

    stage.addChild(birdFromSprite);

    const mainMenu = new WorldMap();
    stage.addChild(mainMenu);
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;
        loader.add('rabbit', './assets/simpleSpriteSheet.json');

        loader.onComplete.once(() => {
            res();
        });

        loader.onError.once(() => {
            rej();
        });

        loader.load();
    });
}

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

function getBird(): AnimatedSprite {
    const bird = new AnimatedSprite([
        Texture.from('birdUp.png'),
        Texture.from('birdMiddle.png'),
        Texture.from('birdDown.png'),
    ]);

    bird.loop = true;
    bird.animationSpeed = 0.1;
    bird.play();
    bird.scale.set(3);

    return bird;
}
