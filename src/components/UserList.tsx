import * as React from 'react';
import '../styles/sidebar.css';

interface Props {
  user: string;
  users: string[];
  sidebarActive: boolean;
  enablePrivateMessage: PrivateMessageToggle;
}
interface State {
  sidebarActive: boolean;
}
export default class UserList extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { sidebarActive: props.sidebarActive };
    this.getUsername = this.getUsername.bind(this);
    this.getRowClass = this.getRowClass.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({sidebarActive: nextProps.sidebarActive});
  }
  getUsername(user: string, currentUser: string) {
    if (user === currentUser) {
      return user + ' (you)';
    } else {
      return user;
    }
  }
  getRowClass() {
    return this.state.sidebarActive ? 'row-offcanvas row-offcanvas-right active' : 'row-offcanvas row-offcanvas-right';
  }
  
  render() {
    return (
      <div className={this.getRowClass()}>
        <div id="sidebar" className="sidebar-offcanvas">
            <div className="col-md-12">
              <h5>Online users:</h5>
              <ul className="nav flex-column">
                {
                  this.props.users.map((user: string, i: number) => {
                    return <li key={i}><a href="#" onClick={() => this.props.enablePrivateMessage(user)}><i className="fa fa-user-o" aria-hidden="true"/> {this.getUsername(user, this.props.user)}</a></li>;
                  })
                }
              </ul>
            </div>
        </div>
      </div>
    );
  }
}