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
/**
 * This is Reactjs functional component that create button to choose colors from Color Picker
 */
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { SketchPicker } from "react-color";

/**
 * Reactjs functional component that create button to choose colors from Color Picker
 * @param {object} classes Property that sets up CSS classes that adding to HTML elements
 * @param {function} setColorFocusButton Callback function from ColorPalette component
 * @param {object} colorFocusButton Object with keys that defining colors using the Red-green-blue-alpha (RGBA) model for focus button
 * @param {boolean} disabled Property that disable component
 */
function PickerColorButton(props) {
  const { setColorFocusButton, colorFocusButton: color, disabled } = props;

  /**
   * This is Hook that lets add React state "anchorEl" to functional components
   * @param {object} [initialState=null] - Sets initial state for "anchorEl".
   */
  const [anchorEl, setAnchorEl] = useState(null);
  const underGlowButtonOpen = useRef(null);

  /**
   * Change "anchorEl" in functional component state to open Color Picker
   */
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  /**
   * Change "anchorEl" in functional component state to close Color Picker pick color of button
   */
  const handleClose = () => {
    setAnchorEl(null);
  };
  // / Set the value to open (close) Popover element
  const open = Boolean(anchorEl);
  return (
    <tooltip placement="top" title={props.children}>
      <div className="">
        <rootRef rootRef={underGlowButtonOpen}>
          <fab
            color="primary"
            className=""
            onClick={handleClick}
            disabled={disabled}
          >
            <paletteIcon className="" />
          </fab>
        </rootRef>
        <popover
          id="simple-popover"
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <SketchPicker
            color={color}
            onChange={(lcolor) => {
              setColorFocusButton(lcolor.rgb);
            }}
          />
        </popover>
      </div>
    </tooltip>
  );
}

PickerColorButton.propTypes = {
  setColorFocusButton: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default PickerColorButton;
