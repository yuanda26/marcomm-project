import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import apiConfig from "../../../config/Host_Config";
import PropTypes from "prop-types";
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
import axios from "axios";

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
    this.getListMenu();
  }

  getListMenu() {
    let token = localStorage.token;
    let option = {
      url: `${apiConfig.host}/menu`,
      method: "get",
      headers: {
        Authorization: token
      }
    };
    axios(option)
      .then(response => {
        let half = response.data.message.length / 2;
        this.setState({
          menu: response.data.message,
          partOne: response.data.message
            .map((content, index) => {
              if (index < half) return content;
              else return false;
            })
            .filter(a => a !== false),
          partTwo: response.data.message
            .map((content, index) => {
              if (index >= half) return content;
              else return false;
            })
            .filter(a => a !== false)
        });
      })
      .catch(error => {
        console.log(error);
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
                    {this.state.partOne.map((row, index) => {
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
                    {this.state.partTwo.map((row, index) => {
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

export default withStyles(styles)(CreateAccess);
