import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { TextInput, StyleSheet } from 'react-native';
import './Home.css';
// const tf = require('@tensorflow/tfjs');

const PAD_INDEX = 0;
const OOV_INDEX = 2;


class ConnectedHome extends Component {
  constructor(props){
    super(props);

    this.state = {
      tweet: "",
      response: {},
    };
  }

  int1 = null

  loadFbLoginApi() {
    window.fbAsyncInit = function() {
        FB.init({
            appId      : "379391010095563",
            cookie     : true,  // enable cookies to allow the server to access
            // the session
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.5' // use version 2.1
        });
    };

    console.log("Loading fb api");
      // Load the SDK asynchronously
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  testAPI() {
    FB.api(
      '/101691908394361/feed',
      'POST',
      {
        "message":"Twitter is down but we wont be silenced #endsars",
        "access_token": "EAAFZADdpjQcsBAOkAAEndWzeRZC3gcZBAS2XCytRASfuUyf5WEP0jEJUcd2VjA6iGhRIHFJsApTNg4T2OZCVzqJ831qipnrDwpd777s0ZCDzMOOga8l9ITbVn1GRTrO30i0m0hsCgM0YwC6P4ArtSFqCLVvuHEdMbLYn76pSq72p0OWphsoZBcUYJwyZA8f3s8Ea07bvHNQSFmWBDZBH3XhH",
      },
      function(response) {
        console.log('response', response);
        document.getElementById('status').innerHTML = response.id + '!';
      }
    );
  }

  statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      this.testAPI();
    } else if (response.status === 'not_authorized') {
        console.log("Please log into this app.");
    } else {
        console.log("Please log into this facebook.");
    }
  }

  checkLoginState() {
    FB.getLoginStatus(function(response) {
      this.statusChangeCallback(response);
    }.bind(this));
  }

  handleFBLogin = () => {
    FB.login(this.checkLoginState());
  }

  componentDidMount(){
    this.loadFbLoginApi()

    this.int1 = setInterval(()=>{
      this.propagateTwitter()
    },1800000)
  }

  componentWillUnmount(){
    clearInterval(this.int1)
  }

  propagateTwitter = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    var keywords = this.state.tweet.trim().split(",")

    var i = 0
    const x = setInterval(function() {
      console.log("keywords[i]", keywords[i])
      i++
      if(i < keywords.length){
        fetch(`https://46hmbtrvr5.execute-api.us-east-1.amazonaws.com/default/naijayouth?tweet=${keywords[i]}`, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result)
          this.setState({response: result})
        })
        .catch(error => console.log('error', error));
      }else{
        clearInterval(x)
      }
    }, 10000)
  }

  render() {
    return (
      // <div>
      //   <div id="status"></div>
      //   <Button
      //       className = "btn-facebook"
      //       id         = "btn-social-login"
      //       onClick = {this.handleFBLogin}
      //       >
      //           <span className="fa fa-facebook"></span> Sign in with Facebook
      //   </Button>
      // </div>

      <div className="Home-container">
        <TextInput
          className="Home-textInput"
          value={this.state.tweet}
          placeholder={"enter tweet..."}
          maxLength={230}
          multiline
          onChangeText={(tweet) => this.setState({tweet})}
        />
        <Button
          onClick={this.propagateTwitter}
          variant="outlined"
          color="primary"
        >
          Submit
        </Button>
          {" "}
          {" "}
          {
            this.state.tweet.length > 0 ? (
              <div>Tweets posted: {this.state.tweet}</div>
            ):(
              <div></div>
            )
          }
          {" "}
          {
            this.state.response.length > 0 ? (
              <div>
                Tweets Retrieved:
                <div>
                  <pre>
                    {JSON.stringify(this.state.response, null, 4) }
                  </pre>
                </div>
              </div>
            ):(<div></div>)
          }
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

const Home = withRouter(connect(mapStateToProps)(ConnectedHome));
export default Home;
