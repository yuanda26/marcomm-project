import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { connect } from "react-redux";
import { createAccessMenu } from "../../../actions/accessMenuActions";
import { getAllMenu } from "../../../actions/menuActions";
import { Alert } from "reactstrap";
import PropTypes from "prop-types";
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  withStyles,
  Table,
  TableCell,
  TableRow,
  TableFooter
} from "@material-ui/core";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit * 3,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

class CreateAccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formdata: {
        m_role_id: "",
        name_role: "",
        m_menu_id: []
      },
      accessData: "",
      theAccess: [],
      alertData: {
        status: false,
        message: ""
      },
      labelWidth: 0,
      menu: [],
      samsul: [],
      checkedOne: false,
      theRole: "",
      open: false,
      nilai: len => {
        let arr = [];
        for (let i = 0; i < len; i++) {
          arr.push(0);
        }
        return arr;
      },
      nilai2: [],
      nilai3: []
    };

    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.props.getAllMenu();
  }
  UNSAFE_componentWillReceiveProps(propsData) {
    this.setState({
      accessData: propsData.accessData,
      menu: propsData.menuData.menuArr,
      nilai3: this.state.nilai(propsData.menuData.menuArr.length)
    });
  }
  changeHandler(e) {
    let tmp = this.state.formdata;
    tmp[e.target.name] = e.target.value;
    this.setState({
      alertData: {
        status: false,
        message: ""
      },
      formdata: tmp
    });
  }

  submitHandler() {
    let temp = this.state.formdata;
    temp.m_role_id = this.props.access[1];
    temp.m_menu_id = this.state.nilai2;
    this.setState({
      formdata: temp
    });
    this.props.createAccessMenu(this.state.formdata);
    this.props.modalStatus2();
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    let index = parseInt(event.target.value);
    if (event.target.checked) {
      let old = this.state.nilai3.map((content, ind) => {
        if (ind === index) return this.state.menu[index].code;
        return content;
      });
      this.setState({
        nilai3: old.map(content => content),
        nilai2: old.filter(e => e !== 0)
      });
    } else {
      let old = this.state.nilai3.map((content, ind) => {
        if (ind === index) return 0;
        return content;
      });
      this.setState({
        nilai3: old.map(content => content),
        nilai2: old.filter(e => e !== 0)
      });
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };
  render() {
    const { classes } = this.props;
    const half = ["test1", "test2"];
    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader>Add/Edit Access</ModalHeader>
        <ModalBody>
          <div className={classes.container}>
            <FormControl component="fieldset" className={classes.formControl}>
              <label htmlFor="text">
                <h5>{this.props.access[0]}</h5>
              </label>
              <br />
              <FormLabel>Select the role</FormLabel>
              <br />
              <FormGroup>
                <Table>
                  <TableFooter>
                    {half.map((content, id) => {
                      return id === 0 ? (
                        <TableCell key={content._id}>
                          {this.state.menu.map((row, index) =>
                            index < this.state.menu.length / 2 ? (
                              <TableRow>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={this.handleChange(
                                        String(row.name)
                                      )}
                                      value={index}
                                    />
                                  }
                                  label={row.name}
                                />
                              </TableRow>
                            ) : (
                              <div />
                            )
                          )}
                        </TableCell>
                      ) : (
                        <TableCell>
                          {this.state.menu.map((row, index) =>
                            index >= this.state.menu.length / 2 ? (
                              <TableRow>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={this.handleChange(
                                        String(row.name)
                                      )}
                                      value={index}
                                    />
                                  }
                                  label={row.name}
                                />
                              </TableRow>
                            ) : (
                              <div />
                            )
                          )}
                        </TableCell>
                      );
                    })}
                  </TableFooter>
                </Table>
              </FormGroup>
            </FormControl>
          </div>
        </ModalBody>
        <ModalFooter>
          {this.state.alertData.status === true ? (
            <Alert color="danger">{this.state.alertData.message} </Alert>
          ) : (
            ""
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={this.submitHandler}
          >
            Save
          </Button>
          <Button variant="contained" onClick={this.props.closeHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  accessData: state.accessMenuData,
  menuData: state.menu
});
CreateAccess.propTypes = {
  createAccessMenu: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  accessData: PropTypes.object.isRequired,
  getAllMenu: PropTypes.func.isRequired,
  menuData: PropTypes.object.isRequired
};
const style = withStyles(styles)(CreateAccess);
export default connect(
  mapStateToProps,
  { createAccessMenu, getAllMenu }
)(style);
