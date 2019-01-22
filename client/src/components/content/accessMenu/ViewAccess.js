import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { getAllMenu } from "../../../actions/menuActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createAccessMenu } from "../../../actions/accessMenuActions";
import { withStyles } from "@material-ui/core";

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
        m_role_id: this.props.access[1],
        m_menu_id: []
      },
      menu: [],
      partOne: [],
      partTwo: [],
      checkVariable: {}
    };
  }
  componentDidMount() {
    this.props.getAllMenu();
  }
  UNSAFE_componentWillReceiveProps(propsData) {
    const half = propsData.menuData.menuArr.length / 2;
    let test = {};
    propsData.menuData.menuArr.forEach((content, index) => {
      let data = this.props.theAccess.filter(a => a === content.controller);
      if (data.length === 0) {
        test[content.code] = false;
      } else {
        test[content.code] = true;
      }
    });
    this.setState({
      formdata: {
        m_menu_id: propsData.menuData.menuArr
          .map(content => {
            if (test[content.code] === true) return content.code;
            else return false;
          })
          .filter(a => a !== false),
        m_role_id: propsData.access[1]
      },
      checkVariable: test,
      partOne: propsData.menuData.menuArr
        .map((content, index) => {
          if (index < half && content.controller !== false) return content;
          else return false;
        })
        .filter(a => a !== false),
      partTwo: propsData.menuData.menuArr
        .map((content, index) => {
          if (index >= half && content.controller !== false) return content;
          else return false;
        })
        .filter(a => a !== false),
      menu: propsData.menuData.menuArr
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
  changeCheck = event => {
    let temp = this.state.checkVariable;
    temp[event.target.name] = event.target.checked;
    this.setState({
      formdata: {
        m_menu_id: this.state.menu
          .map(content => {
            if (temp[content.code] === true) return content.code;
            else return false;
          })
          .filter(a => a !== false),
        m_role_id: this.props.access[1]
      },
      checkVariable: temp
    });
  };
  submit = () => {
    this.props.createAccessMenu(this.state.formdata);
    this.props.modalStatus();
  };
  render() {
    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader>{`View Access (${this.props.access[0]})`}</ModalHeader>
        <ModalBody>
          <div className="table-responsive">
            <table className="table table-borderless">
              <tbody>
                <td>
                  {this.state.menu
                    .slice(0, this.state.menu.length / 2)
                    .map((row, index) => (
                      <tr>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name={row.code}
                            onChange={this.changeCheck}
                            checked={this.state.checkVariable[row.code]}
                            id={`defaultCheck${index}`}
                          />
                          <label
                            htmlFor={`defaultCheck${index}`}
                            className="form-check-label"
                          >
                            {row.name}
                          </label>
                        </div>
                      </tr>
                    ))}
                </td>
                <td>
                  {this.state.menu
                    .slice(this.state.menu.length / 2)
                    .map((row, index) => (
                      <tr>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name={row.code}
                            onChange={this.changeCheck}
                            checked={this.state.checkVariable[row.code]}
                            id={`defaultCheck${index}`}
                          />
                          <label
                            htmlFor={`defaultCheck${index}`}
                            className="form-check-label"
                          >
                            {row.name}
                          </label>
                        </div>
                      </tr>
                    ))}
                </td>
                {/* {this.state.partOne.map((row, rowIndex) => (
                  <tr>
                    {["satu", "dua"].map((column, columnIndex) => (
                      <td>
                        {columnIndex % 2 === 0 ? (
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name={row.code}
                              onChange={this.changeCheck}
                              checked={this.state.checkVariable[row.code]}
                              id={`defaultCheck${rowIndex + columnIndex}`}
                            />
                            <label
                              htmlFor={`defaultCheck${rowIndex + columnIndex}`}
                              className="form-check-label"
                            >
                              {row.name}
                            </label>
                          </div>
                        ) : (
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={
                                this.state.checkVariable[
                                  this.state.partTwo[rowIndex].code
                                ]
                              }
                              name={this.state.partTwo[rowIndex].code}
                              onChange={this.changeCheck}
                              id={`defaultCheck${rowIndex + columnIndex}`}
                            />
                            <label
                              htmlFor={`defaultCheck${rowIndex + columnIndex}`}
                              className="form-check-label"
                            >
                              {this.state.partTwo[rowIndex].name}
                            </label>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="contained"
            onClick={this.props.closeHandler}
          >
            Close
          </Button>
          <Button color="primary" variant="contained" onClick={this.submit}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  menuData: state.menu
});
CreateAccess.propTypes = {
  classes: PropTypes.object.isRequired,
  getAllMenu: PropTypes.func.isRequired,
  menuData: PropTypes.object.isRequired,
  createAccessMenu: PropTypes.func.isRequired
};
const style = withStyles(styles)(CreateAccess);
export default connect(
  mapStateToProps,
  { getAllMenu, createAccessMenu }
)(style);
