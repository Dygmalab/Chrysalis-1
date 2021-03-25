// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from "react";
import { Redirect } from "react-router";
import Focus from "../../api/focus";
import i18n from "../i18n";

class Welcome extends React.Component {
  reconnect = async () => {
    const focus = new Focus();
    const device = {
      path: focus._port.path,
      device: focus.device,
    };

    try {
      await this.props.onConnect(device);
    } catch (err) {
      this.props.enqueueSnackbar(err.toString(), { variant: "error" });
    }
  };

  render() {
    const focus = new Focus();
    let device = "";
    try {
      device = this.props.device.device || focus.device;
    } catch {
      return <Redirect to="/" />;
    }

    const reconnectButton = focus._port && (
      <button color="secondary" onClick={this.reconnect}>
        {i18n.welcome.reconnect}
      </button>
    );
    const reconnectText = focus._port && (
      <p component="p" gutterBottom>
        {i18n.formatString(
          i18n.welcome.reconnectDescription,
          i18n.welcome.reconnect
        )}
      </p>
    );

    return (
      <div className="">
        <h2 container={this.props.titleElement}>{i18n.welcome.title}</h2>
        <card className="">
          <div
            avatar={
              "keyboard" //TODO: Use local imported iconset to place keyboard icon for menu
            }
            title={device.info.displayName}
            subheader={focus._port && focus._port.path}
          />
          <div>
            <p component="p" gutterBottom>
              {i18n.formatString(
                i18n.welcome.contents,
                i18n.app.menu.firmwareUpdate
              )}
            </p>
            {reconnectText}
          </div>
          <div>
            {reconnectButton}
            <div className="{classes.grow}" />
            <button
              color="primary"
              variant="outlined"
              onClick={async () => {
                await Redirect("/firmware-update");
              }}
            >
              {i18n.formatString(
                i18n.welcome.gotoUpdate,
                i18n.app.menu.firmwareUpdate
              )}
            </button>
          </div>
        </card>
      </div>
    );
  }
}

export default Welcome;
