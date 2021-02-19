class Animation {
  constructor( parent, animation, animationProps) {
    // this.parent = parent;
    // this.app = parent._appReference;
    // this.animation = animation;
  }

  then = (resolve, reject) => {
    setTimeout(() => {
      console.log('Waited 1000 ms...')
      resolve('hi')
    }, 1000)
  }
}

export default Animation;