import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { getAllMenu } from "../../../actions/menuActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createAccessMenu } from "../../../actions/accessMenuActions";
import { getnoAccess } from "../../../actions/roleActions";
import { withStyles } from "@material-ui/core";
import SelectList from "../../common/SelectList";
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
      errorOption: "",
      m_role_id: "",
      m_menu_id: [],
      menu: [],
      role: [],
      checkVariable: {}
    };
  }
  componentDidMount() {
    this.props.getAllMenu();
    this.props.getnoAccess();
  }
  UNSAFE_componentWillReceiveProps(propsData) {
    let test = {};
    propsData.menuData.menuArr.forEach(content => {
      test[content.code] = false;
    });
    this.setState({
      role: propsData.getTheRole.dataRole,
      checkVariable: test,
      menu: propsData.menuData.menuArr.filter(a => a.controller !== false)
    });
  }
  changeCheck = event => {
    let temp = this.state.checkVariable;
    temp[event.target.name] = event.target.checked;
    this.setState({
      m_menu_id: this.state.menu
        .map(content => {
          if (temp[content.code] === true) return content.code;
          else return false;
        })
        .filter(a => a !== false),
      checkVariable: temp
    });
  };
  selectRole = event => {
    this.setState({
      m_role_id: event.target.value,
      errorOption: ""
    });
  };
  submit = () => {
    if (this.state.m_role_id === "") {
      this.setState({
        errorOption: "This Field is Required!"
      });
    } else {
      this.props.createAccessMenu({
        m_role_id: this.state.m_role_id,
        m_menu_id: this.state.m_menu_id
      });
      this.props.modalStatus(1, "Access Menu has been added", 200);
    }
  };
  render() {
    const option = [
      {
        value: "",
        label: "*Select Role..."
      }
    ].concat(
      this.state.role.map(content => ({
        value: content.code,
        label: content.name
      }))
    );
    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader>{`Add Access Menu`}</ModalHeader>

        {this.state.role.length !== 0 ? (
          <ModalBody>
            <SelectList
              value={this.state.m_role_id}
              onChange={this.selectRole}
              options={option}
              errors={this.state.errorOption}
            />
            <div>Select Menu</div>
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-6">
                  {this.state.menu
                    .slice(0, this.state.menu.length / 2)
                    .map((row, index) => (
                      <div key={index.toString()}>
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
                      </div>
                    ))}
                </div>
                <div className="col-md-6">
                  {this.state.menu
                    .slice(this.state.menu.length / 2)
                    .map((row, index) => (
                      <div key={index.toString()}>
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
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </ModalBody>
        ) : (
          <ModalBody>All Role was have access!</ModalBody>
        )}

        <ModalFooter>
          <Button
            color="danger"
            variant="contained"
            onClick={this.props.closeHandler}
          >
            Close
          </Button>

          {this.state.role.length !== 0 ? (
            <Button color="primary" variant="contained" onClick={this.submit}>
              Save
            </Button>
          ) : (
            <div />
          )}
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  menuData: state.menu,
  getTheRole: state.roleData
});
CreateAccess.propTypes = {
  classes: PropTypes.object.isRequired,
  getAllMenu: PropTypes.func.isRequired,
  menuData: PropTypes.object.isRequired,
  getTheRole: PropTypes.object.isRequired,
  getnoAccess: PropTypes.func.isRequired,
  createAccessMenu: PropTypes.func.isRequired
};
const style = withStyles(styles)(CreateAccess);
export default connect(
  mapStateToProps,
  { getAllMenu, createAccessMenu, getnoAccess }
)(style);
