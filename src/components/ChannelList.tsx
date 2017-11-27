import * as React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import '../styles/navbar.css';
const logo = require('../images/logo.svg');

interface Props {
  channelChange: Channel;
  channels: string[];
  initialChannel: string;
}
interface State {
  currentChannel: string;
  isOpen: boolean;
}
export default class ChannelList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.changeChannel = this.changeChannel.bind(this);
    this.state = {
      currentChannel: props.initialChannel,
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  transition = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
  }
  changeChannel(targetChannel: string) {
    if (this.state.currentChannel !== targetChannel) {    
      this.setState({currentChannel: targetChannel});
      this.props.channelChange(targetChannel);
    }
  }
  
  render() {
    return (
      <Navbar dark={true} className="fixed-top" expand="md">
        <NavbarBrand href="#"><img src={logo} className="app-logo"/>Chatroom</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar={true}>
            <Nav navbar={true}>
            {
              this.props.channels.map((channel, i) => {
                return (
                  <NavItem className={channel === this.state.currentChannel ? 'active' : ''} key={i}>
                    <NavLink href="#" onClick={() => this.changeChannel(channel)} ># {channel}</NavLink>
                  </NavItem>
                );
              })
            };
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}