import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import axios from "axios";
import apiConfig from "../../../config/Host_Config";
class DeleteRole extends React.Component {
  constructor(props) {
    super(props);
    this.deleteHandler = this.deleteHandler.bind(this);
  }

  deleteHandler() {
    let token = localStorage.token;
    let option = {
      url: apiConfig.host + "/role" + "/" + this.props.role.code,
      method: "delete",
      headers: {
        Authorization: token
      }
    };
    axios(option)
      .then(response => {
        if (response.data.code == 200) {
          this.props.modalStatus(
            1,
            "Data deleted!, Data role with code " +
              this.props.role.code +
              " has been deleted!"
          );
        }
      })
      .catch(error => {
        this.props.modalStatus(
          2,
          "Invalid!, Data role with code " +
            this.props.role.code +
            " is used in other account!"
        );
      });
  }

  render() {
    return (
      <Modal isOpen={this.props.delete} className={this.props.className}>
        <ModalHeader> Delete Role </ModalHeader>
        <ModalBody>
          <p> Delete Data </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.deleteHandler}>
            Delete
          </Button>
          <Button color="danger" onClick={this.props.closeModalHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
export default DeleteRole;
