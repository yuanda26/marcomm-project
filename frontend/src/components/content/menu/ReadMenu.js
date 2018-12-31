import React from "react";
import { Link } from "react-router-dom";
import { Alert, FormGroup, Input } from "reactstrap";
import { getAllMenu } from "../../../actions/menuActions";
import { connect } from "react-redux";

import EditMenu from "./UpdateMenu";
import CreateMenu from "./CreateMenu";
import DeleteMenu from "./DeleteMenu";
import ViewMenu from "./ViewMenu";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableFooter,
  TablePagination,
  IconButton,
  Paper,
  Hidden,
  Button,
  Grid
} from "@material-ui/core";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import SearchIcon from "@material-ui/icons/Search";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import moment from "moment";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, {
  withTheme: true
})(TablePaginationActions);

class ListMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      showCreateMenu: false,
      allMenu: [],
      currentMenu: {},
      alertData: {
        status: 0,
        message: "",
        code: ""
      },
      hasil: [],
      page: 0,
      rowsPerPage: 5,
      startDate: new Date(),
      created_date: ""
    };
  }

  componentDidMount() {
    this.props.getAllMenu();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      allMenu: newProps.take.menuArr,
      hasil: newProps.take.menuArr
    });
  }

  showHandler = () => {
    this.setState({ showCreateMenu: true });
  };

  closeHandler = () => {
    this.setState({ showCreateMenu: false });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  viewModalHandler = menuid => {
    let tmp = {};
    this.state.allMenu.forEach(ele => {
      if (menuid === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentMenu: tmp,
      viewMenu: true
    });
  };

  editModalHandler = menuid => {
    let tmp = {};
    this.state.allMenu.forEach(ele => {
      if (menuid === ele._id) {
        tmp = {
          _id: ele._id,
          code: ele.code,
          name: ele.name,
          controller: ele.controller,
          parent_id: ele.parent_id,
          updated_by: ele.updated_by
        };
        this.setState({
          currentMenu: tmp,
          editMenu: true
        });
      }
    });
  };

  deleteModalHandler = menuid => {
    let tmp = {};
    this.state.allMenu.forEach(ele => {
      if (menuid === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentMenu: tmp,
      deleteMenu: true
    });
  };

  changeHandler = e => {
    let temp = [];
    let search = e.target.value;
    let patt = new RegExp(search.toLowerCase());

    this.state.allMenu.forEach(ele => {
      if (
        patt.test(ele.code.toLowerCase()) ||
        patt.test(ele.name.toLowerCase()) ||
        patt.test(ele.created_date) ||
        patt.test(ele.created_by)
      ) {
        temp.push(ele);
      }
    });
    this.setState({
      hasil: temp
    });
  };

  closeModalHandler = () => {
    this.setState({
      viewMenu: false,
      editMenu: false,
      deleteMenu: false
    });
  };

  modalStatus = (status, message, code) => {
    this.setState({
      alertData: {
        status: status,
        message: message,
        code: code
      },
      viewMenu: false,
      editMenu: false,
      deleteMenu: false
    });
    // this.getListUnit();
  };

  changeDate = date => {
    return moment(date).format("DD/MM/YYYY");
  };

  render() {
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              <ul class="breadcrumb">
                <li>
                  <a href="/dashboard">Home</a> <span class="divider">/</span>
                </li>
                <li>
                  <a href="#!">Master</a> <span class="divider">/</span>
                </li>
                <li class="active">List Menu</li>
              </ul>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <h4>List Menu</h4>
          </Grid>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Input
              placeholder="Search"
              // className={classes.input}
              name="search"
              onChange={this.changeHandler}
            />
          </FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Input
              placeholder="Search Date"
              // className={classes.input}
              type="date"
              name="created_date"
              onChange={this.changeHandler}
            />
          </FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Button
              variant="contained"
              color="primary"
              size="small"
              // className={classes.button}
              onClick={this.showHandler}
            >
              Add Menu
            </Button>
          </FormGroup>
          <CreateMenu
            create={this.state.showCreateMenu}
            closeHandler={this.closeHandler}
            modalStatus={this.modalStatus}
            menu={this.state.allMenu}
            getlist={this.props.getAllMenu}
          />
          <ViewMenu
            view={this.state.viewMenu}
            closeModalHandler={this.closeModalHandler}
            menu={this.state.currentMenu}
            getlist={this.props.getAllMenu}
          />
          <EditMenu
            edit={this.state.editMenu}
            closeModalHandler={this.closeModalHandler}
            menutest={this.state.currentMenu}
            modalStatus={this.modalStatus}
            getlist={this.props.getAllMenu}
          />
          <DeleteMenu
            delete={this.state.deleteMenu}
            menu={this.state.currentMenu}
            closeModalHandler={this.closeModalHandler}
            modalStatus={this.modalStatus}
            getlist={this.props.getAllMenu}
          />
          <Grid item xs={12}>
            {this.state.alertData.status === 1 ? (
              <Alert color="success">
                <b>Data {this.state.alertData.message}</b> Data menu with code{" "}
                <strong>{this.state.alertData.code} </strong>
                has been {this.state.alertData.message}
              </Alert>
            ) : (
              ""
            )}
            {this.state.alertData.status === 2 ? (
              <Alert color="danger">{this.state.alertData.message} </Alert>
            ) : (
              ""
            )}
            <Hidden>
              <br />
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Menu Code</TableCell>
                      <TableCell>Menu Name</TableCell>
                      <TableCell>Created By</TableCell>
                      <TableCell>Created Date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.hasil
                      .slice(
                        this.state.page * this.state.rowsPerPage,
                        this.state.page * this.state.rowsPerPage +
                          this.state.rowsPerPage
                      )
                      .map((row, index) => {
                        return (
                          <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                              {row.code}
                            </TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.created_by}</TableCell>
                            <TableCell>
                              {this.changeDate(row.created_date)}
                            </TableCell>
                            <TableCell>
                              <Link to="#">
                                <SearchIcon
                                  onClick={() => {
                                    this.viewModalHandler(row._id);
                                  }}
                                />
                              </Link>
                              <Link to="#">
                                <CreateOutlinedIcon
                                  onClick={() => {
                                    this.editModalHandler(row._id);
                                  }}
                                />
                              </Link>
                              <Link to="#">
                                <DeleteOutlinedIcon
                                  onClick={() => {
                                    this.deleteModalHandler(row._id);
                                  }}
                                />
                              </Link>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        colSpan={3}
                        count={this.state.hasil.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActionsWrapped}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </Paper>
            </Hidden>
          </Grid>
        </Grid>
      </div>
    );
  }
}

ListMenu.propTypes = {
  getAllMenu: PropTypes.func.isRequired,
  take: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  take: state.menu
});

export default connect(
  mapStateToProps,
  { getAllMenu }
)(ListMenu);
