import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getListTsouvenirItem } from "../../../actions/tsouvenirAction";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import Spinner from "../../common/Spinner";

class ViewTsouvenir extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: ["null"]
    };
  }

  componentDidMount() {
    this.props.getListTsouvenirItem();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      item: newProps.itemTableReducer.it
    });
  }

  func(input) {
    return input.filter(a => a.t_souvenir_id === this.props.item.code);
  }

  changeDate = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
  };

  render() {
    return (
      <Modal isOpen={this.props.view} className={this.props.className}>
        <ModalHeader> View Souvenir Item</ModalHeader>
        <ModalBody>
          <div>
            <h3>{this.props.item.code} </h3>
          </div>
          <div>
            <Grid container spacing={24}>
              <Grid item xs={6}>
                Code
                <br />
                Received By
                <br />
                Received Date
                <br />
                Note
                <br />
              </Grid>
              <Grid item xs={6}>
                {this.props.item.code}
                <br />
                {this.props.item.received_by}
                <br />
                {this.props.item.received_date}
                <br />
                {this.props.item.note}
                <br />
              </Grid>
            </Grid>
          </div>
          <br />
          <div>
            <h4>Souvenir Item</h4>
          </div>
          <div className="table-responsive">
            <table className="table table-stripped">
              <thead>
                <tr>
                  <th>Souvenir Item</th>
                  <th>Qty</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {this.state.item[0] === "null" ? (
                  <Spinner />
                ) : this.func(this.state.item).length === 0 ? (
                  <tr>
                    <td />
                    <td>No Data Found</td>
                  </tr>
                ) : (
                  this.func(this.state.item).map(item => (
                    <tr key={item._id}>
                      <td>{item.m_souvenir_id}</td>
                      <td>{item.qty}</td>
                      <td>{item.note}</td>
                    </tr>
                  ))
                )}
              </tbody>
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

ViewTsouvenir.propTypes = {
  getListTsouvenirItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  itemTableReducer: state.tsouvenirIndexReducer
});

export default connect(
  mapStateToProps,
  { getListTsouvenirItem }
)(ViewTsouvenir);
