import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import PropTypes from "prop-types";
import { Alert } from "reactstrap";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { updateUnit } from "../../../actions/unitAction";

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

class EditUnit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unitId: "",
      code: "",
      name: "",
      description: "",
      updated_by: "",
      alertdata: {
        stat: "",
        message: ""
      }
    };
  }

  componentWillReceiveProps(props, state) {
    this.setState({
      unitId: props.unit._id,
      code: props.unit.code,
      name: props.unit.name,
      description: props.unit.description
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
        description: this.state.description
      };

      this.props.updateUnit(this.state.unitId, formdata);
      this.props.closeModal();
    }
  };

  render() {
    let { unit } = this.props;
    let { stat, message } = this.state.alertdata;

    return (
      <Modal isOpen={this.props.edit} className={this.props.className}>
        <ModalHeader>
          Edit Unit - {unit.name} ({unit.code})
        </ModalHeader>
        <ModalBody>
          {stat === 2 && <Alert color="danger">{message}</Alert>}
          <form className="form-inline">
            <div className="input-group mb-3 input-group-sm">
              <Grid item xs={6}>
                <label htmlFor="text"> *Unit Code : </label>
              </Grid>
              <Grid item xs={6}>
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  name="code"
                  value={this.state.code}
                />
              </Grid>
            </div>
            <div className="input-group mb-3 input-group-sm">
              <Grid item xs={6}>
                <label htmlFor="text"> *Unit Role : </label>
              </Grid>
              <Grid item xs={6}>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={this.state.name}
                  onChange={this.changeHandler}
                />
              </Grid>
            </div>
            <div className="input-group mb-3 input-group-sm">
              <Grid item xs={6}>
                <label htmlFor="text"> description : </label>
              </Grid>
              <Grid item xs={6}>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={this.state.description}
                  onChange={this.changeHandler}
                />
              </Grid>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.submitHandler}>
            Update
          </Button>
          <Button color="warning" onClick={this.props.closeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

EditUnit.propTypes = {
  edit: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
  alertData: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalStatus: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  units: state.units
});

const style = withStyles(styles)(EditUnit);
const konek = connect(
  mapStateToProps,
  { updateUnit }
);
export default konek(style);
