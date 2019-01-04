import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { Alert } from "reactstrap";
import { connect } from "react-redux";
import { createUnit } from "../../../actions/unitAction";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

class CreateUnit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      name: "",
      description: "",
      is_delete: false,
      userdata: {},
      alertdata: {
        stat: "",
        message: ""
      },
      units: []
    };
  }

  componentWillReceiveProps(props, state) {
    this.setState({
      units: props.units.unitData,
      userdata: props.userdata
    });
  }

  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitHandler = () => {
    if (this.state.name === "") {
      this.setState({
        alertdata: {
          stat: 2,
          message: "Field Name tidak boleh kosong"
        }
      });
    } else {
      const formdata = {
        code: this.state.code,
        name: this.state.name,
        description: this.state.description,
        updated_by: this.state.userdata.m_employee_id
      };
      // Save Unit to Database
      this.props.createUnit(formdata);
      this.props.closeModal();
    }
  };

  render() {
    const { stat, message } = this.state.alertdata;
    const { classes } = this.props;

    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader>Add Unit</ModalHeader>
        <ModalBody>
          {stat === 2 && <Alert color="danger">{message}</Alert>}
          <div className={classes.root}>
            <form className="form-inline">
              <div className="input-group mb-3 input-group-sm">
                <Grid item xs={6}>
                  <label htmlFor="text">Unit Code</label>
                </Grid>
                <Grid item xs={6}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Auto Generated"
                    readOnly
                    name="code"
                    value={this.state.code}
                    onChange={this.changeHandler}
                  />
                </Grid>
              </div>
              <div className="input-group mb-3 input-group-sm">
                <Grid item xs={6}>
                  <label htmlFor="text">Unit Name</label>
                </Grid>
                <Grid item xs={6}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type Unit Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.changeHandler}
                    required
                  />
                </Grid>
              </div>
              <div className="input-group mb-3 input-group-sm">
                <Grid item xs={6}>
                  <label htmlFor="text">Description</label>
                </Grid>
                <Grid item xs={6}>
                  <input
                    type="description  "
                    className="form-control"
                    placeholder="Type Description"
                    name="description"
                    value={this.state.description}
                    onChange={this.changeHandler}
                    required
                  />
                </Grid>
              </div>
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.submitHandler}>
            Save
          </Button>
          <Button color="warning" onClick={this.props.closeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

CreateUnit.propTypes = {
  create: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  userdata: PropTypes.object.isRequired,
  alertData: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalStatus: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  units: state.units
});

const style = withStyles(styles)(CreateUnit);
const konek = connect(
  mapStateToProps,
  { createUnit }
);
export default konek(style);
