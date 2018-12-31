import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
  Label,
  FormGroup,
  Table
} from "reactstrap";
import PropTypes from "prop-types";
import {
  getAllTSouvenirItemDetil,
  getAllTSouvenirItem,
  adminRequestApprove
} from "../../../actions/tsouveniritemAction";
import { connect } from "react-redux";
import AdminRejectRequest from "./AdminRequestReject";
import moment from "moment";

class AdminApprove extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      result: [],
      item: [],
      currentTsouveniritem: {},
      status: "",
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
      status: newProps.tsouveniritemReducer.statusRA,
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

  approveHandler = () => {
    const formdata = {
      code: this.props.tsouveniritem.code,
      approved_by: this.state.userdata.m_employee_id,
      approved_date: moment().format("YYYY-MM-DD"),
      status: 2
    };
    this.props.adminRequestApprove(formdata);
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

  render() {
    if (this.state.status === 200) {
      this.props.modalStatus(1, "Approved", this.props.tsouveniritem.code);
    } else if (this.state.status === 400) {
      this.props.modalStatus(
        2,
        "Data Rejected! Transaction souvenir request with code " +
          this.props.tsouveniritem.code +
          " is rejected by Administrator!"
      );
    } else {
      console.log("");
    }

    return (
      <Modal isOpen={this.props.approve} className={this.props.className}>
        <ModalHeader>
          {" "}
          Approve Souvenir Request - {this.props.tsouveniritem.code}
        </ModalHeader>
        <ModalBody>
          <AdminRejectRequest
            reject={this.state.rejectRequest}
            closeModalHandler={this.closeModalHandler}
            tsouveniritem={this.state.currentTsouveniritem}
            modalStatus={this.modalStatus}
          />
          <div>
            <FormGroup>
              <Label for="">Transaction Code</Label>
              <Input
                type="text"
                name="code"
                placeholder=""
                value={this.props.tsouveniritem.code}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="">T Event Code</Label>
              <Input
                type="text"
                name="received_by"
                placeholder=""
                value={this.props.tsouveniritem.t_event_id}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="">Request By</Label>
              <Input
                type="text"
                name="received_date"
                placeholder=""
                value={this.props.tsouveniritem.request_by}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="">Request Date</Label>
              <Input
                type="text"
                name="note"
                placeholder=""
                value={this.props.tsouveniritem.request_date}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="">Due Date</Label>
              <Input
                type="text"
                name="note"
                placeholder=""
                value={this.props.tsouveniritem.request_due_date}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="">Note</Label>
              <Input
                type="text"
                name="note"
                placeholder=""
                value={this.props.tsouveniritem.note}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="">Status</Label>
              <Input
                type="text"
                name="note"
                placeholder=""
                value={this.designStatus(this.props.tsouveniritem.status)}
                readOnly
              />
            </FormGroup>
          </div>
          <div>
            <h5>Souvenir Item </h5>
          </div>
          <Table>
            <thead>
              <tr>
                <th>M Souvenir ID</th>
                <th>Qty</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {this.func(this.state.item).length === 0 ? (
                <div>Item Null</div>
              ) : (
                this.func(this.state.item).map(ele => (
                  <tr>
                    <td>
                      <Input
                        type="text"
                        name="note"
                        placeholder={ele.m_souvenir_id}
                        value={ele.m_souvenir_id}
                        readOnly
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        name="note"
                        placeholder={ele.qty}
                        value={ele.qty}
                        readOnly
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        name="note"
                        placeholder={ele.note}
                        value={ele.note}
                        readOnly
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.approveHandler}>
            Approve
          </Button>
          {/* {this.state.result.map((ele) => ( */}
          <Button
            color="danger"
            onClick={() => {
              this.rejectModalHandler(this.props.tsouveniritem._id);
            }}
          >
            Reject
          </Button>
          {/* )}} */}
          <Button color="warning" onClick={this.props.closeModalHandler}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

AdminApprove.propTypes = {
  classes: PropTypes.object.isRequired,
  getAllTSouvenirItemDetil: PropTypes.func.isRequired,
  getAllTSouvenirItem: PropTypes.func.isRequired,
  adminRequestApprove: PropTypes.func.isRequired
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
    adminRequestApprove
  }
)(AdminApprove);
