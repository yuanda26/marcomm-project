import React from "react";
import { Link } from "react-router-dom";
import { Alert, Button } from "reactstrap";
import { getAllProduct, searchProduct } from "../../../actions/productAction";
import { connect } from "react-redux";

import EditProduct from "./editProduct";
import CreateProduct from "./createProduct";
import DeleteProduct from "./deleteProduct";
import ViewProduct from "./viewProduct";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Paper from "@material-ui/core/Paper";
import Hidden from "@material-ui/core/Hidden";
import SearchIcon from "@material-ui/icons/Search";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import Grid from "@material-ui/core/Grid";
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
      initialSearch:{
        code : '',
        name : '',
        description : '',
        created_date : '',
        created_by : ''
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
        message: "",
        code: ""
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

  deleteModalHandler = (companyid) => {
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
  }

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
    return moment(tanggal).format("DD/MM/YYYY")
  }

  editModalHandler(companyid) {
    let tmp = {};
    this.state.result.forEach(ele => {
      if (companyid === ele._id) {
        tmp = {
          _id: ele._id,
          code: ele.code,
          name: ele.name,
          description:ele.description,
          update_by: "purwanto",
          address: ele.address,
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
    let { initialSearch } = this.state
    let { name, value } = event.target
    initialSearch[name] = value
    this.setState({
      initialSearch : initialSearch,
    });
  };

    change = () => {
      const {
        code,
        name,
        description,
        created_by,
        created_date
      } = this.state.initialSearch;
      let temp = [];
      this.state.result.forEach(ele => {
      if (
        code.test(ele.code.toLowerCase()) &&
        name.test(ele.name.toLowerCase()) &&
        description.test(ele.description.toLowerCase()) &&
        created_by.test(ele.created_by.toLowerCase()) &&
        created_date.test(ele.created_date.toLowerCase())
      ) {
        temp.push(ele);
      }
      return temp;
    });
    this.setState({
      hasil: temp
    });
  };

  SearchHandler = () => {
    const {
      code, name, description, created_date, created_by 
    } = this.state.initialSearch
    this.props.searchProduct(
      code, name, description, created_date, created_by  
    )
  }
  
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

  modalStatus(status, message, code) {
    this.setState({
      alertData: {
        status: status,
        message: message,
        code: code
      }
    });
  }

  render() {
    const { classes } = this.props
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <ul className="breadcrumb">
                  <li>
                    <a href="/dashboard">Home</a> <span className="divider">/</span>
                  </li>
                  <li>
                    <a href="/dashboard">Master</a> <span className="divider">/</span>
                  </li>
                  <li className="active">List Product</li>
                </ul>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <h4>List Product</h4>
            </Grid>
            
            <form>
              <div className="form-row align-items-center">
                <div className='col-md-2'>
                  <input 
                    placeholder="Code" 
                    className="form-control" 
                    name="code"
                    onChange={this.changeHandler}
                  />
                </div>
                <div className='col-md-2'>
                  <input 
                    placeholder="Name" 
                    className="form-control" 
                    name="name"
                    onChange={this.changeHandler}
                  />
                </div>
                <div className='col-md-2'>
                  <input 
                    placeholder="Description" 
                    className="form-control" 
                    name="description"
                    onChange={this.changeHandler}
                  />
                 </div>
                <div className='col-md'>
                  <input
                    type="date"
                    className="form-control" 
                    placeholder="Search Created Date"
                    name="created_date"
                    onChange={this.changeHandler}
                  />
                </div>
                <div className='col-md-2'>
                  <input 
                    placeholder="Created By" 
                    name="created_by"
                    className="form-control" 
                    onChange={this.changeHandler}
                  />
                </div>
                <div className='col-md'>
                  <button 
                    type="button" 
                    className="btn btn-warning float-right"
                    onClick ={this.SearchHandler}
                  >Search
                  </button>
                </div>
                <div className='col-md'>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small" 
                    onClick={this.showHandler}>
                    Add
                  </Button>
                </div>
              </div>
            </form>
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
              getAllProduct = {this.props.getAllProduct}
              modalStatus={this.modalStatus}
              dataValidation = {(this.props.product.production.map(content=>content.name))}
            />
             <EditProduct
              edit={this.state.editProduct}
              closeModalHandler={this.closeModalHandler}
              product_test={this.state.currentProduct}
              getAllProduct = {this.props.getAllProduct}
              modalStatus={this.modalStatus}
              dataValidation = {(this.props.product.production.map(content=>content.name))}
            />
            <Grid item xs={12}>
              <Hidden>
                <br />
                <Paper>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Product Code</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Created By</TableCell>
                        <TableCell>Created Date</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.props.product.production
                        .slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )
                        .map((row, index) => {
                          return (
                            <TableRow key={row._id}>
                              <TableCell>{index+1+this.state.page * this.state.rowsPerPage}</TableCell>
                              <TableCell component="th" scope="row">
                                {row.code}
                              </TableCell>
                              <TableCell>{row.name}</TableCell>
                              <TableCell>{row.description}</TableCell>
                              <TableCell>{row.created_by}</TableCell>
                              <TableCell>{this.chanegeDate(row.created_date)}</TableCell>
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
          <br />
            <Grid>
              {this.state.alertData.status === 1 ? (
                <Alert color="success">
                  <b>Data {this.state.alertData.message}</b> Data Product with
                  referential code <strong>{this.state.alertData.code} </strong>
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
            </Grid>
        </div>
      </div>
    </div>
    );
  }
}


ListProduct.propTypes = {
  getAllProduct: PropTypes.func.isRequired,
  searchProduct: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  product: state.product
});

export default connect(
  mapStateToProps,
  { getAllProduct, searchProduct}
)( withStyles(styles)(ListProduct) );
