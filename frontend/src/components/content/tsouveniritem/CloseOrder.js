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
  putCloseOrder
} from "../../../actions/tsouveniritemAction";
import { connect } from "react-redux";
import moment from "moment";

class CloseOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      item: [],
      currentTsouveniritem: {}
    };
  }

  componentDidMount() {
    this.props.getAllTSouvenirItemDetil();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      item: newProps.tsouveniritemview.tsv,
      result: newProps.tsouveniritemReducer.ts,
      status: newProps.tsouveniritemReducer.statusCO
    });
  }

  closeOrderHandler = () => {
    const formdata = {
      code: this.props.tsouveniritem.code,
      status: 6
    };
    this.props.putCloseOrder(formdata);
    this.props.closeModalHandler();
  };

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

  changeDateFormat = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
  };

  render() {
    this.state.status === 200 &&
      this.props.modalStatus(1, "Closed", this.props.tsouveniritem.code);
    return (
      <Modal isOpen={this.props.approve} className={this.props.className}>
        <ModalHeader>
          {" "}
          Close Order Souvenir Request - {this.props.tsouveniritem.code}
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
                <th>Qty Actual</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {this.func(this.state.item).map(ele => (
                <tr>
                  <td>
                    <Input
                      type="text"
                      name="name"
                      placeholder={ele.m_souvenir_id}
                      value={ele.m_souvenir_id}
                      readOnly
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="qty"
                      placeholder={ele.qty}
                      value={ele.qty}
                      readOnly
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="qty actual"
                      placeholder={ele.qty_actual}
                      value={ele.qty_actual}
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
          <Button color="primary" onClick={this.closeOrderHandler}>
            Close Request
          </Button>
          <Button color="warning" onClick={this.props.closeModalHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

CloseOrder.propTypes = {
  classes: PropTypes.object.isRequired,
  getAllTSouvenirItemDetil: PropTypes.func.isRequired,
  getAllTSouvenirItem: PropTypes.func.isRequired,
  putCloseOrder: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tsouveniritemview: state.tsouveniritemIndexReducer,
  tsouveniritemReducer: state.tsouveniritemIndexReducer
});

export default connect(
  mapStateToProps,
  { getAllTSouvenirItemDetil, getAllTSouvenirItem, putCloseOrder }
)(CloseOrder);
