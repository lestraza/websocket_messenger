import React from "react";
import "./style.css";
import ChatList from "./components/ChatList";
import Dialog from "./components/Dialog";

export default class App extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <div className="header"></div>
        <div className="main"></div>
        <div className="app_container">
          <ChatList />
          <Dialog />
        </div>
      </div>
    );
  }
}
