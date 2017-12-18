// Structures
interface ChatMessage {
  user: string;
  channel: string;
  date: Date;
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