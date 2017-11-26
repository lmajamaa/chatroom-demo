import * as React from 'react';
import Initials from './Initials';
import { Media } from 'reactstrap';
import '../styles/message.css';

interface Props {
  user: string;
  date: Date;
  text: string;
}
interface State { }

export default class Message extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
    
  render() {
    return (
      <li className="messageRow">
        <Media>
          <Initials user={this.props.user}/>
          <Media body={true}>
            <Media heading={true}>
              <span className="messageUser mt-0">{this.props.user}</span>
              <span className="messageTime"> ({('0' + this.props.date.getHours()).slice(-2)}:{('0' + this.props.date.getMinutes()).slice(-2)})</span>
            </Media>
            <pre className="messageText">{this.props.text}</pre>
          </Media>
        </Media>      
      </li>
    );
  }
}