/// <reference path="../types/interfaces.d.ts"/>
import * as React from 'react';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import Initials from './Initials';
import Hidden from 'material-ui/Hidden';

interface Props {
  classes: ExampleClasses;
  channels: string[];
  channel: string;
  user: string;
  users: string[];
  handleChannelChange: ChannelChange;
  enablePrivateMessage: PrivateMessageToggle;
  handleDrawerToggle: DrawerToggle;
  sidebarOpen: boolean;
}

export default class Sidebar extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  changeChannel = (targetChannel: string) => {
    if (this.props.channel !== targetChannel) {    
      this.props.handleChannelChange(targetChannel);
    }
  }
  
  getUsername = (user: string, currentUser: string) => {
    if (user === currentUser) {
      return user + ' (you)';
    } else {
      return user;
    }
  }
  
  handleUserClick = (user: string) => {
    this.props.enablePrivateMessage(user);
  }
  
  isActive = (channel) => {
    return channel === this.props.channel;
  }
  render() {
    const { channels, classes, sidebarOpen } = this.props;
    const inActive = {
    };
    const active = {
      backgroundColor: '#546E7A',
    };
    const drawerContent = (
      <div>
        <div className={classes.drawerHeader}>
          <Typography type="title">
          Channels
          </Typography>
        </div>
        <Divider />
        <List>
        {
          channels.map((channel, i) => {
            return (
              <ListItem button={true} key={i} onClick={() => this.changeChannel(channel)} style={this.isActive(channel) ? active : inActive}>
                <ListItemText primary={'# ' + channel} />
              </ListItem>
            );
          })
        }
        </List>
        <Divider />
        <div className={classes.drawerHeader}>
          <Typography type="title">
          Users
          </Typography>
        </div>
        <Divider />
        <List>
        {
          this.props.users.map((user: string, i: number) => {
            return (
              <ListItem button={true} key={i} onClick={() => this.handleUserClick(user)} style={this.isActive(user) ? active : inActive}>
                <Initials user={user} size={32}/>
                <ListItemText primary={this.getUsername(user, this.props.user)} />
              </ListItem>
            );
          })
        }
        </List>
      </div>
    );
    
    return (
      <div>
      <Hidden mdUp={true}>
          <Drawer
            type="persistent"
            open={sidebarOpen}
            classes={{ modal: classes.drawerModal,  paper: classes.drawerPaper }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{keepMounted: true}}
          >
          {drawerContent}
          </Drawer>
        </Hidden>
        <Hidden mdDown={true} implementation="css">
          <Drawer
            type="persistent"
            open={sidebarOpen}
            classes={{ modal: classes.drawerModal,  paper: classes.drawerPaper }}
            onClose={this.props.handleDrawerToggle}
          >
          {drawerContent}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}