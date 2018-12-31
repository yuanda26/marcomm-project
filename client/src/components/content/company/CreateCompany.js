import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { Alert } from "reactstrap";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";

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

  componentDidMount() {}

  componentWillReceiveProps(newProps) {
    this.setState({
      status: newProps.companyReducer.statusADD,
      userdata: newProps.auth.user
    });
  }

  changeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value,
      alertData: {
        status: false,
        message: ""
      }
    });
  }

  validateFilter = companyname => {
    let allCompany = this.props.allCompany.map(ele => ele.name);
    let a = allCompany.filter(
      e => e.toLowerCase() === companyname.toLowerCase()
    );
    if (a.length === 0) {
      return false;
    } else {
      return true;
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
    if (
      this.state.name === "" ||
      this.state.email === "" ||
      this.state.phone === "" ||
      this.state.address === "" ||
      this.state.provinsi === "" ||
      this.state.kota === ""
    ) {
      this.setState({
        alertData: {
          status: true,
          message: "all forms must be filled!"
        }
      });
    } else if (this.validateFilter(this.state.name) === true) {
      this.setState({
        alertData: {
          status: true,
          message: "Company with name " + this.state.name + " is already exist"
        }
      });
    } else if (this.validateEmail(this.state.email) === false) {
      this.setState({
        alertData: {
          status: true,
          message: "invalid email format,type in the email section correctly!"
        }
      });
    } else if (this.validatePhone(this.state.phone) === false) {
      this.setState({
        alertData: {
          status: true,
          message:
            "invalid phone number format,type in the phone number section correctly!"
        }
      });
    } else {
      const formdata = {
        code: this.state.code,
        name: this.state.name,
        email: this.state.email,
        address: this.state.address,
        phone: this.state.phone,
        created_by: this.state.userdata.m_employee_id
      };
      this.props.createCompany(formdata);
      this.props.closeHandler();
    }
  }

  render() {
    console.log(this.state.userdata);
    this.state.status === 200 &&
      this.props.modalStatus(1, "Created", this.state.name);

    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader> Add Company</ModalHeader>
        <ModalBody>
          {/* <form className={classes.container}> */}
          <form>
            <TextField
              //   className={classes.textField}
              id="standard-read-only-input"
              name="code"
              label=""
              defaultValue="Code Company Auto Generated"
              margin="normal"
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true
              }}
            />
            <TextField
              //   className={classes.textField}
              name="name"
              label="*Type Company Name"
              value={this.state.name}
              onChange={this.changeHandler}
              margin="normal"
              variant="outlined"
              fullWidth
            />
            <TextField
              //   className={classes.textField}
              id="outlined-email-input"
              label="*Type Company Email"
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.changeHandler}
              autoComplete="email"
              margin="normal"
              variant="outlined"
              fullWidth
            />
            <TextField
              //   className={classes.textField}
              name="phone"
              label="*Type Company Phone Number"
              value={this.state.phone}
              onChange={this.changeHandler}
              margin="normal"
              variant="outlined"
              fullWidth
            />
            <TextField
              //   className={classes.textField}
              name="address"
              label="*Type Company Address"
              value={this.state.address}
              onChange={this.changeHandler}
              margin="normal"
              variant="outlined"
              fullWidth
            />
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

CreateCompany.propTypes = {
  classes: PropTypes.object.isRequired,
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
