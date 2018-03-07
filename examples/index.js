import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Redirect } from "react-router-dom";
import { Basic } from "./basic/basic";
import { Relative } from "./relative/relative";
import { Stacked } from "./stacked/stacked";
import { Navbar } from "./navbar";
import styles from "./styles";

ReactDOM.render(
  <Router>
    <div className="app">
      <style>{styles}</style>
      <Navbar />
      <div className="examples">
        <Route exact path="/" render={() => <Redirect to="/basic" />} />
        <Route path="/basic" component={Basic} />
        <Route path="/relative" component={Relative} />
        <Route path="/stacked" component={Stacked} />
      </div>
    </div>
  </Router>,
  document.querySelector("#mount")
);
