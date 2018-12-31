import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import host from "../../../config/Host_Dev.json";
import { deleteCompany } from "../../../actions/companyAction";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

class DeleteCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ""
    };
    this.deleteHandler = this.deleteHandler.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      status: newProps.companyReducer.statusDEL
    });
  }

  deleteHandler() {
    let userdata = JSON.parse(localStorage.getItem(host.LS.USERDATA));
    const formdata = {
      code: this.props.company_del.code,
      updated_by: userdata.m_employee_id,
      updated_date: moment().format("YYYY-MM-DD"),
      is_delete: true
    };
    this.props.deleteCompany(formdata);
    this.props.closeModalHandler();
  }

  render() {
    this.state.status === 200 &&
      this.props.modalStatus(1, "Deleted", this.props.company_del.name);
    this.state.status === 400 &&
      this.props.modalStatus(
        2,
        "Invalid! Data company with name " +
          this.props.company_del.name +
          " is used in master employee!"
      );
    return (
      <Modal isOpen={this.props.delete} className={this.props.className}>
        <ModalHeader> Delete Company </ModalHeader>
        <ModalBody>
          <p>
            {" "}
            Delete Data <strong>
              Company {this.props.company_del.name}
            </strong>{" "}
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
  companyReducer: state.companyIndexReducer
});

export default connect(
  mapStateToProps,
  { deleteCompany }
)(DeleteCompany);
