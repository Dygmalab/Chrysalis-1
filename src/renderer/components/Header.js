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

import React, { Component } from "react";

import MainMenu from "./MainMenu/MainMenu";
class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mainMenu: true
    };
  }

  closeMainMenu() {
    this.setState({ mainMenu: false });
  }

  render() {
    const { connected, pages, theme } = this.props;
    const { mainMenu } = this.state;

    return (
      <MainMenu
        connected={connected}
        pages={pages}
        open={mainMenu}
        closeMenu={this.closeMainMenu}
        themeDark={theme}
      />
    );
  }
}

export default Header;
