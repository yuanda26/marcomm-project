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
import { getAllTSouvenirItemDetil } from "../../../actions/tsouveniritemAction";
import { connect } from "react-redux";

class ViewTsouveniritem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: []
    };
  }

  componentDidMount() {
    this.props.getAllTSouvenirItemDetil();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      item: newProps.tsouveniritemviewReducer.tsv
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
        return "Closed Request";
      default:
        return "Submitted";
    }
  };

  render() {
    return (
      <Modal isOpen={this.props.view} className={this.props.className}>
        <ModalHeader>
          {" "}
          View Transaction Souvenir Request - {this.props.tsouveniritem.code}
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
              {this.func(this.state.item).map(ele => (
                <tr>
                  <td>
                    <Input
                      type="text"
                      name="note"
                      placeholder={ele.souv_name}
                      value={ele.souv_name}
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
          <Button color="danger" onClick={this.props.closeModalHandler}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

ViewTsouveniritem.propTypes = {
  classes: PropTypes.object.isRequired,
  getAllTSouvenirItemDetil: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tsouveniritemviewReducer: state.tsouveniritemIndexReducer
});

export default connect(
  mapStateToProps,
  { getAllTSouvenirItemDetil }
)(ViewTsouveniritem);
