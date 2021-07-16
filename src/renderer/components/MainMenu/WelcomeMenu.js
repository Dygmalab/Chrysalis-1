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

import React, { Fragment } from "react";

import { MdAccountCircle } from "react-icons/md";

export default function WelcomeMenu({
  selected,
  userMenu,
  onClick,
  drawerWidth
}) {
  return (
    <div onClick={onClick} className={"item-list"}>
      <div className="icon-item">
        <MdAccountCircle className={"icon-image"} />
      </div>
      {drawerWidth === "auto" ? (
        <div className="icon-text">
          <p className="primary">{userMenu}</p>
        </div>
      ) : (
        <Fragment></Fragment>
      )}
    </div>
  );
}
