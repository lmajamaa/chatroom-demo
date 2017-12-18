import * as React from 'react';
import List, { ListItem } from 'material-ui/List';
import Message from './Message';

interface Props {
  classes: ExampleClasses;
  channel: string;
  messages: ChatMessage[];
  sidebarOpen: boolean;
  lightMode: boolean;
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
    const classes = this.props.classes as ExampleClasses;
    return (
      <main className={classes.content} style={{marginLeft: this.props.sidebarOpen ? 240 : 0}}>
        <List>
        {
          this.state.channelMessages.map((message, i) => {
            return (
              <ListItem key={i} className={classes.listItem}>
                <Message user={message.user} date={message.date} text={message.text} />
              </ListItem>
            );
          })
        }
        </List>
      </main>
    );
  }
}