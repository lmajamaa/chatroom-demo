/// <reference path="../types/interfaces.d.ts"/>

import * as React from 'react';
import { Navbar, Form, FormGroup, InputGroup, Button } from 'reactstrap';

interface Props {
  user: string;
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
  constructor(props: Props) {
    super(props);
    this.state = { text: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentWillReceiveProps(nextProps: Props) {
    if (this.props.focus !== nextProps.focus) {
      this.messageInput.focus();
    }
  }

  handleSubmit(event: React.FormEvent<HTMLElement>) {
      event.preventDefault();
      if (this.props.privateMessageTo.length === 0) {
        var message = {
            user : this.props.user,
            date : new Date(),
            text : this.state.text
        };
        this.props.onMessageSubmit(message);
      } else {
        var privateMessage = {
            user : this.props.user,
            to : this.props.privateMessageTo,
            date : new Date(),
            text : this.state.text
        };
        this.props.onPrivateMessageSubmit(privateMessage);
      }
      this.setState({ text: '' });
  }

  handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
      this.setState({ text : event.target.value });
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
              />
              <Button color="danger" title="Send message" type="submit">Send</Button>
            </InputGroup>
          </FormGroup>
        </Form>
      </Navbar>
    );
  }
}