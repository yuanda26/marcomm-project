import React from "react";
import { putRole } from "../../../actions/roleActions";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextFieldGroup from "../../common/TextFieldGroup";
class EditRole extends React.Component {
  constructor(props) {
    super(props);
    super(props);
    this.state = {
      errRoleName: "",
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
      this.props.putRole(this.state.formdata, this.props.modalStatus);
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
      <Modal isOpen={this.props.edit} className={this.props.className}>
        <ModalHeader> Edit Role</ModalHeader>
        <ModalBody>
          <form>
            <TextFieldGroup
              label="Role Code"
              name="code"
              value={this.state.formdata.code}
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
              label="Role Description"
              placeholder="*Type Role Description"
              name="description"
              maxLength="50"
              value={this.state.formdata.description}
              onChange={this.changeHandler}
            />
          </form>
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
