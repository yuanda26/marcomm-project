import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import PropTypes from "prop-types";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";
import isEmpty from "../../../validation/isEmpty";

import { connect } from "react-redux";
import { editCompany } from "../../../actions/companyAction";

class UpdateCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formdata: {
        code: "",
        name: "",
        address: "",
        email: "",
        phone: "",
        updated_by: ""
      },
      alertData: {
        status: false,
        message: ""
      },
      status: "",
      userdata: {}
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      formdata: newProps.companytest,
      status: newProps.companyReducer.statusPUT,
      userdata: newProps.auth.user
    });
  }

  changeHandler(e) {
    let tmp = this.state.formdata;
    tmp[e.target.name] = e.target.value;
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

  validateCompanyName = input => {
    let allCompany = this.props.allCompany.map(ele => ele.name);
    let oldData = this.props.allCompany.filter(
      a => a._id === this.state.formdata._id
    )[0];
    let a = allCompany.filter(b => b.toLowerCase() === input.toLowerCase());
    if (input.toLowerCase() === oldData.name.toLowerCase()) {
      return true;
    } else if (
      input.toLowerCase() !== oldData.name.toLowerCase() &&
      a.length === 0
    ) {
      return true;
    } else if (
      input.toLowerCase() !== oldData.name.toLowerCase() &&
      a.length !== 0
    ) {
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
    if (isEmpty(this.state.formdata.name)) {
      this.setState({ errorName: "This Field is Required!" });
    }
    if (isEmpty(this.state.formdata.email)) {
      this.setState({ errorEmail: "This Field is Required!" });
    }
    if (isEmpty(this.state.formdata.phone)) {
      this.setState({ errorPhone: "This Field is Required!" });
    }
    if (isEmpty(this.state.formdata.address)) {
      this.setState({ errorAddress: "This Field is Required!" });
    }
    if (this.validateCompanyName(this.state.formdata.name) === false) {
      this.setState({
        errorName:
          "Company with name" + this.state.formdata.name + "is already exist!"
      });
    }
    if (this.validateEmail(this.state.formdata.email) === false) {
      this.setState({
        errorEmail: "Invalid e-mail format!"
      });
    }
    if (this.validatePhone(this.state.formdata.phone) === false) {
      this.setState({
        errorPhone: "Invalid phone number format!"
      });
    }
    if (
      !isEmpty(this.state.formdata.name) &&
      !isEmpty(this.state.formdata.email) &&
      !isEmpty(this.state.formdata.phone) &&
      !isEmpty(this.state.formdata.address) &&
      this.validateCompanyName(this.state.formdata.name) &&
      this.validateEmail(this.state.formdata.email) &&
      this.validatePhone(this.state.formdata.phone)
    ) {
      this.props.editCompany(this.state.formdata, this.props.modalStatus);
      this.props.closeModalHandler();
    }
  }

  render() {
    return (
      <Modal
        isOpen={this.props.edit}
        className={this.props.className}
        size="lg"
      >
        <ModalHeader> Edit Company</ModalHeader>
        <ModalBody>
          <form>
            <TextFieldGroup
              label="*Company Code"
              placeholder="Auto Generated"
              name="code"
              value={this.state.formdata.code}
              onChange={this.changeHandler}
              disabled={true}
            />
            <TextFieldGroup
              label="*Company Name"
              placeholder="Type Company Name"
              name="name"
              value={this.state.formdata.name}
              onChange={this.changeHandler}
              errors={this.state.errorName}
              maxLength="50"
            />
            <TextFieldGroup
              label="*Company E-mail"
              placeholder="Type Company E-mail"
              name="email"
              value={this.state.formdata.email}
              onChange={this.changeHandler}
              errors={this.state.errorEmail}
            />
            <TextFieldGroup
              label="*Company Phone Number"
              placeholder="Type Company Phone Number"
              name="phone"
              value={this.state.formdata.phone}
              onChange={this.changeHandler}
              errors={this.state.errorPhone}
            />
            <TextAreaGroup
              label="*Company Address"
              placeholder="Type Company Address"
              name="address"
              value={this.state.formdata.address}
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
          <Button variant="contained" onClick={this.props.closeModalHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

UpdateCompany.propTypes = {
  editCompany: PropTypes.func.isRequired,
  companyReducer: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  companyReducer: state.companyIndexReducer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { editCompany }
)(UpdateCompany);
