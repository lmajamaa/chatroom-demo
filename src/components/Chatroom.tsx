/// <reference path="../types/interfaces.d.ts"/>
import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import StyleDefinition from '../styles/StyleDefinition';
import Sidebar from './Sidebar';
import ChannelHeader from './ChannelHeader';
import MessageBar from './MessageBar';
import MessageList from './MessageList';
import NameChangeModal from './NameChangeModal';
import withRoot from './withRoot';

import * as openSocket from 'socket.io-client';
const socket = window.location.hostname === 'localhost' ? openSocket(window.location.hostname + ':3001') : openSocket(window.location.hostname) ;

interface State {
  user: string;
  users: string[];
  channel: string;
  channels: string[];
  message: string;
  messages: ChatMessage[];
  channelMessages: ChatMessage[];
  sidebarOpen: boolean;
  nameChangeActive: boolean;
  privateMessageTo: string;
  focusMessageBar: boolean;
  lightMode: boolean;
}

// Get styles
const styles = (theme) => {
  return StyleDefinition.getStyles(theme);
};

class Chatroom extends React.Component<WithStyles<keyof typeof styles>, State> {
  constructor(props: WithStyles<'root'>) {
    super(props);
    this.state = {
      user: '',
      users: [],
      channel: 'general',
      channels: [],
      message: '',
      messages: [],
      channelMessages: [],
      sidebarOpen: true,
      nameChangeActive: true,
      privateMessageTo: '',
      focusMessageBar: false,
      lightMode: false,
    };
      
    socket.on('init', this._initialize);
    socket.on('user:message', this._messageReceive);
    socket.on('user:privateMessage', this._privateMessageReceive);
    socket.on('user:join', this._userJoined);
    socket.on('user:left', this._userLeft);
    socket.on('user:changeName', this._userChangedName);
    socket.on('channelUpdate', this._channelUpdate); 
  }
  _initialize = (data: InitializeData) => {
    var {users, channel, channels, name} = data;
    this.setState({users, channel, channels, user: name});
  }

  _messageReceive = (message: ChatMessage) => {
    var messages = this.state.messages.concat();
    var channelMessages = this.state.channelMessages.concat();
    message.date = new Date();
    messages.push(message);
    this.setState({messages, channelMessages});
  }
  
  _privateMessageReceive = (privateMessage: ChatMessage) => {
    var messages = this.state.messages.concat();
    privateMessage.user = privateMessage.user + '  (PRIVATE)';
    messages.push(privateMessage);
    this.setState({messages});
  }

  _userJoined = (data: InitializeData) => {
    var users = this.state.users.concat();
    users.push(data.name);
    this.setState({users});
  }

  _userLeft = (data: InitializeData) => {
    var users = this.state.users.concat();
    users.splice(users.indexOf(data.name), 1);
    this.setState({users});
  }

  _userChangedName = (data: InitializeData) => {
    var users = this.state.users.concat();
    users.splice(users.indexOf(data.oldName), 1, data.newName);
    this.setState({users});
  }
  
  _channelUpdate = (message: ChannelUpdate) => {
    var messages = this.state.messages.concat();
    message.date = new Date();
    messages.push(message);
    this.setState({messages, users: message.users});
  }
  
  handleMessageSubmit = (message: ChatMessage) => {
    var messages = this.state.messages.concat();
    messages.push(message);
    this.setState({messages});
    socket.emit('user:message', message);
  }
  
  handlePrivateMessageSubmit = (message: ChatMessage) => {
    var messages = this.state.messages.concat();
    socket.emit('user:privateMessage', message);
    messages.push(message);
    this.setState({messages, privateMessageTo: ''});
  }
  
  handleChangeName = (newName: string) => {
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
      localStorage.setItem('userName', newName);
    });
  }

  handleChannelChange = (channel: string) => {
    socket.emit('user:changeChannel', channel);
    this.setState({channel, messages: []});
  }
  
  // Enable/disable private message mode. Disable also if current user is selected
  enablePrivateMessage = (user: string) => {
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
  
  handleDrawerToggle = () => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  }
  
  handleThemeSwitch = () => {
    this.setState({ lightMode: !this.state.lightMode });
    alert('Theme switching not implemented yet');
  }

  render() {
    const classes = this.props.classes as ExampleClasses;
    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <ChannelHeader
            classes={classes}
            channel={this.state.channel}
            handleDrawerToggle={this.handleDrawerToggle}
            handleThemeSwitch={this.handleThemeSwitch}
          />
          <Sidebar
            classes={classes}
            channels={this.state.channels}
            initialChannel={this.state.channel}
            user={this.state.user}
            users={this.state.users}
            sidebarOpen={this.state.sidebarOpen}
            handleDrawerToggle={this.handleDrawerToggle}
            handleChannelChange={this.handleChannelChange}
            enablePrivateMessage={this.enablePrivateMessage}
          />
          <MessageList
            classes={classes}
            channel={this.state.channel}
            messages={this.state.messages}
            sidebarOpen={this.state.sidebarOpen}
            lightMode={this.state.lightMode}
          />
          <MessageBar
            classes={classes}
            user={this.state.user}
            channel={this.state.channel}
            privateMessageTo={this.state.privateMessageTo}
            focus={this.state.focusMessageBar}
            onMessageSubmit={this.handleMessageSubmit}
            onPrivateMessageSubmit={this.handlePrivateMessageSubmit}
          />
        </div>
        {this.state.nameChangeActive ? <NameChangeModal user={this.state.user} onChangeName={this.handleChangeName}/> : null}
      </div>
    );
  }
}

export default withRoot(withStyles(styles, { withTheme: true })(Chatroom as React.ComponentType<WithStyles<keyof typeof styles>>));