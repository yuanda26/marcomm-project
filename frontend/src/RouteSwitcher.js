import React from "react";
import { connect } from "react-redux";
import { Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PropTypes from "prop-types";
import apiconfig from "./config/Host_Config";
// import listUser from "./content/user/listUser";
import axios from "axios";
// import listPromotion from "./content/promotion/listPromotion";
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
// import addPromotionND from "./content/promotion/addPromotionND";
// import addPromotionD from "./content/promotion/addPromotionD";
// import editPromotionD from "./content/promotion/editPromotionD";
// import editPromotionND from "./content/promotion/editPromotionND";

class RouteSwitcher extends React.Component {
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
      let option = {
        url: apiconfig.host + "/access" + "/" + theRole,
        method: "get",
        headers: {
          Authorization: localStorage.token
        }
      };
      console.log(option.headers.Authorization);
      axios(option)
        .then(response => {
          console.log(response.data.message);
          this.setState({
            dataAccess: response.data.message.map(content => {
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
  func = inp => {
    if (inp == "/role") {
      return listRole;
    } else if (inp == "/accessmenu") {
      return listAccess;
    } else if (inp == "/design") {
      return DesignList;
    }
  };

  render() {
    return (
      <Switch>
        <PrivateRoute path="/dashboard" component={Dashboard} />
        {this.state.dataAccess.map((content, index) => {
          // if (content == "/promotion") {
          //   return (
          //     <Switch>
          //       <PrivateRoute
          //         path={content}
          //         component={this.func(this.state.dataAccess[index])}
          //       />
          //       {/* <PrivateRoute
          //         path="/addpromot-nd"
          //         component={addPromotionND}
          //       />
          //       <PrivateRoute path="/addpromot-d" component={addPromotionD} />
          //       <PrivateRoute
          //         path="/editpromot-d"
          //         component={editPromotionD}
          //       />
          //       <PrivateRoute
          //         path="/editpromot-nd"
          //         component={editPromotionND}
          //       /> */}
          //     </Switch>
          //   );
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
  data: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  data: state.auth
});
export default connect(mapStateToProps)(RouteSwitcher);
