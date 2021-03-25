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

import i18n from "../i18n";

const ConfirmationDialog = (props) => {
  return (
    <dialog
      disableBackdropClick
      open={props.open}
      onClose={props.onCancel}
      fullWidth
    >
      <dialogTitle>{props.title}</dialogTitle>
      <typography style={{ padding: "0 24px 20px" }}>{props.text}</typography>
      <dialogActions>
        <button onClick={props.onCancel}>{i18n.dialog.cancel}</button>
        <button onClick={props.onConfirm}>{i18n.dialog.ok}</button>
      </dialogActions>
    </dialog>
  );
};

export { ConfirmationDialog as default };
