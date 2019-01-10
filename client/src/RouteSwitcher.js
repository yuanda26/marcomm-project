import React, { Component, Fragment } from "react";
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
import DesignClose from "./components/content/design/DesignClose";
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
import ListProduct from "./components/content/product/listProduct";
// Actions
import { getListAccess } from "./actions/accessMenuActions";
import ApprovalPromotionD from "./components/content/promotion/ApprovalPromotionD";
import ApprovalPromotionND from "./components/content/promotion/ApprovalPromotionND";
import ClosePromotionD from "./components/content/promotion/ClosePromotionD";
import ClosePromotionND from "./components/content/promotion/ClosePromotionND";

class RouteSwitcher extends Component {
  state = {
    dataAccess: []
  };

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
      case "/product":
        return ListProduct;
      default:
        return Dashboard;
    }
  };

  render() {
    return (
      <Fragment>
        {/* General Routes */}
        <Switch>
          <PrivateRoute path={"/dashboard"} component={Dashboard} />
        </Switch>

        {/* Private Routes with Access Control  */}
        {this.state.dataAccess.map((content, index) => {
          // Routes for Transaction Promotion
          if (content === "/promotion") {
            return (
              <Switch key={index + Date.now()}>
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
                  path="/approvepromot-d"
                  component={ApprovalPromotionD}
                />
                <PrivateRoute
                  path="/approvepromot-nd"
                  component={ApprovalPromotionND}
                />
                <PrivateRoute
                  path="/closepromot-d"
                  component={ClosePromotionD}
                />
                <PrivateRoute
                  path="/closepromot-nd"
                  component={ClosePromotionND}
                />
              </Switch>
            );
          }

          // Routes for Transasction Design
          if (content === "/design") {
            return (
              <Switch key={index + Date.now()}>
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
                <PrivateRoute
                  exact
                  path="/design/close/:code"
                  component={DesignClose}
                />
              </Switch>
            );
          }

          return (
            <Switch key={index + Date.now()}>
              <PrivateRoute
                path={content}
                component={this.func(this.state.dataAccess[index])}
              />
            </Switch>
          );
        })}
      </Fragment>
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
