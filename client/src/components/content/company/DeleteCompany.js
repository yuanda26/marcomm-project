import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { deleteCompany } from "../../../actions/companyAction";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

class DeleteCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      userdata: {}
    };
    this.deleteHandler = this.deleteHandler.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      status: newProps.companyReducer.statusDEL,
      userdata: newProps.auth.user
    });
  }

  deleteHandler() {
    const formdata = {
      name: this.props.company_del.name,
      code: this.props.company_del.code,
      updated_by: this.state.userdata.m_employee_id,
      updated_date: moment().format("YYYY-MM-DD"),
      is_delete: true
    };
    this.props.deleteCompany(formdata, this.props.modalStatus);
    this.props.closeModalHandler();
  }

  render() {
    return (
      <Modal isOpen={this.props.delete} className={this.props.className}>
        <ModalHeader> Delete Company </ModalHeader>
        <ModalBody>
          <p>
            {" "}
            Delete Data Company with Name{" "}
            <strong> {this.props.company_del.name}</strong> ?
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

DeleteCompany.propTypes = {
  deleteCompany: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  companyReducer: state.companyIndexReducer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteCompany }
)(DeleteCompany);
