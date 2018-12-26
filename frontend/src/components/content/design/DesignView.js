import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getProduct,
  getDesign,
  getItems,
  getRequester,
  getAssignToName
} from "../../../actions/designAction";
import SpinnerTable from "../../common/SpinnerTable";
import TextFieldGroup from "../../common/TextFieldGroup";

class DesignView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      t_event_id: "",
      title_header: "",
      note: "",
      request_by: "",
      request_date: "",
      items: [],
      employee: []
    };
  }

  componentDidMount() {
    if (this.props.match.params.code) {
      const code = this.props.match.params.code;
      this.props.getDesign(code);
      this.props.getItems(code);
    }
    this.props.getProduct();
    this.props.getRequester();
    this.props.getAssignToName();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      items: newProps.design.items,
      code: newProps.design.design.code,
      t_event_id: newProps.design.design.t_event_id,
      title_header: newProps.design.design.title_header,
      request_by: newProps.design.design.request_by,
      request_date: newProps.design.design.request_date,
      note: newProps.design.design.note,
      employee: newProps.design.assign
    });
  }

  getDescription(product_id) {
    let description = "";
    if (product_id !== "") {
      this.props.design.product.forEach(rows => {
        if (rows.code === product_id) {
          description = rows.description;
        }
      });
    }
    return description;
  }

  getProductName(product_id) {
    let name = "";
    if (product_id !== "") {
      this.props.design.product.forEach(rows => {
        if (rows.code === product_id) {
          name = rows.name;
        }
      });
    }
    return name;
  }

  getRequester(request_pic) {
    let name = "";
    if (request_pic !== "") {
      this.props.design.requester.forEach(rows => {
        if (rows.employee_number === request_pic) {
          name = rows.first_name + " " + rows.last_name;
        }
      });
    }
    return name;
  }

  // Get Employee Name
  assignToName(employeeNumber) {
    let employeeName = "";
    if (employeeNumber !== null) {
      this.state.employee.forEach(staff => {
        if (staff.employee_number === employeeNumber) {
          employeeName = staff.first_name + " " + staff.last_name;
        }
      });
    } else {
      employeeName = "-";
    }

    return employeeName;
  }

  render() {
    const { code } = this.props.match.params;
    const { design, requester, product, items, assign } = this.props.design;

    let viewForm;
    if (
      design === null ||
      requester === null ||
      product === null ||
      items === null ||
      assign === null
    ) {
      viewForm = <SpinnerTable />;
    } else {
      viewForm = (
        <React.Fragment>
          {this.state.items.map((item, idx) => (
            <tr key={idx}>
              <td>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="*Select Product"
                    name="m_product_id"
                    value={this.getProductName(item.m_product_id)}
                    disabled={true}
                  />
                </div>
              </td>
              <td>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={this.getDescription(item.m_product_id)}
                    disabled={true}
                  />
                </div>
              </td>
              <td>
                <div className="form-group">
                  <input
                    type="text"
                    name="title_item"
                    value={item.title_item}
                    className="form-control"
                    placeholder="Type Title"
                    disabled={true}
                  />
                </div>
              </td>
              <td>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="*Select PIC"
                    className="form-control"
                    name="request_pic"
                    value={this.getRequester(item.request_pic)}
                    disabled={true}
                  />
                </div>
              </td>
              <td>
                <div className="form-group">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Due Date"
                    name="request_due_date"
                    value={item.request_due_date}
                    disabled={true}
                  />
                </div>
              </td>
              <td>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Start Date"
                    disabled={true}
                  />
                </div>
              </td>
              <td>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="End Date"
                    disabled={true}
                  />
                </div>
              </td>
              <td>
                <div className="form-group">
                  <input
                    type="text"
                    name="note"
                    className="form-control"
                    placeholder="Note"
                    value={item.note}
                    disabled={true}
                  />
                </div>
              </td>
            </tr>
          ))}
        </React.Fragment>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <nav aria-label="breadcrumb mb-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/design">List Design</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  View Design
                </li>
              </ol>
            </nav>
            <div className="card border-info mb-3">
              <div className="card-header lead">
                View Design Request: {this.state.code}
              </div>
              <div className="card-body">
                <Link to="/design">
                  <button className="btn btn-default mb-4 mr-1" type="button">
                    Back
                  </button>
                </Link>
                <Link to={`/design/edit/${code}`}>
                  <button className="btn btn-primary mb-4" type="button">
                    Edit
                  </button>
                </Link>
                <form>
                  <div className="row">
                    <div className="col-md-6">
                      <TextFieldGroup
                        label="*Transaction Code"
                        value={this.state.code}
                        disabled={true}
                      />
                      <TextFieldGroup
                        label="*Event Code"
                        value={this.state.t_event_id}
                        disabled={true}
                      />
                      <TextFieldGroup
                        label="*Design Title"
                        value={this.state.title_header}
                        disabled={true}
                      />
                    </div>
                    <div className="col-md-6">
                      <TextFieldGroup
                        label="*Request By"
                        value={this.assignToName(this.state.request_by)}
                        disabled={true}
                      />
                      <TextFieldGroup
                        label="*Request Date"
                        value={this.state.request_date}
                        disabled={true}
                      />
                      <TextFieldGroup
                        label="Note"
                        value={this.state.note}
                        disabled={true}
                      />
                    </div>
                    <div className="col-md-12 mt-4 form-inline">
                      <table className="table table-responsive mt-2 mb-2">
                        <thead>
                          <tr className="text-center">
                            <td>Product Name</td>
                            <td>Product Description</td>
                            <td>Title</td>
                            <td>Request PIC</td>
                            <td>Due Date</td>
                            <td>Start Date</td>
                            <td>End Date</td>
                            <td>Note</td>
                            <td />
                          </tr>
                        </thead>
                        <tbody>{viewForm}</tbody>
                      </table>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DesignView.propTypes = {
  getDesign: PropTypes.func.isRequired,
  getItems: PropTypes.func.isRequired,
  getProduct: PropTypes.func.isRequired,
  getRequester: PropTypes.func.isRequired,
  getAssignToName: PropTypes.func.isRequired,
  design: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  design: state.design
});

export default connect(
  mapStateToProps,
  { getProduct, getDesign, getItems, getRequester, getAssignToName }
)(DesignView);
