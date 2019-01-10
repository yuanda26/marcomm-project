import React from "react";
import moment from "moment";

import { Link } from "react-router-dom";
import { connect } from "react-redux";

import EditProduct from "./editProduct";
import CreateProduct from "./createProduct";
import DeleteProduct from "./deleteProduct";
import ViewProduct from "./viewProduct";

import { Alert, Button } from "reactstrap";

import {
  getAllProduct,
  searchProduct,
  eraseStatus
} from "../../../actions/productAction";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import {
  TableRow,
  TableFooter,
  TablePagination,
  IconButton
} from "@material-ui/core";

import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  Search,
  DeleteOutlined,
  CreateOutlined
} from "@material-ui/icons";

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
          {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
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
          {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
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

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    minWidth: "90%"
  },
  table: {
    minWidth: 700,
    hidden: true
  },
  button: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

class ListProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialSearch: {
        code: "",
        name: "",
        description: "",
        created_date: "",
        created_by: ""
      },
      search: "",
      showCreateProduct: false,
      deleteProduct: false,
      viewProduct: false,
      editProduct: false,
      result: [],
      currentProduct: {},
      alertData: {
        status: 0,
        message: ""
      },
      hasil: [],
      page: 0,
      rowsPerPage: 5
    };
    this.showHandler = this.showHandler.bind(this);
    //   this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    //   this.SearchHandler = this.SearchHandler.bind(this);
    this.closeModalHandler = this.closeModalHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    // this.deleteHandler = this.deleteHandler.bind(this);
    // this.deleteModalHandler = this.deleteModalHandler.bind(this);
    this.viewModalHandler = this.viewModalHandler.bind(this);
    this.editModalHandler = this.editModalHandler.bind(this);
    this.modalStatus = this.modalStatus.bind(this);
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  deleteModalHandler = companyid => {
    let tmp = {};
    this.state.result.forEach(ele => {
      if (companyid === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentProduct: tmp,
      deleteProduct: true
    });
  };

  viewModalHandler(companyid) {
    let tmp = {};
    this.state.result.forEach(ele => {
      if (companyid === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentProduct: tmp,
      viewProduct: true
    });
  }

  chanegeDate = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
  };

  editModalHandler(companyid) {
    let tmp = {};
    this.state.result.forEach(ele => {
      if (companyid === ele._id) {
        tmp = {
          _id: ele._id,
          code: ele.code,
          name: ele.name,
          description: ele.description,
          update_by: "purwanto",
          address: ele.address
        };
        //alert(JSON.stringify(tmp));
        this.setState({
          currentProduct: tmp,
          editProduct: true
        });
      }
    });
  }

  changeHandler = event => {
    let { initialSearch } = this.state;
    let { name, value } = event.target;
    initialSearch[name] = value;
    this.setState({
      initialSearch: initialSearch
    });
  };

  SearchHandler = () => {
    const {
      code,
      name,
      description,
      created_date,
      created_by
    } = this.state.initialSearch;
    this.props.searchProduct(code, name, description, created_date, created_by);
  };

  closeModalHandler() {
    this.setState({
      viewProduct: false,
      editProduct: false,
      deleteProduct: false
    });
  }

  showHandler() {
    this.setState({ showCreateProduct: true });
  }

  closeHandler() {
    this.setState({ showCreateProduct: false });
  }

  componentDidMount() {
    this.props.getAllProduct();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      result: newProps.product.production,
      hasil: newProps.product.production
    });
  }

  modalStatus = (status, message) => {
    this.props.eraseStatus();
    this.setState({
      alertData: {
        status: status,
        message: message
      }
    });
    setTimeout(() => {
      this.setState({
        alertData: {
          status: 0,
          message: ""
        }
      });
    }, 3000);
  };

  closeAlert = () => {
    this.setState({
      alertData: {
        status: 0,
        message: ""
      }
    });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card border-primary">
              <div className="card-header bg-primary text-white">
                <h4>List Product</h4>
              </div>
              <div className="card-body">
                <div className="col">
                  <nav aria-label="breadcrumb">
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="/dashboard">Home</a>
                      </li>
                      <li className="breadcrumb-item">
                        <a href="/dashboard">Master</a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        List Product
                      </li>
                    </ul>
                  </nav>
                </div>
                <div>
                  {this.state.alertData.status === 1 ? (
                    <Alert className="alert alert-succes alert-dismissible fade show">
                      <b>{this.state.alertData.message}</b>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                        onClick={this.closeAlert}
                        aria-label="Close"
                      >
                        <span>&times;</span>
                      </button>
                    </Alert>
                  ) : (
                    ""
                  )}
                  {this.state.alertData.status === 2 ? (
                    <Alert className="alert alert-danger alert-dismissible fade show">
                      <b>{this.state.alertData.message}</b>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                        aria-label="Close"
                        onClick={this.closeAlert}
                      >
                        <span>&times;</span>
                      </button>
                    </Alert>
                  ) : (
                    ""
                  )}
                  <DeleteProduct
                    delete={this.state.deleteProduct}
                    product_del={this.state.currentProduct}
                    closeModalHandler={this.closeModalHandler}
                    modalStatus={this.modalStatus}
                  />
                  <ViewProduct
                    view={this.state.viewProduct}
                    closeModalHandler={this.closeModalHandler}
                    product={this.state.currentProduct}
                  />
                  <CreateProduct
                    create={this.state.showCreateProduct}
                    closeHandler={this.closeHandler}
                    getAllProduct={this.props.getAllProduct}
                    modalStatus={this.modalStatus}
                    dataValidation={this.props.product.production.map(
                      content => content.name
                    )}
                  />
                  <EditProduct
                    edit={this.state.editProduct}
                    closeModalHandler={this.closeModalHandler}
                    product_test={this.state.currentProduct}
                    getAllProduct={this.props.getAllProduct}
                    modalStatus={this.modalStatus}
                    dataValidation={this.props.product.production.map(
                      content => content.name
                    )}
                  />
                  <form>
                    <div className="form-row align-items-center">
                      <div className="col-md-2">
                        <input
                          placeholder="Code"
                          className="form-control"
                          name="code"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Name"
                          className="form-control"
                          name="name"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Description"
                          className="form-control"
                          name="description"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md">
                        <input
                          type="date"
                          className="form-control"
                          placeholder="Search Created Date"
                          name="created_date"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Created By"
                          name="created_by"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md">
                        <button
                          type="button"
                          className="btn btn-warning float-right"
                          onClick={this.SearchHandler}
                        >
                          Search
                        </button>
                      </div>
                      <div className="col-md">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={this.showHandler}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </form>
                  <br />
                  <div className="table-responsive">
                    <table id="mytable" className="table table-hover">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Product Code</th>
                          <th>Product Name</th>
                          <th>Description</th>
                          <th>Created By</th>
                          <th>Created Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.product.production
                          .slice(
                            this.state.page * this.state.rowsPerPage,
                            this.state.page * this.state.rowsPerPage +
                              this.state.rowsPerPage
                          )
                          .map((row, index) => {
                            return (
                              <tr key={row._id}>
                                <td>
                                  {index +
                                    1 +
                                    this.state.page * this.state.rowsPerPage}
                                </td>
                                <td>{row.code}</td>
                                <td>{row.name}</td>
                                <td>{row.description}</td>
                                <td>{row.created_by}</td>
                                <td>{this.chanegeDate(row.created_date)}</td>
                                <td>
                                  <Link to="#">
                                    <Search
                                      onClick={() => {
                                        this.viewModalHandler(row._id);
                                      }}
                                    />
                                  </Link>
                                  <Link to="#">
                                    <CreateOutlined
                                      onClick={() => {
                                        this.editModalHandler(row._id);
                                      }}
                                    />
                                  </Link>
                                  <Link to="#">
                                    <DeleteOutlined
                                      onClick={() => {
                                        this.deleteModalHandler(row._id);
                                      }}
                                    />
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            count={this.state.hasil.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActionsWrapped}
                          />
                        </TableRow>
                      </TableFooter>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ListProduct.propTypes = {
  getAllProduct: PropTypes.func.isRequired,
  searchProduct: PropTypes.func.isRequired,
  eraseStatus: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  product: state.product
});

export default connect(
  mapStateToProps,
  { getAllProduct, searchProduct, eraseStatus }
)(withStyles(styles)(ListProduct));
