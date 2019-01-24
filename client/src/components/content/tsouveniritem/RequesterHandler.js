import React from "react";
import Grid from "@material-ui/core/Grid";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button
  // Label,
  // FormGroup
} from "reactstrap";
import PropTypes from "prop-types";
import {
  putReceivedSouvenir,
  putCloseOrder,
  getAllTSouvenirItemDetil,
  getAllTSouvenirItem
} from "../../../actions/tsouveniritemAction";
import { connect } from "react-redux";
import moment from "moment";
import host from "../../../config/Host_Config";
import axios from "axios";
import SpinnerTable from "../../common/SpinnerTable";
import TextField from "../../common/TextField";

class RequesterHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      item: [null],
      currentTsouveniritem: {},
      qtyActual: null,
      NewItem: [],
      NewItem2: {},
      userdata: {},
      statusRS: "",
      statusSS: "",
      statusCO: ""
    };
  }

  componentDidMount() {
    this.props.getAllTSouvenirItemDetil();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      item: newProps.tsouveniritemview.tsv,
      result: newProps.tsouveniritemReducer.ts,
      userdata: newProps.auth.user,
      statusRS: newProps.tsouveniritemReducer.statusTR,
      statusCO: newProps.tsouveniritemReducer.statusCO
      //statusSS: newProps.tsouveniritemReducer.statusSS
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
    this.props.putReceivedSouvenir(formdata, this.props.modalStatus);
    this.props.closeModalHandler();
  };

  //Settlement Souvenir
  // semua isian form qty action ditangani oleh fungsi ini
  changeByIndex = index => event => {
    const newQty = this.state.item.map((ele, tatang) => {
      if (index !== tatang) return ele;
      return { ...ele, [event.target.name]: event.target.value };
    });
    let { NewItem2 } = this.state;
    NewItem2[event.target.name] = event.target.value;

    this.setState({
      NewItem: newQty,
      //menampung isian form di item baru lagi
      NewItem2: NewItem2
    });
  };

  settlementHandler = () => {
    let func1 = this.func(this.state.item);
    const satu = [];
    const dua = [];
    let formdata = { kode: satu, nilai: dua };
    func1.forEach((row, index) => {
      satu.push(row.m_souvenir_id2);
      dua.push(row.qty - this.state.NewItem2[index]);
    });
    const file = {
      status: 4
    };
    let option = {
      url: `${host}/tsouveniritemsettlement/${this.props.tsouveniritem.code}`,
      method: "put",
      headers: {
        Authorization: localStorage.token,
        "Content-Type": "application/json"
      },
      data: {
        sett: formdata,
        stat: file,
        code: this.props.tsouveniritem.code
      }
    };
    axios(option)
      .then(response => {
        if (response.data.code === 200) {
          this.props.modalStatus(
            1,
            `Settlement Souvenir Request with code ${
              this.props.tsouveniritem.code
            } has been submitted!`,
            this.props.tsouveniritem.code
          );
          this.props.history.push("/dashboard");
        } else {
          alert(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
    this.props.closeModalHandler();
  };
  //End of Settlement Souvenir

  closeOrderHandler = () => {
    const formdata = {
      code: this.props.tsouveniritem.code,
      status: 6
    };
    this.props.putCloseOrder(formdata, this.props.modalStatus);
    this.props.closeModalHandler();
  };

  changeDateFormat = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
  };

  render() {
    return (
      <Modal
        isOpen={this.props.requesterHandler}
        className={this.props.className}
      >
        {this.props.tsouveniritem.status === 2 && (
          <ModalHeader>
            {" "}
            Received Souvenir Request - {this.props.tsouveniritem.code}
          </ModalHeader>
        )}
        {this.props.tsouveniritem.status === 3 && (
          <ModalHeader>
            {" "}
            Settlement Souvenir Request - {this.props.tsouveniritem.code}
          </ModalHeader>
        )}
        {this.props.tsouveniritem.status === 5 && (
          <ModalHeader>
            {" "}
            Close Order Souvenir Request - {this.props.tsouveniritem.code}
          </ModalHeader>
        )}
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
                {this.changeDateFormat(this.props.tsouveniritem.request_date)}
                <br />
                {this.changeDateFormat(
                  this.props.tsouveniritem.request_due_date
                )}
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
            </FormGroup> */}
          </div>
          <br />
          <div>
            <h4>Souvenir Item </h4>
          </div>
          {this.props.tsouveniritem.status === 2 && (
            <div className="table-responsive">
              <table className="table table-stripped">
                <thead>
                  <tr nowrap="true">
                    <th>M Souvenir ID</th>
                    <th>Qty</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.item[0] === null ? (
                    <SpinnerTable />
                  ) : this.func(this.state.item).length === 0 ? (
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
          {this.props.tsouveniritem.status === 3 && (
            <div className="table-responsive">
              <table className="table table-stripped">
                <thead>
                  <tr>
                    <th nowrap="true">M Souvenir ID</th>
                    <th>Qty</th>
                    <th>Qty Actual</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.item[0] === null ? (
                    <SpinnerTable />
                  ) : this.func(this.state.item).length === 0 ? (
                    <div>Item Not Found</div>
                  ) : (
                    this.func(this.state.item).map((ele, index) => (
                      <tr>
                        <td>{ele.m_souvenir_id}</td>
                        <td>{ele.qty}</td>
                        <td>
                          <TextField
                            type="number"
                            name={index}
                            placeholder="Qty Actual"
                            value={this.state.qtyActual}
                            onChange={this.changeByIndex(ele)}
                          />
                        </td>
                        <td>{ele.note}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {this.props.tsouveniritem.status === 5 && (
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
                  {this.state.item[0] === null ? (
                    <SpinnerTable />
                  ) : this.func(this.state.item).length === 0 ? (
                    <div>Item Not Found</div>
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
          {this.props.tsouveniritem.status === 2 && (
            <Button color="primary" onClick={this.receivedHandler}>
              Received
            </Button>
          )}
          {this.props.tsouveniritem.status === 3 && (
            <Button color="primary" onClick={this.settlementHandler}>
              Settlement
            </Button>
          )}
          {this.props.tsouveniritem.status === 5 && (
            <Button color="primary" onClick={this.closeOrderHandler}>
              Close Order
            </Button>
          )}
          <Button color="warning" onClick={this.props.closeModalHandler}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

RequesterHandler.propTypes = {
  classes: PropTypes.object.isRequired,
  getAllTSouvenirItemDetil: PropTypes.func.isRequired,
  getAllTSouvenirItem: PropTypes.func.isRequired,
  putReceivedSouvenir: PropTypes.func.isRequired,
  putCloseOrder: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tsouveniritemview: state.tsouveniritemIndexReducer,
  tsouveniritemReducer: state.tsouveniritemIndexReducer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    getAllTSouvenirItemDetil,
    getAllTSouvenirItem,
    putReceivedSouvenir,
    putCloseOrder
  }
)(RequesterHandler);
