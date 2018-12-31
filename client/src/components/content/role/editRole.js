import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import axios from "axios";

class EditRole extends React.Component {
  constructor(props) {
    super(props);
    super(props);
    this.state = {
      oldData: {
        code: "",
        name: "",
        description: ""
      },
      formdata: {
        code: "",
        name: "",
        description: ""
      }
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      formdata: newProps.roletest,
      oldData: newProps.roletest
    });
  }

  changeHandler(e) {
    let tmp = this.state.formdata;
    tmp[e.target.name] = e.target.value;
    this.setState({
      formdata: tmp
    });
  }

  submitHandler() {
    if (this.state.formdata.name == "") {
      alert("Role name can't be null!!");
    } else {
      let token = localStorage.token;
      let option = {
        url: "http://localhost:4000/api/role" + "/" + this.state.formdata.code,
        method: "put",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        data: this.state.formdata
      };
      axios(option)
        .then(response => {
          if (response.data.code === 200) {
            this.props.modalStatus(
              1,
              "Data updated! " + this.state.formdata.code + " has been updated!"
            );
          } else {
            alert(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.edit} className={this.props.className}>
        <ModalHeader> Edit Role</ModalHeader>
        <ModalBody>
          <form class="form-inline">
            <div class="input-group mb-3 input-group-sm">
              <label for="text"> *Role Code : </label>
              <input
                type="text"
                class="form-control"
                readOnly
                name="code"
                value={this.state.formdata.code}
                onChange={this.changeHandler}
              />
              <label for="text"> *Role Name : </label>
              <input
                type="text"
                class="form-control"
                name="name"
                value={this.state.formdata.name}
                onChange={this.changeHandler}
              />
            </div>

            <div class="input-group mb-3 input-group-sm">
              <label for="text"> Description : </label>
              <input
                type="text"
                class="form-control"
                name="description"
                value={this.state.formdata.description}
                onChange={this.changeHandler}
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.submitHandler}>
            Update
          </Button>
          <Button color="warning" onClick={this.props.closeModalHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
export default EditRole;
