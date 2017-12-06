/// <reference path="../types/interfaces.d.ts"/>

import * as React from 'react';
import ChannelList from './ChannelList';
import UserList from './UserList';
import MessageBar from './MessageBar';
import MessageList from './MessageList';
import NameChangeModal from './NameChangeModal';
import { Container, Col } from 'reactstrap';
import '../styles/chatroom.css';

import * as openSocket from 'socket.io-client';
const socket = window.location.hostname === 'localhost' ? openSocket(window.location.hostname + ':3001') : openSocket(window.location.hostname) ;

interface Props { }
interface State {
  user: string;
  users: string[];
  channel: string;
  channels: string[];
  message: string;
  messages: ChatMessage[];
  channelMessages: ChatMessage[];
  sidebarActive: boolean;
  nameChangeActive: boolean;
  privateMessageTo: string;
  focusMessageBar: boolean;
}

export default class Chatroom extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      user: '',
      users: [],
      channel: 'general',
      channels: [],
      message: '',
      messages: [],
      channelMessages: [],
      sidebarActive: false,
      nameChangeActive: true,
      privateMessageTo: '',
      focusMessageBar: false
    };
    
    this._initialize = this._initialize.bind(this);
    this._messageReceive = this._messageReceive.bind(this);
    this._privateMessageReceive = this._privateMessageReceive.bind(this);
    this._userJoined = this._userJoined.bind(this);
    this._userLeft = this._userLeft.bind(this);
    this._userChangedName = this._userChangedName.bind(this);
    this._channelUpdate = this._channelUpdate.bind(this);
    
    socket.on('init', this._initialize);
    socket.on('user:message', this._messageReceive);
    socket.on('user:privateMessage', this._privateMessageReceive);
    socket.on('user:join', this._userJoined);
    socket.on('user:left', this._userLeft);
    socket.on('user:changeName', this._userChangedName);
    socket.on('channelUpdate', this._channelUpdate);
    
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.handlePrivateMessageSubmit = this.handlePrivateMessageSubmit.bind(this);
    this.handleChannelChange = this.handleChannelChange.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.enablePrivateMessage = this.enablePrivateMessage.bind(this);
  }

 _initialize(data: InitializeData) {
    var {users, channel, channels, name} = data;
    this.setState({users, channel, channels, user: name});
  }

  _messageReceive(message: ChatMessage) {
    var messages = this.state.messages.concat();
    var channelMessages = this.state.channelMessages.concat();
    message.date = new Date();
    messages.push(message);
    this.setState({messages, channelMessages});
  }
  
  _privateMessageReceive(privateMessage: ChatMessage) {
    var messages = this.state.messages.concat();
    privateMessage.user = privateMessage.user + '  (PRIVATE)';
    messages.push(privateMessage);
    this.setState({messages});
  }

  _userJoined(data: InitializeData) {
    var users = this.state.users.concat();
    users.push(data.name);
    this.setState({users});
  }

  _userLeft(data: InitializeData) {
    var users = this.state.users.concat();
    users.splice(users.indexOf(data.name), 1);
    this.setState({users});
  }

  _userChangedName(data: InitializeData) {
    var users = this.state.users.concat();
    users.splice(users.indexOf(data.oldName), 1, data.newName);
    this.setState({users});
  }
  
  _channelUpdate(message: ChannelUpdate) {
    var messages = this.state.messages.concat();
    message.date = new Date();
    messages.push(message);
    this.setState({messages, users: message.users});
  }
  
  handleMessageSubmit(message: ChatMessage) {
    var messages = this.state.messages.concat();
    messages.push(message);
    this.setState({messages});
    socket.emit('user:message', message);
  }
  
  handlePrivateMessageSubmit(message: ChatMessage) {
    var messages = this.state.messages.concat();
    socket.emit('user:privateMessage', message);
    messages.push(message);
    this.setState({messages, privateMessageTo: ''});
  }
  
  handleChangeName(newName: string) {
    this.setState({nameChangeActive: false});
    if (newName.length === 0) { return; }
    var oldName = this.state.user;
    socket.emit('user:changeName', { name : newName}, (result) => {
      if (!result) {
        return alert('There was an error changing your name');
      }
      var {users} = this.state;
      var index = users.indexOf(oldName);
      users.splice(index, 1, newName);
      this.setState({users, user: newName, focusMessageBar: !this.state.focusMessageBar});
    });
  }

  handleChannelChange(channel: string) {
    socket.emit('user:changeChannel', channel);
    this.setState({channel, messages: []});
  }
  
  toggleSidebar() {
    this.setState({
      sidebarActive: !this.state.sidebarActive
    });
  }
  
  // Enable/disable private message mode. Disable also if current user is selected
  enablePrivateMessage(user: string) {
    if (this.state.user !== user) { 
      if (this.state.privateMessageTo === user) {
        this.setState({
          privateMessageTo: ''
        });
      } else {
        this.setState({
          privateMessageTo: user
        });
      }
    } else {
      this.setState({
        privateMessageTo: ''
      });
      this.setState({
        nameChangeActive: true
      });
    }
  }
  
  render() {
    return (
      <Container fluid={true} className="container-fullsize">
        <ChannelList channelChange={this.handleChannelChange} channels={this.state.channels} initialChannel={this.state.channel}/>
        <UserList user={this.state.user} users={this.state.users} sidebarActive={this.state.sidebarActive} enablePrivateMessage={this.enablePrivateMessage}/>
        <div id="main">
          <Col md={12} className="container-fullsize">
            <p className="toggleButton d-block d-sm-none">
              <button type="button" className="btn btn-primary btn-xs" onClick={this.toggleSidebar}>
                <i className={this.state.sidebarActive ? 'fa fa-chevron-right' : 'fa fa-chevron-left'}/> {this.state.sidebarActive ? '' : 'Users'}
                </button>
            </p>
            <MessageList channel={this.state.channel} messages={this.state.messages}/>
            <MessageBar
              onMessageSubmit={this.handleMessageSubmit}
              onPrivateMessageSubmit={this.handlePrivateMessageSubmit}
              user={this.state.user}
              channel={this.state.channel}
              privateMessageTo={this.state.privateMessageTo}
              focus={this.state.focusMessageBar}
            />
          </Col>
        </div>
        {this.state.nameChangeActive ? <NameChangeModal user={this.state.user} onChangeName={this.handleChangeName}/> : null}
      </Container>
    );
  }
}