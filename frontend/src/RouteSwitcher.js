import React from "react";
import { connect } from "react-redux";
import { Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PropTypes from "prop-types";
import { getListAccess } from "./actions/accessMenuActions";
// import listUser from "./content/user/listUser";
import listPromotion from "./components/content/promotion/listPromotion";
import listRole from "./components/content/role/listRole";
import listAccess from "./components/content/accessMenu/listAccess";
import Dashboard from "./Dashboard";
import Login from "./components/content/users/Login";
import DesignAdd from "./components/content/design/DesignAdd";
import DesignList from "./components/content/design/DesignList";
import DesignView from "./components/content/design/DesignView";
import DesignEdit from "./components/content/design/DesignEdit";
import SouvenirList from "./components/content/souvenir/SouvenirList";
import UnitList from "./components/content/unit/UnitList";
import EmployeeList from "./components/content/employee/ListEmployee";
import addPromotionND from "./components/content/promotion/addPromotionND";
import addPromotionD from "./components/content/promotion/addPromotionD";
import editPromotionD from "./components/content/promotion/editPromotionD";
import editPromotionND from "./components/content/promotion/editPromotionND";
import { ContactPhoneSharp } from "@material-ui/icons";

class RouteSwitcher extends React.Component {
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
  func = inp => {
    if (inp === "/role") {
      return listRole;
    } else if (inp === "/accessmenu") {
      return listAccess;
    } else if (inp === "/design") {
      return DesignList;
    } else if (inp === "/promotion") {
      return listPromotion;
    }
  };

  render() {
    return (
      <Switch>
        <PrivateRoute path="/dashboard" component={Dashboard} />
        {this.state.dataAccess.map((content, index) => {
          if (content === "/promotion") {
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
              </Switch>
            );
          }
          //silahkan ditambahkan dg format dibawah (tinggal diganti path dan komponen) jika satu path dapat mempengaruhi path lain
          // else if(content === '/design'){
          //   return(
          //     <Switch>
          //       <PrivateRoute
          //         path={content}
          //         component={this.func(this.state.dataAccess[index])}
          //       />
          //       <PrivateRoute path="/addpromot-nd" component={addPromotionND} />
          //       <PrivateRoute path="/addpromot-d" component={addPromotionD} />
          //       <PrivateRoute path="/editpromot-d" component={editPromotionD} />
          //       <PrivateRoute
          //         path="/editpromot-nd"
          //         component={editPromotionND}
          //       />
          //     </Switch>
          //   )
          // }
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
