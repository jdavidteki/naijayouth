import React, { Component } from "react";
import { setLoggedInUser } from "../../Redux/Actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Person from "@material-ui/icons/PersonOutline";
import Auth from "../../Auth";
import {
  logout,
} from "../../Redux/Actions";
import './Header.css';

// TODO:when people Search,it should return cloeset 5 vendors to thier current location
class ConnectedHeader extends Component {
  state = {
    anchorEl: null
  };

  componentDidMount(){
    let user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (user != null){
      this.props.dispatch(setLoggedInUser({ name: user.name, uid: user.uid, email: user.email }));
    }
  }

  render() {
    let { anchorEl } = this.state;
    
    return (
      <div className="Header">
          <div style={{ fontWeight: 900 }} >naijayouth</div>
          <div className="right-part">
            <Avatar
              onClick={event => {
                this.setState({ anchorEl: event.currentTarget });
              }}
              style={{ backgroundColor: "#3f51b5", marginRight: 10, cursor: "pointer", objectFit: "inherit"}}
            >
              <Person />
            </Avatar>
          </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
    someoneLoggedIn: state.someoneLoggedIn,
  };
};

const Header = withRouter(connect(mapStateToProps)(ConnectedHeader));
export default Header;