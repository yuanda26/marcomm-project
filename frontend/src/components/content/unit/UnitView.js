import React, { Component } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

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

class ViewUnit extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Modal isOpen={this.props.view} className={this.props.className}>
        <ModalHeader> View Unit</ModalHeader>
        <ModalBody>
          <div className={classes.root}>
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
                    value={this.props.unit.code}
                    onChange={this.changeHandler}
                  />
                </Grid>
              </div>
              <div className="input-group mb-3 input-group-sm">
                <Grid item xs={6}>
                  <label htmlFor="text"> *Unit Name : </label>
                </Grid>
                <Grid item xs={6}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type Unit Name"
                    readOnly
                    name="name"
                    value={this.props.unit.name}
                    onChange={this.changeHandler}
                  />
                </Grid>
              </div>
              <div className="input-group mb-3 input-group-sm">
                <Grid item xs={6}>
                  <label htmlFor="text"> Description : </label>
                </Grid>
                <Grid item xs={6}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="-"
                    readOnly
                    name="description"
                    value={this.props.unit.description}
                    onChange={this.changeHandler}
                  />
                </Grid>
              </div>
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.props.closeModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

ViewUnit.propTypes = {
  classes: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
  view: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalStatus: PropTypes.func.isRequired
};

export default withStyles(styles)(ViewUnit);
