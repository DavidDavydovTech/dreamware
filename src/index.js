import { Application, Sprite, Text, TextStyle, Ticker, Loader, Graphics, Container } from 'pixi.js';
import * as PixiSound from 'pixi-sound';
import Peer from 'peerjs';
import Keyboard from './keyboard';
const sound = PixiSound.default.sound;

class SlideController {
  constructor() {
    // Bind Funcs:
    this._init = this._init.bind(this);
    this._initPeer = this._initPeer.bind(this);
    this._initControls = this._initControls.bind(this);
    this._changeSlide = this._changeSlide.bind(this);

    this.state = {
      _peer: null,
      _user: {
        type: 'viewer', // Can be either viewer, attendee, or presenter.
        peerID: null, // The peer-id of the current user.
        peerConns: [], // Any peer connections this user makes.
        presenterID: null, // The ID of the presenter this user is connected to (...if they're an attendee.)
        following: false,
      },
      _stateMainListeners: {},
      stateMain: new Proxy(
        {slide: 0}, 
        {
          get: (target, prop, receiver) => {
            return target[prop];
          }, 
          set: (target, prop, value) => {
            console.log(this);
            if (this.state._stateMainListeners.hasOwnProperty(prop)) {
              this.state._stateMainListeners[prop](value);
            }
            target[prop] = value;
          }
        }
      ),
      _statePresenterListeners: {},
      statePresenter: new Proxy(
        {}, 
        {
          get: (target, prop, receiver) => {
            return target[prop];
          }, 
          set: (target, prop, value) => {
            console.log(this);
            if (this.state._statePresenterListeners.hasOwnProperty(prop)) {
              this.state._statePresenterListeners[prop](value);
            }
            target[prop] = value;
          }
        }
      ),
    };

    this._init();
  }

  _init() {
    this.state._statePresenterListeners.slide = this._changeSlide;
    this.state._stateMainListeners.slide = this._changeSlide;

    this._initPeer()
      .then(() => {
        this._initControls();
      });
  }
  // Initalizes everything to do with peers.
  _initPeer() {
    return new Promise((resolve, reject) => {
      try {
        // The user probably doesn't need peer networking if they're no URL query params.
        if (window.location.search) {
          // First we need to check if the correct url params are there
          // before we create a peer object.
          const urlParams = new URLSearchParams(window.location.search);
          if (!urlParams.get('presenter') && urlParams.get('present') != 'true') {
            resolve();
          }
          // Now we know the user probably is either a presenter or a
          // attendee so we create a peer object.
          this.state._peer = new Peer();
          const { _peer, } = this.state;
          // Notify the user if there's errors.
          _peer.on('error', (err) => {
            alert('A fatal error occured, check the console for more details.')
            console.error(err);
            throw err;
          })
          // Unforuntatly because of how peer.js works we need to scope
          // all our code inside this 'on open' scope.
          _peer.on('open', (id) => {
            // Update the peerID.
            const { _user } = this.state;
            _user.peerID = id;

            if (urlParams.get('presenter')) {
              console.log('Attendee');
              // Update the user type to attendee and the presenterID to
              // what we find in the URL params.
              _user.type = 'attendee';
              _user.presenterID = urlParams.get('presenter');
              const { presenterID } = _user;
              console.log(urlParams.get('presenter'));
              console.log(presenterID)
              // Create a connection to the presenter.
              _user.peerConns.push(_peer.connect(presenterID));
              const { peerConns } = _user;
              const [ presenter ] = peerConns;

              // Set up the connection...
              presenter.on('open', () => {
                // We're connected!
                alert(`You're connected to the presenter! (...waiting for an additional confirmation mesage from the presenter...)`)
                resolve(true);

                // When we get data from the presenter we want to update our statePresenter.
                presenter.on('data', (data) => {
                  console.log('received Data: ', data);
                  Object.keys(data).forEach((e) => {
                    this.state.statePresenter[e] = data[e];
                  });
                });

              })
              // Error handle.
              .on('error', function (err) {
                alert('Couldn\'t connect, check the console for details.')
                console.error(err);
                throw err;
              });
            } else if (urlParams.get('present') == 'true') {
              // Change the user type to presenter.
              _user.type = 'presenter';
              // Give the user their presentation link.
              const { peerID, peerConns } = _user;
              alert('Entering Presenter-Mode!');
              prompt('Your presenter link is:', `localhost:8000/?presenter=${peerID}`);
              // When a user connects to us...
              console.log(_peer);
              _peer.on('connection', (conn) => {
                console.log('Got a connection!')
                // Push their connection to the peerConns array/
                _user.peerConns.push(conn);
                // Then run this code when the connection is completely
                // established.
                conn.on('open', function () {
                  console.log('Established a connection!')
                  // attendees.push({
                  //   id: conn.id,
                  //   conn: conn,
                  // });

                  // Receive messages
                  conn.on('data', function (data) {
                    console.log('Received', data);
                  });

                  // Send a connection message.
                  conn.send({
                    presenterMessage: `You're connected! (user No. ${peerConns.length})`,
                  });
                });
              });
              // Resolve now that we set up the logic for new 
              // connections.
              resolve(true);
            }
            resolve(false);
          });
        }
        resolve(false);
      } catch (err) {
        reject(err);
      }

    });
  }
  // Initalizes control hotkeys.
  _initControls() {
    const { _user: { type } } = this.state;
    if (type !== 'attendee') {
      const left = Keyboard('ArrowLeft');
      const right = Keyboard('ArrowRight');
      // space = Keyboard('Space'),
      // l = Keyboard('KeyL');
  
      left.press = () => {
        this.state.stateMain.slide -= 1;
      };
      right.press = () => {
        this.state.stateMain.slide += 1;
      };
    }
  }
  // Control related methods:

  // Slide control:
  _changeSlide(slide, cb = null) {
    app.stage.removeChildren();
    let container = new Container();
    container.width = w;
    container.h = h;
    console.log(slide);
    app.stage.addChild(slides[slide](container));
    if (this.state._user.type === 'presenter') {
      for (let attendee of this.state._user.peerConns) {
        attendee.send({
          slide
        })
      }
    }
  }
}

let timeLaunched = Date.now() + 1000*60*10;
window.currentSession = new SlideController();

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const w = SCREEN_WIDTH;
const h = SCREEN_HEIGHT;

let app = new Application({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  backgroundColor: 0x272d37,
});
document.body.appendChild(app.view);
// Ticker.shared.autoStart = true;

// -- NOTE --
// commented out/removed audio use in this file due to 
// -- NOTE ---
// const loader = new Loader();
// loader
// .add('song', 'sound/running.mp3')
//   .add('knight', 'img/knight.png');

// loader.load((loader, resources) => {
//   init(loader, resources);
// });

// const init = (loader, resources) => {
//   let { song, knight } = resources;

//   // NOTE: Sytax is [ song.sound.play(); ]

//   knight = new Sprite(knight.texture);
//   knight.anchor.set(0.5);
//   knight.x = SCREEN_WIDTH / 2;
//   knight.y = SCREEN_HEIGHT / 2;
//   app.stage.addChild(knight);

//   let redSquareContainer = new Container();

//   let redSquare = new Graphics();
//   redSquare.beginFill(0xff0000);
//   redSquare.drawRect(0, 0, 100, 100);
//   redSquare.drawRect(100, 100, 100, 100);
//   redSquare.endFill();

//   redSquareContainer.addChild(redSquare);
//   app.stage.addChild(redSquareContainer);
// };
const slideTitle = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 150,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: ['#ffdde1', '#ee9ca7'], // gradient
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 13,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 14,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: 'round'
});

const styleHeader = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 72,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: ['#ffdde1', '#ee9ca7'], // gradient
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 13,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 14,
  wordWrap: true,
  wordWrapWidth: w - 70,
  lineJoin: 'round'
});

const styleBody = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 30,
  fontWeight: 'bold',
  fill: ['#FFFFFF', '#ECE9E6'], // gradient
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 5,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: w - 70*2,
  lineJoin: 'round'
});

const slides = [
  (container) => {
    const slideTitle2 = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 60,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#b6fbff', '#83a4d4'], // gradient
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 7,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: w,
      lineJoin: 'round'
    });
    
    const s1Title = new Text('PIXI.JS', slideTitle);
    s1Title.x = -500;
    s1Title.y = 50;
    
    const s1Subtitle = new Text('The "Canvas Killer"', slideTitle2);
    s1Subtitle.x = 920;
    s1Subtitle.y = 200;
    
    container.addChild(s1Title);
    container.addChild(s1Subtitle);
    app.ticker.add(() => {
      s1Title.x += Math.abs(s1Title.x - 50)/30
      s1Subtitle.x -= Math.abs(s1Subtitle.x - 120)/30
    })

    return container;
  },
  // Header
  (container) => {
    const Title = new Text('What is PIXI.js?', styleHeader);
    Title.x = -500;
    Title.y = 50;

    container.addChild(Title);
    app.ticker.add(() => {
      Title.x += Math.abs(Title.x - 50)/10
    })

    return container;
  },
  // Header + 1 Body
  (container) => {
    const Title = new Text('What is PIXI.js?', styleHeader);
    Title.x = 50;
    Title.y = 50;

    const Body = new Text(`• It's a tried and true framework that improves the canvas API in almost every way.`, styleBody);
    Body.x = -w * + 70*2;
    Body.y = 160;

    container.addChild(Body);
    container.addChild(Title);
    app.ticker.add(() => {
      Body.x += Math.abs(Body.x - 70)/10
    })

    return container;
  },
  // Header + 2 Body
  (container) => {
    const Title = new Text('What is PIXI.js?', styleHeader);
    Title.x = 50;
    Title.y = 50;

    const Body = new Text(`• It's a tried and true framework that improves the canvas API in almost every way.`, styleBody);
    Body.x = 70;
    Body.y = 160;

    const Body2 = new Text(
      `

      
• Leverages WebGL and its API when possible making it have much better performance than the canvas.`, 
      styleBody
    );
    Body2.x = -w * + 70*2;
    Body2.y = 160;

    container.addChild(Body);
    container.addChild(Body2);
    container.addChild(Title);
    app.ticker.add(() => {
      Body2.x += Math.abs(Body2.x - 70)/10
    })

    return container;
  },
  (container) => {
    const Title = new Text('What is PIXI.js?', styleHeader);
    Title.x = 50;
    Title.y = 50;

    const Body = new Text(
      `• It's a tried and true framework that improves the canvas API in almost every way.

• Leverages WebGL and its API when possible making it have much better performance than the canvas.`,
       styleBody
    );
    Body.x = 70;
    Body.y = 160;

    const Body2 = new Text(
      `






• Abstracts most of the pain and suffering associated working with the HTML5 canvas from scratch.`, 
    styleBody
    );
    Body2.x = -w * + 70*2;
    Body2.y = 160;

    container.addChild(Body);
    container.addChild(Body2);
    container.addChild(Title);
    app.ticker.add(() => {
      Body2.x += Math.abs(Body2.x - 70)/10
    })

    return container;
  },
  (container) => {
    const Title = new Text('PIXI.js has it all.', styleHeader);
    Title.x = -500;
    Title.y = 50;

    container.addChild(Title);
    app.ticker.add(() => {
      Title.x += Math.abs(Title.x - 50)/10
    })

    return container;
  },
  (container) => {
    const Title = new Text('PIXI.js has it all.', styleHeader);
    Title.x = 50;
    Title.y = 50;

    const Body = new Text(`• I'm not exagerating... In fact, lets take a quick look at  all of the classes we have available to us in PIXI.js.`, styleBody);
    Body.x = -w * + 70*2;
    Body.y = 160;

    container.addChild(Body);
    container.addChild(Title);
    app.ticker.add(() => {
      Body.x += Math.abs(Body.x - 70)/10
    })

    return container;
  },
  (container) => {
    const Body = new Text(
      `BasisFile
IGLUniformData
PIXI.AbstractBatchRenderer
PIXI.AbstractMaskSystem
PIXI.AbstractMultiResource
PIXI.AbstractRenderer
PIXI.accessibility.AccessibilityManager
PIXI.AccessibilityManager
PIXI.AnimatedSprite
PIXI.Application
PIXI.AppLoaderPlugin
PIXI.ArrayResource
PIXI.Attribute
PIXI.BaseImageResource
PIXI.BasePrepare
PIXI.BaseRenderTexture
PIXI.BaseTexture
PIXI.BasisLoader
PIXI.BasisLoader.TranscoderWorker
PIXI.BatchDrawCall
PIXI.BatchGeometry
PIXI.BatchPluginFactory
PIXI.BatchShaderGenerator
PIXI.BatchSystem
PIXI.BatchTextureArray
PIXI.BitmapFont
PIXI.BitmapFontData
PIXI.BitmapFontLoader
PIXI.BitmapText
PIXI.Bounds
PIXI.Buffer
PIXI.BufferResource
PIXI.CanvasExtract
PIXI.CanvasGraphicsRenderer
PIXI.CanvasMaskManager
PIXI.CanvasMeshRenderer
PIXI.CanvasPrepare
PIXI.CanvasRenderer
PIXI.CanvasRenderTarget
PIXI.CanvasResource
PIXI.CanvasSpriteRenderer
PIXI.Circle
PIXI.CompressedTextureLoader
PIXI.CompressedTextureResource
PIXI.Container
PIXI.ContextSystem
PIXI.CountLimiter
PIXI.CubeResource
PIXI.DDSLoader
PIXI.DepthResource
PIXI.DisplayObject
PIXI.Ellipse
PIXI.Extract
PIXI.extract.CanvasExtract
PIXI.extract.Extract
PIXI.extract.WebGLExtract
PIXI.extras.AnimatedSprite
PIXI.extras.BitmapText
PIXI.extras.TilingSprite
PIXI.extras.TilingSpriteRenderer
PIXI.FillStyle
PIXI.Filter
PIXI.FilterManager
PIXI.filters.AlphaFilter
PIXI.filters.BlurFilter
PIXI.filters.BlurFilterPass
PIXI.filters.BlurXFilter
PIXI.filters.BlurYFilter
PIXI.filters.ColorMatrixFilter
PIXI.filters.DisplacementFilter
PIXI.filters.FXAAFilter
PIXI.filters.NoiseFilter
PIXI.FilterSystem
PIXI.Framebuffer
PIXI.FramebufferSystem
PIXI.Geometry
PIXI.GeometrySystem
PIXI.GLFramebuffer
PIXI.GLProgram
PIXI.GLTexture
PIXI.Graphics
PIXI.GraphicsData
PIXI.GraphicsGeometry
PIXI.graphicsUtils.BatchPart
PIXI.graphicsUtils.Star
PIXI.ImageBitmapResource
PIXI.ImageResource
PIXI.interaction.InteractionData
PIXI.interaction.InteractionEvent
PIXI.interaction.InteractionManager
PIXI.InteractionData
PIXI.InteractionEvent
PIXI.InteractionManager
PIXI.KTXLoader
PIXI.LineStyle
PIXI.Loader
PIXI.LoaderResource
PIXI.loaders.Loader
PIXI.loaders.Resource
PIXI.MaskData
PIXI.MaskSystem
PIXI.Matrix
PIXI.Mesh
PIXI.mesh.CanvasMeshRenderer
PIXI.mesh.Mesh
PIXI.mesh.MeshRenderer
PIXI.mesh.NineSlicePlane
PIXI.mesh.Plane
PIXI.mesh.RawMesh
PIXI.mesh.Rope
PIXI.MeshBatchUvs
PIXI.MeshGeometry
PIXI.MeshMaterial
PIXI.NineSlicePlane
PIXI.ObjectRenderer
PIXI.ObservablePoint
PIXI.ParticleContainer
PIXI.ParticleRenderer
PIXI.particles.ParticleContainer
PIXI.particles.ParticleRenderer
PIXI.Point
PIXI.Polygon
PIXI.Prepare
PIXI.prepare.BasePrepare
PIXI.prepare.CanvasPrepare
PIXI.prepare.Prepare
PIXI.prepare.WebGLPrepare
PIXI.Program
PIXI.ProjectionSystem
PIXI.Quad
PIXI.QuadUv
PIXI.Rectangle
PIXI.Renderer
PIXI.RenderTexture
PIXI.RenderTexturePool
PIXI.RenderTextureSystem
PIXI.Resource
PIXI.resources.BlobResource
PIXI.RopeGeometry
PIXI.RoundedRectangle
PIXI.Runner
PIXI.ScissorSystem
PIXI.Shader
PIXI.ShaderSystem
PIXI.SimpleMesh
PIXI.SimplePlane
PIXI.SimpleRope
PIXI.Sprite
PIXI.SpriteMaskFilter
PIXI.Spritesheet
PIXI.SpritesheetLoader
PIXI.State
PIXI.StateSystem
PIXI.StencilSystem
PIXI.SVGResource
PIXI.System
PIXI.Text
PIXI.TextMetrics
PIXI.TextStyle
PIXI.Texture
PIXI.TextureGCSystem
PIXI.TextureLoader
PIXI.TextureMatrix
PIXI.TextureSystem
PIXI.TextureUvs
PIXI.Ticker
PIXI.ticker.Ticker
PIXI.TickerPlugin
PIXI.TilingSprite
PIXI.TilingSpriteRenderer
PIXI.TimeLimiter
PIXI.Transform
PIXI.TransformBase
PIXI.TransformStatic
PIXI.UniformGroup
PIXI.utils.CanvasRenderTarget
PIXI.utils.EventEmitter
PIXI.VideoResource
PIXI.ViewableBuffer
PIXI.WebGLRenderer
PlaneGeometry
TemporaryDisplayObject`, 
      styleBody
    );
    // -- NOTE --
    // I removed the audio playing here because you won't have access to it with just this script.
    // -- NOTE --
    Body.x = 70;
    Body.y = h + 200;

    container.addChild(Body);
    app.ticker.add(() => {
        Body.y -= 8;
    })

    return container;
  },
  (container) => {
    const Title = new Text('182 CLASSES O.o', styleHeader);
    Title.x = 80;
    Title.y = h + 200;

    let stack = 0;
    let left = true;
    container.addChild(Title);
    app.ticker.add(() => {
      if (Title.y > h*0.35) {
        Title.y -= 8;
      }
      stack += 1;
      if (stack > 30) {
        stack = stack % 30;
        left = !left;
      }
      if (left) {
        Title.text = '182 CLASSES O.o';
      } else {
        Title.text = '182 CLASSES o.O';
      }
    })

    return container;
  },
  (container) => {
    const Body = new Text(`And of course, all of those have their own special methods and features that make things even easier...`, styleBody);
    Body.x = -w * + 70*2;
    Body.y = h/2 - 22;

    container.addChild(Body);
    app.ticker.add(() => {
      Body.x += Math.abs(Body.x - 70)/10
    })

    return container;
  },
    // Header
    (container) => {
      const Title = new Text('So now...', styleHeader);
      Title.x = -500;
      Title.y = 50;
  
      container.addChild(Title);
      app.ticker.add(() => {
        Title.x += Math.abs(Title.x - 50)/10
      })
  
      return container;
    },
    // Header + 1 Body
    (container) => {
      const Title = new Text('So now...', styleHeader);
      Title.x = 50;
      Title.y = 50;
  
      const Body = new Text(`• Let's go take a look at some demos on the Pixi.js example site!`, styleBody);
      Body.x = -w * + 70*2;
      Body.y = 160;
  
      container.addChild(Body);
      container.addChild(Title);
      app.ticker.add(() => {
        Body.x += Math.abs(Body.x - 70)/10
      })
  
      return container;
    },
];

