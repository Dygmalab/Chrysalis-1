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

import React, { useState } from "react";

import i18n from "../../i18n";

const CopyFromDialog = (props) => {
  const [selectedLayer, setSelectedLayer] = useState(-1);
  return (
    <dialog
      disableBackdropClick
      open={props.open}
      onClose={props.onCancel}
      fullWidth
    >
      <dialogTitle>{i18n.editor.copyFrom}</dialogTitle>
      <dialogContent>
        <typography variant="body1" gutterBottom>
          {i18n.editor.pleaseSelectLayer}
        </typography>
        <list>
          {props.layers.map((layer) => {
            return (
              <listItem
                key={layer.index}
                button
                disabled={layer.index === props.currentLayer}
                selected={layer.index === selectedLayer}
                onClick={() => {
                  setSelectedLayer(layer.index);
                }}
              >
                <listItemText inset primary={layer.label} />
              </listItem>
            );
          })}
        </list>
      </dialogContent>
      <dialogActions>
        <button
          color="primary"
          onClick={() => {
            setSelectedLayer(-1);
            props.onCancel();
          }}
        >
          {i18n.dialog.cancel}
        </button>
        <button
          onClick={() => {
            const layer = selectedLayer;
            setSelectedLayer(-1);
            props.onCopy(layer);
          }}
          color="primary"
          disabled={selectedLayer === -1}
        >
          {i18n.dialog.ok}
        </button>
      </dialogActions>
    </dialog>
  );
};

export default CopyFromDialog;
