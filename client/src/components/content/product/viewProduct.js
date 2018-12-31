import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Input, Label, FormGroup } from "reactstrap";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    width: "100%",
    flexGrow: 1
  },
  table: {
    minWidth: 700
  }
});

class ViewCompany extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Modal isOpen={this.props.view} className={this.props.className}>
        <ModalHeader> View Product</ModalHeader>
        <ModalBody>
          <div className={classes.root}>
            <FormGroup>
              <Label for="">Code</Label>
              <Input type="text" name="code"  placeholder="" value={this.props.product.code} readOnly />
            </FormGroup>
            <FormGroup>
              <Label for="">Name Product</Label>
              <Input type="text" name="name"  placeholder="" value={this.props.product.name} readOnly />
            </FormGroup>
            <FormGroup>
              <Label for="">Description</Label>
              <Input type="text" name="description"  placeholder="" value={this.props.product.description}  readOnly />
            </FormGroup>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.props.closeModalHandler}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

ViewCompany.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ViewCompany);
