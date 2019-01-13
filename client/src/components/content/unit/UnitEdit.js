import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUnit } from "../../../actions/unitAction";
// Form Components
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";
// Form Validation
import isEmpty from "../../../validation/isEmpty";

class EditUnit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unitId: "",
      code: "",
      name: "",
      description: "",
      updated_by: "",
      errorName: ""
    };
  }

  UNSAFE_componentWillReceiveProps(props, state) {
    this.setState({
      unitId: props.unit._id,
      code: props.unit.code,
      name: props.unit.name,
      description: props.unit.description
    });
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
        updated_by: this.props.userdata.m_employee_id
      };

      this.props.updateUnit(this.state.unitId, formdata);
      this.props.closeModal();
    }
  };

  closeHandler = () => {
    this.setState({ errorName: "" });
    this.props.closeModal();
  };

  render() {
    let { unit } = this.props;

    return (
      <Modal isOpen={this.props.edit} className={this.props.className}>
        <ModalHeader>
          Edit Unit - {unit.name} ({unit.code})
        </ModalHeader>
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
              <button type="submit" className="btn btn-primary mr-1">
                Update
              </button>
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

EditUnit.propTypes = {
  edit: PropTypes.bool.isRequired,
  unit: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalStatus: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  units: state.units
});

export default connect(
  mapStateToProps,
  { updateUnit }
)(EditUnit);
