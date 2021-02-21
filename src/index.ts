import { Application, AnimatedSprite, Texture, Loader } from "pixi.js";

import "./style.css";

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
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;
        loader.add("rabbit", "./assets/simpleSpriteSheet.json");

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
    const resize = () => {
        let w, h;
        if (window.innerWidth >= window.innerHeight) {
            w = window.innerHeight || gameWidth;
            h = window.innerHeight || gameHeight;
        } else {
            w = window.innerWidth || gameWidth;
            h = window.innerWidth || gameHeight;
        }
        app.renderer.resize(w, h);

        const xScale = w / gameWidth;
        const yScale = h / gameHeight;
        app.stage.scale.set(xScale, yScale);
    };

    resize();

    window.addEventListener("resize", resize);
}

function getBird(): AnimatedSprite {
    const bird = new AnimatedSprite([
        Texture.from("birdUp.png"),
        Texture.from("birdMiddle.png"),
        Texture.from("birdDown.png"),
    ]);

    bird.loop = true;
    bird.animationSpeed = 0.1;
    bird.play();
    bird.scale.set(3);

    return bird;
}
