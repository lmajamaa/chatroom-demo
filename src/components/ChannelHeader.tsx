/// <reference path="../types/interfaces.d.ts"/>
import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import LightbulbOutline from 'material-ui-icons/LightbulbOutline';
import Typography from 'material-ui/Typography';

interface Props {
  classes: ExampleClasses;
  channel: string;
  handleDrawerToggle: DrawerToggle;
  handleThemeSwitch: ThemeSwitch;
}

export default class ChannelHeader extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    
    return (
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <IconButton color="contrast" onClick={this.props.handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Typography type="title" color="inherit" style={{flex: 1}}>
          Chatroom
          </Typography>
          <Typography type="title" color="inherit" style={{flex: 1}}>
            # {this.props.channel}
          </Typography>
          <IconButton color="contrast" onClick={this.props.handleThemeSwitch}>
            <LightbulbOutline />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}