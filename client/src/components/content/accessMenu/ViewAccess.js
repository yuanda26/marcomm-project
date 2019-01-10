import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { getAllMenu } from "../../../actions/menuActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
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
      menu: [],
      partOne: [],
      partTwo: []
    };
  }
  componentDidMount() {
    this.props.getAllMenu();
  }
  UNSAFE_componentWillReceiveProps(propsData) {
    const half = propsData.menuData.menuArr.length / 2;
    this.setState({
      partOne: propsData.menuData.menuArr
        .map((content, index) => {
          if (index < half) return content;
          else return false;
        })
        .filter(a => a !== false),
      partTwo: propsData.menuData.menuArr
        .map((content, index) => {
          if (index >= half) return content;
          else return false;
        })
        .filter(a => a !== false)
    });
  }
  getChecked = code => {
    let data = this.props.theAccess.filter(a => a === code);

    if (data.length !== 0) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader>{`View Access (${this.props.access[0]})`}</ModalHeader>
        <ModalBody>
          <Table>
            <TableFooter>
              <TableCell>
                <TableRow>
                  <FormGroup>
                    {this.state.partOne.map(row => {
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.getChecked(row.controller)}
                            />
                          }
                          label={row.name}
                        />
                      );
                    })}
                  </FormGroup>
                </TableRow>
              </TableCell>
              <TableCell>
                <TableRow>
                  <FormGroup>
                    {this.state.partTwo.map(row => {
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.getChecked(row.controller)}
                            />
                          }
                          label={row.name}
                        />
                      );
                    })}
                  </FormGroup>
                </TableRow>
              </TableCell>
            </TableFooter>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="contained"
            onClick={this.props.closeHandler}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

CreateAccess.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  menuData: state.menu
});
CreateAccess.propTypes = {
  getAllMenu: PropTypes.func.isRequired,
  menuData: PropTypes.object.isRequired
};
const style = withStyles(styles)(CreateAccess);
export default connect(
  mapStateToProps,
  { getAllMenu }
)(style);
