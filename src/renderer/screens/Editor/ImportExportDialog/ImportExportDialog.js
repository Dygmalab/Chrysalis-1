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

import React, { useState } from 'react';

import i18n from '../../../i18n';
import LoadDefaultKeymap from './LoadDefaultKeymap';
const { remote } = require('electron');
const { clipboard } = remote.require('electron');
const fs = remote.require('fs');

// eslint-disable-next-line import/prefer-default-export
export const ImportExportDialog = (props) => {
  const { toCloseImportExportDialog } = props;

  const [dataState, setData] = useState();

  /**
   * This is Hook that lets add React state "isChange" for change tracking in this dialog
   * @param {boolean} [initialState=false] - Sets initial state for "isChange"
   */
  const [isChange, setIsChange] = useState(false);

  const data =
    dataState !== undefined
      ? dataState
      : JSON.stringify(
          {
            keymap: props.keymap,
            colormap: props.colormap,
            palette: props.palette,
          },
          null,
          2
        );

  function onConfirm() {
    try {
      isChange
        ? props.onConfirm(JSON.parse(data))
        : toCloseImportExportDialog();
      setData(undefined);
      setIsChange(false);
    } catch (e) {
      props.enqueueSnackbar(e.toString(), { variant: 'error' });
    }
  }

  function onCancel() {
    setData(undefined);
    setIsChange(false);
    props.onCancel();
  }

  function copyToClipboard(Cdata) {
    clipboard.writeText(Cdata);
    setIsChange(false);
    props.enqueueSnackbar(i18n.editor.copySuccess, {
      variant: 'success',
      autoHideDuration: 2000,
    });
  }

  function pasteFromClipboard() {
    setData(clipboard.readText());
    setIsChange(true);
    props.enqueueSnackbar(i18n.editor.pasteSuccess, {
      variant: 'success',
      autoHideDuration: 2000,
    });
  }

  function loadDefault(path) {
    fs.readFile(path, 'utf-8', (err, layoutData) => {
      if (err) {
        props.enqueueSnackbar(i18n.editor.pasteSuccess, {
          variant: 'error',
          autoHideDuration: 2000,
        });
      }
      setData(layoutData);
    });
  }

  return (
    <dialog
      disableBackdropClick
      open={props.open}
      onClose={onCancel}
      fullScreen
    >
      <dialogTitle>{i18n.editor.importExport}</dialogTitle>
      <dialogContent>
        <typography variant="body1">
          {i18n.editor.importExportDescription}
        </typography>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <LoadDefaultKeymap loadDefault={loadDefault} />
          <div>
            <button color="primary" onClick={() => copyToClipboard(data)}>
              {i18n.editor.copyToClipboard}
            </button>
            <button color="primary" onClick={pasteFromClipboard}>
              {i18n.editor.pasteFromClipboard}
            </button>
          </div>
        </div>
        <textField
          disabled={props.isReadOnly}
          multiline
          fullWidth
          value={data}
          onChange={(event) => {
            setData(event.target.value);
            setIsChange(true);
          }}
          variant="outlined"
          margin="normal"
        />
      </dialogContent>
      <dialogActions>
        <button color="primary" onClick={onCancel}>
          Cancel
        </button>
        <button color="primary" onClick={onConfirm}>
          Ok
        </button>
      </dialogActions>
    </dialog>
  );
};
