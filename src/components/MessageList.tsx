import * as React from 'react';
import Message from './Message';

interface Props {
  channel: string;
  messages: ChatMessage[];
}
interface State {
  channelMessages: ChatMessage[];
}

export default class MessageList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { channelMessages: this.props.messages };
  }
  componentWillReceiveProps(nextProps: Props) {
    var messages = nextProps.messages.concat();
    var channelMessages = messages.filter(message => message.channel === nextProps.channel);
    this.setState({channelMessages});  
  }
  render() {
    return (
      <ul className="list-unstyled">
      {
        this.state.channelMessages.map((message, i) => {
          return (
            <Message key={i} user={message.user} date={message.date} text={message.text} />
          );
        })
      }
      </ul>
    );
  }
}