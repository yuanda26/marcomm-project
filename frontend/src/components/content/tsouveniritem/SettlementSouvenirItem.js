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
  getAllTSouvenirItem
} from "../../../actions/tsouveniritemAction";
import { connect } from "react-redux";
import ApiConfig from "../../../config/Host_Config";
import axios from "axios";
import moment from "moment";

class SettlementSouvenir extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      item: [],
      currentTsouveniritem: {},
      qtyActual: null,
      NewItem: [],
      NewItem2: {},
      status: []
    };
  }

  componentDidMount() {
    this.props.getAllTSouvenirItemDetil();
    this.props.getAllTSouvenirItem();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      item: newProps.tsouveniritemdetil.tsv,
      result: newProps.tsouveniritemReducer.ts
    });
  }

  // fungsi untuk memfilter form menjadi dinamis
  func(input) {
    return input.filter(a => a.t_souvenir_id === this.props.tsouveniritem.code);
  }

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

  // submit
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
  // }
  closeModalHandler = () => {
    this.setState({
      rejectRequest: false
    });
  };

  changeDateFormat = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
  };

  render() {
    return (
      <Modal isOpen={this.props.approve} className={this.props.className}>
        <ModalHeader>
          {" "}
          Settlement Souvenir Request - {this.props.tsouveniritem.code}
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
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.settlementHandler}>
            Settlement
          </Button>
          <Button color="warning" onClick={this.props.closeModalHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

SettlementSouvenir.propTypes = {
  classes: PropTypes.object.isRequired,
  getAllTSouvenirItemDetil: PropTypes.func.isRequired,
  getAllTsouveniritem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tsouveniritemdetil: state.tsouveniritemIndexReducer,
  tsouveniritemReducer: state.tsouveniritemIndexReducer
});

export default connect(
  mapStateToProps,
  { getAllTSouvenirItemDetil, getAllTSouvenirItem }
)(SettlementSouvenir);
