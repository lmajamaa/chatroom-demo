// Structures
interface ChatMessage {
  user: string;
  channel: string;
  date: number;
  text: string;
}

interface ExampleClasses {
  root: string;
  appFrame: string;
  appBar: string;
  toolBar: string;
  drawerPaper: string;
  drawerModal: string;
  drawerBackdrop: string;
  drawerHeader: string;
  bottomNavigation: string;
  textField: string;
  content: string;
  listItem: string;
}

interface ChannelUpdate extends ChatMessage {
  users: string[];
}

interface InitializeData {
  user: string;
  users: string[];
  oldName: string;
  newName: string;
  channel: string;
  channels: string[];
  messages: ChatMessage[];
}

// Functions
interface MessageSubmit {
  (message: ChatMessage): void;
}
interface PrivateMessageSubmit {
  (message: ChatMessage): void;
}
interface NameChange {
  (newName: string): void;
}

interface DrawerToggle {
  (): void;
}

interface ThemeSwitch {
  (): void;
}

interface ChannelChange {
  (channelName: string): void;
}

interface PrivateMessageToggle {
  (user: string): void;
}