import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import url from "../../config/Host_Config";
import PropTypes from "prop-types";
class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      side: [],
      lala: []
    };
  }
  getListMenu() {
    let token = localStorage.token;
    let theRole = this.props.data.user.m_role_id;
    let option = {
      url: url.host + "/access" + "/" + theRole,
      method: "get",
      headers: {
        Authorization: token
      }
    };
    axios(option)
      .then(response => {
        let reg = /^[Tt]/;
        this.setState({
          side: response.data.message.filter(a => !reg.test(a.name)),
          lala: response.data.message.filter(a => reg.test(a.name))
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  componentDidMount() {
    this.getListMenu();
  }
  render() {
    return (
      <nav className="col-md-2 d-none d-md-block bg-light sidebar">
        <div className="sidebar-sticky">
          <h5 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span>Master</span>
            <a
              className="d-flex align-items-center text-muted"
              href="/master"
            />
          </h5>
          {this.state.side.map(row => (
            <ul className="nav flex-column mb-2">
              <li className="nav-item">
                <a className="nav-link" href={row.controller}>
                  {row.name}
                </a>
              </li>
            </ul>
          ))}

          <h5
            className="sidebar-heading d-flex justify-content-between align-items-center
    px-3 mt-4 mb-1 text-muted"
          >
            <span>Transaction</span>
            <a className="d-flex align-items-center text-muted" href="#" />
          </h5>
          {this.state.lala.map(row => (
            <ul className="nav flex-column mb-2">
              <li className="nav-item">
                <a className="nav-link" href={row.controller}>
                  {row.name}
                </a>
              </li>
            </ul>
          ))}
        </div>
      </nav>
    );
  }
}
Sidebar.propTypes = {
  data: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  data: state.auth
});
export default connect(mapStateToProps)(Sidebar);
