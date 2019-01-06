import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import { deleteRole } from '../../../actions/roleActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
class DeleteRole extends React.Component {
	deleteHandler = () => {
		this.props.deleteRole(this.props.role.code, this.props.modalStatus);
	};

	render() {
		return (
			<Modal isOpen={this.props.delete} className={this.props.className}>
				<ModalHeader> Delete Role </ModalHeader>
				<ModalBody>
					<p> Delete Data </p>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={this.deleteHandler}>
						Delete
					</Button>
					<Button color="danger" onClick={this.props.closeModalHandler}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}
DeleteRole.propTypes = {
	deleteRole: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
	theRole: state.roleData
});

export default connect(mapStateToProps, { deleteRole })(DeleteRole);
