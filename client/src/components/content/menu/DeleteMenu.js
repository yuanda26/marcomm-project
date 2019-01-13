import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { delMenu } from "../../../actions/menuActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class DeleteMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ""
    };
  }

  deleteHandler = () => {
    this.props.delMenu(this.props.menu, this.props.modalStatus);
    this.props.closeModalHandler();
  };

  componentWillReceiveProps(newStatus) {
    this.setState({
      status: newStatus.take.statusDEL
    });
  }

  render() {
    return (
      <Modal isOpen={this.props.delete} className={this.props.className}>
        <ModalHeader> Delete Menu </ModalHeader>
        <ModalBody>
          <p>
            Are you sure want delete <strong>{this.props.menu.name}</strong>{" "}
            Menu ?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.deleteHandler}>
            Delete
          </Button>
          <Button color="danger" onClick={this.props.closeModalHandler}>
            No
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

DeleteMenu.propTypes = {
  delMenu: PropTypes.func.isRequired,
  take: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  take: state.menu
});

export default connect(
  mapStateToProps,
  { delMenu }
)(DeleteMenu);
