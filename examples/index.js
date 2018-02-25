import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { Basic } from "./basic/basic";
import { Relative } from "./relative/relative";
import { Stacked } from "./stacked/stacked";
import styles from "./styles";

ReactDOM.render(
  <Router>
    <div>
      <style>{styles}</style>
      <div className="header">
        <Link to="/basic">Basic</Link> <Link to="/relative">Relative</Link>{" "}
        <Link to="/stacked">Stacked</Link>
      </div>
      <Route exact path="/" render={() => <Redirect to="/basic" />} />
      <Route path="/basic" component={Basic} />
      <Route path="/relative" component={Relative} />
      <Route path="/stacked" component={Stacked} />
    </div>
  </Router>,
  document.querySelector("#mount")
);
