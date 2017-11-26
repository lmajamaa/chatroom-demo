import * as React from 'react';
import Chatroom from './components/Chatroom';

interface Props { }
interface State { }

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <Chatroom/>
    );
  }
}