import React from "react";
import { createRole } from "../../../actions/roleActions";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class CreateRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formdata: {
        code: "",
        name: "",
        description: ""
      }
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
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
      return alert("All field must be Filled!");
    }
    this.props.createRole(this.state.formdata, this.props.modalStatus);
  }
  render() {
    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader>Add Role</ModalHeader>
        <ModalBody>
          <form>
            <div class="input-group mb-4 input-group-sm">
              <label for="code" class="col-md-3">
                Role ID
              </label>
              <input
                type="text"
                placeholder="Auto Generated"
                class="form-control"
                readOnly
                name="code"
                value={this.state.formdata.code}
                onChange={this.changeHandler}
              />
            </div>
            <div class="input-group mb-4 input-group-sm">
              <label for="text" class="col-md-3">
                Name Role
              </label>
              <input
                type="text"
                class="form-control"
                placeholder="Type Role Name"
                name="name"
                value={this.state.formdata.name}
                onChange={this.changeHandler}
                required
              />
            </div>
            <div class="input-group mb-4 input-group-sm">
              <label for="text" class="col-md-3">
                Description
              </label>
              <input
                type="text"
                class="form-control"
                placeholder="Type Description"
                name="description"
                value={this.state.formdata.description}
                onChange={this.changeHandler}
                required
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.submitHandler}>
            Save
          </Button>
          <Button color="warning" onClick={this.props.closeHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
CreateRole.propTypes = {
  createRole: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  theRole: state.roleData
});

export default connect(
  mapStateToProps,
  { createRole }
)(CreateRole);
// export default CreateRole
