import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
  Label,
  FormGroup,
  Table
} from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getListTsouvenirItem } from "../../../actions/tsouvenirAction";
import moment from "moment";

class ViewTsouvenir extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: []
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
            <FormGroup>
              <Label for="">Code</Label>
              <Input
                type="text"
                name="code"
                placeholder=""
                value={this.props.item.code}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="">Received By</Label>
              <Input
                type="text"
                name="received_by"
                placeholder=""
                value={this.props.item.received_by}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="">Received Date</Label>
              <Input
                type="text"
                name="received_date"
                placeholder=""
                value={this.changeDate(this.props.item.received_date)}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="">Note</Label>
              <Input
                type="text"
                name="note"
                placeholder=""
                value={this.props.item.note}
                readOnly
              />
            </FormGroup>
          </div>
          <div>
            <h3>Souvenir Item </h3>
          </div>
          <Table>
            <thead>
              <tr>
                <th>Souvenir Item</th>
                <th>Qty</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {this.func(this.state.item).map(ele => (
                <tr>
                  <td>
                    <Input
                      type="text"
                      name="note"
                      placeholder={ele.m_souvenir_id}
                      value={ele.m_souvenir_id}
                      readOnly
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="note"
                      placeholder={ele.qty}
                      value={ele.qty}
                      readOnly
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="note"
                      placeholder={ele.note}
                      value={ele.note}
                      readOnly
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
  classes: PropTypes.object.isRequired,
  getListTsouvenirItem: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  itemTableReducer: state.tsouvenirIndexReducer
});

export default connect(
  mapStateToProps,
  { getListTsouvenirItem }
)(ViewTsouvenir);
