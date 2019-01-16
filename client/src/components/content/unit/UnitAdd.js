import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createUnit } from "../../../actions/unitAction";
// Form Components
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";
// Form Validation
import isEmpty from "../../../validation/isEmpty";

class CreateUnit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      name: "",
      description: "",
      errorName: "",
      units: []
    };
  }

  UNSAFE_componentWillReceiveProps(props, state) {
    this.setState({ units: props.units.unitData });
  }

  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = e => {
    e.preventDefault();

    // Form Validation
    if (isEmpty(this.state.name)) {
      this.setState({ errorName: "This Field is Required!" });
    }

    // Final Validation
    if (!isEmpty(this.state.name)) {
      const formdata = {
        code: this.state.code,
        name: this.state.name,
        description: this.state.description,
        created_by: this.props.userdata.m_employee_id,
        is_delete: false
      };
      // Save Unit to Database
      this.props.createUnit(formdata);
      this.props.closeModal();
    }
  };

  closeHandler = () => {
    this.setState({
      code: "",
      name: "",
      description: "",
      errorName: ""
    });
    this.props.closeModal();
  };

  render() {
    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader>Add Unit</ModalHeader>
        <ModalBody>
          <form onSubmit={this.submitHandler}>
            <TextFieldGroup
              label="*Unit Code"
              placeholder="Auto Generated"
              name="code"
              value={this.state.code}
              disabled={true}
            />
            <TextFieldGroup
              label="*Unit Name"
              placeholder="Type Unit Name"
              name="name"
              value={this.state.name}
              onChange={this.changeHandler}
              errors={this.state.errorName}
            />
            <TextAreaGroup
              label="Description"
              placeholder="Type Description"
              rows="3"
              name="description"
              value={this.state.description}
              onChange={this.changeHandler}
            />
            <div className="form-group mt-4 text-right">
              <input
                type="submit"
                className="btn btn-primary mr-1"
                value="Submit"
              />
              <button
                type="button"
                className="btn btn-warning"
                onClick={this.closeHandler}
              >
                Cancel
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    );
  }
}

CreateUnit.propTypes = {
  create: PropTypes.bool.isRequired,
  userdata: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  units: state.units
});

export default connect(
  mapStateToProps,
  { createUnit }
)(CreateUnit);
