import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";

class ViewRole extends React.Component {
  render() {
    return (
      <Modal isOpen={this.props.view} className={this.props.className}>
        <ModalHeader> View Role</ModalHeader>
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
                    value={this.props.role.code}
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
                    value={this.props.role.name}
                    readOnly
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
                    value={this.props.role.description}
                    readOnly
                  />
                </td>
              </tr>
            </table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.props.closeModalHandler}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
export default ViewRole;
