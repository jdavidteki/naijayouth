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
  }

  propagateTwitter = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    var endsars = ''
    if (this.state.tweet.toLowerCase().includes("#endsars") == false) {
      endsars = " #EndSars"
    }
    
    fetch(`https://46hmbtrvr5.execute-api.us-east-1.amazonaws.com/default/naijayouth?tweet=${this.state.tweet}${endsars}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
        this.setState({response: result})
      })
      .catch(error => console.log('error', error));
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
          maxLength={130}
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

//RESOURCES
//  https://observablehq.com/@jashkenas/sentiment-analysis-with-tensorflow-js
//  https://bensonruan.com/twitter-sentiment-analysis-with-tensorflowjs/
//  https://github.com/bensonruan/Sentiment-Analysis
//  twitter & instagram usename: jesuyedd@gmail.com password: naijayouth2020
// AIzaSyDw1hEgFIlAKsoJDLzhCwvbGwStCYZuvmY
//https://scaleserp.com/
// curl https://en.wikipedia.org/wiki/Eberechi_Wike

//FACEBOOK ACCESSTOKEN
// {"access_token":"379391010095563|LLjXfOQXCRGm5qUCU2bqO9DUBUo","token_type":"bearer"}


//GraphAPI INTERFACE
//https://developers.facebook.com/tools/explorer/?method=GET&path=me%3Ffields%3Did%2Cname&version=v8.0


//facebook page id -- 101691908394361


// FB.api(
//   '/101691908394361/feed',
//   'POST',
//   {"message":"awesome"},
//   function(response) {
//       // Insert your code here
//   }
// );

//graphapiid - 379391010095563
//graphapisecretkey - 379391010095563


//PRTEAMS
//twitter API Keys 
// api keys - Tf8D7ytOYqqxcJtmA6SUS4CPB
// api secrets - n72tXOl7tb3rgWBDfPKDW75elW0qerpwvKseqhYfCVCMKITLLC

// bearer tokens - AAAAAAAAAAAAAAAAAAAAAFy%2BJQEAAAAAHkCos35zjt3StBWnB27b2F7wrE8%3DSxpmL1gP5bVQdqb23p1sACXTiB11iRWlEbbksNffa7dka4S2oI

// access token - 1316251270483791872-HMMmtn3HKCuYJdsPJfmpC69sT9WJw2
// access token secret - 9se6hOh9aXe5SsM2rdvIBXYk1XzvtyKSOh9jglsPn01kp


//NAIJAYOUTH
//api keys -  GBcpYu4bs4aYyAHskronTMpsr
//api secret - JNUbdTP2iP31qzFdfM5tUDvieSSopxyDRw35CWrfdiQDYwTTXV
//bearer token - AAAAAAAAAAAAAAAAAAAAAJZXJgEAAAAA0XNKfMSrbl47zjMDU3UEZvlqMx4%3DF7H1zKSd2k4n8aSZ9dyIS9WMyWmqakB1eFzmK1M6h3EGL1uJz6
//access toke - 1316332404177592321-XcJK7PcWUMVXnWxbcAPF3otbjxc6E5
//access token secret - wLfL5tyKW9XPen76r38v6PwSWp0TXYdXQnk7N3edoUBp8

//https://developer.twitter.com/en/portal/dashboard
//https://documenter.getpostman.com/view/9956214/T1LMiT5U