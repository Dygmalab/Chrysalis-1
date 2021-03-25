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

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Styled from 'styled-components';

// Bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

// Icons
import {
  MDLock,
  MdImportExport,
  MdContentCopy,
  MdLayersClear,
  MdSave,
} from 'react-icons/md';

import Keymap, { KeymapDB } from '../../../api/keymap';
import Focus from '../../../api/focus';
// import ColorPalette from "../../components/ColorPalette";
// import KeySelector from "./KeySelector";
import LayerPanel from './LayerPanel';
import ToolBar from '../../components/edit-tool/Toolbar';
import SaveChangesButton from '../../components/SaveChangesButton';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import i18n from '../../i18n';
import ImportExportDialog from './ImportExportDialog';
import CopyFromDialog from './CopyFromDialog';
import undeglowDefaultColors from './initialUndaglowColors';

// New Imports for ML Layers
import { backupLayers, shareLayers } from '../../../firebase/firebase.utils';
import ColorPanel from './ColorPanel';
import { KeyPicker, LayerPicker, MiscPicker } from '../../components/KeyPicker';

const { remote } = require('electron');

const Store = remote.require('electron-store');
const store = new Store();

const Styles = Styled.div`
.keyboard-editor {
  .editor {
    margin-left: 210px;
    margin-right: 210px;
    display: flex;
    justify-content: space-between;

    .raise-editor {
      text-align: center;
      align-self: center;
      padding: unset;
      margin-top: 15px;
      svg {
        height: 57vh;
        max-width: 70vw;
      }
    }
  }
}`;

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLayer: 0,
      currentKeyIndex: -1,
      currentLedIndex: -1,
      modified: false,
      keymap: {
        custom: [],
        default: [],
        onlyCustom: false,
      },
      palette: [],
      colorMap: [],
      clearConfirmationOpen: false,
      copyFromOpen: false,
      importExportDialogOpen: false,
      isMultiSelected: false,
      isColorButtonSelected: false,
      undeglowColors: null,
    };
  }

  componentDidMount() {
    this.scanKeyboard().then(() => {
      const { keymap } = this.state;
      const defLayer =
        this.state.defaultLayer >= 126 ? 0 : this.state.defaultLayer;
      let initialLayer = 0;

      if (!store.get('keymap.showDefaults')) {
        if (defLayer < keymap.default.length) {
          initialLayer = keymap.onlyCustom ? 0 : keymap.default.length;
        }
      }

      this.setState({ currentLayer: initialLayer });
    });
    this.onChangeLanguageLayout();
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (this.props.inContext && !nextProps.inContext) {
      this.scanKeyboard();
      this.setState({ modified: false });
    }
  };

  keymapDB = new KeymapDB();

  undeglowCount = 14;

  /**
   * Bottom menu never hide and automatically select a key at launch and have this shown in the bottom menu
   */
  bottomMenuNeverHide = () => {
    this.setState((state) => ({
      currentKeyIndex: state.currentKeyIndex !== -1 ? state.currentKeyIndex : 0,
      currentLedIndex: state.currentLedIndex !== -1 ? state.currentLedIndex : 0,
      selectedPaletteColor: null,
      isColorButtonSelected: false,
    }));
  };

  bottomMenuNeverHideFromUnderglow = () => {
    this.setState((state) => ({
      currentKeyIndex: state.currentKeyIndex !== -1 ? state.currentKeyIndex : 0,
      currentLedIndex: state.currentLedIndex !== -1 ? state.currentLedIndex : 0,
    }));
  };

  scanKeyboard = async (lang) => {
    const focus = new Focus();
    try {
      /**
       * Create property language to the object 'options', to call KeymapDB in Keymap and modify languagu layout
       */
      if (lang) {
        const deviceLeng = { ...focus.device, language: true };
        focus.commands.keymap = new Keymap(deviceLeng);
        this.keymapDB = focus.commands.keymap.db;
      }

      let defLayer = await focus.command('settings.defaultLayer');
      defLayer = parseInt(defLayer, 10) || 0;

      const keymap = await focus.command('keymap');

      let empty = true;
      for (const layer of keymap.custom) {
        for (const i of layer) {
          if (i.keyCode !== 65535) {
            empty = false;
            break;
          }
        }
      }

      if (empty && !keymap.onlyCustom && keymap.custom.length > 0) {
        console.log('Custom keymap is empty, copying defaults');
        for (let i = 0; i < keymap.default.length; i + 1) {
          keymap.custom[i] = keymap.default[i].slice();
        }
        keymap.onlyCustom = true;
        await focus.command('keymap', keymap);
      }

      const colormap = await focus.command('colormap');
      const palette = colormap.palette.slice();
      const undeglowColors = store.get('undeglowColors');
      this.setState(
        () => {
          if (!undeglowColors) {
            store.set('undeglowColors', undeglowDefaultColors);
            return { undeglowColors: undeglowDefaultColors };
          }
          return { undeglowColors };
        },
        () => {
          palette[this.undeglowCount] = this.state.undeglowColors[
            this.state.currentLayer
          ];
          this.setState({
            defaultLayer: defLayer,
            keymap,
            palette,
            colorMap: colormap.colorMap,
          });
        }
      );
      this.bottomMenuNeverHide();
    } catch (e) {
      // this.props.enqueueSnackbar(e, { variant: "error" }); TODO: A sustituir por nueva herramienta de notificaciones
      this.props.onDisconnect();
    }
  };

  getCurrentKey() {
    if (this.state.currentKeyIndex < 0) return -1;

    let layer = parseInt(this.state.currentLayer, 10);
    const keyIndex = parseInt(this.state.currentKeyIndex, 10);

    if (keyIndex >= 80) return 0;

    if (this.state.keymap.onlyCustom) {
      if (layer < 0) {
        layer += this.state.keymap.default.length;
        return this.state.keymap.default[layer][keyIndex].keyCode;
      }

      return this.state.keymap.custom[layer][keyIndex].keyCode;
    }
    const offset = this.state.keymap.default.length;
    if (layer < this.state.keymap.default.length)
      return this.state.keymap.default[layer][keyIndex].keyCode;

    return this.state.keymap.custom[layer - offset][keyIndex].keyCode;
  }

  onKeyChange = (keyCode) => {
    // Keys can only change on the custom layers

    const layer = this.state.currentLayer;
    const keyIndex = this.state.currentKeyIndex;

    if (keyIndex === -1) {
      return;
    }

    this.setState((state) => {
      const keymap = state.keymap.custom.slice();
      const l = state.keymap.onlyCustom
        ? layer
        : layer - state.keymap.default.length;
      keymap[l][keyIndex] = this.keymapDB.parse(keyCode);
      return {
        keymap: {
          default: state.keymap.default,
          onlyCustom: state.keymap.onlyCustom,
          custom: keymap,
        },
        modified: true,
      };
    });
    this.props.startContext();
  };

  /**
   * Verificate that colors in keyboard button and in color palette is equal
   * @param {number} colorIndex Number of palette index
   * @param {number} currentLayer Number of current layer
   * @param {number} currentLedIndex Number of current selected keyboard button
   */

  onVerificationColor = (colorIndex, currentLayer, currentLedIndex) => {
    const { colorMap } = this.state;
    const currentIndexKeyButton = colorMap[currentLayer][currentLedIndex];
    return currentIndexKeyButton === colorIndex;
  };

  /**
   * Change state if click control or shift button
   * @param {number} layer Number of current layer
   * @param {number} ledIndex Number of current selected keyboard button
   */
  onCtrlShiftPress = (layer, ledIndex) => {
    const selpalco = this.state.colorMap[layer][ledIndex];
    this.setState({
      selectedPaletteColor: selpalco,
      isMultiSelected: true,
      isColorButtonSelected: true,
    });
  };

  /**
   * Change state if color buton selected
   * @param {number} layer Number of layer in attribute of keyboard button
   * @param {number} currentLayer Number of current layer from state
   * @param {number} ledIndex Number of current selected keyboard button
   */
  onButtonKeyboardColorChange = (currentLayer, layer, ledIndex) => {
    const { selectedPaletteColor, modified } = this.state;
    const isEqualColor = this.onVerificationColor(
      selectedPaletteColor,
      currentLayer,
      ledIndex
    );
    if (!modified && isEqualColor) {
      // pass
    } else {
      this.setState((state) => {
        const colormap = state.colorMap.slice();
        colormap[currentLayer][ledIndex] = this.state.selectedPaletteColor;
        this.props.startContext();
        return {
          selectedPaletteColor: this.state.colorMap[layer][ledIndex],
          colorMap: colormap,
          modified: true,
        };
      });
    }
  };

  onKeySelect = (event) => {
    const {
      selectedPaletteColor,
      currentLayer,
      isMultiSelected,
      isColorButtonSelected,
      currentKeyIndex,
    } = this.state;
    const { currentTarget } = event;
    const layer = parseInt(currentTarget.getAttribute('data-layer'), 10);
    const keyIndex = parseInt(currentTarget.getAttribute('data-key-index'), 10);
    const ledIndex = parseInt(currentTarget.getAttribute('data-led-index'), 10);

    if (keyIndex === currentKeyIndex) {
      if (event.ctrlKey || (event.shiftKey && !isColorButtonSelected)) {
        this.onCtrlShiftPress(layer, ledIndex);
        return;
      }
      this.setState({
        currentKeyIndex: -1,
        currentLedIndex: -1,
        selectedPaletteColor: null,
        isMultiSelected: false,
        isColorButtonSelected: false,
      });
      return;
    }

    this.setState((state) => {
      if (
        state.colorMap.length > 0 &&
        layer >= 0 &&
        layer < state.colorMap.length
      ) {
        return {
          currentLayer: layer,
          currentKeyIndex: keyIndex,
          currentLedIndex: ledIndex,
        };
      }
      return {
        currentLayer: layer,
        currentKeyIndex: keyIndex,
      };
    });

    if (event.ctrlKey || event.shiftKey) {
      this.onCtrlShiftPress(layer, ledIndex);
    } else {
      if (
        selectedPaletteColor !== null &&
        isMultiSelected &&
        isColorButtonSelected
      ) {
        this.onButtonKeyboardColorChange(currentLayer, layer, ledIndex);
      }
      if (isColorButtonSelected && !isMultiSelected) {
        this.setState(
          () => {
            return {
              isMultiSelected: true,
            };
          },
          () => {
            this.onButtonKeyboardColorChange(currentLayer, layer, ledIndex);
          }
        );
      }
    }
  };

  selectLayer = (id) => {
    if (id === undefined) return;
    const { palette, undeglowColors } = this.state;
    const newPalette = palette.slice();
    newPalette[this.undeglowCount] = undeglowColors[id];
    this.setState({
      currentLayer: id,
      palette: newPalette,
    });
    this.bottomMenuNeverHide();
  };

  onApply = async () => {
    this.setState({ saving: true });
    store.set('undeglowColors', this.state.undeglowColors);
    const focus = new Focus();
    await focus.command('keymap', this.state.keymap);
    await focus.command('colormap', this.state.palette, this.state.colorMap);
    this.setState({
      modified: false,
      saving: false,
      isMultiSelected: false,
      selectedPaletteColor: null,
      isColorButtonSelected: false,
    });
    console.log('Changes saved.');
    // TODO: Save changes in the cloud
    const Layers = {
      undeglowColors: this.state.undeglowColors,
      keymap: this.state.keymap,
      colormap: {
        palette: this.state.palette,
        colorMap: this.state.colorMap,
      },
    };
    // backupLayers(Layers);
    this.props.cancelContext();
  };

  sharelayers = async () => {
    // TODO: Share layers in the cloud
    const Layers = {
      undeglowColors: this.state.undeglowColors,
      keymap: this.state.keymap,
      colormap: {
        palette: this.state.palette,
        colorMap: this.state.colorMap,
      },
    };
    shareLayers(Layers);
  };

  // Callback function to set State of new Language
  onChangeLanguageLayout = () => {
    this.setState({
      currentLanguageLayout: store.get('keyboard.language') || 'english',
    });
  };

  copyFromDialog = () => {
    this.setState({ copyFromOpen: true });
  };

  cancelCopyFrom = () => {
    this.setState({ copyFromOpen: false });
  };

  copyFromLayer = (layer) => {
    this.setState((state) => {
      let newKeymap;

      if (state.keymap.onlyCustom) {
        newKeymap =
          layer < 0
            ? state.keymap.default.slice()
            : state.keymap.custom.slice();
        newKeymap[state.currentLayer] =
          layer < 0
            ? state.keymap.default[layer + state.keymap.default.length].slice()
            : state.keymap.custom[layer].slice();
      } else {
        newKeymap =
          layer < state.keymap.default.length
            ? state.keymap.default.slice()
            : state.keymap.custom.slice();
        newKeymap[state.currentLayer] =
          layer < state.keymap.default.length
            ? state.keymap.default[layer].slice()
            : state.keymap.custom[layer - state.keymap.default.length].slice();
      }
      const newColormap = state.colorMap.slice();
      if (newColormap.length > 0)
        newColormap[state.currentLayer] = state.colorMap[
          layer >= 0 ? layer : state.currentLayer
        ].slice();

      this.props.startContext();
      return {
        colorMap: newColormap,
        keymap: {
          default: state.keymap.default,
          onlyCustom: state.keymap.onlyCustom,
          custom: newKeymap,
        },
        copyFromOpen: false,
        modified: true,
      };
    });
  };

  clearLayer = () => {
    this.setState((state) => {
      const newKeymap = state.keymap.custom.slice();
      const idx = state.keymap.onlyCustom
        ? state.currentLayer
        : state.currentLayer - state.keymap.default.length;
      newKeymap[idx] = Array(newKeymap[0].length)
        .fill()
        .map(() => ({ keyCode: 0xffff }));

      const newColormap = state.colorMap.slice();
      if (newColormap.length > 0) {
        newColormap[idx] = Array(newColormap[0].length)
          .fill()
          .map(() => 15);
      }
      this.props.startContext();
      return {
        keymap: {
          default: state.keymap.default,
          onlyCustom: state.keymap.onlyCustom,
          custom: newKeymap,
        },
        colorMap: newColormap,
        modified: true,
        clearConfirmationOpen: false,
      };
    });
  };

  confirmClear = () => {
    this.setState({ clearConfirmationOpen: true });
  };

  cancelClear = () => {
    this.setState({ clearConfirmationOpen: false });
  };

  onColorButtonSelect = (action, colorIndex) => {
    const { isColorButtonSelected } = this.state;
    if (action === 'one_button_click') {
      this.setState({
        isMultiSelected: false,
        isColorButtonSelected: !isColorButtonSelected,
      });
      return;
    }
    if (action === 'another_button_click') {
      this.setState({
        selectedPaletteColor: colorIndex,
        isColorButtonSelected: true,
      });
    }
  };

  onColorSelect = (colorIndex) => {
    const { currentLayer, currentLedIndex, colorMap } = this.state;

    const isEqualColor = this.onVerificationColor(
      colorIndex,
      currentLayer,
      currentLedIndex
    );

    if (currentLayer < 0 || currentLayer >= colorMap.length) return;

    if (!isEqualColor) {
      this.setState((state) => {
        const colormap = state.colorMap.slice();
        colormap[currentLayer][currentLedIndex] = colorIndex;
        return {
          isMultiSelected: true,
          colorMap: colormap,
          selectedPaletteColor: colorIndex,
          modified: true,
        };
      });
      this.props.startContext();
    } else {
      this.setState({
        selectedPaletteColor: colorIndex,
      });
    }
  };

  onBacklightColorSelect = (colorIndex) => {
    this.setState({
      selectedPaletteColor: colorIndex,
      isColorButtonSelected: true,
    });
  };

  setColors = (r, g, b) => ({
    r,
    g,
    b,
    rgb: `rgb(${r}, ${g}, ${b})`,
  });

  onColorPick = (colorIndex, r, g, b) => {
    const newPalette = this.state.palette.slice();
    newPalette[colorIndex] = this.setColors(r, g, b);
    this.setState({
      palette: newPalette,
      modified: true,
    });
    if (colorIndex === this.undeglowCount) {
      const { currentLayer } = this.state;
      const newUndeglowColors = { ...this.state.undeglowColors };
      newUndeglowColors[currentLayer] = this.setColors(r, g, b);
      this.setState({
        undeglowColors: newUndeglowColors,
      });
    }
    this.props.startContext();
  };

  importExportDialog = () => {
    this.setState({ importExportDialogOpen: true });
  };

  cancelImport = () => {
    this.setState({ importExportDialogOpen: false });
  };

  importLayer = (data) => {
    if (data.palette.length > 0) this.setState({ palette: data.palette });
    if (data.keymap.length > 0 && data.colormap.length > 0) {
      const { currentLayer } = this.state;
      if (this.state.keymap.onlyCustom) {
        if (currentLayer >= 0) {
          this.setState((state) => {
            const newKeymap = this.state.keymap.custom.slice();
            newKeymap[currentLayer] = data.keymap.slice();
            const newColormap = this.state.colorMap.slice();
            newColormap[currentLayer] = data.colormap.slice();
            return {
              keymap: {
                default: state.keymap.default,
                custom: newKeymap,
                onlyCustom: state.keymap.onlyCustom,
              },
              colorMap: newColormap,
            };
          });
        }
      } else if (currentLayer >= this.state.keymap.default.length) {
        this.setState((state) => {
          const defLength = this.state.keymap.default.length;
          const newKeymap = this.state.keymap.custom.slice();
          newKeymap[currentLayer - defLength] = data.keymap;
          const newColormap = this.state.colorMap.slice();
          newColormap[currentLayer - defLength] = data.colormap.slice();
          return {
            keymap: {
              default: state.keymap.default,
              custom: newKeymap,
              onlyCustom: state.keymap.onlyCustom,
            },
            colorMap: newColormap,
          };
        });
      }
    }
    this.setState({ modified: true });
    this.props.startContext();
    this.toCloseImportExportDialog();
  };

  /**
   * Close ImportExportDialog component
   */
  toCloseImportExportDialog = () => {
    this.setState({ importExportDialogOpen: false });
  };

  toChangeAllKeysColor = (colorIndex, start, end) => {
    const { currentLayer } = this.state;
    this.setState((state) => {
      const colormap = state.colorMap.slice();
      colormap[currentLayer] = colormap[currentLayer].fill(
        colorIndex,
        start,
        end
      );
      return {
        colorMap: colormap,
        modified: true,
      };
    });
    this.props.startContext();
  };

  render() {
    const { keymap, palette, isColorButtonSelected } = this.state;

    const focus = new Focus();
    let Layer = '';

    // Layer = focus.device.components.keymap;

    try {
      Layer = focus.device.components.keymap;
    } catch (error) {
      console.log(error);
      return <Redirect to="/keyboard-select" />;
    }

    const showDefaults = store.get('keymap.showDefaults');

    let { currentLayer } = this.state;

    if (!showDefaults) {
      if (currentLayer < keymap.default.length && !keymap.onlyCustom) {
        currentLayer = 0;
      }
    }

    let layerData;
    let isReadOnly;
    if (keymap.onlyCustom) {
      isReadOnly = currentLayer < 0;
      layerData = isReadOnly
        ? keymap.default[currentLayer + keymap.default.length]
        : keymap.custom[currentLayer];
    } else {
      isReadOnly = currentLayer < keymap.default.length;
      layerData = isReadOnly
        ? keymap.default[currentLayer]
        : keymap.custom[currentLayer - keymap.default.length];
    }

    const layer = (
      // <fade in appear key={currentLayer}>
      <div className="">
        <Layer
          readOnly={isReadOnly}
          index={currentLayer}
          keymap={layerData}
          onKeySelect={this.onKeySelect}
          selectedKey={this.state.currentKeyIndex}
          palette={this.state.palette}
          colormap={this.state.colorMap[this.state.currentLayer]}
          theme={this.props.theme}
          style={{ width: '70vw' }}
        />
      </div>
      // </fade>
    );

    const copyCustomItems = this.state.keymap.custom.map((_, index) => {
      const idx = index + (keymap.onlyCustom ? 0 : keymap.default.length);
      const label = i18n.formatString(i18n.components.layer, idx);

      return {
        index: idx,
        label,
      };
    });
    const copyDefaultItems =
      showDefaults &&
      keymap.default.map((_, index) => {
        const idx = index - (keymap.onlyCustom ? keymap.default.length : 0);
        const label = i18n.formatString(i18n.components.layer, idx);

        return {
          index: idx,
          label,
        };
      });
    const copyFromLayerOptions = (copyDefaultItems || []).concat(
      copyCustomItems
    );

    const defaultLayerMenu =
      showDefaults &&
      keymap.default.map((_, index) => {
        const idx = index - (keymap.onlyCustom ? keymap.default.length : 0);
        return {
          name: i18n.formatString(i18n.components.layer, idx),
          id: idx,
        };
      });

    const customLayerMenu = keymap.custom.map((_, index) => {
      const idx = index + (keymap.onlyCustom ? 0 : keymap.default.length);
      return {
        name: i18n.formatString(i18n.components.layer, idx + 1),
        id: idx,
      };
    });

    // const layerMenu = (defaultLayerMenu || []).concat(customLayerMenu);
    const layerMenu = customLayerMenu;

    return (
      <Styles>
        <Container fluid className="keyboard-editor">
          <Row className="title-row">
            <h4 className="section-title">Keymap and Color Editor</h4>
          </Row>
          <Row>
            <Col>
              <LayerPanel
                layers={layerMenu}
                selectLayer={this.selectLayer}
                currentLayer={currentLayer}
                isReadOnly={isReadOnly}
                importTitle={i18n.editor.importExport}
                importFunc={this.importExportDialog}
                copyTitle={i18n.editor.copyFrom}
                copyFunc={this.copyFromDialog}
                clearTitle={i18n.editor.clearLayer}
                clearFunc={this.confirmClear}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <ColorPanel
                key={palette}
                colors={palette}
                disabled={
                  isReadOnly || currentLayer > this.state.colorMap.length
                }
                onColorSelect={this.onColorSelect}
                colorButtonIsSelected={this.state.colorButtonIsSelected}
                onColorPick={this.onColorPick}
                selected={this.state.selectedPaletteColor}
                isColorButtonSelected={isColorButtonSelected}
                onColorButtonSelect={this.onColorButtonSelect}
                toChangeAllKeysColor={this.toChangeAllKeysColor}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <LayerPicker onKeySelect={this.onKeyChange} />
              <MiscPicker onKeySelect={this.onKeyChange} />
            </Col>
          </Row>
          {this.state.keymap.custom.length === 0 &&
            this.state.keymap.default.length === 0 && (
              <linearProgress variant="query" />
            )}
          <Row className="editor">
            <Col className="raise-editor">
              {layer}
              {/* <ColorPalette
            disabled={isReadOnly || currentLayer > this.state.colorMap.length}
            onColorSelect={this.onColorSelect}
            colorButtonIsSelected={this.state.colorButtonIsSelected}
            palette={palette}
            onColorPick={this.onColorPick}
            selected={this.state.selectedPaletteColor}
            isColorButtonSelected={isColorButtonSelected}
            onColorButtonSelect={this.onColorButtonSelect}
            theme={this.props.theme}
            toChangeAllKeysColor={this.toChangeAllKeysColor}
            onBacklightColorSelect={this.onBacklightColorSelect}
            className="palette"
            darkMode={this.props.darkMode}
          /> */}
            </Col>
          </Row>
          {/* <Slide in={this.getCurrentKey() != -1} direction="up" unmountOnExit>
          <KeySelector
            disabled={isReadOnly}
            onKeySelect={this.onKeyChange}
            currentKeyCode={this.getCurrentKey()}
            scanKeyboard={this.scanKeyboard}
            currentLanguageLayout={this.state.currentLanguageLayout}
            onChangeLanguageLayout={this.onChangeLanguageLayout}
            drawerWidth={this.props.drawerWidth}
          />
        </Slide> */}
          {/* <Slide in={this.getCurrentKey() !== -1} direction="up">
          <Demo />
          <ToolBar />
        </Slide> */}
          <Row>
            {/* <ToolBar onKeySelect={this.onKeyChange} /> */}
            <KeyPicker onKeySelect={this.onKeyChange} />
          </Row>
          <SaveChangesButton
            floating
            onClick={this.onApply}
            disabled={!this.state.modified}
          >
            {i18n.components.save.saveChanges}
          </SaveChangesButton>
          <button
            onClick={this.sharelayers}
            disabled={false}
            style={{
              padding: '6px 8px',
              right: '80px',
              bottom: '16px',
              position: 'fixed',
              justifyContent: 'flex-end',
            }}
          >
            Share Content
          </button>
          <ConfirmationDialog
            title={i18n.editor.clearLayerQuestion}
            open={this.state.clearConfirmationOpen}
            onConfirm={this.clearLayer}
            onCancel={this.cancelClear}
          >
            {i18n.editor.clearLayerPrompt}
          </ConfirmationDialog>
          <CopyFromDialog
            open={this.state.copyFromOpen}
            onCopy={this.copyFromLayer}
            onCancel={this.cancelCopyFrom}
            layers={copyFromLayerOptions}
            currentLayer={currentLayer}
          />
          <ImportExportDialog
            open={this.state.importExportDialogOpen}
            keymap={layerData}
            palette={this.state.palette}
            colormap={this.state.colorMap[this.state.currentLayer]}
            isReadOnly={isReadOnly}
            onConfirm={this.importLayer}
            onCancel={this.cancelImport}
            toCloseImportExportDialog={this.toCloseImportExportDialog}
          />
        </Container>
      </Styles>
    );
  }
}

export default Editor;
