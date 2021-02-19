import { Application, Sprite, InteractionData, Text, TextStyle, Ticker, Loader, Graphics, Container } from 'pixi.js';
import * as PixiSound from 'pixi-sound';
import Keyboard from './keyboard';
import MiniGame from './lib/MiniGame';
import DoodleSprite from './lib/DoodleSprite';
import GameHUD from './lib/GameHUD';
import GameController from './lib/GameController';
// Temp Import 
import GetGoatScareFuncs from './minigames/GoatScare';
import GetNightPlugFuncs from './minigames/NightPlug';
import GetGhostShooterFuncs from './minigames/GhostShooter';
import GetTypingTestFuncs from './minigames/TypingTest';
import GetPitJumperFuncs from './minigames/PitJumper';
//import GetSketchManFuncs from './minigames/SketchMan';
import GetFlashlightFuncs from './minigames/Flashlight';
import GetHotdogFuncs from './minigames/Hotdog';
import GetPingPongFuncs from './minigames/PingPong';
import GetIceSkateFuncs from './minigames/IceSkate';
import GetImpastaFuncs from './minigames/Impasta';
import GetFlowersFuncs from './minigames/Flowers';

const sound = PixiSound.default.sound;

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 800;
const w = SCREEN_WIDTH;
const h = SCREEN_HEIGHT;

let app = new Application({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  backgroundColor: 0xffffff,
});
app.interactionData = new InteractionData();
document.body.appendChild(app.view);
Ticker.shared.autoStart = true;

// -- NOTE --
// commented out/removed audio use in this file due to 
// -- NOTE ---
// const loader = new Loader();
app.loader
  .add('plant_body', 'img/test_game/plant_body.png')
  .add('plant_maw_1', 'img/test_game/plant_maw_1.png')
  .add('plant_maw_2', 'img/test_game/plant_maw_2.png')
  // -- Assets needed for the HUD --
    // HUD Numbers
    .add('zeroA', 'img/hud/HUDN_0000.png')
    .add('zeroB', 'img/hud/HUDN_0001.png')
    .add('oneA', 'img/hud/HUDN_0002.png')
    .add('oneB', 'img/hud/HUDN_0003.png')
    .add('twoA', 'img/hud/HUDN_0004.png')
    .add('twoB', 'img/hud/HUDN_0005.png')
    .add('threeA', 'img/hud/HUDN_0006.png')
    .add('threeB', 'img/hud/HUDN_0007.png')
    .add('fourA', 'img/hud/HUDN_0008.png')
    .add('fourB', 'img/hud/HUDN_0009.png')
    .add('fiveA', 'img/hud/HUDN_0010.png')
    .add('fiveB', 'img/hud/HUDN_0011.png')
    .add('sixA', 'img/hud/HUDN_0012.png')
    .add('sixB', 'img/hud/HUDN_0013.png')
    .add('sevenA', 'img/hud/HUDN_0014.png')
    .add('sevenB', 'img/hud/HUDN_0015.png')
    .add('eightA', 'img/hud/HUDN_0016.png')
    .add('eightB', 'img/hud/HUDN_0017.png')
    .add('nineA', 'img/hud/HUDN_0018.png')
    .add('nineB', 'img/hud/HUDN_0019.png')
    // HUD Cloud
    .add('cloudA', 'img/hud/HUDC_0000.png')
    .add('cloudB', 'img/hud/HUDC_0001.png')
    // HUD Box
    .add('boxA', 'img/hud/HUDPLP_0000.png')
    .add('boxB', 'img/hud/HUDPLP_0001.png')
    // HUD Hearts
    .add('heartA', 'img/hud/HUDH_0000.png')
    .add('heartB', 'img/hud/HUDH_0001.png')
    .add('heartC', 'img/hud/HUDH_0002.png')
    .add('heartD', 'img/hud/HUDH_0003.png')
    .add('heartE', 'img/hud/HUDH_0004.png')
    .add('heartF', 'img/hud/HUDH_0005.png')
    .add('heartG', 'img/hud/HUDH_0006.png')
    // HUD Meter
    .add('meterA', 'img/hud/HUDM_0000.png')
    .add('meterB', 'img/hud/HUDM_0001.png')
    // HUD Sleeping Characters (Bodys)
    .add('impyA', 'img/hud/HUDPLPP_0000.png')
    .add('impyB', 'img/hud/HUDPLPP_0001.png')
    .add('clingyA', 'img/hud/HUDPLPP_0002.png')
    .add('clingyB', 'img/hud/HUDPLPP_0003.png')
    .add('miroA', 'img/hud/HUDPLPP_0004.png')
    .add('miroB', 'img/hud/HUDPLPP_0005.png')
    // HUD Sleeping Faces
      // Calm sleep
      .add('impyFaceA', 'img/hud/HUDPLN_0000.png')
      .add('impyFaceB', 'img/hud/HUDPLN_0001.png')
      .add('clingyFaceA', 'img/hud/HUDPLN_0002.png')
      .add('clingyFaceB', 'img/hud/HUDPLN_0003.png')
      .add('miroFaceA', 'img/hud/HUDPLN_0004.png')
      .add('miroFaceB', 'img/hud/HUDPLN_0005.png')
      // Anger sleep
      .add('impyFaceAngA', 'img/hud/HUDA_0000.png')
      .add('impyFaceAngB', 'img/hud/HUDA_0001.png')
      .add('impyFaceAngC', 'img/hud/HUDA_0002.png')
      .add('clingyFaceAngA', 'img/hud/HUDA2_0000.png')
      .add('clingyFaceAngB', 'img/hud/HUDA2_0001.png')
      .add('clingyFaceAngC', 'img/hud/HUDA2_0002.png')
      .add('clingyFaceAngD', 'img/hud/HUDA2_0003.png')
      .add('miroFaceAngA', 'img/hud/HUDA3_0000.png')
      .add('miroFaceAngB', 'img/hud/HUDA3_0001.png')
      .add('miroFaceAngC', 'img/hud/HUDA3_0002.png')
      .add('miroFaceAngD', 'img/hud/HUDA3_0003.png')

  // <==Minigames==>
  // --Clingy Games--
    // Ping Pong
    .add('pingBgA', 'img/clingy/pingpong/bg_0000.png')
    .add('pingBgB', 'img/clingy/pingpong/bg_0001.png')
    .add('pingBallA', 'img/clingy/pingpong/ball_0000.png')
    .add('pingBallB', 'img/clingy/pingpong/ball_0001.png')
    .add('pingHitEffectA', 'img/clingy/pingpong/hit_0000.png')
    .add('pingHitEffectB', 'img/clingy/pingpong/hit_0001.png')
    .add('pingEnHitEffectA', 'img/clingy/pingpong/enemyhit_0000.png')
    .add('pingEnHitEffectB', 'img/clingy/pingpong/enemyhit_0001.png')
    .add('pingPaddleA', 'img/clingy/pingpong/paddle_0000.png')
    .add('pingPaddleB', 'img/clingy/pingpong/paddle_0001.png')
    .add('pingEnPaddleA', 'img/clingy/pingpong/enemyp_0000.png')
    .add('pingEnPaddleB', 'img/clingy/pingpong/enemyp_0001.png')
    .add('pingWinA', 'img/clingy/pingpong/win_0000.png')
    .add('pingWinB', 'img/clingy/pingpong/win_0001.png')
    .add('pingLossA', 'img/clingy/pingpong/loss_0000.png')
    .add('pingLossB', 'img/clingy/pingpong/loss_0001.png')
    // Ice Skating
    .add('iceBgA', 'img/clingy/iceskate/ice_0001.png')
    .add('iceBgB', 'img/clingy/iceskate/ice_0000.png')
    .add('iceScreenA', 'img/clingy/iceskate/screen_0000.png')
    .add('iceScreenB', 'img/clingy/iceskate/screen_0001.png')
    .add('iceFigure8A', 'img/clingy/iceskate/figure8_0000.png')
    .add('iceCircleA', 'img/clingy/iceskate/circle_0000.png')
    .add('iceSquareA', 'img/clingy/iceskate/square_0000.png')
    .add('iceTriangleA', 'img/clingy/iceskate/triangle_0000.png')
    .add('iceWinA', 'img/clingy/iceskate/win_0000.png')
    .add('iceWinB', 'img/clingy/iceskate/win_0001.png')
    .add('iceLossA', 'img/clingy/iceskate/loss_0000.png')
    .add('iceLossB', 'img/clingy/iceskate/loss_0001.png')
    .add('icePlayerA', 'img/clingy/iceskate/you_0000.png')
    .add('icePlayerB', 'img/clingy/iceskate/you_0001.png')
    // Snow Sledding
    .add('snowBgA', 'img/clingy/snowsled/bg_0000.png')
    .add('snowIconsA', 'img/clingy/snowsled/icons_0000.png')
    .add('snowIconsB', 'img/clingy/snowsled/icons_0001.png')
    .add('snowBarA', 'img/clingy/snowsled/bar_0000.png')
    .add('snowBarB', 'img/clingy/snowsled/bar_0001.png')
    .add('snowRampA', 'img/clingy/snowsled/ramp_0000.png')
    .add('snowRockA', 'img/clingy/snowsled/rock_0000.png')
    .add('snowPengA', 'img/clingy/snowsled/peng_0000.png')
    .add('snowPengB', 'img/clingy/snowsled/peng_0001.png')
    .add('snowWinA', 'img/clingy/snowsled/win_0000.png')
    .add('snowWinB', 'img/clingy/snowsled/win_0001.png')
    .add('snowLossA', 'img/clingy/snowsled/loss_0000.png')
    .add('snowLossB', 'img/clingy/snowsled/loss_0001.png')
    // Typing
    .add('typeArrowA', 'img/clingy/typing/arrow_0000.png')
    .add('typeArrowB', 'img/clingy/typing/arrow_0001.png')
    .add('typeClickmarkA', 'img/clingy/typing/clickmark_0000.png')
    .add('typeCursorA', 'img/clingy/typing/cursor_0000.png')
    .add('typeCursorB', 'img/clingy/typing/cursor_0001.png')
    .add('typeHillA', 'img/clingy/typing/hill_0000.png')
    .add('typeHillB', 'img/clingy/typing/hill_0001.png')
    .add('typeQuestionA', 'img/clingy/typing/question_0000.png')
    .add('typeQuestionB', 'img/clingy/typing/question_0001.png')
    .add('typeSmileA', 'img/clingy/typing/smile_0000.png')
    .add('typeSmileB', 'img/clingy/typing/smile_0001.png')
    .add('typeTriangleA', 'img/clingy/typing/triangle_0000.png')
    .add('typeTriangleB', 'img/clingy/typing/triangle_0001.png')
    .add('typeTriangleDownA', 'img/clingy/typing/triangledown_0000.png')
    .add('typeTriangleDownB', 'img/clingy/typing/triangledown_0001.png')
    .add('typeTriangleUpA', 'img/clingy/typing/triangleup_0000.png')
    .add('typeTriangleUpB', 'img/clingy/typing/triangleup_0001.png')
    .add('typeLossA', 'img/clingy/typing/loss_0000.png')
    .add('typeLossB', 'img/clingy/typing/loss_0001.png')
    .add('typeWinA', 'img/clingy/typing/win_0000.png')
    .add('typeWinB', 'img/clingy/typing/win_0001.png')
    .add('typeKeyboardA', 'img/clingy/typing/keyboard_0000.png')
    .add('typeKeyboardB', 'img/clingy/typing/keyboard_0001.png')
    .add('typeTextA', 'img/clingy/typing/text_0000.png')
    .add('typeTextB', 'img/clingy/typing/text_0001.png')
    // Hotdog
    .add('hdAngerFaceA', 'img/clingy/hotdog/anger_0000.png')
    .add('hdAngerFaceB', 'img/clingy/hotdog/anger_0001.png')
    .add('hdBaconA', 'img/clingy/hotdog/bacon_0000.png')
    .add('hdBaconB', 'img/clingy/hotdog/bacon_0001.png')
    .add('hdBubbleA', 'img/clingy/hotdog/bubble_0000.png')
    .add('hdBubbleB', 'img/clingy/hotdog/bubble_0001.png')
    .add('hdBunForwardA', 'img/clingy/hotdog/bunf_0000.png')
    .add('hdBunForwardB', 'img/clingy/hotdog/bunf_0001.png')
    .add('hdMeatA', 'img/clingy/hotdog/buns_0000.png')
    .add('hdMeatB', 'img/clingy/hotdog/buns_0001.png')
    .add('hdCheeseA', 'img/clingy/hotdog/cheese_0000.png')
    .add('hdCheeseB', 'img/clingy/hotdog/cheese_0001.png')
    .add('hdCounterA', 'img/clingy/hotdog/counter_0000.png')
    .add('hdCounterB', 'img/clingy/hotdog/counter_0001.png')
    .add('hdHandA', 'img/clingy/hotdog/hand_0000.png')
    .add('hdHandB', 'img/clingy/hotdog/hand_0001.png')
    .add('hdClickContentsA', 'img/clingy/hotdog/hotcontents_0000.png')
    .add('hdClickContentsB', 'img/clingy/hotdog/hotcontents_0001.png')
    .add('hdKetchupSplatA', 'img/clingy/hotdog/ketchsplat_0000.png')
    .add('hdKetchupSplatB', 'img/clingy/hotdog/ketchsplat_0001.png')
    .add('hdMustardSplatA', 'img/clingy/hotdog/mussplat_0000.png')
    .add('hdMustardSplatB', 'img/clingy/hotdog/mussplat_0001.png')
    .add('hdMustardA', 'img/clingy/hotdog/mustard_0000.png')
    .add('hdMustardB', 'img/clingy/hotdog/mustard_0001.png')
    .add('hdKetchupA', 'img/clingy/hotdog/ketchup_0000.png')
    .add('hdKetchupB', 'img/clingy/hotdog/ketchup_0001.png')
    .add('hdOnionsA', 'img/clingy/hotdog/onions_0000.png')
    .add('hdOnionsB', 'img/clingy/hotdog/onions_0001.png')
    .add('hdThingA', 'img/clingy/hotdog/thing_0000.png')
    .add('hdThingB', 'img/clingy/hotdog/thing_0001.png')
    // Dungeon
      // Assets need to be handled by clingy

  // --Impy Games--
    // Flashlight
    .add('flashBananaA', 'img/impy/flashlight/banana_0000.png')
    .add('flashBananaB', 'img/impy/flashlight/banana_0001.png')
    .add('flashDoorOpenA', 'img/impy/flashlight/dooropen_0000.png')
    .add('flashDoorOpenB', 'img/impy/flashlight/dooropen_0001.png')
    .add('flashDoorCloseA', 'img/impy/flashlight/doorclose_0000.png')
    .add('flashDoorCloseB', 'img/impy/flashlight/doorclose_0001.png')
    .add('flashDoorCloseC', 'img/impy/flashlight/doorclose_0002.png')
    .add('flashDoorCloseD', 'img/impy/flashlight/doorclose_0003.png')
    .add('flashFingerA', 'img/impy/flashlight/finger_0000.png')
    .add('flashFingerB', 'img/impy/flashlight/finger_0001.png')
    .add('flashFloatyManA', 'img/impy/flashlight/floatyman_0000.png')
    .add('flashFloatyManB', 'img/impy/flashlight/floatyman_0001.png')
    .add('flashImpyDarkA', 'img/impy/flashlight/impydark_0000.png')
    .add('flashImpyDarkB', 'img/impy/flashlight/impydark2_0000.png')
    .add('flashImpyDark2A', 'img/impy/flashlight/impydark_0001.png')
    .add('flashImpyDark2B', 'img/impy/flashlight/impydark2_0001.png')
    .add('flashImpyLossA', 'img/impy/flashlight/impyloss_0000.png')
    .add('flashImpyLossB', 'img/impy/flashlight/impyloss_0001.png')
    .add('flashImpyWinA', 'img/impy/flashlight/impywin_0000.png')
    .add('flashImpyWinB', 'img/impy/flashlight/impywin_0001.png')
    .add('flashMeterA', 'img/impy/flashlight/meter_0000.png')
    .add('flashMeterB', 'img/impy/flashlight/meter_0001.png')
    .add('flashMeterMaskA', 'img/impy/flashlight/metermask_0000.png')
    .add('flashMeterMaskB', 'img/impy/flashlight/metermask_0001.png')
    .add('flashMeterShadeA', 'img/impy/flashlight/metershade_0000.png')
    .add('flashMeterShadeB', 'img/impy/flashlight/metershade_0001.png')
    .add('flashMeterBumpA', 'img/impy/flashlight/meterbump_0000.png')
    .add('flashMeterBumpB', 'img/impy/flashlight/meterbump_0001.png')
    .add('flashMeterLineA', 'img/impy/flashlight/meterline_0000.png')
    .add('flashMeterLineB', 'img/impy/flashlight/meterline_0001.png')
    .add('flashMonsterA', 'img/impy/flashlight/monster_0000.png')
    .add('flashMonsterB', 'img/impy/flashlight/monster_0001.png')
    .add('flashMonsterC', 'img/impy/flashlight/monster_0002.png')
    .add('flashMonsterD', 'img/impy/flashlight/monster_0003.png')
    .add('flashMonsterE', 'img/impy/flashlight/monster_0004.png')
    .add('flashMonsterF', 'img/impy/flashlight/monster_0005.png')
    .add('flashMouseA', 'img/impy/flashlight/mouse_0000.png')
    .add('flashMouseB', 'img/impy/flashlight/mouse_0001.png')
    .add('flashW2A', 'img/impy/flashlight/w2_0000.png')
    .add('flashW2B', 'img/impy/flashlight/w2_0001.png')
    // Ghost Shooter
    .add('ghostBgA', 'img/impy/ghostshooter/bg_0000.png')
    .add('ghostBgB', 'img/impy/ghostshooter/bg_0001.png')
    .add('ghostCrosshairA', 'img/impy/ghostshooter/crosshair_0000.png')
    .add('ghostCrosshairB', 'img/impy/ghostshooter/crosshair_0001.png')
    .add('ghostGhostA', 'img/impy/ghostshooter/ghost_0000.png')
    .add('ghostGhostB', 'img/impy/ghostshooter/ghost_0001.png')
    .add('ghostLossA', 'img/impy/ghostshooter/loss_0000.png')
    .add('ghostLossB', 'img/impy/ghostshooter/loss_0001.png')
    .add('ghostWinA', 'img/impy/ghostshooter/win_0000.png')
    .add('ghostWinB', 'img/impy/ghostshooter/win_0001.png')
    .add('ghostPapA', 'img/impy/ghostshooter/pap_0000.png')
    .add('ghostPapB', 'img/impy/ghostshooter/pap_0001.png')
    // Night Plug 
    .add('plugArmDarkA', 'img/impy/nightplug/arm_0000.png')
    .add('plugArmDarkB', 'img/impy/nightplug/arm_0001.png')
    .add('plugArmLightA', 'img/impy/nightplug/armlight_0000.png')
    .add('plugArmLightB', 'img/impy/nightplug/armlight_0001.png')
    .add('plugArmDarkPluggedA', 'img/impy/nightplug/armplugged_0000.png')
    .add('plugArmDarkPluggedB', 'img/impy/nightplug/armplugged_0001.png')
    .add('plugArmLightPluggedA', 'img/impy/nightplug/armlightplugged_0000.png')
    .add('plugArmLightPluggedB', 'img/impy/nightplug/armlightplugged_0001.png')
    .add('plugSocketA', 'img/impy/nightplug/socket_0000.png')
    .add('plugSocketB', 'img/impy/nightplug/socket_0001.png')
    .add('plugSocketLightA', 'img/impy/nightplug/socketlight_0000.png')
    .add('plugSocketLightB', 'img/impy/nightplug/socketlight_0001.png')
    .add('plugBgA', 'img/impy/nightplug/bg_0000.png')
    .add('plugBgB', 'img/impy/nightplug/bg_0001.png')
    .add('plugDarknessA', 'img/impy/nightplug/darkness_0000.png')
    // Sketchman
    .add('sketchLossA', 'img/impy/sketchman/loss_0000.png')
    .add('sketchLossB', 'img/impy/sketchman/loss_0001.png')
    .add('sketchWinA', 'img/impy/sketchman/win_0000.png')
    .add('sketchWinB', 'img/impy/sketchman/win_0001.png')
    .add('sketchPaperA', 'img/impy/sketchman/paper_0000.png')
    .add('sketchPaperB', 'img/impy/sketchman/paper_0001.png')
    .add('sketchPenA', 'img/impy/sketchman/pen_0000.png')
    .add('sketchPenB', 'img/impy/sketchman/pen_0001.png')
    .add('sketchStickmanA', 'img/impy/sketchman/stickman_0000.png')
    .add('sketchStickmanB', 'img/impy/sketchman/stickman_0001.png')
    // Pit Jumper
    .add('jumpDeathPitA', 'img/impy/pitjump/deathpit_0000.png')
    .add('jumpDeathPitB', 'img/impy/pitjump/deathpit_0001.png')
    .add('jumpFloorA', 'img/impy/pitjump/floor_0000.png')
    .add('jumpFloorB', 'img/impy/pitjump/floor_0001.png')
    .add('jumpImpDeathA', 'img/impy/pitjump/impdeath_0000.png')
    .add('jumpImpDeathB', 'img/impy/pitjump/impdeath_0001.png')
    .add('jumpImpRunA', 'img/impy/pitjump/imprun_0000.png')
    .add('jumpImpRunB', 'img/impy/pitjump/imprun_0001.png')
    .add('jumpImpRunC', 'img/impy/pitjump/imprun_0002.png')
    .add('jumpImpRunD', 'img/impy/pitjump/imprun_0003.png')
    .add('jumpImpWin', 'img/impy/pitjump/impwin_0000.png')
    .add('jumpImpWinB', 'img/impy/pitjump/impwin_0001.png')
    .add('jumpMeanA', 'img/impy/pitjump/mean_0000.png')
    .add('jumpMeanB', 'img/impy/pitjump/mean_0001.png')
    // Phone bomb
      // WIP (clingy import this plz)
    // Maze Game
    .add('mazeBedA', 'img/impy/mazegame_boss/bed_0000.png')
    .add('mazeBedB', 'img/impy/mazegame_boss/bed_0001.png')
    .add('mazeToiletA', 'img/impy/mazegame_boss/toilet_0000.png')
    .add('mazeToiletB', 'img/impy/mazegame_boss/toilet_0001.png')
    .add('mazeImpyA', 'img/impy/mazegame_boss/impy_0000.png')
    .add('mazeImpyB', 'img/impy/mazegame_boss/impy_0001.png')
    .add('mazeLoseA', 'img/impy/mazegame_boss/MAZELOSE_0000.png')
    .add('mazeLoseB', 'img/impy/mazegame_boss/MAZELOSE_0001.png')
    .add('mazeWinA', 'img/impy/mazegame_boss/MAZEWIN_0000.png')
    .add('mazeWinB', 'img/impy/mazegame_boss/MAZEWIN_0001.png')
    .add('mazeRoom1A', 'img/impy/mazegame_boss/MAZEM1_0000.png')
    .add('mazeRoom1B', 'img/impy/mazegame_boss/MAZEM1_0001.png')
    .add('mazeRoom2A', 'img/impy/mazegame_boss/MAZEM2_0000.png')
    .add('mazeRoom2B', 'img/impy/mazegame_boss/MAZEM2_0001.png')
    .add('mazeRoom3A', 'img/impy/mazegame_boss/MAZEM3_0000.png')
    .add('mazeRoom3B', 'img/impy/mazegame_boss/MAZEM3_0001.png')

  // --Miro Games--
    // Impasta
    .add('snailBgA', 'img/miro/impasta/bg_0000.png')
    .add('snailBgB', 'img/miro/impasta/bg_0001.png')
    .add('snailImposterA', 'img/miro/impasta/fakesnail_0000.png')
    .add('snailImposterB', 'img/miro/impasta/fakesnail_0001.png')
    .add('snailLossA', 'img/miro/impasta/loss_0000.png')
    .add('snailLossB', 'img/miro/impasta/loss_0001.png')
    .add('snailWinA', 'img/miro/impasta/win_0000.png')
    .add('snailWinB', 'img/miro/impasta/win_0001.png')
    .add('snailSnailsA', 'img/miro/impasta/snails_0000.png')
    .add('snailSnailsB', 'img/miro/impasta/snails_0001.png')
    .add('snailPointA', 'img/miro/impasta/point_0000.png')
    .add('snailPointB', 'img/miro/impasta/point_0001.png')
    // -- Goat Scare --
    .add('goatBgA', 'img/miro/goatscare/GOAT_BG_A.png')
    .add('goatBgB', 'img/miro/goatscare/GOAT_BG_B.png')
    .add('goatBushA', 'img/miro/goatscare/GOAT_BUSH_A.png')
    .add('goatBushB', 'img/miro/goatscare/GOAT_BUSH_B.png')
    .add('goatCalmA', 'img/miro/goatscare/GOAT_CALM_A.png')
    .add('goatCalmB', 'img/miro/goatscare/GOAT_CALM_B.png')
    .add('goatGroundA', 'img/miro/goatscare/GOAT_GROUND_A.png')
    .add('goatGroundB', 'img/miro/goatscare/GOAT_GROUND_B.png')
    .add('goatScaredA', 'img/miro/goatscare/GOAT_SCARED_A.png')
    .add('goatScaredB', 'img/miro/goatscare/GOAT_SCARED_B.png')
    .add('goatSneakA', 'img/miro/goatscare/GOAT_SNEAK_A.png')
    .add('goatSneakB', 'img/miro/goatscare/GOAT_SNEAK_B.png')
    .add('goatSpookA', 'img/miro/goatscare/GOAT_SPOOK_A.png')
    .add('goatSpookB', 'img/miro/goatscare/GOAT_SPOOK_B.png')
    // Flowers
    .add('flowerBasketsA', 'img/miro/flowers/baskets_0000.png')
    // .add('flowerBasketB', 'img/miro/flowers/baskets_0001.png')
    .add('flowerSoftFlowerA', 'img/miro/flowers/softflower_0000.png')
    .add('flowerSoftFlowerB', 'img/miro/flowers/softflower_0001.png')
    .add('flowerSpikeFlowerA', 'img/miro/flowers/spikeflower_0000.png')
    .add('flowerSpikeFlowerB', 'img/miro/flowers/spikeflower_0001.png')
    .add('flowerLossA', 'img/miro/flowers/loss_0000.png')
    .add('flowerLossB', 'img/miro/flowers/loss_0001.png')
    .add('flowerWinA', 'img/miro/flowers/win_0000.png')
    .add('flowerWinB', 'img/miro/flowers/win_0001.png')
    // Monkey Vines
    .add('monkeyBgA', 'img/miro/vineswing/bg_0000.png')
    .add('monkeyBgB', 'img/miro/vineswing/bg_0001.png')
    .add('monkeyA', 'img/miro/vineswing/monkey_0000.png')
    .add('monkeyB', 'img/miro/vineswing/monkey_0001.png')
    .add('monkeyVineA', 'img/miro/vineswing/vine_0000.png')
    .add('monkeyVineB', 'img/miro/vineswing/vine_0001.png')
    // Chompy
    .add('chompyChompA', 'img/miro/chompy/chomp_0000.png')
    .add('chompyChompB', 'img/miro/chompy/chomp_0001.png')
    .add('chompyBgA', 'img/miro/chompy/CHOMPBG_0000.png')
    .add('chompyBgB', 'img/miro/chompy/CHOMPBG_0001.png')
    .add('chompyChompNA', 'img/miro/chompy/CHOMPN_0000.png')
    .add('chompyChompNB', 'img/miro/chompy/CHOMPN_0001.png')
    .add('chomypChompSA', 'img/miro/chompy/CHOMPS_0000.png')
    .add('chomypChompSB', 'img/miro/chompy/CHOMPS_0001.png')
    .add('chompyA', 'img/miro/chompy/chompy_0000.png')
    .add('chompyB', 'img/miro/chompy/chompy_0001.png')
    .add('chompyFlyA', 'img/miro/chompy/FLY_0000.png')
    .add('chompyFlyB', 'img/miro/chompy/FLY_0001.png')
    .add('chompyFlyNormA', 'img/miro/chompy/flynorm_0000.png')
    .add('chompyFlyNormB', 'img/miro/chompy/flynorm_0001.png')
    .add('chompyMosquitoPeekA', 'img/miro/chompy/mospeek1_0000.png')
    .add('chompyMosquitoPeekB', 'img/miro/chompy/mospeek1_0001.png')
    .add('chompyMosquitoPeekC', 'img/miro/chompy/mospeek1_0002.png')
    .add('chompyMosquitoPeek2A', 'img/miro/chompy/mospeek2_0000.png')
    .add('chompyMosquitoPeek2B', 'img/miro/chompy/mospeek2_0001.png')
    .add('chompyMosquitoPeek2C', 'img/miro/chompy/mospeek2_0002.png')
    .add('chompyMosquitoA', 'img/miro/chompy/mosquito_0000.png')
    .add('chompyMosquitoB', 'img/miro/chompy/mosquito_0001.png')
    .add('chompySpiderA', 'img/miro/chompy/spider_0000.png')
    .add('chompySpiderB', 'img/miro/chompy/spider_0001.png')

app.loader.load((loader, resources) => {
  init(loader, resources);
});

function init (loader, resources) {
  const { zeroA, zeroB } = resources;
  //console.log( app.loader.resources, resources)
  // const plant_boy = new Container();
  // plant_boy.x = SCREEN_WIDTH / 2;
  // plant_boy.y = SCREEN_HEIGHT / 2;
  // app.stage.addChild(plant_boy);

  // const plant_body_sprite = new Sprite(plant_body.texture);
  // plant_boy.addChild(plant_body_sprite);
  // const plant_maw_1_sprite = new Sprite(plant_maw_1.texture);
  // plant_maw_1_sprite.x = 90;
  // plant_maw_1_sprite.y -= plant_maw_1_sprite.height - 10;
  // plant_maw_1_sprite.alpha = 0;
  // plant_boy.addChild(plant_maw_1_sprite);
  // const plant_maw_2_sprite = new Sprite(plant_maw_2.texture);
  // plant_maw_2_sprite.x = 60;
  // plant_maw_2_sprite.y -= plant_maw_2_sprite.height - 10;
  // plant_boy.addChild(plant_maw_2_sprite);

  // app.stage.addChild(plant_boy);

  // const zero = new DoodleSprite({
  //   app,
  //   texture: [zeroA.texture, zeroB.texture],
  //   timeMod: 1,
  //   swapMS: 500,
  // });

  // app.stage.addChild(zero);
  

  // IF YOU DELETE THIS COMMENT I WILL FUCKING END YOU BORA >:C
  // NOTE: Sytax is [ song.sound.play(); ]

  // const newMG = new MiniGame({ 
  //   app: app, 
  //   timeMod: 1, 
  //   update: exampleRenderFunction, 
  //   maxMS: 5000,
  // });

  // newMG.didWin
  //   .then( won => {
  //     console.log('Won?', won)
  //     if (won === true) {
  //       alert('Won!');
  //     } else {
  //       alert('Lost :(')
  //     }
  //   })
  //   .catch( err => {
  //     console.log(err)
  //   });

  // console.log(newMG.didWin)

  // Rename init and update once making a new instance of the minigame 
  const { init, update } = GetPingPongFuncs(); 
  const Impasta = new MiniGame({
    app,
    init,
    update,
    difficulty: 1,
    maxMS: 10000,
  });

  app.stage.addChild(Impasta);
  // console.log(data)
  // const HUD = new GameController({ app, MGArray: [], MGBoss: {} });
  // app.stage.addChild(HUD);
};