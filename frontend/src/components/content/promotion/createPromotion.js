import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Form,
  FormGroup,
  Label,
  Alert
} from "reactstrap";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getEvent,
  getDesign,
  getDesignByCode
} from "../../../actions/promotionActions";

class CreatePromotion extends React.Component {
  constructor(props) {
    super(props);
    //form data-->> lookup from t_event
    //designHeader-->> lookup from t_design
    //designItem-->> lookup from t_design_item (product name and description lookup from m_product)
    this.state = {
      formdata: {
        t_event_id: "",
        t_design_id: "",
        flag_design: 0
      },
      designHeader: {
        t_design_id: "",
        request_by: "",
        request_date: "",
        title_header: "",
        note: ""
      },
      designItem: {
        product_name: "",
        description: "",
        title: "",
        start_date: "",
        end_date: ""
      },
      alertData: {
        status: false,
        message: ""
      }
    };
    this.NextHandler = this.NextHandler.bind(this);
    this.CancelHandler = this.CancelHandler.bind(this);
  }
  //<<<---------------------------------Setting------------------------>>
  selectEvent = selectedOption => {
    let tmp = this.state.formdata;
    tmp["t_event_id"] = selectedOption.value;
    this.setState({
      formdata: tmp,
      alertData: {
        status: false,
        message: ""
      }
    });
  };
  selectDesign = selectedOption => {
    let tmp = this.state.formdata;
    let lala = this.state.designHeader;
    tmp["t_design_id"] = selectedOption.value;
    lala["t_design_id"] = selectedOption.value;
    this.setState({
      designHeader: lala,
      formdata: tmp,
      alertData: {
        status: false,
        message: ""
      }
    });
  };
  selectFlag = selectedOption => {
    let tmp = this.state.formdata;
    tmp["flag_design"] = selectedOption.value;
    this.setState({
      formdata: tmp,
      alertData: {
        status: false,
        message: ""
      }
    });
  };

  NextHandler() {
    if (
      (this.state.formdata.flag_design === 1 &&
        this.state.formdata.t_design_id === "") ||
      this.state.formdata.t_event_id === ""
    ) {
      this.setState({
        alertData: {
          status: true,
          message: "All forms must be filled!"
        }
      });
    } else if (this.state.formdata.flag_design === 0) {
      localStorage.setItem("PROMOTION", JSON.stringify(this.state.formdata));
      window.location.href = "/addpromot-nd";
      this.props.closeHandler();
    } else {
      localStorage.setItem("PROMOTION", JSON.stringify(this.state.formdata));
      window.location.href = "/addpromot-d";
      this.props.closeHandler();
    }
  }

  CancelHandler() {
    this.setState({
      formdata: {
        t_event_id: "",
        t_design_id: "",
        flag_design: 0
      },
      alertData: {
        status: false,
        message: ""
      }
    });
    this.props.closeHandler();
  }
  componentDidMount() {
    this.props.getEvent();
    this.props.getDesign();
  }
  render() {
    const { event, design } = this.props.ambil;
    const eventOptions = [];
    event.map(row => {
      return eventOptions.push({
        value: row.code,
        label: row.code
      });
    });

    const designOptions = event => {
      return design
        .map(row => {
          if (row.t_event_id == event) {
            return {
              value: row.code,
              label: row.code
            };
          } else return false;
        })
        .filter(a => a !== false);
    };

    const flagOptions = [{ value: 0, label: "NO" }, { value: 1, label: "YES" }];

    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader> Add Marketing Promotion</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Select Event</Label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                label="Select Event"
                name="t_event_id"
                options={eventOptions}
                value={this.state.t_event_id}
                onChange={this.selectEvent}
              />
            </FormGroup>
            <FormGroup>
              <Label for="selectflag">Design Or No Design</Label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                label="Select From Design"
                name="flag_design"
                options={flagOptions}
                value={this.state.flag_design}
                onChange={this.selectFlag}
              />
            </FormGroup>
            {this.state.formdata.flag_design === 1 ? (
              <FormGroup>
                <Label for="selectdesign">Select Design</Label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  label="Select Design"
                  name="t_design_id"
                  options={designOptions(this.state.formdata.t_event_id)}
                  value={this.state.t_design_id}
                  onChange={this.selectDesign}
                />
              </FormGroup>
            ) : (
              ""
            )}
          </Form>
        </ModalBody>
        <ModalFooter>
          {this.state.alertData.status === true ? (
            <Alert color="danger">{this.state.alertData.message} </Alert>
          ) : (
            ""
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={this.NextHandler}
          >
            Next
          </Button>
          <Button variant="contained" onClick={this.CancelHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

CreatePromotion.propTypes = {
  getEvent: PropTypes.func.isRequired,
  getDesign: PropTypes.func.isRequired,
  getDesignByCode: PropTypes.func.isRequired,
  ambil: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  ambil: state.promot
});

export default connect(
  mapStateToProps,
  { getEvent, getDesign, getDesignByCode }
)(CreatePromotion);
