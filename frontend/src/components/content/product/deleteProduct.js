import React from "react"
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap"
import axios from "axios";

import {delProduct} from "../../../actions/productAction";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

class DeleteProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ""
    };
    this.deleteHandler = this.deleteHandler.bind(this);
  }

  deleteHandler() {
    this.props.delProduct(this.props.product_del.code);
    this.props.closeModalHandler();
  }

  componentWillReceiveProps(newStatus) {
    this.setState({
      status: newStatus.product.statusDEL
    });
  }

  render() {
    this.state.status == 200
      ? this.props.modalStatus(1, "Deleted!", this.props.product_del.code)
      : console.log(this.state.status);

    return (
      <Modal isOpen={this.props.delete} className={this.props.className}>
        <ModalHeader> Delete Product </ModalHeader>
        <ModalBody>
          <p>
            Are you sure want delete <strong>{this.props.product_del.name}</strong>{" "}
            Product ?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.deleteHandler}>
            Yes
          </Button>
          <Button color="danger" onClick={this.props.closeModalHandler}>
            No
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

DeleteProduct.propTypes = {
  delProduct: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  product: state.product
});

export default connect(
  mapStateToProps,
  { delProduct }
)(DeleteProduct);
