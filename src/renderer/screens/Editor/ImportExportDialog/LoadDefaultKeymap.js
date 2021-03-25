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

import React, { useState, Fragment } from 'react';

import Focus from '../../../../api/focus';

import i18n from '../../../i18n';
const { remote } = require('electron');
let fs = remote.require('fs');
let path = remote.require('path');

export default function LoadDefaultKeymap({ loadDefault }) {
  const focus = new Focus();
  const [device] = useState(focus.device);

  const { vendor, product } = device.info;
  const cVendor = vendor.replace('/', '');
  const cProduct = product.replace('/', '');
  const layoutPath = (layout) =>
    // eslint-disable-next-line no-undef
    path.join(__dirname, cVendor, cProduct, `${layout}.json`);

  const defaultLayouts = ['Qwerty', 'Dvorak', 'Colemak'];
  const deviceLayouts = [];

  defaultLayouts.map((layout) => {
    const lpath = layoutPath(layout);
    try {
      fs.accessSync(lpath);
      deviceLayouts.push({ name: layout, lpath });
    } catch (err) {
      console.log(`${vendor} ${layout} does not exist`);
    }
    return 0;
  });

  return (
    <div style={{ display: 'flex' }}>
      {deviceLayouts.length > 0 && (
        <Fragment>
          <h3>{i18n.editor.loadDefault}</h3>
          {deviceLayouts.map(({ name, dpath }, i) => (
            <button
              key={name + i}
              color="primary"
              onClick={() => loadDefault(dpath)}
            >
              {name}
            </button>
          ))}
        </Fragment>
      )}
    </div>
  );
}
