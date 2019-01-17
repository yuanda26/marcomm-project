import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import PropTypes from "prop-types";
import { getAllTSouvenirItemDetil } from "../../../actions/tsouveniritemAction";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import moment from "moment";

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

  changeDate = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
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
            {/* <FormGroup>
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
            </FormGroup> */}
          </div>
          <br />
          <div>
            <h4>Souvenir Item </h4>
          </div>
          {this.props.tsouveniritem.status < 4 && (
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
          {this.props.tsouveniritem.status >= 4 && (
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
