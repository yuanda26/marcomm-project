import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { Alert } from "reactstrap";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
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
    this.setState({
      formdata: tmp,
      alertData: {
        status: false,
        message: ""
      }
    });
  }

  validateFilter = input => {
    let allCompany = this.props.allCompany.map(ele => ele.name);
    let oldData = this.props.allCompany.filter(
      a => a._id === this.state.formdata._id
    )[0];
    let a = allCompany.filter(a => a.toLowerCase() === input.toLowerCase());
    if (input.toLowerCase() === oldData.name.toLowerCase()) {
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
    if (
      this.state.formdata.name === "" ||
      this.state.formdata.email === "" ||
      this.state.formdata.phone === "" ||
      this.state.formdata.address === ""
    ) {
      this.setState({
        alertData: {
          status: true,
          message: "all forms must be filled!"
        }
      });
    } else if (this.validateFilter(this.state.formdata.name) === false) {
      this.setState({
        alertData: {
          status: true,
          message: "Company name already exist"
        }
      });
    } else if (this.validateEmail(this.state.formdata.email) === false) {
      this.setState({
        alertData: {
          status: true,
          message: "invalid email format,type in the email section correctly!"
        }
      });
    } else if (this.validatePhone(this.state.formdata.phone) === false) {
      this.setState({
        alertData: {
          status: true,
          message:
            "invalid phone number format,type in the phone number section correctly!"
        }
      });
    } else {
      this.props.editCompany(this.state);
      this.props.closeModalHandler();
    }
  }

  render() {
    this.state.status === 200 &&
      this.props.modalStatus(1, "Updated", this.state.formdata.name);
    //const { classes } = this.props;
    return (
      <Modal isOpen={this.props.edit} className={this.props.className}>
        <ModalHeader> Edit Company</ModalHeader>
        <ModalBody>
          <form>
            <TextField
              name="code"
              label="Company Code"
              // className={classes.textField}
              value={this.state.formdata.code}
              onChange={this.changeHandler}
              margin="normal"
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true
              }}
            />
            <TextField
              name="name"
              label="Company Name"
              // className={classes.textField}
              value={this.state.formdata.name}
              onChange={this.changeHandler}
              margin="normal"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="outlined-email-input"
              label="Email"
              // className={classes.textField}
              type="email"
              name="email"
              value={this.state.formdata.email}
              onChange={this.changeHandler}
              autoComplete="email"
              margin="normal"
              variant="outlined"
              fullWidth
            />
            <TextField
              name="phone"
              label="Phone Number"
              // className={classes.textField}
              value={this.state.formdata.phone}
              onChange={this.changeHandler}
              margin="normal"
              variant="outlined"
              fullWidth
            />
            <TextField
              name="address"
              label="Address"
              defaultValue="Default Value"
              rows="4"
              value={this.state.formdata.address}
              onChange={this.changeHandler}
              // className={classes.textField}
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
          <Button variant="contained" onClick={this.props.closeModalHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

UpdateCompany.propTypes = {
  classes: PropTypes.object.isRequired,
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
