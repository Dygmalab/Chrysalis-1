// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2019  DygmaLab SE
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
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const styleDisabled = {
  background: "#e0e0e0",
  pointerEvents: "none",
  cursor: "default",
  color: "#797979",
};

const styleDisabledDark = {
  pointerEvents: "none",
  cursor: "default",
  color: "rgba(255, 255, 255, 0.3)",
  backgroundColor: "rgba(255, 255, 255, 0.12)",
};

/**
 * This is Reactjs functional component that create button for change color of all undeglow elements
 * @param {object} classes Property that sets up CSS classes that adding to HTML elements
 * @param {boolean} colorFocusButton Set color for UndeglowColorButton if any color button in palette is selected
 * @param {function} indexFocusButton Numder of selected color button in palette from 0 to 15, is not selected - null
 * @param {number} theme To use theme object from Material UI
 * @param {object} toChangeAllUnderglowsColor Callback function from Editor component. Parameter is index of color palette from 0 to 15
 * @param {boolean} disabled Property that disable component
 */

function BackLightButton(props) {
  const {
    colorFocusButton,
    toChangeAllKeysColor,
    disabled,
    indexFocusButton,
    darkMode,
  } = props;

  const minWhiteColorValue = 140;
  const isWhiteColor =
    colorFocusButton.r >= minWhiteColorValue &&
    colorFocusButton.g >= minWhiteColorValue &&
    colorFocusButton.b >= minWhiteColorValue;
  const style = {
    background: `rgb(${colorFocusButton.r}, ${colorFocusButton.g}, ${colorFocusButton.b})`,
    color: !isWhiteColor ? "white" : "black",
  };
  const enable = {
    pointerEvents: "auto",
    cursor: "pointer",
    color: !isWhiteColor ? "white" : "black",
    background: `rgb(${colorFocusButton.r}, ${colorFocusButton.g}, ${colorFocusButton.b})`,
  };
  const [, setBackgroundColor] = useState(enable);
  useEffect(() => {
    return () => setBackgroundColor(style);
  }, [style]);

  return (
    <tooltip placement="top" title={props.children}>
      <div className="">
        <button
          variant="contained"
          className=""
          style={
            (!+indexFocusButton && indexFocusButton !== 0) || disabled
              ? darkMode
                ? styleDisabledDark
                : styleDisabled
              : {}
          }
          onClick={() => {
            toChangeAllKeysColor(indexFocusButton, 0, 69);
            setBackgroundColor(style);
          }}
        >
          BACKLIGHT
        </button>
      </div>
    </tooltip>
  );
}

BackLightButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  toChangeAllKeysColor: PropTypes.func.isRequired,
};

export default BackLightButton;
