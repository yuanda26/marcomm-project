import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PropTypes from "prop-types";
import HostConfig from "./config/Host_Config";
import axios from "axios";
// Pages Components
import Dashboard from "./Dashboard";
import ListCompany from "./components/content/company/ReadCompany";
import ListRole from "./components/content/role/listRole";
import ListAccess from "./components/content/accessMenu/ListAccess";
import SouvenirList from "./components/content/souvenir/SouvenirList";
import UnitList from "./components/content/unit/UnitList";
import ListEmployee from "./components/content/employee/ListEmployee";
import ListEvent from "./components/content/event/ListEvent";
import DesignAdd from "./components/content/design/DesignAdd";
import DesignList from "./components/content/design/DesignList";
import DesignView from "./components/content/design/DesignView";
import DesignEdit from "./components/content/design/DesignEdit";
import TsouvenirList from "./components/content/tsouvenir/ReadTsouvenir";
import TsouveniritemList from "./components/content/tsouveniritem/ReadTSouvenirRequest";
import ListMenu from "./components/content/menu/ReadMenu";

class RouteSwitcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataAccess: [],
      the: [],
      side: []
    };
  }

  getListAccess = () => {
    let theRole = this.props.data.user.m_role_id;
    if (theRole !== undefined) {
      axios({
        url: `${HostConfig.host}/access/${theRole}`,
        method: "get",
        headers: {
          Authorization: localStorage.token
        }
      })
        .then(res => {
          this.setState({
            dataAccess: res.data.message.map(content => {
              return content.controller;
            })
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  componentDidMount() {
    this.getListAccess();
  }

  func = url => {
    switch (url) {
      case "/dashboard":
        return Dashboard;
      case "/company":
        return ListCompany;
      case "/design":
        return DesignList;
      case "/souvenir":
        return SouvenirList;
      case "/event":
        return ListEvent;
      case "/unit":
        return UnitList;
      case "/role":
        return ListRole;
      case "/accessmenu":
        return ListAccess;
      case "/menu":
        return ListMenu;
      case "/employee":
        return ListEmployee;
      case "/tsouvenir":
        return TsouvenirList;
      case "/tsouveniritem":
        return TsouveniritemList;

      default:
        return Dashboard;
    }
  };

  render() {
    return (
      <Switch>
        {/* Private Route with Access Control  */}
        {this.state.dataAccess.map((content, index) => {
          if (content === "/design") {
            return (
              <Switch>
                <PrivateRoute
                  exact
                  path={content}
                  component={this.func(this.state.dataAccess[index])}
                />
                <PrivateRoute exact path="/design/add" component={DesignAdd} />
                <PrivateRoute
                  exact
                  path="/design/view/:code"
                  component={DesignView}
                />
                <PrivateRoute
                  exact
                  path="/design/edit/:code"
                  component={DesignEdit}
                />
              </Switch>
            );
          }
          return (
            <PrivateRoute
              path={content}
              component={this.func(this.state.dataAccess[index])}
            />
          );
        })}
      </Switch>
    );
  }
}

RouteSwitcher.propTypes = {
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.auth
});

export default connect(mapStateToProps)(RouteSwitcher);
