import React, { Component } from "react";
import Header from "./Components/Header/Header.js";
import Home from "./Components/Home/Home.js";
import Footer from "./Components/Footer/Footer.js";
import { StyleSheet } from 'react-native';
import { Switch, Route } from "react-router-dom";

import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <div className="content">
            <Switch>
              <Route path="/naijayouth" exact component={Home} />
              <Route
                component={() => (
                  <div style={{ padding: 20 }}>Page not found</div>
                )}
              />
            </Switch>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

