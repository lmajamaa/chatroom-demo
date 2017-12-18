/// <reference path="../types/interfaces.d.ts"/>
import * as React from 'react';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import TextField from 'material-ui/TextField';

interface Props {
  onChangeName: NameChange;
  user: string;
}
interface State {
    newName: string;
    open: boolean;
}
export default class NameChangeModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { newName: '', open: true };
  }
  
  toggle() {
    this.setState({
      open: !this.state.open
    });
    this.props.onChangeName('');
  }
  
  handleClose = () => {
    var newName = this.state.newName;
    this.props.onChangeName(newName);    
  }
  
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newName : event.target.value });
  }
  
  handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === 13 ) { this.handleClose(); }
  }

  render() {
    return(
      <Dialog open={this.state.open} onClose={this.handleClose}>
        <DialogTitle>Enter your username</DialogTitle>
        <DialogContent>
          <TextField
            value={this.state.newName}
            placeholder="Username"
            required={true}
            autoFocus={true}
            fullWidth={true}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}