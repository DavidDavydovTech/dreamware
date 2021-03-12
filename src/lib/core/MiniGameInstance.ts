import { Container } from 'pixi.js';

export class MiniGameInstance extends Container {
  public init;
  public update;
  private _result;
  public result: Promise<boolean>;
  public resultResolver: (didWin: boolean) => void;
  public resultRejector: (error: Error) => void;

  constructor(init: () => void, update: () => void) {
    super();
    this.init = init;
    this.update = update;
    this.result = new Promise((resolve, reject) => {
      this.resultResolver = resolve;
      this.resultRejector = reject;
    });
  }
}
