/// <reference path="../types/interfaces.d.ts"/>
import * as React from 'react';
import BottomNavigation from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

interface Props {
  classes: ExampleClasses;
  user: string;
  channel: string;
  privateMessageTo: string;
  focus: boolean;
  onMessageSubmit: MessageSubmit;
  onPrivateMessageSubmit: PrivateMessageSubmit;
}
interface State {
  text: string;
}

export default class MessageBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { text: '' };
  }

  sendMessage = () => {
    if (this.props.privateMessageTo.length === 0) {
      var message = {
          user: this.props.user,
          channel: this.props.channel,
          date: Date.now(),
          text: this.state.text
      };
      this.props.onMessageSubmit(message);
      } else {
        var privateMessage = {
          user: this.props.user,
          channel: this.props.privateMessageTo,
          date: Date.now(),
          text: this.state.text
        };
        this.props.onPrivateMessageSubmit(privateMessage);
      }
    this.setState({ text: '' });
  }
  handleSubmit = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    if (this.state.text.length > 0) {
      this.sendMessage();
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ text : event.target.value });
  }
  
  handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === 13 && event.ctrlKey) {
      event.preventDefault();
      this.setState({ text : this.state.text + '\n' });
    } else if (event.keyCode === 13 && !event.ctrlKey) {
      event.preventDefault();
      if (this.state.text.length > 0) {
        this.sendMessage();
      }
    }
  }

  render() {
    const classes = this.props.classes as ExampleClasses;
    const messageBar = {
      bottom: 0,
    };
    const container = {
      width: '100%',
    } as React.CSSProperties;
    const buttonStyle = {
      margin: 12,
    };

    return(
      <Paper elevation={4} className={classes.appBar} style={messageBar}>
        <BottomNavigation className={classes.bottomNavigation}>
          <form style={container} onSubmit={this.handleSubmit}>
            <TextField
              className={classes.textField}
              value={this.state.text}
              placeholder={this.props.privateMessageTo.length === 0 ? 'Type your message here...' : 'Type your private message here...'}
              multiline={true}
              required={true}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
            />
            <Button raised={true} type="submit" color="primary" style={buttonStyle}>
            Send
            </Button>
          </form>
        </BottomNavigation>
      </Paper>
    );
  }
}