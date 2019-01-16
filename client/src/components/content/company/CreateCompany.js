import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import PropTypes from "prop-types";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";
import isEmpty from "../../../validation/isEmpty";

import { connect } from "react-redux";
import { createCompany } from "../../../actions/companyAction";

class CreateCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      name: "",
      email: "",
      address: "",
      phone: "",
      alertData: {
        status: false,
        message: ""
      },
      status: "",
      userdata: {},
      labelWidth: 0
    };

    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      status: newProps.companyReducer.statusADD,
      userdata: newProps.auth.user
    });
  }

  changeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    if (e.target.name === "name") {
      this.setState({ errorName: "" });
    }
    if (e.target.name === "email") {
      this.setState({ errorEmail: "" });
    }
    if (e.target.name === "phone") {
      this.setState({ errorPhone: "" });
    }
    if (e.target.name === "address") {
      this.setState({ errorAddress: "" });
    }
  }

  validateCompanyName = companyname => {
    let allCompany = this.props.allCompany.map(ele => ele.name);
    let a = allCompany.filter(
      e => e.toLowerCase() === companyname.toLowerCase()
    );
    if (a.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  validateEmail(email) {
    let regex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regex.test(String(email).toLowerCase());
  }

  validatePhone(phone) {
    let regex = new RegExp(/^[0-9\-+,()]{9,15}$/);
    return regex.test(phone);
  }

  submitHandler() {
    if (isEmpty(this.state.name)) {
      this.setState({ errorName: "This Field is Required!" });
    }
    if (isEmpty(this.state.email)) {
      this.setState({ errorEmail: "This Field is Required!" });
    }
    if (isEmpty(this.state.phone)) {
      this.setState({ errorPhone: "This Field is Required!" });
    }
    if (isEmpty(this.state.address)) {
      this.setState({ errorAddress: "This Field is Required!" });
    }
    if (this.validateCompanyName(this.state.name) === false) {
      this.setState({
        errorName: "Company with name " + this.state.name + " is already exist!"
      });
    }
    if (this.validateEmail(this.state.email) === false) {
      this.setState({
        errorEmail: "Invalid e-mail format!"
      });
    }
    if (this.validatePhone(this.state.phone) === false) {
      this.setState({
        errorPhone: "Invalid phone number format!"
      });
    }
    if (
      !isEmpty(this.state.name) &&
      !isEmpty(this.state.email) &&
      !isEmpty(this.state.phone) &&
      !isEmpty(this.state.address) &&
      this.validateCompanyName(this.state.name) &&
      this.validateEmail(this.state.email) &&
      this.validatePhone(this.state.phone)
    ) {
      const formdata = {
        code: this.state.code,
        name: this.state.name,
        email: this.state.email,
        address: this.state.address,
        phone: this.state.phone,
        created_by: this.state.userdata.m_employee_id
      };
      this.props.createCompany(formdata, this.props.modalStatus);
      this.props.closeHandler();
      setTimeout(() => {
        this.setState({
          code: "",
          name: "",
          email: "",
          address: "",
          phone: ""
        });
      }, 3000);
    }
  }

  closeHandler = () => {
    this.setState({
      code: "",
      name: "",
      email: "",
      address: "",
      phone: "",
      errorName: "",
      errorEmail: "",
      errorPhone: "",
      errorAddress: ""
    });
    this.props.closeHandler();
  };

  render() {
    return (
      <Modal
        isOpen={this.props.create}
        className={this.props.className}
        //size="lg"
      >
        <ModalHeader> Add Company</ModalHeader>
        <ModalBody>
          <form>
            <TextFieldGroup
              label="*Company Code"
              placeholder="Auto Generated"
              name="code"
              value={this.state.code}
              onChange={this.changeHandler}
              disabled={true}
            />
            <TextFieldGroup
              label="*Company Name"
              placeholder="Type Company Name"
              name="name"
              value={this.state.name}
              onChange={this.changeHandler}
              errors={this.state.errorName}
              maxLength="50"
            />
            <TextFieldGroup
              label="*Company E-mail"
              placeholder="Type Company E-mail"
              name="email"
              value={this.state.email}
              onChange={this.changeHandler}
              errors={this.state.errorEmail}
            />
            <TextFieldGroup
              label="*Company Phone Number"
              placeholder="Type Company Phone Number"
              name="phone"
              value={this.state.phone}
              onChange={this.changeHandler}
              errors={this.state.errorPhone}
            />
            <TextAreaGroup
              label="*Company Address"
              placeholder="Type Company Address"
              name="address"
              value={this.state.address}
              onChange={this.changeHandler}
              errors={this.state.errorAddress}
              rows="3"
              maxLength="255"
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="contained"
            color="primary"
            onClick={this.submitHandler}
          >
            Save
          </Button>
          <Button variant="contained" onClick={this.closeHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

CreateCompany.propTypes = {
  createCompany: PropTypes.func.isRequired,
  companyReducer: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  companyReducer: state.companyIndexReducer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { createCompany }
)(CreateCompany);
