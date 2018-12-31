import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import PropTypes from "prop-types";
import { putMenu } from "../../../actions/menuActions";
import { connect } from "react-redux";

class EditMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formdata: {
        code: "",
        name: "",
        controller: "",
        parent_id: ""
      },
      status: "",
      alertData: {
        status: false,
        message: ""
      },
      userdata: {}
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      formdata: newProps.menutest,
      status: newProps.take.statusPUT,
      userdata: newProps.auth.user
    });
  }

  changeHandler = e => {
    let tmp = this.state.formdata;
    tmp[e.target.name] = e.target.value;
    this.setState({
      formdata: tmp,
      alertData: {
        status: false,
        message: ""
      }
    });
  };

  submitHandler = () => {
    const formdata = {
      code: this.state.formdata.code,
      name: this.state.formdata.name,
      controller: this.state.formdata.controller,
      parent_id: this.state.formdata.parent_id,
      updated_by: this.state.userdata.m_employee_id
    };
    if (
      formdata.code === "" ||
      formdata.name === "" ||
      formdata.controller === ""
    ) {
      this.setState({
        alertData: {
          status: true,
          message: "all forms must be filled!"
        }
      });
    } else {
      this.props.putMenu(formdata);
      this.props.closeModalHandler();
    }
  };

  render() {
    this.state.status === 200 &&
      this.props.modalStatus(1, "Updated!", this.state.formdata.code);
    return (
      <Modal isOpen={this.props.edit} className={this.props.className}>
        <ModalHeader> Edit Menu</ModalHeader>
        <ModalBody>
          <label for="text"> Menu Code : </label>
          <form class="form">
            <input
              type="text"
              class="form-control"
              readOnly
              name="code"
              value={this.state.formdata.code}
              onChange={this.changeHandler}
            />
          </form>
          <form>
            <label for="text"> Menu Name :</label>
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                name="name"
                value={this.state.formdata.name}
                onChange={this.changeHandler}
              />
            </div>
          </form>
          <label for="text"> URL : </label>
          <form>
            <input
              type="text"
              class="form-control"
              name="controller"
              value={this.state.formdata.controller}
              onChange={this.changeHandler}
            />
          </form>
          <label for="text"> Parent : </label>
          <form>
            <input
              type="text"
              class="form-control"
              readOnly
              name="parent_id"
              value={this.state.formdata.parent_id}
              onChange={this.changeHandler}
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="contained"
            color="primary"
            onClick={this.submitHandler}
          >
            Update
          </Button>
          <Button variant="contained" onClick={this.props.closeModalHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

EditMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  putMenu: PropTypes.func.isRequired,
  take: PropTypes.object.isRequired
};

const mapStatetoProps = state => ({
  take: state.menu,
  auth: state.auth
});

export default connect(
  mapStatetoProps,
  { putMenu }
)(EditMenu);
