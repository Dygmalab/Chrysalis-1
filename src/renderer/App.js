/* eslint-disable react/jsx-filename-extension */
import React, { Component, Fragment } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import styled, { ThemeProvider, css } from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';

import '../api/keymap';
import '../api/colormap';

import Container from 'react-bootstrap/Container';
import Focus from '../api/focus';
import KeyboardSelect from './screens/KeyboardSelect';
// import FirmwareUpdate from './screens/FirmwareUpdate';
import Editor from './screens/Editor/Editor';
// import Preferences from './screens/Preferences';
// import Welcome from './screens/Welcome';
import i18n from './i18n';
import Hardware from '../api/hardware';
import Header from './components/Header';
// import ConfirmationDialog from './components/ConfirmationDialog';

import 'react-toastify/dist/ReactToastify.css';
import GlobalStyles from '../theme/GlobalStyles';
import Light from '../theme/LightTheme';
import Dark from '../theme/DarkTheme';

const { remote } = require('electron');

const { spawn } = remote.require('child_process');
const usb = remote.require('usb');
const settings = remote.require('electron-settings').default;

const focus = new Focus();
focus.debug = true;
focus.timeout = 15000;

if (remote.app.getLocale()) i18n.setLanguage(remote.app.getLocale());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      darkMode: false,
      connected: false,
      device: null,
      pages: {},
      contextBar: false,
      cancelPendingOpen: false,
    };
    localStorage.clear();

    this.onKeyboardConnect = this.onKeyboardConnect.bind(this);
  }

  async componentDidMount() {
    const devices = await focus.find(Hardware.serial[0]);
    usb.on('detach', async (device) => {
      console.log(!focus.device, this.flashing);
      if (!focus.device) return;
      if (this.flashing) return;

      if (
        focus.device.usb.vendorId !== device.deviceDescriptor.idVendor ||
        focus.device.usb.productId !== device.deviceDescriptor.idProduct
      ) {
        return;
      }

      // Must await this to stop re-render of components reliant on `focus.device`
      // However, it only renders a blank screen. New route is rendered below.
      await Redirect('/keyboard-select');
      console.log('is port open?', focus._port.isOpen);
      if (!focus._port.isOpen) {
        toast.error(i18n.errors.deviceDisconnected, {
          autoDismiss: false,
          position: toast.POSITION.BOTTOM_LEFT,
        });
        focus.close();
        this.setState({
          connected: false,
          device: null,
          pages: {},
        });
        // Second call to `navigate` will actually render the proper route
        await Redirect('/keyboard-select');
      }
    });
    if (devices.length > 0) {
      console.log(devices[0]);
      await this.onKeyboardConnect(devices[0]);
      await Redirect('/editor');
      await Redirect('/editor');
    }
  }

  flashing = false;

  toggleDarkMode = () => {
    const { darkMode } = this.state;
    this.setState({
      darkMode: !darkMode,
    });
    settings.set('ui.darkMode', !darkMode);
  };

  toggleFlashing = async () => {
    this.flashing = !this.flashing;
    if (!this.flashing) {
      this.setState({
        connected: false,
        device: null,
        pages: {},
      });
      await Redirect('/keyboard-select');
    }
  };

  onKeyboardConnect = async (port) => {
    focus.close();

    if (!port.path) {
      port.device.device = port.device;

      this.setState({
        connected: true,
        pages: {},
        device: port.device,
      });
      await Redirect('/welcome');
      return [];
    }

    console.log('Connecting to ', port.path);
    await focus.open(port.path, port.device);
    if (process.platform === 'darwin') {
      await spawn('stty', ['-f', port.path, 'clocal']);
    }

    if (focus.device.bootloader) {
      this.setState({
        connected: true,
        pages: {},
        device: port,
      });
      await Redirect('/welcome');
      return [];
    }

    console.log('Probing for Focus support...');
    let commands;
    try {
      commands = await focus.probe();
    } catch (e) {
      commands = [];
    }

    focus.setLayerSize(focus.device);
    const pages = {
      keymap:
        commands.includes('keymap.custom') > 0 ||
        commands.includes('keymap.map') > 0,
      colormap:
        commands.includes('colormap.map') > 0 &&
        commands.includes('palette') > 0,
    };

    this.setState({
      connected: true,
      device: port,
      pages,
    });
    await Redirect(pages.keymap ? '/editor' : '/welcome');
    return commands;
  };

  onKeyboardDisconnect = async () => {
    focus.close();
    this.setState({
      connected: false,
      device: null,
      pages: {},
    });
    localStorage.clear();
    await Redirect('/keyboard-select');
  };

  cancelContext = (dirty) => {
    if (dirty) {
      this.setState({ cancelPendingOpen: true });
    } else {
      this.doCancelContext();
    }
  };

  doCancelContext = () => {
    this.setState({
      contextBar: false,
      cancelPendingOpen: false,
    });
  };

  cancelContextCancellation = () => {
    this.setState({ cancelPendingOpen: false });
  };

  startContext = () => {
    this.setState({ contextBar: true });
  };

  render() {
    const { connected, pages, contextBar, darkMode, device } = this.state;
    const { toastManager } = this.props;

    const Rfocus = new Focus();
    const Device =
      (Rfocus.device && Rfocus.device.info) ||
      (device && device.device && device.device.info) ||
      (device && device.info);

    // if (Rfocus.device !== undefined) {
    //   return <Redirect to="/keyboard-select" />;
    // }

    return (
      <ThemeProvider theme={darkMode ? Dark : Light}>
        <GlobalStyles />
        <ToastContainer />
        <Header
          contextBar={contextBar}
          connected={connected}
          pages={pages}
          device={Device}
          cancelContext={this.cancelContext}
        />
        <Container fluid className="main-container">
          <Switch>
            {/* <Welcome
              path="/welcome"
              device={this.state.device}
              onConnect={this.onKeyboardConnect}
              titleElement={() => document.querySelector('#page-title')}
            /> */}
            <KeyboardSelect
              path="/keyboard-select"
              onConnect={this.onKeyboardConnect}
              onDisconnect={this.onKeyboardDisconnect}
              toastManager={toastManager}
              titleElement={() => document.querySelector('#page-title')}
            />
            <Editor
              path="/editor"
              onDisconnect={this.onKeyboardDisconnect}
              startContext={this.startContext}
              cancelContext={this.cancelContext}
              inContext={contextBar}
              titleElement={() => document.querySelector('#page-title')}
              appBarElement={() => document.querySelector('#appbar')}
              darkMode={darkMode}
            />
          </Switch>
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;

// <Header
//             contextBar={contextBar}
//             connected={connected}
//             pages={pages}
//             device={device}
//             drawerWidth={drawerWidth}
//             cancelContext={this.cancelContext}
//             theme={darkMode}
//           />
//           <main>
//             <Switch>
//               <Welcome
//                 path="/welcome"
//                 drawerWidth={drawerWidth}
//                 device={this.state.device}
//                 onConnect={this.onKeyboardConnect}
//                 titleElement={() => document.querySelector("#page-title")}
//               />
//               <KeyboardSelect
//                 path="/keyboard-select"
//                 drawerWidth={drawerWidth}
//                 onConnect={this.onKeyboardConnect}
//                 onDisconnect={this.onKeyboardDisconnect}
//                 titleElement={() => document.querySelector("#page-title")}
//               />
//               <Editor
//                 path="/editor"
//                 drawerWidth={drawerWidth}
//                 onDisconnect={this.onKeyboardDisconnect}
//                 startContext={this.startContext}
//                 cancelContext={this.cancelContext}
//                 inContext={this.state.contextBar}
//                 titleElement={() => document.querySelector("#page-title")}
//                 appBarElement={() => document.querySelector("#appbar")}
//                 darkMode={darkMode}
//               />
//               <FirmwareUpdate
//                 path="/firmware-update"
//                 drawerWidth={drawerWidth}
//                 device={this.state.device}
//                 toggleFlashing={this.toggleFlashing}
//                 onDisconnect={this.onKeyboardDisconnect}
//                 titleElement={() => document.querySelector("#page-title")}
//               />
//               <Preferences
//                 connected={connected}
//                 path="/preferences"
//                 drawerWidth={drawerWidth}
//                 titleElement={() => document.querySelector("#page-title")}
//                 darkMode={this.state.darkMode}
//                 toggleDarkMode={this.toggleDarkMode}
//                 startContext={this.startContext}
//                 cancelContext={this.cancelContext}
//                 inContext={this.state.contextBar}
//               />
//             </Switch>
//           </main>
//           <ConfirmationDialog
//             title={i18n.app.cancelPending.title}
//             open={this.state.cancelPendingOpen}
//             onConfirm={this.doCancelContext}
//             onCancel={this.cancelContextCancellation}
//             text={i18n.app.cancelPending.content}
//           />
