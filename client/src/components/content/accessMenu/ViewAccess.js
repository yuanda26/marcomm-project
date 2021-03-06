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
      menu: []
    };
  }
  componentDidMount() {
    this.props.getAllMenu();
  }
  UNSAFE_componentWillReceiveProps(propsData) {
    this.setState({
      menu: propsData.menuData.menuArr.filter(a => a.controller !== false)
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
                          checked={this.getChecked(row.controller)}
                          id={`defaultCheck${index}`}
                          disabled
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
                          checked={this.getChecked(row.controller)}
                          id={`defaultCheck${index}`}
                          disabled
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
