import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import { deleteRole } from '../../../actions/roleActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
class DeleteAccess extends React.Component {
	deleteHandler = () => {
		this.props.deleteRole(this.props.access.code, this.props.modalStatus);
	};

	render() {
		return (
			<Modal isOpen={this.props.delete} className={this.props.className}>
				<ModalHeader> Delete Access </ModalHeader>
				<ModalBody>
					<p> Delete Data </p>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={this.deleteHandler}>
						Yes
					</Button>
					<Button color="danger" onClick={this.props.closeModalHandler}>
						No
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}
DeleteAccess.propTypes = {
	deleteRole: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
	theRole: state.roleData
});

export default connect(mapStateToProps, { deleteRole })(DeleteAccess);
