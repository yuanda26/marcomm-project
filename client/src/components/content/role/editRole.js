import React from "react";
import { putRole } from "../../../actions/roleActions";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
class EditRole extends React.Component {
  constructor(props) {
    super(props);
    super(props);
    this.state = {
      oldData: {
        code: "",
        name: "",
        description: ""
      },
      formdata: {
        code: "",
        name: "",
        description: ""
      }
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
      formdata: newProps.roletest,
      oldData: newProps.roletest
    });
  }

  changeHandler(e) {
    let tmp = this.state.formdata;
    tmp[e.target.name] = e.target.value;
    this.setState({
      formdata: tmp
    });
  }

  submitHandler() {
    if (this.state.formdata.name === "") {
      alert("Role name can't be null!!");
    } else {
      this.props.putRole(this.state.formdata, this.props.modalStatus);
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.edit} className={this.props.className}>
        <ModalHeader> Edit Role</ModalHeader>
        <ModalBody>
          <div className="table-responsive">
            <table className="table table-borderless">
              <tr>
                <td nowrap="true">Role Code</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    readOnly
                    name="code"
                    value={this.state.formdata.code}
                    onChange={this.changeHandler}
                  />
                </td>
              </tr>
              <tr>
                <td nowrap="true">Role Name</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={this.state.formdata.name}
                    onChange={this.changeHandler}
                  />
                </td>
              </tr>
              <tr>
                <td nowrap="true">Description</td>
                <td>
                  <textarea
                    type="text"
                    className="form-control"
                    name="description"
                    value={this.state.formdata.description}
                    onChange={this.changeHandler}
                  />
                </td>
              </tr>
            </table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.submitHandler}>
            Update
          </Button>
          <Button color="warning" onClick={this.props.closeModalHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
EditRole.propTypes = {
  putRole: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  theRole: state.roleData
});

export default connect(
  mapStateToProps,
  { putRole }
)(EditRole);
