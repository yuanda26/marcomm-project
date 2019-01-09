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
  putCloseOrder,
  getAllTSouvenirItemDetil,
  getAllTSouvenirItem
} from "../../../actions/tsouveniritemAction";
import { connect } from "react-redux";
import moment from "moment";
import ApiConfig from "../../../config/Host_Config";
import axios from "axios";

class RequesterHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      item: [],
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
    this.props.getAllTSouvenirItem();
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
    this.props.putReceivedSouvenir(formdata);
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
      url: `${ApiConfig.host}/tsouveniritemsettlement/${
        this.props.tsouveniritem.code
      }`,
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
            "settlement submitted!",
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
    this.props.putCloseOrder(formdata);
    this.props.closeModalHandler();
  };

  changeDateFormat = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
  };

  render() {
    this.state.statusRS === 200 &&
      this.props.modalStatus(1, "received", this.props.tsouveniritem.code);
    this.state.statusSS === 200 &&
      this.props.modalStatus(
        1,
        "settlement submitted",
        this.props.tsouveniritem.code
      );
    this.state.statusCO === 200 &&
      this.props.modalStatus(
        1,
        "request closed",
        this.props.tsouveniritem.code
      );
    return (
      <Modal
        isOpen={this.props.RequesterHandler}
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
          {this.props.tsouveniritem.status === 2 && (
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
          )}
          {this.props.tsouveniritem.status === 3 && (
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
                {this.func(this.state.item).length === 0 ? (
                  <div>Item Null</div>
                ) : (
                  this.func(this.state.item).map((ele, index) => (
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
                          name="qty"
                          placeholder={ele.qty}
                          id=""
                          value={ele.qty}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          name={index}
                          placeholder=""
                          value={this.state.qtyActual}
                          onChange={this.changeByIndex(ele)}
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
          )}
          {this.props.tsouveniritem.status === 5 && (
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
