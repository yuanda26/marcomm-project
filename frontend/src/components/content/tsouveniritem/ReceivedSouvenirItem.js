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
  putReceivedSouvenir,
  getAllTSouvenirItemDetil,
  getAllTSouvenirItem
} from "../../../actions/tsouveniritemAction";
import { connect } from "react-redux";
import moment from "moment";

class ReceivedSouvenir extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      item: [],
      currentTsouveniritem: {},
      userdata: {},
      status: ""
    };
  }

  componentDidMount() {
    this.props.getAllTSouvenirItemDetil();
    this.props.getAllTSouvenirItem();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      item: newProps.tsouveniritemview.tsv,
      result: newProps.tsouveniritemReducer.ts,
      userdata: newProps.auth.user,
      status: newProps.tsouveniritemReducer.statusTR
    });
  }

  func(input) {
    return input.filter(a => a.t_souvenir_id === this.props.tsouveniritem.code);
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

  receivedHandler = () => {
    const formdata = {
      code: this.props.tsouveniritem.code,
      received_by: this.state.userdata.m_employee_id,
      received_date: moment().format("YYYY-MM-DD"),
      status: 3
    };
    this.props.putReceivedSouvenir(formdata);
    this.props.closeModalHandler();
  };

  changeDateFormat = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
  };

  render() {
    this.state.status === 200 &&
      this.props.modalStatus(1, "received", this.props.tsouveniritem.code);
    return (
      <Modal isOpen={this.props.approve} className={this.props.className}>
        <ModalHeader>
          {" "}
          Received Souvenir Request - {this.props.tsouveniritem.code}
        </ModalHeader>
        <ModalBody>
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
                value={this.changeDateFormat(
                  this.props.tsouveniritem.request_date
                )}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="">Due Date</Label>
              <Input
                type="text"
                name="note"
                placeholder=""
                value={this.changeDateFormat(
                  this.props.tsouveniritem.request_due_date
                )}
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
              {this.func(this.state.item).map(ele => (
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
              ))}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.receivedHandler}>
            Received
          </Button>
          <Button color="warning" onClick={this.props.closeModalHandler}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

ReceivedSouvenir.propTypes = {
  classes: PropTypes.object.isRequired,
  getAllTSouvenirItemDetil: PropTypes.func.isRequired,
  putReceivedSouvenir: PropTypes.func.isRequired,
  getAllTSouvenirItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tsouveniritemview: state.tsouveniritemIndexReducer,
  tsouveniritemReducer: state.tsouveniritemIndexReducer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getAllTSouvenirItemDetil, getAllTSouvenirItem, putReceivedSouvenir }
)(ReceivedSouvenir);
