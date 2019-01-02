import React from "react";
import { connect } from "react-redux";
import { getAllRoles } from "../../../actions/roleActions";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import EditRole from "./editRole";
import CreateRole from "./createRole";
import { Alert } from "reactstrap";
import DeleteRole from "./deleteRole";
import ViewRole from "./viewRole";
import {
  Grid,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";
import SearchIcon from "@material-ui/icons/Search";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import moment from "moment";

class ListRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateRole: false,
      roleItem: {
        code: null,
        name: null,
        created_by: null,
        reqDate: null
      },
      role: [],
      dummyRole: [],
      currentRole: {},
      alertData: {
        status: 0,
        message: ""
      }
    };
    this.showHandler = this.showHandler.bind(this);
    this.closeModalHandler = this.closeModalHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    this.deleteModalHandler = this.deleteModalHandler.bind(this);
    this.viewModalHandler = this.viewModalHandler.bind(this);
    this.editModalHandler = this.editModalHandler.bind(this);
    this.modalStatus = this.modalStatus.bind(this);
  }
  //for delete action
  deleteModalHandler(roleid) {
    let tmp = {};
    this.state.role.map(ele => {
      if (roleid === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentRole: tmp,
      deleteRole: true
    });
  }
  //for view action
  viewModalHandler(roleid) {
    let tmp = {};
    this.state.role.map(ele => {
      if (roleid === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentRole: tmp,
      viewRole: true
    });
  }
  //for update action
  editModalHandler(roleid) {
    let tmp = {};
    this.state.role.map(ele => {
      if (roleid === ele._id) {
        tmp = {
          _id: ele._id,
          code: ele.code,
          name: ele.name,
          description: ele.description,
          updated_by: ele.updated_by
        };
        this.setState({
          currentRole: tmp,
          editRole: true
        });
      }
    });
  }
  //close pop up for modal (used in update, veiw, delete)
  closeModalHandler() {
    this.setState({
      viewRole: false,
      editRole: false,
      deleteRole: false
    });
  }
  //show pop up for modal (used in update, veiw, delete)
  showHandler() {
    this.setState({ showCreateRole: true });
  }
  //close pop for create
  closeHandler() {
    this.setState({ showCreateRole: false });
  }
  //handler Change for search
  changeHandler = event => {
    let temp = this.state.roleItem;
    if (event.target.name === "reqDate") {
      temp[event.target.name] = moment(event.target.value).format("DD/MM/YYYY");
    } else {
      temp[event.target.name] = event.target.value;
    }
    this.setState({
      roleItem: temp
    });
  };
  // handle keypress
  keyHandler = event => {
    if (event.key === "Enter") this.search();
  };
  //Search Handler
  search = () => {
    const func = input => {
      if (input === "") return null;
      else return input;
    };
    let regCode = new RegExp(func(this.state.roleItem.code), "i");
    let regName = new RegExp(func(this.state.roleItem.name), "i");
    let regBy = new RegExp(func(this.state.roleItem.created_by), "i");
    let regDate = new RegExp(this.state.roleItem.reqDate);
    let data = this.state.role
      .map(content => {
        if (
          regBy.test(content.created_by) ||
          regCode.test(content.code) ||
          regName.test(content.name) ||
          regDate.test(moment(content.created_date).format("DD/MM/YYYY"))
        )
          return content;
        else return false;
      })
      .filter(a => a !== false);
    this.setState({
      dummyRole: data
    });
  };
  //Go Back before search
  refresh = () => {
    this.setState({
      dummyRole: this.state.role
    });
  };

  //mount before render
  componentDidMount() {
    this.props.getAllRoles();
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      role: newProps.getTheRole.rolan,
      dummyRole: newProps.getTheRole.rolan
    });
  }
  modalStatus(status, message) {
    setTimeout(() => {
      this.props.getAllRoles();
    }, 0);
    this.setState({
      alertData: {
        status: status,
        message: message
      },
      viewRole: false,
      editRole: false,
      deleteRole: false
    });
  }

  render() {
    return (
      <div>
        <br />
        <Grid item xs={12}>
          <Paper>
            <ul class="breadcrumb">
              <li>
                <a href="/dashboard">Home</a> <span class="divider">/</span>
              </li>
              <li class="active">Master/</li>
              <li class="active">List Role</li>
            </ul>
          </Paper>
        </Grid>

        <div>
          <h4>List Role</h4>

          {this.state.alertData.status === 1 ? (
            <Alert color="success"> {this.state.alertData.message} </Alert>
          ) : (
            ""
          )}
          {this.state.alertData.status === 2 ? (
            <Alert color="danger"> {this.state.alertData.message} </Alert>
          ) : (
            ""
          )}

          <CreateRole
            create={this.state.showCreateRole}
            modalStatus={this.modalStatus}
            closeHandler={this.closeHandler}
          />
          <ViewRole
            view={this.state.viewRole}
            closeModalHandler={this.closeModalHandler}
            role={this.state.currentRole}
          />
          <DeleteRole
            delete={this.state.deleteRole}
            role={this.state.currentRole}
            closeModalHandler={this.closeModalHandler}
            modalStatus={this.modalStatus}
          />
          <EditRole
            edit={this.state.editRole}
            closeModalHandler={this.closeModalHandler}
            roletest={this.state.currentRole}
            modalStatus={this.modalStatus}
          />
          <br />
          <div class="form-row">
            <div class="col-md-2">
              <input
                name="code"
                onKeyPress={this.keyHandler}
                onChange={this.changeHandler}
                class="form-control"
                placeholder="-Role Code-"
              />
            </div>
            <div class="col-md-2">
              <input
                name="name"
                onKeyPress={this.keyHandler}
                onChange={this.changeHandler}
                class="form-control"
                placeholder="-Role Name-"
              />
            </div>
            <div class="col-md-2">
              <input
                name="created_by"
                onKeyPress={this.keyHandler}
                onChange={this.changeHandler}
                class="form-control"
                placeholder="-Request By-"
              />
            </div>
            <div class="col-md-2">
              <input
                name="reqDate"
                onKeyPress={this.keyHandler}
                onChange={this.changeHandler}
                type="date"
                class="form-control"
              />
            </div>
            <div class="col-xs-1">
              <button class="btn btn-primary" onClick={this.search}>
                Search
              </button>
            </div>
            <div class="col-xs-1">
              <button onClick={this.refresh} class="btn btn-warning">
                Refresh
              </button>
            </div>
            <div class="col-xs-1">
              <button onClick={this.showHandler} class="btn btn-primary">
                Add Role
              </button>
            </div>
          </div>
          <Grid item xs={6} justify="flex-end" />
          <br />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Code</TableCell>
                <TableCell>Role Name</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            {this.state.dummyRole.map(content => (
              <TableRow>
                <TableCell>{content.code}</TableCell>
                <TableCell>{content.name}</TableCell>
                <TableCell>{content.created_by}</TableCell>
                <TableCell>
                  {moment(content.created_date).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  <Link to="#">
                    <SearchIcon
                      onClick={() => {
                        this.viewModalHandler(content._id);
                      }}
                    />
                  </Link>
                  <Link to="#">
                    <CreateOutlinedIcon
                      onClick={() => {
                        this.editModalHandler(content._id);
                      }}
                    />
                  </Link>
                  <Link to="#">
                    <DeleteOutlinedIcon
                      onClick={() => {
                        this.deleteModalHandler(content._id);
                      }}
                    />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </div>
      </div>
    );
  }
}
ListRole.propTypes = {
  getAllRoles: PropTypes.object.isRequired,
  getTheRole: PropTypes.object.isRequired
  // classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  getTheRole: state.roleData
});

export default connect(
  mapStateToProps,
  { getAllRoles }
)(ListRole);

// export default ListRole
