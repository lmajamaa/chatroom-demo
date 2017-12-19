import * as React from 'react';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Initials from './Initials';

interface Props {
  user: string;
  date: number;
  text: string;
}

export default class Message extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  
  getMessageDate = () => {
    try {
      var date = new Date(this.props.date);
      var hours = ('0' + date.getHours()).slice(-2);
      var minutes = ('0' + date.getMinutes()).slice(-2);
      return hours + ':' + minutes;
    } catch (err) {
      return err;
    }
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