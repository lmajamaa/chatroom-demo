// Structures
interface ChatMessage {
  user: string;
  date: Date;
  text: string;
}
interface PrivateMessage extends ChatMessage {
  to: string;
}

interface ChannelUpdate extends ChatMessage {
  users: string[];
}

interface InitializeData {
  name: string;
  oldName: string;
  newName: string;
  user: string;
  channel: string;
  channels: string[];
  users: string[];
}


// Functions
interface MessageSubmit {
  (message: ChatMessage): void;
}
interface PrivateMessageSubmit {
  (message: PrivateMessage): void;
}
interface NameChange {
  (newName: string): void;
}

interface Channel {
  (channelName: string): void;
}

interface PrivateMessageToggle {
  (user: string): void;
}