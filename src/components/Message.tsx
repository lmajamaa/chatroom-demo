import * as React from 'react';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Initials from './Initials';

interface Props {
  user: string;
  date: Date;
  text: string;
}
interface State { }

export default class Message extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  
  getMessageDate = () => {
    var hours = ('0' + this.props.date.getHours()).slice(-2);
    var minutes = ('0' + this.props.date.getMinutes()).slice(-2);
    return hours + ':' + minutes;
  }
  
  render() {
    const cardStyle = {
      position: 'relative' as 'relative',
      display: 'flex',
      width: '100%',
      height: 'auto'
    };
    const formattedTextStyle = {
      marginTop: '13px',
      whiteSpace: 'pre-wrap',
      fontWeight: 200,
    } as React.CSSProperties;
    return (
      <Card style={cardStyle}>
        <CardHeader
          title={this.props.user}
          subheader={this.getMessageDate()}
          avatar={<Initials user={this.props.user} size={64}/>}
        />
        <CardContent>
          <Typography style={formattedTextStyle}>
            {this.props.text}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}