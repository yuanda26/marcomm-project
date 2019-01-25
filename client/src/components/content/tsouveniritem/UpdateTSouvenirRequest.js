import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Alert
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Create, Delete } from "@material-ui/icons";
import { getAllSouvenir } from "../../../actions/souvenirAction";
import { getAllTSouvenirItemDetil } from "../../../actions/tsouveniritemAction";
import {
  updateTSouvenirItem,
  getEvent
} from "../../../actions/tsouveniritemAction";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextField from "../../common/TextField";
import TextAreaGroup from "../../common/TextAreaGroup";
import SelectList from "../../common/SelectList";
import Spinner from "../../common/Spinner";
//import SpinnerTable from "../../common/SpinnerTable";
import isEmpty from "../../../validation/isEmpty";
import moment from "moment";

class EditTsouveniritem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formdata: {
        code: "",
        t_event_id: "",
        request_by: "",
        request_date: "",
        request_due_date: "",
        note: "",
        status: "",
        created_by: "",
        created_date: "",
        updated_by: "",
        updated_date: moment().format("YYYY-MM-DD")
      },
      alertData: {
        status: false,
        message: ""
      },
      status: "",
      newItem: [], //additem
      dataItem: [null], //olditem
      userdata: {},
      souvenirOptions: []
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentDidMount() {
    this.props.getAllSouvenir();
    this.props.getEvent();
    this.props.getAllTSouvenirItemDetil();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.getAllItem) {
      this.setState({
        formdata: newProps.tsouveniritemtest,
        eventcode: newProps.teventReducer.myEvent,
        dataItem: newProps.getAllItem.map(element => {
          return {
            ...element,
            readOnly: true,
            disable: true,
            errorSouvenir: "",
            errorQty: ""
          };
        }),
        souvenirOptions: [{ label: "*Select Souvenir", value: "" }].concat(
          newProps.souvenirReducer.souvenirs.map(row => ({
            label: row.name,
            value: row.code
          }))
        ),
        status: newProps.tsouveniritemReducer.statusPUT,
        userdata: newProps.auth.user
      });
    }
  }

  validateDuplicateItem = input => {
    let duplicate = { status: false, index: null };
    input.forEach((content, i) => {
      input.forEach((element, index) => {
        if (element.m_souvenir_id === content.m_souvenir_id && i !== index)
          duplicate = {
            status: true,
            index: [index, i - this.state.dataItem.length]
          };
      });
    });
    return duplicate;
  };

  submitHandler() {
    if (isEmpty(this.state.formdata.request_due_date)) {
      this.setState({ errorRequestDueDate: "This Field is Required" });
    }

    // Souvenir Item Form Validation
    // Set Error Counter
    let errorCounter = 0;
    this.state.newItem.forEach((item, idx) => {
      const newItems = this.state.newItem;
      const oldItems = this.state.dataItem;
      // Check for Empty Souvenir Name
      if (isEmpty(item.m_souvenir_id)) {
        errorCounter += 1;
        newItems[idx].errorSouvenir = "This Field is Required!";
        this.setState({ newItems });
      }
      // Check for Empty Qty
      if (isEmpty(item.qty)) {
        errorCounter += 1;
        newItems[idx].errorQty = "This Field is Required!";
        this.setState({ newItems });
      }
      // Check Duplicate Item
      let cekItems = this.state.dataItem.concat(this.state.newItem);
      if (this.validateDuplicateItem(cekItems).status === true) {
        let a = this.validateDuplicateItem(cekItems).index[0];
        let b = this.validateDuplicateItem(cekItems).index[1];
        errorCounter += 1;
        oldItems[a].errorSouvenir = "Can't Add Same Item Twice!";
        newItems[b].errorSouvenir = "Can't Add Same Item Twice!";
        this.setState({ oldItems, newItems });
      }
    });

    // Validate min one item to added
    if (this.state.dataItem.length === 0 && this.state.newItem.length === 0) {
      this.setState({
        alertData: {
          status: true,
          message: "Add minimal one item!"
        }
      });
      errorCounter += 1;
    }

    if (
      !isEmpty(this.state.formdata.request_due_date) &&
      !moment(this.state.formdata.request_due_date) <
        moment().subtract(1, "day") &&
      //this.state.shareholders.length > 0 &&
      //duplicateItem === false &&
      errorCounter === 0
    ) {
      let newItem = this.state.newItem.map(content => {
        return {
          m_souvenir_id: content.m_souvenir_id,
          qty: parseInt(content.qty),
          note: content.note,
          created_by: content.created_by,
          created_date: content.created_date,
          t_souvenir_id: content.t_souvenir_id,
          updated_by: content.updated_by,
          updated_date: content.updated_date,
          is_delete: false
        };
      });
      let oldItem = this.state.dataItem.map(content => {
        return {
          _id: content._id,
          m_souvenir_id: content.m_souvenir_id,
          qty: parseInt(content.qty),
          note: content.note,
          t_souvenir_id: content.t_souvenir_id,
          created_by: content.created_by,
          created_date: content.created_date,
          updated_by: content.updated_by,
          updated_date: content.updated_date,
          is_delete: false
        };
      });
      //alert(JSON.stringify(newItem));
      let data = {
        souv: this.state.formdata,
        oldFile: oldItem,
        newFile: newItem
      };
      this.props.updateTSouvenirItem(data, this.props.modalStatus);
      this.props.closeModalHandler();
      setTimeout(() => {
        this.setState({
          newItem: []
        });
      }, 2000);
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

  func(input) {
    return input
      .forEach(a => {
        if (a.t_souvenir_id === this.props.tsouveniritem.code) {
          return a;
        }
      })
      .filter(b => b !== undefined);
  }

  changeHandler(e) {
    if (e.target.name === "request_due_date") {
      this.setState({ errorRequestDueDate: "" });
    }
    if (
      e.target.name === "request_due_date" &&
      moment(e.target.value) < moment(this.state.formdata.request_due_date)
    ) {
      this.setState({
        errorRequestDueDate: "Due Date Must Same Day or After Request Date"
      });
    }

    let tmp = this.state.formdata;
    tmp[e.target.name] = e.target.value;
    this.setState({
      formdata: tmp
    });
  }

  handleAddNewItem = () => {
    this.setState({
      newItem: this.state.newItem.concat([
        {
          m_souvenir_id: "",
          qty: "",
          note: "",
          created_by: this.state.userdata.m_employee_id,
          created_date: moment().format("YYYY-MM-DD"),
          t_souvenir_id: this.props.getAllItem[0].t_souvenir_id,
          updated_by: this.state.userdata.m_employee_id,
          updated_date: moment().format("YYYY-MM-DD"),
          is_delete: false,
          disable: true,
          readOnly: true,
          errorSouvenir: "",
          errorQty: ""
        }
      ])
    });
  };

  handleAddedItemChange = idx => evt => {
    const newAddedItem = this.state.newItem.map((newItem, sidx) => {
      if (idx !== sidx) return newItem;
      return { ...newItem, [evt.target.name]: evt.target.value };
    });

    this.setState({ newItem: newAddedItem });
  };

  handleEditNewItem = idx => {
    const newAddedItem = this.state.newItem.map((newItem, sidx) => {
      if (idx !== sidx) return newItem;
      return {
        ...newItem,
        readOnly: !newItem.readOnly,
        disable: !newItem.disable
      };
    });
    this.setState({ newItem: newAddedItem });
  };

  handleRemoveNewItem = idx => {
    this.setState({
      newItem: this.state.newItem.filter((s, sidx) => idx !== sidx)
    });
  };

  handleOldItemChange = idx => evt => {
    // Clear Error State Message
    const errors = {};
    if (evt.target.name === "m_souvenir_id") {
      errors.errorSouvenir = "";
    }
    if (evt.target.name === "qty") {
      errors.errorQty = "";
    }

    const newOldItem = this.state.dataItem.map((oldItem, sidx) => {
      if (idx !== sidx) return oldItem;
      return { ...oldItem, ...errors, [evt.target.name]: evt.target.value };
    });

    this.setState({ dataItem: newOldItem });
  };

  handleEditOldItem = idx => evt => {
    const newOldFile = this.state.dataItem.map((oldItem, sidx) => {
      if (idx !== sidx) return oldItem;
      return {
        ...oldItem,
        readOnly: !oldItem.readOnly,
        disable: !oldItem.disable
      };
    });
    this.setState({ dataItem: newOldFile });
  };

  handleRemoveOldItem = idx => () => {
    this.setState({
      dataItem: this.state.dataItem.filter((s, sidx) => idx !== sidx)
    });
  };

  changeDateFormat = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
  };

  closeModalEdit = () => {
    this.props.closeModalHandler();
    this.setState({
      newItem: []
    });
  };

  render() {
    return (
      <Modal
        isOpen={this.props.edit}
        className={this.props.className}
        size="lg"
      >
        <ModalHeader>
          Edit Souvernir Request - {this.state.formdata.code}
        </ModalHeader>
        <ModalBody>
          <form>
            {this.state.alertData.status === true && (
              <Alert color="danger">{this.state.alertData.message} </Alert>
            )}
            <TextFieldGroup
              label="*Transaction Code"
              type="text"
              name="code"
              placeholder="Auto Generate"
              value={this.state.formdata.code}
              disabled={true}
            />
            <TextFieldGroup
              label="*Event Code"
              type="text"
              name="t_event_id"
              placeholder="Auto Generate"
              value={this.state.formdata.t_event_id}
              disabled={true}
            />
            <TextFieldGroup
              label="*Request By"
              type="text"
              name="request_by"
              placeholder={this.state.formdata.request_by}
              value={this.state.formdata.request_by}
              onChange={this.changeHandler}
              disabled={true}
            />
            <TextFieldGroup
              label="*Request Date"
              type="date"
              name="request_date"
              placeholder={this.state.request_date}
              value={this.state.formdata.request_date}
              onChange={this.changeHandler}
              disabled={true}
            />
            <TextFieldGroup
              label="*Request Due Date"
              type="date"
              name="request_due_date"
              placeholder={this.state.request_due_date}
              value={this.state.formdata.request_due_date}
              onChange={this.changeHandler}
              errors={this.state.errorRequestDueDate}
            />
            <TextAreaGroup
              label="*Note"
              type="text"
              name="note"
              placeholder=""
              value={this.state.formdata.note}
              onChange={this.changeHandler}
            />
            <TextFieldGroup
              label="Status"
              type="text"
              name="status"
              placeholder=""
              value={this.designStatus(this.state.formdata.status)}
              onChange={this.changeHandler}
              disabled={true}
            />
          </form>
          <div className="col-md-12 mb-4 form-inline">
            <button
              className="btn btn-primary"
              type="button"
              onClick={this.handleAddNewItem}
            >
              Add Item
            </button>
            <br />
            {this.state.dataItem[0] === null ? (
              <Spinner />
            ) : (
              <table className="table table-responsive mt-2 mb-2">
                <thead>
                  <tr className="text-center">
                    <th>Souvenir</th>
                    <th>Qty</th>
                    <th>Note</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.dataItem.map((oldItem, idx) => (
                    <tr key={idx}>
                      <td>
                        <SelectList
                          type="text"
                          name="m_souvenir_id"
                          placeholder="*Souvenir Item"
                          value={oldItem.m_souvenir_id}
                          onChange={this.handleOldItemChange(idx)}
                          options={this.state.souvenirOptions}
                          disabled={oldItem.disable}
                          errors={oldItem.errorSouvenir}
                        />
                      </td>
                      <td>
                        <TextField
                          type="number"
                          name="qty"
                          placeholder="*Qty"
                          value={oldItem.qty}
                          onChange={this.handleOldItemChange(idx)}
                          readOnly={oldItem.readOnly}
                          errors={oldItem.errorQty}
                        />
                      </td>
                      <td>
                        <TextField
                          type="text"
                          name="note"
                          id="exampleNote"
                          class="form-control"
                          value={oldItem.note}
                          onChange={this.handleOldItemChange(idx)}
                          readOnly={oldItem.readOnly}
                          placeholder="Note"
                        />
                      </td>
                      <td>
                        <Create
                          className="mr-1"
                          onClick={this.handleEditOldItem(idx)}
                          size="small"
                        />
                        <Delete
                          onClick={this.handleRemoveOldItem(idx)}
                          size="small"
                        />
                      </td>
                    </tr>
                  ))}
                  {this.state.newItem.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <SelectList
                          type="text"
                          name="m_souvenir_id"
                          placeholder="*Souvenir Item"
                          className="form-control"
                          value={item.m_souvenir_id}
                          options={this.state.souvenirOptions}
                          onChange={this.handleAddedItemChange(idx)}
                          disabled={item.disable}
                          errors={item.errorSouvenir}
                        />
                      </td>
                      <td>
                        <TextField
                          type="number"
                          name="qty"
                          placeholder="*Qty"
                          className="form-control"
                          value={item.qty}
                          onChange={this.handleAddedItemChange(idx)}
                          readOnly={item.readOnly}
                          errors={item.errorQty}
                        />
                      </td>
                      <td>
                        <TextField
                          type="text"
                          name="note"
                          placeholder="Note"
                          className="form-control"
                          value={item.note}
                          onChange={this.handleAddedItemChange(idx)}
                          readOnly={item.readOnly}
                        />
                      </td>
                      <td>
                        <Create
                          className="mr-1"
                          onClick={() => {
                            this.handleEditNewItem(idx);
                          }}
                          size="small"
                        />
                        <Delete
                          size="small"
                          onClick={() => {
                            this.handleRemoveNewItem(idx);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.submitHandler}>
            Update
          </Button>
          <Button color="warning" onClick={this.closeModalEdit}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

EditTsouveniritem.propTypes = {
  classes: PropTypes.object.isRequired,
  EditTsouveniritem: PropTypes.func.isRequired,
  getAllSouvenir: PropTypes.func.isRequired,
  getEvent: PropTypes.func.isRequired,
  updateTSouvenirItem: PropTypes.func.isRequired,
  tsouveniritemReducer: PropTypes.object.isRequired,
  souvenir: PropTypes.object.isRequired,
  tevent: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  tsouveniritemReducer: state.tsouveniritemIndexReducer,
  souvenirReducer: state.souvenir,
  teventReducer: state.event,
  tsouveniritemviewReducer: state.tsouveniritemIndexReducer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    EditTsouveniritem,
    getAllSouvenir,
    getEvent,
    getAllTSouvenirItemDetil,
    updateTSouvenirItem
  }
)(EditTsouveniritem);
