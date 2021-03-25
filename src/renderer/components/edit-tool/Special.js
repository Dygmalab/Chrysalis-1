import React, { Component } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

class Move extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layoutName: "move",
    };
  }

  layout = {
    move: ["{disableKey}", "{LedNext} {LedToggle}"],
  };

  display = {
    "{disableKey}": "Disable Key",
    "{LedNext}": "Next Effect",
    "{LedToggle}": "On/Off",
  };

  buttonTheme = [
    {
      class: "Hidden",
      buttons: "/N /S",
    },
    {
      class: "small-button",
      buttons: "/S",
    },
    {
      class: "medium-button",
      buttons: "{L1} {L2} {L3} {L4} {L5} {L6} {L7} {L8} {L9} {L10}",
    },
  ];

  onChange = (input) => {
    console.log("Input changed", input);
  };

  onKeyPress = (button) => {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  };

  handleShift = () => {
    const layoutName = this.state.layoutName;

    this.setState({
      layoutName: layoutName === "move" ? "shift" : "move",
    });
  };

  render() {
    return (
      <Keyboard
        baseClass="Special"
        keyboardRef={(r) => (this.moveKeyboard = r)}
        onChange={this.onChange}
        onKeyPress={this.onKeyPress}
        theme="hg-theme-default hg-layout-default myTheme"
        layoutName={this.state.layoutName}
        layout={this.layout}
        mergeDisplay
        display={this.display}
        buttonTheme={this.buttonTheme}
      />
    );
  }
}

export default Move;
