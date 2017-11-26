/// <reference path="../types/interfaces.d.ts"/>

import * as React from 'react';
import { Form, Input, InputGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import '../styles/modal.css';

interface Props {
  onChangeName: NameChange;
  user: string;
}
interface State {
    newName: string;
    modal: boolean;
}
export default class NameChangeModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { newName: '', modal: true };
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }
  
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
    this.props.onChangeName('');
  }
  
  handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    var newName = this.state.newName;
    this.props.onChangeName(newName);    
  }
  
  changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
      this.setState({ newName : event.target.value });
  }

  render() {
    return(
      <div className="userName">
        <Modal isOpen={this.state.modal} toggle={this.toggle} className="changeNameModal">
          <Form onSubmit={this.handleSubmit}>
            <ModalHeader toggle={this.toggle}>Choose your username</ModalHeader>
            <ModalBody>
              <InputGroup>
                <Input onChange={this.changeHandler} value={this.state.newName} placeholder="Username" required={true}/>
              </InputGroup>
            </ModalBody>
            <ModalFooter>
              <button type="submit" className="btn btn-primary">Confirm</button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}