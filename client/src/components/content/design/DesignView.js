import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getProduct,
  getDesign,
  getItems,
  getRequester,
  getStaff,
  getAssignToName,
  getEvent
} from "../../../actions/designAction";
// Design Components
import DesignApprove from "./DesignApprove";
import DesignClose from "./DesignClose";
import DesignRead from "./DesignRead";
// Form Components
import Spinner from "../../common/Spinner";
import DeniedPage from "../../common/DeniedPage";
// Form Validation
import isEmpty from "../../../validation/isEmpty";

class DesignView extends Component {
  componentDidMount() {
    if (this.props.match.params.code) {
      const code = this.props.match.params.code;
      this.props.getDesign(code);
      this.props.getItems(code);
    }
    this.props.getAssignToName();
    this.props.getProduct();
    this.props.getRequester();
    this.props.getStaff();
    this.props.getEvent();
  }

  // Function to Get Page Title
  pageTitle(status) {
    switch (status) {
      case 0:
        return "Rejected Design Request";
      case 1:
        return "Approve Design Request";
      case 2:
        return "Close Design Request";
      default:
        return "Done Design Request";
    }
  }

  render() {
    const { code } = this.props.match.params;
    const {
      design,
      requester,
      product,
      items,
      assign,
      staff,
      event
    } = this.props.design;
    const { m_employee_id, m_role_id } = this.props.user;

    if (
      isEmpty(design) &&
      isEmpty(items) &&
      isEmpty(requester) &&
      isEmpty(product) &&
      isEmpty(assign) &&
      isEmpty(staff) &&
      isEmpty(event)
    ) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Spinner />
            </div>
          </div>
        </div>
      );
    } else {
      if (design.status === 1) {
        if (m_role_id !== "RO0001") {
          return (
            <DesignRead
              code={code}
              design={design}
              items={items}
              employee={assign}
              product={product}
              requester={requester}
            />
          );
        } else {
          // Admin Role Can Only Approve Design Request
          return (
            <DesignApprove
              title={this.pageTitle(design.status)}
              code={code}
              design={design}
              items={items}
              employee={assign}
              product={product}
              staff={staff}
              requester={requester}
            />
          );
        }
      } else if (design.status === 2) {
        if (m_role_id === "RO0001") {
          // Admin Role Can Only Read Design Request
          return (
            <DesignRead
              code={code}
              design={design}
              items={items}
              employee={assign}
              product={product}
              requester={requester}
            />
          );
        } else if (design.assign_to !== m_employee_id) {
          return <DeniedPage />;
        } else {
          return (
            <DesignClose
              title={this.pageTitle(design.status)}
              code={code}
              design={design}
              items={items}
              employee={assign}
              product={product}
              staff={staff}
              requester={requester}
            />
          );
        }
      } else {
        return (
          <DesignRead
            code={code}
            design={design}
            items={items}
            employee={assign}
            product={product}
            requester={requester}
          />
        );
      }
    }
  }
}

DesignView.propTypes = {
  design: PropTypes.object.isRequired,
  getDesign: PropTypes.func.isRequired,
  getItems: PropTypes.func.isRequired,
  getProduct: PropTypes.func.isRequired,
  getRequester: PropTypes.func.isRequired,
  getAssignToName: PropTypes.func.isRequired,
  getStaff: PropTypes.func.isRequired,
  getEvent: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  design: state.design,
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  {
    getProduct,
    getDesign,
    getItems,
    getRequester,
    getAssignToName,
    getStaff,
    getEvent
  }
)(DesignView);
