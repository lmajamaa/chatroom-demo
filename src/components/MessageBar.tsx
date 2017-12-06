/// <reference path="../types/interfaces.d.ts"/>

import * as React from 'react';
import { Navbar, Form, FormGroup, InputGroup, Button } from 'reactstrap';

interface Props {
  user: string;
  channel: string;
  onMessageSubmit: MessageSubmit;
  onPrivateMessageSubmit: PrivateMessageSubmit;
  privateMessageTo: string;
  focus: boolean;
}
interface State {
  text: string;
}

export default class MessageBar extends React.Component<Props, State> {
  private messageInput: HTMLTextAreaElement;
  private messageSubmit: HTMLButtonElement;
  constructor(props: Props) {
    super(props);
    this.state = { text: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTextAreaKeydown = this.handleTextAreaKeydown.bind(this);
  }
  
  componentWillReceiveProps(nextProps: Props) {
    if (this.props.focus !== nextProps.focus) {
      this.messageInput.focus();
    }
  }

  sendMessage() {
  if (this.props.privateMessageTo.length === 0) {
    var message = {
        user: this.props.user,
        channel: this.props.channel,
        date: new Date(),
        text: this.state.text
    };
    this.props.onMessageSubmit(message);
    } else {
      var privateMessage = {
        user: this.props.user,
        channel: this.props.privateMessageTo,
        date: new Date(),
        text: this.state.text
      };
      this.props.onPrivateMessageSubmit(privateMessage);
    }
  this.setState({ text: '' });
  }
  handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    if (this.state.text.length > 0) {
      this.sendMessage();
    }
  }

  handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ text : event.target.value });
  }
  
  handleTextAreaKeydown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
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
    return(
      <Navbar dark={true} className="fixed-bottom"> 
        <Form className="messageForm" onSubmit={this.handleSubmit}>
          <FormGroup>
            <InputGroup>
              {this.props.privateMessageTo.length === 0 ? null : <span className="input-group-addon">@{this.props.privateMessageTo}</span>}
              <textarea
                className="form-control messageArea"
                value={this.state.text}
                onChange={this.handleChange}
                placeholder={this.props.privateMessageTo.length === 0 ? 'Type your message here...' : 'Type your private message here...'}
                required={true}
                ref={textArea => this.messageInput = textArea as HTMLTextAreaElement}
                onKeyDown={this.handleTextAreaKeydown}
              />
              <Button color="danger" title="Send message" type="submit" ref={messageSubmit => this.messageSubmit = messageSubmit as HTMLButtonElement}>Send</Button>
            </InputGroup>
          </FormGroup>
        </Form>
      </Navbar>
    );
  }
}