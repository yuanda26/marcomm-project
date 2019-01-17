import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import {
  getAllTSouvenirItemDetil,
  getAllTSouvenirItem,
  adminRequestApprove,
  adminApproveSettlement
} from "../../../actions/tsouveniritemAction";
import { connect } from "react-redux";
import AdminRejectRequest from "./AdminReject";
import moment from "moment";
// import TextFieldGroup from "../../common/TextFieldGroup";
// import TextAreaGroup from "../../common/TextAreaGroup";

class AdminHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      result: [],
      item: [],
      currentTsouveniritem: {},
      statusRA: "",
      statusSA: "",
      userdata: {}
    };
  }

  componentDidMount() {
    this.props.getAllTSouvenirItemDetil();
    //this.props.getAllTSouvenirItem()
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      item: newProps.tsouveniritemdetilReducer.tsv,
      result: newProps.tsouveniritemReducer.ts,
      statusRA: newProps.tsouveniritemReducer.statusRA,
      statusSA: newProps.tsouveniritemReducer.statusSA,
      userdata: newProps.auth.user
    });
  }

  func(input) {
    if (this.props.tsouveniritem.code === undefined) {
      return [];
    } else {
      return input.filter(
        a => a.t_souvenir_id === this.props.tsouveniritem.code
      );
    }
  }

  designStatus = status => {
    switch (status) {
      case 0:
        return "Rejected";
      case 2:
        return "In Progress";
      case 3:
        return "Recieved by Requester";
      case 4:
        return "Settlement";
      case 5:
        return "Approved Settlement";
      case 6:
        return "Close Request";
      default:
        return "Submitted";
    }
  };

  approveRequestHandler = () => {
    const formdata = {
      code: this.props.tsouveniritem.code,
      approved_by: this.state.userdata.m_employee_id,
      approved_date: moment().format("YYYY-MM-DD"),
      status: 2
    };
    this.props.adminRequestApprove(formdata, this.props.modalStatus);
    this.props.closeModalHandler();
  };

  approveSettlementHandler = () => {
    const formdata = {
      code: this.props.tsouveniritem.code,
      settlement_approved_by: this.state.userdata.m_employee_id,
      settlement_approved_date: moment().format("YYYY-MM-DD"),
      status: 5
    };
    this.props.adminApproveSettlement(formdata, this.props.modalStatus);
    this.props.closeModalHandler();
  };

  rejectModalHandler = tsouveniritemid => {
    let tmp = {};
    this.state.result.forEach(ele => {
      if (tsouveniritemid === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentTsouveniritem: tmp,
      rejectRequest: true
    });
  };

  closeModalHandler = () => {
    this.setState({
      rejectRequest: false
    });
  };

  modalStatus = (status, message, code) => {
    this.props.modalStatus(status, message, code);
  };

  changeDate = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
  };

  render() {
    return (
      <Modal isOpen={this.props.adminHandler} className={this.props.className}>
        {this.props.tsouveniritem.status === 1 && (
          <ModalHeader>
            {" "}
            Approve Souvenir Request - {this.props.tsouveniritem.code}
          </ModalHeader>
        )}
        {this.props.tsouveniritem.status === 4 && (
          <ModalHeader>
            {" "}
            Approve Settlement Request - {this.props.tsouveniritem.code}
          </ModalHeader>
        )}
        <ModalBody>
          <AdminRejectRequest
            reject={this.state.rejectRequest}
            closeModalHandler={this.closeModalHandler}
            tsouveniritem={this.state.currentTsouveniritem}
            modalStatus={this.modalStatus}
          />
          <div>
            <Grid container spacing={24}>
              <Grid item xs={6}>
                Transaction Code
                <br />
                Event Code
                <br />
                Request By
                <br />
                Request Date
                <br />
                Request Due Date
                <br />
                Status
                <br />
                Note
              </Grid>
              <Grid item xs={6}>
                {this.props.tsouveniritem.code}
                <br />
                {this.props.tsouveniritem.t_event_id}
                <br />
                {this.props.tsouveniritem.request_by}
                <br />
                {this.changeDate(this.props.tsouveniritem.request_date)}
                <br />
                {this.changeDate(this.props.tsouveniritem.request_due_date)}
                <br />
                {this.designStatus(this.props.tsouveniritem.status)}
                <br />
                {this.props.tsouveniritem.note}
              </Grid>
            </Grid>
            {/* <TextFieldGroup
              label="Transaction Code"
              type="text"
              name="Transaction Code"
              placeholder=""
              value={this.props.tsouveniritem.code}
              disabled={true}
            />
            <TextFieldGroup
              label="Event Code"
              type="text"
              name="t_event_id"
              placeholder="Event Code"
              value={this.props.tsouveniritem.t_event_id}
              disabled={true}
            />
            <TextFieldGroup
              label="Received By"
              type="text"
              name="received_date"
              placeholder=""
              value={this.props.tsouveniritem.request_by}
              disabled={true}
            />
            <TextFieldGroup
              label="Request Date"
              type="text"
              name="request_date"
              placeholder=""
              value={this.changeDate(this.props.tsouveniritem.request_date)}
              disabled={true}
            />
            <TextFieldGroup
              label="Request Due Date"
              type="text"
              name="request_due_date"
              placeholder=""
              value={this.changeDate(this.props.tsouveniritem.request_due_date)}
              disabled={true}
            />
            <TextAreaGroup
              label="Note"
              type="text"
              name="note"
              placeholder=""
              value={this.props.tsouveniritem.note}
              disabled={true}
            />
            <TextFieldGroup
              label="Status"
              type="text"
              name="status"
              placeholder=""
              value={this.designStatus(this.props.tsouveniritem.status)}
              disabled={true}
            /> */}
          </div>
          <br />
          <div>
            <h4>Souvenir Item </h4>
          </div>
          {this.props.tsouveniritem.status === 1 && (
            <div className="table-responsive">
              <table className="table table-stripped">
                <thead>
                  <tr>
                    <th>M Souvenir ID</th>
                    <th>Qty</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {this.func(this.state.item).length === 0 ? (
                    <div>Item Not Found</div>
                  ) : (
                    this.func(this.state.item).map(ele => (
                      <tr>
                        <td>{ele.m_souvenir_id}</td>
                        <td>{ele.qty}</td>
                        <td>{ele.note}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {this.props.tsouveniritem.status === 4 && (
            <div className="table-responsive">
              <table className="table table-stripped">
                <thead>
                  <tr>
                    <th>M Souvenir ID</th>
                    <th>Qty</th>
                    <th>Qty Actual</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {this.func(this.state.item).length === 0 ? (
                    <div>No Item Found</div>
                  ) : (
                    this.func(this.state.item).map(ele => (
                      <tr>
                        <td>{ele.m_souvenir_id}</td>
                        <td>{ele.qty}</td>
                        <td>{ele.qty_actual}</td>
                        <td>{ele.note}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {this.props.tsouveniritem.status === 1 && (
            <Button color="primary" onClick={this.approveRequestHandler}>
              Approve
            </Button>
          )}
          {this.props.tsouveniritem.status === 4 && (
            <Button color="primary" onClick={this.approveSettlementHandler}>
              Approve
            </Button>
          )}
          <Button
            color="danger"
            onClick={() => {
              this.rejectModalHandler(this.props.tsouveniritem._id);
            }}
          >
            Reject
          </Button>
          <Button color="warning" onClick={this.props.closeModalHandler}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

AdminHandler.propTypes = {
  classes: PropTypes.object.isRequired,
  getAllTSouvenirItemDetil: PropTypes.func.isRequired,
  getAllTSouvenirItem: PropTypes.func.isRequired,
  adminRequestApprove: PropTypes.func.isRequired,
  adminApproveSettlement: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tsouveniritemdetilReducer: state.tsouveniritemIndexReducer,
  tsouveniritemReducer: state.tsouveniritemIndexReducer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    getAllTSouvenirItemDetil,
    getAllTSouvenirItem,
    adminRequestApprove,
    adminApproveSettlement
  }
)(AdminHandler);
