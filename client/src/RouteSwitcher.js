import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PropTypes from "prop-types";
// Pages Components
import Dashboard from "./Dashboard";
import ListCompany from "./components/content/company/CompanyList";
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
import TsouvenirList from "./components/content/tsouvenir/TSouvenirList";
import TsouveniritemList from "./components/content/tsouveniritem/TSouvenirRequestList";
import ListMenu from "./components/content/menu/MenuList";
import ListPromotion from "./components/content/promotion/ListPromotion";
import addPromotionND from "./components/content/promotion/addPromotionND";
import addPromotionD from "./components/content/promotion/addPromotionD";
import editPromotionD from "./components/content/promotion/editPromotionD";
import editPromotionND from "./components/content/promotion/editPromotionND";
import ViewPromotion from "./components/content/promotion/viewPromotion/viewPromotion";
import ListUser from "./components/content/users/ListUser";
import { getListAccess } from "./actions/accessMenuActions";

class RouteSwitcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataAccess: []
    };
  }
  componentDidMount() {
    if (this.props.data.user.m_role_id !== undefined) {
      this.props.getListAccess(this.props.data.user.m_role_id);
    }
  }
  componentWillReceiveProps(propsData) {
    this.setState({
      dataAccess: propsData.theAccessData.dataAccess
    });
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
      case "/promotion":
        return ListPromotion;
      case "/user":
        return ListUser;
      default:
        return Dashboard;
    }
  };

  render() {
    return (
      <Switch>
        <PrivateRoute path={"/dashboard"} component={Dashboard} />
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
          } else if (content === "/promotion") {
            return (
              <Switch>
                <PrivateRoute
                  path={content}
                  component={this.func(this.state.dataAccess[index])}
                />
                <PrivateRoute path="/addpromot-nd" component={addPromotionND} />
                <PrivateRoute path="/addpromot-d" component={addPromotionD} />
                <PrivateRoute path="/editpromot-d" component={editPromotionD} />
                <PrivateRoute
                  path="/editpromot-nd"
                  component={editPromotionND}
                />
                <PrivateRoute
                  path="/viewpromotion/:flag/:code/:design"
                  component={ViewPromotion}
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
  data: PropTypes.object.isRequired,
  getListAccess: PropTypes.func.isRequired,
  theAccessData: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.auth,
  theAccessData: state.accessMenuData
});

export default connect(
  mapStateToProps,
  { getListAccess }
)(RouteSwitcher);
