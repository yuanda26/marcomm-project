import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { Alert } from "reactstrap";
import PropTypes from "prop-types";
import TextFieldGroup from "../../common/TextFieldGroup";
import SelectList from "../../common/SelectListGroup";
import isEmpty from "../../../validation/isEmpty";

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
    this.setState({
      [e.target.name]: e.target.value
    });
    if (e.target.name === "name") {
      this.setState({ errorName: "" });
    }
    if (e.target.name === "controller") {
      this.setState({ errorController: "" });
    }
  };

  submitHandler = () => {
    if (isEmpty(this.state.name)) {
      this.setState({ errorName: "This Field is Required!" });
    }
    if (isEmpty(this.state.controller)) {
      this.setState({ errorController: "This Field is Required!" });
    }
    if (!isEmpty(this.state.name) && !isEmpty(this.state.controller)) {
      const formdata = {
        name: this.state.name,
        controller: this.state.controller,
        parent_id: this.state.parent_id,
        created_by: this.state.userdata.m_employee_id
      };
      this.props.createMenu(formdata, this.props.modalStatus);
      this.props.closeHandler();
    }
  };

  render() {
    const parentMenu = this.props.menu.filter(row => row.parent_id === false);
    const options = [];
    options.push({ label: "*Select Parent Menu", value: "" });
    parentMenu.forEach(parentMenu =>
      options.push({
        label: parentMenu.name,
        value: parentMenu.code
      })
    );
    return (
      <Modal
        isOpen={this.props.create}
        className={this.props.className}
        //size="lg"
      >
        <ModalHeader> Add Menu</ModalHeader>
        <ModalBody>
          <form>
            <TextFieldGroup
              label="*Menu Code"
              placeholder="Auto Generated"
              name="code"
              value={this.state.code}
              onChange={this.changeHandler}
              disabled={true}
            />
            <TextFieldGroup
              label="*Menu Name"
              placeholder="Type Menu Name"
              name="name"
              value={this.state.name}
              onChange={this.changeHandler}
              errors={this.state.errorName}
              maxLength="50"
            />
            <TextFieldGroup
              label="*Menu Controller / URL"
              placeholder="Type Menu Controller / URL"
              name="controller"
              value={this.state.controller}
              onChange={this.changeHandler}
              errors={this.state.errorController}
            />
            <SelectList
              label="Parent Menu"
              placeholder="*Select Parent Menu"
              name="parent_id"
              value={this.state.parent_id}
              onChange={this.changeHandler}
              options={options}
            />
          </form>
        </ModalBody>
        <ModalFooter>
          {this.state.alertData.status === true && (
            <Alert color="danger">{this.state.alertData.message} </Alert>
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
