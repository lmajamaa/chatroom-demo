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
  initialChannel: string;
  user: string;
  users: string[];
  handleChannelChange: ChannelChange;
  enablePrivateMessage: PrivateMessageToggle;
  handleDrawerToggle: DrawerToggle;
  sidebarOpen: boolean;
}

interface State {
  currentChannel: string;
}

export default class Sidebar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentChannel: props.initialChannel,
    };
  }

  changeChannel = (targetChannel: string) => {
    if (this.state.currentChannel !== targetChannel) {    
      this.setState({currentChannel: targetChannel});
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
  
  render() {
    const { channels, classes, sidebarOpen } = this.props;
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
              <ListItem button={true} key={i} onClick={() => this.changeChannel(channel)}>
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
              <ListItem button={true} key={i} onClick={() => this.props.enablePrivateMessage(user)}>
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