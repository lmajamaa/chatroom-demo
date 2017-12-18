import * as React from 'react';

interface Props {
  user: string;
  size: number;
}
interface State { }

export default class Initials extends React.Component<Props, State> {
  private myCanvas: HTMLCanvasElement;
  constructor(props: Props) {
    super(props);
  }
  
  componentDidMount() {
    this.generateInitials(this.props.user);
  }
  componentWillReceiveProps(nextProps: Props) {
    this.generateInitials(nextProps.user);  
  }
  generateInitials(user: string) {
    let colours = ['#F44336', '#880E4F', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#FF6E40', '#607D8B'];

    // Allow single initials to be generated
    if (!user.includes(' ')) {
      user = user + ' ';
    }
      
    let nameSplit = user.split(' '),
        initials = nameSplit[0].charAt(0).toUpperCase() + nameSplit[1].charAt(0).toUpperCase(),
        charIndex = initials.charCodeAt(0) - 65,
        colourIndex = charIndex % 19;

    let ctx = this.myCanvas.getContext('2d');
    if (ctx instanceof CanvasRenderingContext2D) {
      const { size } = this.props;
      let canvasCssWidth = size,
          canvasCssHeight = size;

      ctx.fillStyle = colours[colourIndex];
      ctx.fillRect (0, 0, this.myCanvas.width, this.myCanvas.height);
      ctx.font = (size / 2) + 'px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFF';
      ctx.fillText(initials, canvasCssWidth / 2, canvasCssHeight / 1.5);
    }
  }
    
  render() {
    const { size } = this.props;
    return (
      <canvas width={size} height={size} ref={canvas => this.myCanvas = canvas as HTMLCanvasElement} className="media-object"/>
    );
  }
}