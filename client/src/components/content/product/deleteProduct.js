import React from "react"
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap"

import { delProduct } from "../../../actions/productAction";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class DeleteProduct extends React.Component {
  constructor(props) {
    super(props);
    this.deleteHandler = this.deleteHandler.bind(this);
  }

  deleteHandler() {
    this.props.delProduct(this.props.product_del.code);
    this.props.closeModalHandler();
  }

  componentWillReceiveProps(newProps){
    if (newProps.statusDeleted) {
      if(newProps.statusDeleted === 200){
        newProps.modalStatus(1, "Deleted")
      }
    }
  }

  render() {
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
};

const mapStateToProps = state => ({
  product: state.product,
  statusDeleted: state.product.statusDeleted
});

export default connect(
  mapStateToProps,
  { delProduct }
)( DeleteProduct );
