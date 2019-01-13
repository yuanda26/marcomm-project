import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import PropTypes from "prop-types";
import TextFieldGroup from "../../common/TextFieldGroup";
import SelectList from "../../common/SelectListGroup";
import isEmpty from "../../../validation/isEmpty";

import { connect } from "react-redux";
import { putMenu } from "../../../actions/menuActions";

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
    if (e.target.name === "name") {
      this.setState({ errorName: "" });
    }
    if (e.target.name === "controller") {
      this.setState({ errorController: "" });
    }
  };

  submitHandler = () => {
    if (isEmpty(this.state.formdata.name)) {
      this.setState({ errorName: "This Field is Required!" });
    }
    if (isEmpty(this.state.formdata.controller)) {
      this.setState({ errorController: "This Field is Required!" });
    }
    if (
      !isEmpty(this.state.formdata.name) &&
      !isEmpty(this.state.formdata.controller)
    ) {
      const formdata = {
        code: this.state.formdata.code,
        name: this.state.formdata.name,
        controller: this.state.formdata.controller,
        parent_id: this.state.formdata.parent_id,
        updated_by: this.state.userdata.m_employee_id
      };
      this.props.putMenu(formdata, this.props.modalStatus);
      this.props.closeModalHandler();
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
      <Modal isOpen={this.props.edit} className={this.props.className}>
        <ModalHeader> Edit Menu</ModalHeader>
        <ModalBody>
          <form>
            <TextFieldGroup
              label="*Menu Code"
              placeholder="Auto Generated"
              name="code"
              value={this.state.formdata.code}
              onChange={this.changeHandler}
              disabled={true}
            />
            <TextFieldGroup
              label="*Menu Name"
              placeholder="Type Menu Name"
              name="name"
              value={this.state.formdata.name}
              onChange={this.changeHandler}
              errors={this.state.errorName}
              maxLength="50"
            />
            <TextFieldGroup
              label="*Menu Controller / URL"
              placeholder="Type Menu Controller / URL"
              name="controller"
              value={this.state.formdata.controller}
              onChange={this.changeHandler}
              errors={this.state.errorController}
            />
            <SelectList
              label="Parent Menu"
              placeholder="*Select Parent Menu"
              name="parent_id"
              value={this.state.formdata.parent_id}
              onChange={this.onChange}
              options={options}
              disabled={true}
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
