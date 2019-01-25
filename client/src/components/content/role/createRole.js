import React from "react";
import { createRole } from "../../../actions/roleActions";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextFieldGroup from "../../common/TextFieldGroup";
class CreateRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errRoleName: "",
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
    if (e.target.name === "name") {
      this.setState({
        formdata: tmp,
        errRoleName: ""
      });
    } else {
      this.setState({
        formdata: tmp
      });
    }
  }

  submitHandler() {
    if (this.state.formdata.name === "") {
      this.setState({
        errRoleName: "This Field is Required!"
      });
    } else {
      this.props.createRole(this.state.formdata, this.props.modalStatus);
      setTimeout(() => {
        this.setState({
          formdata: {
            code: "",
            name: "",
            description: ""
          }
        });
      }, 3000);
    }
  }
  render() {
    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader>Add Role</ModalHeader>
        <ModalBody>
          <form>
            <TextFieldGroup
              label="*Role ID"
              placeholder="Auto Generated"
              disabled={true}
            />
            <TextFieldGroup
              label="*Role Name"
              placeholder="*Type Role Name"
              name="name"
              maxLength="50"
              errors={this.state.errRoleName}
              value={this.state.formdata.name}
              onChange={this.changeHandler}
            />
            <TextFieldGroup
              label="Description"
              placeholder="Type Description"
              name="description"
              maxLength="50"
              value={this.state.formdata.description}
              onChange={this.changeHandler}
            />
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
  createRole: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  theRole: state.roleData
});

export default connect(
  mapStateToProps,
  { createRole }
)(CreateRole);
// export default CreateRole
