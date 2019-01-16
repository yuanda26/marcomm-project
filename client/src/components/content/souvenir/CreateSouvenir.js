import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import { createSouvenir } from "../../../actions/souvenirAction";
// Form Components
import TextFieldGroup from "../../common/TextFieldGroup";
import SelectListGroup from "../../common/SelectListGroup";
import TextAreaGroup from "../../common/TextAreaGroup";
// Form Validation
import isEmpty from "../../../validation/isEmpty";

class CreateSouvenir extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      m_unit_id: "",
      description: "",
      errorName: "",
      errorUnit: ""
    };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
      errorName: newProps.errorName,
      errorUnit: newProps.errorUnit
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    // Clear Error State Unit
    if (e.target.name === "name") {
      this.setState({ errorName: "" });
    }
    // Clear Error State Unit
    if (e.target.name === "m_unit_id") {
      this.setState({ errorUnit: "" });
    }
  };

  closeHandler = () => {
    // Clear All State
    this.setState({
      name: "",
      m_unit_id: "",
      description: "",
      errorName: "",
      errorUnit: ""
    });
    // Close Modal
    this.props.closeHandler();
  };

  onSubmit = e => {
    e.preventDefault();

    // Validate Form
    if (isEmpty(this.state.name)) {
      this.setState({ errorName: "This Field is Required" });
    }
    if (isEmpty(this.state.m_unit_id)) {
      this.setState({ errorUnit: "This Field is Required" });
    }

    if (!isEmpty(this.state.name) && !isEmpty(this.state.m_unit_id)) {
      const souvenirData = {
        name: this.state.name,
        m_unit_id: this.state.m_unit_id,
        description: this.state.description,
        created_by: this.props.m_employee_id
      };
      // Save New Souvenir to Database
      this.props.createSouvenir(souvenirData);
      // Clear All State
      this.setState({
        name: "",
        m_unit_id: "",
        description: "",
        errorName: "",
        errorUnit: ""
      });
      // Close Modal
      this.props.closeModal();
    }
  };

  render() {
    const { units } = this.props;

    const options = [];
    options.push({ label: "*Select Unit Name", value: "" });
    units.forEach(unit =>
      options.push({
        label: unit.name,
        value: unit.code
      })
    );

    return (
      <Modal isOpen={this.props.create}>
        <ModalHeader>
          <div className="lead font-weight-bold">Add Souvenir</div>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={this.onSubmit}>
            <TextFieldGroup
              placeholder="Auto Generated"
              label="*Souvenir Code"
              name="code"
              disabled={true}
            />
            <TextFieldGroup
              placeholder="Type Souvenir Name"
              label="*Souvenir Name"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              errors={this.state.errorName}
            />
            <SelectListGroup
              label="*Unit Name"
              placeholder="*Select Unit Name"
              name="m_unit_id"
              value={this.state.m_unit_id}
              onChange={this.onChange}
              options={options}
              errors={this.state.errorUnit}
            />
            <TextAreaGroup
              label="Description"
              rows="3"
              placeholder="Type Description"
              name="description"
              value={this.state.description}
              onChange={this.onChange}
            />
            <div className="form-group text-right">
              <input
                type="submit"
                className="btn btn-primary mr-1"
                value="Submit"
                onClick={this.onSubmit}
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

CreateSouvenir.propTypes = {
  createSouvenir: PropTypes.func.isRequired,
  units: PropTypes.array.isRequired,
  create: PropTypes.bool.isRequired,
  closeHandler: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  m_employee_id: PropTypes.string.isRequired
};

export default connect(
  null,
  { createSouvenir }
)(CreateSouvenir);
