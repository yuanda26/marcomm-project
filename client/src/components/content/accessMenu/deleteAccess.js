import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import axios from "axios";
import apiConfig from "../../../config/Host_Config";

class DeleteAccess extends React.Component {
  constructor(props) {
    super(props);
    this.deleteHandler = this.deleteHandler.bind(this);
  }

  deleteHandler() {
    let token = localStorage.token;
    let option = {
      url: apiConfig.host + "/role" + "/" + this.props.access.code,
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
              this.props.access.code +
              " has been deleted!",
            200
          );
        }
      })
      .catch(error => {
        this.props.modalStatus(
          2,
          "Invalid!, Data role with code " +
            this.props.access.code +
            " is used in other account!",
          400
        );
      });
  }

  render() {
    return (
      <Modal isOpen={this.props.delete} className={this.props.className}>
        <ModalHeader> Delete Access </ModalHeader>
        <ModalBody>
          <p> Delete Data </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.deleteHandler}>
            Yes
          </Button>
          <Button color="danger" onClick={this.props.closeModalHandler}>
            No
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
export default DeleteAccess;
