import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { Alert } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createMenu } from "../../../actions/menuActions";

class CreateMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      name: "",
      controller: "",
      parent_id: false,
      status: "",
      alertData: {
        status: false,
        message: ""
      },
      labelWidth: 0,
      show: false,
      userdata: {}
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      status: newProps.take.statusADD,
      userdata: newProps.auth.user
    });
  }

  changeHandler = e => {
    let tmp = this.state;
    tmp[e.target.name] = e.target.value;
    this.setState({
      alertData: {
        status: false,
        message: ""
      },
      formdata: tmp
    });
  };

  // membuat pilihan parent atau child
  // radioChange = event => {
  //   let tmp = event.target.value;
  //   if (tmp == "child") {
  //     this.setState({ show: false });
  //   } else {
  //     this.setState({ show: true });
  //   }
  // };

  submitHandler = () => {
    const formdata = {
      name: this.state.name,
      controller: this.state.controller,
      parent_id: this.state.parent_id,
      created_by: this.state.userdata.m_employee_id
    };
    if (
      formdata.name === "" ||
      formdata.controller === ""
      // formdata.parent_id === ""
    ) {
      this.setState({
        alertData: {
          status: true,
          message: "all forms must be filled!"
        }
      });
    } else {
      this.props.createMenu(formdata);
      this.props.closeHandler();
    }
  };

  render() {
    this.state.status === 200 &&
      this.props.modalStatus(1, "Created!", this.state.formdata.code);
    const filter = this.props.menu.filter(row => row.parent_id === false);
    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader> Add Menu</ModalHeader>
        <ModalBody>
          <form>
            <div class="input-group mb-4 input-group-sm">
              <label for="code" class="col-md-3">
                *Menu ID
              </label>
              <input
                type="text"
                class="form-control"
                name="code"
                value="Auto Generated"
                disabled="true"
                onChange={this.changeHandler}
              />
            </div>
            <div class="input-group mb-4 input-group-sm">
              <label for="text" class="col-md-3">
                *Menu Name
              </label>
              <input
                type="text"
                class="form-control"
                name="name"
                value={this.state.name}
                onChange={this.changeHandler}
                required
              />
            </div>
            <div class="input-group mb-4 input-group-sm">
              <label for="text" class="col-md-3">
                *URL
              </label>
              <input
                type="text"
                class="form-control"
                name="controller"
                value={this.state.controller}
                onChange={this.changeHandler}
                readOnly={this.state.show}
                required
              />
            </div>
            <div class="input-group mb-4 input-group-sm">
              <label for="text" class="col-md-3">
                *Parent Menu
              </label>
              <select
                className="form-control"
                disabled={this.state.show}
                name="parent_id"
                value={this.state.parent_id}
                onChange={this.changeHandler}
              >
                <option value="">Select Parent Menu</option>
                {filter.map(row => (
                  <option value={row.code}>{row.name}</option>
                ))}
              </select>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          {this.state.alertData.status === true ? (
            <Alert color="danger">{this.state.alertData.message} </Alert>
          ) : (
            ""
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={this.submitHandler}
          >
            Save
          </Button>
          <Button variant="contained" onClick={this.props.closeHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

CreateMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  createMenu: PropTypes.func.isRequired,
  take: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  take: state.menu,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { createMenu }
)(CreateMenu);
