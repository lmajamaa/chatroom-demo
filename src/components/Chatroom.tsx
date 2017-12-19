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
  messages: ChatMessage[];
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
      messages: [],
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
    let {user, users, channels, messages} = data;
    this.setState({user, users, channel: channels[0], channels, messages});
  }

  _messageReceive = (message: ChatMessage) => {
    let messages = this.state.messages.concat();
    messages.push(message);
    this.setState({messages});
  }
  
  _privateMessageReceive = (message: ChatMessage) => {
    let messages = this.state.messages.concat();
    messages.push(message);
    this.setState({messages});
  }

  _userJoined = (message: ChannelUpdate) => {
    this.setState({users: message.users});
  }

  _userLeft = (message: ChannelUpdate) => {
    this.setState({users: message.users});
  }

  _userChangedName = (message: InitializeData) => {
    let users = this.state.users.concat();
    users.splice(users.indexOf(message.oldName), 1, message.newName);
    this.setState({users});
  }
  
  _channelUpdate = (message: ChannelUpdate) => {
    this.setState({users: message.users});
  }
  
  handleMessageSubmit = (message: ChatMessage) => {
    let messages = this.state.messages.concat();
    messages.push(message);
    this.setState({messages});
    socket.emit('user:message', message);
  }
  
  handlePrivateMessageSubmit = (message: ChatMessage) => {
    let messages = this.state.messages.concat();
    socket.emit('user:privateMessage', message);
    messages.push(message);
    this.setState({messages});
  }
  
  handleChangeName = (newName: string) => {
    let oldName = this.state.user;
    this.setState({nameChangeActive: false});
    if (newName.length === 0 || newName === oldName) { return; }
    
    socket.emit('user:changeName', { name : newName}, (result) => {
      if (!result) {
        return alert('There was an error changing your name');
      }
      let {users} = this.state;
      let index = users.indexOf(oldName);
      users.splice(index, 1, newName);
      this.setState({users, user: newName, focusMessageBar: !this.state.focusMessageBar});
      localStorage.setItem('userName', newName);
    });
  }

  // Change channel, disable private message mode if it was enabled
  handleChannelChange = (channel: string) => {
    socket.emit('user:getUsers', channel);
    this.setState({channel, privateMessageTo: ''});
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
          privateMessageTo: user,
          channel: user
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
            channel={this.state.channel}
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