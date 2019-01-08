import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getProduct,
  getDesign,
  getItems,
  getRequester,
  getStaff,
  getAssignToName
} from "../../../actions/designAction";
// Design Components
import DesignApprove from "./DesignApprove";
import DesignClose from "./DesignClose";
import DesignRead from "./DesignRead";
// Import Form Components
import Spinner from "../../common/Spinner";

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
      staff
    } = this.props.design;

    if (
      Object.keys(design).length === 0 &&
      items.length === 0 &&
      requester.length === 0 &&
      product.length === 0 &&
      assign.length === 0 &&
      staff.length === 0
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
      } else if (design.status === 2) {
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
      } else {
        return (
          <DesignRead
            title={this.pageTitle(design.status)}
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
  getStaff: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  design: state.design
});

export default connect(
  mapStateToProps,
  { getProduct, getDesign, getItems, getRequester, getAssignToName, getStaff }
)(DesignView);
