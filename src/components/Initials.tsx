import * as React from 'react';

interface Props {
  user: string;
}
interface State {
  myCanvas: HTMLCanvasElement;
}

export default class Initials extends React.Component<Props, State> {
  private myCanvas: HTMLCanvasElement;
  constructor(props: Props) {
    super(props);
  }
  
  componentDidMount() {
    this.generateInitials(this.props.user);
  }
    
  generateInitials(user: string) {
    var colours = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'];

    // Allow single initials to be generated
    if (!user.includes(' ')) {
      user = user + ' ';
    }
      
    var nameSplit = user.split(' '),
        initials = nameSplit[0].charAt(0).toUpperCase() + nameSplit[1].charAt(0).toUpperCase(),
        charIndex = initials.charCodeAt(0) - 65,
        colourIndex = charIndex % 19;

    var ctx = this.myCanvas.getContext('2d');
    if (ctx instanceof CanvasRenderingContext2D) {
      var canvasCssWidth = 64,
          canvasCssHeight = 64;

      ctx.fillStyle = colours[colourIndex];
      ctx.fillRect (0, 0, this.myCanvas.width, this.myCanvas.height);
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFF';
      ctx.fillText(initials, canvasCssWidth / 2, canvasCssHeight / 1.5);
    }
  }
    
  render() {
    return (
      <canvas width="64" height="64" ref={canvas => this.myCanvas = canvas as HTMLCanvasElement} className="media-object"/>
    );
  }
}