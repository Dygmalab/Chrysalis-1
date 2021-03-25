import React, { Component } from 'react';
import Keyboard from 'react-simple-keyboard';
import cascade from 'react-simple-keyboard/build/css/index.css';
import { baseKeyCodeTable } from '../../../api/keymap';
import Styled from 'styled-components';

const StyleWrapper = Styled.div`
.hg-theme-default{width:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;box-sizing:border-box;overflow:hidden;touch-action:manipulation}.hg-theme-default .hg-button span{pointer-events:none}.hg-theme-default button.hg-button{border-width:0;outline:0;font-size:inherit}.hg-theme-default{font-family:"HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;background-color:#ececec;padding:5px;border-radius:5px}.hg-theme-default .hg-button{display:inline-block;flex-grow:1}.hg-theme-default .hg-row{display:flex}.hg-theme-default .hg-row:not(:last-child){margin-bottom:5px}.hg-theme-default .hg-row .hg-button-container,.hg-theme-default .hg-row .hg-button:not(:last-child){margin-right:5px}.hg-theme-default .hg-row>div:last-child{margin-right:0}.hg-theme-default .hg-row .hg-button-container{display:flex}.hg-theme-default .hg-button{box-shadow:0 0 3px -1px rgba(0,0,0,.3);height:40px;border-radius:5px;box-sizing:border-box;padding:5px;background:#fff;border-bottom:1px solid #b5b5b5;cursor:pointer;display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:rgba(0,0,0,0)}.hg-theme-default .hg-button.hg-activeButton{background:#efefef}.hg-theme-default.hg-layout-numeric .hg-button{width:33.3%;height:60px;align-items:center;display:flex;justify-content:center}.hg-theme-default .hg-button.hg-button-numpadadd,.hg-theme-default .hg-button.hg-button-numpadenter{height:85px}.hg-theme-default .hg-button.hg-button-numpad0{width:105px}.hg-theme-default .hg-button.hg-button-com{max-width:85px}.hg-theme-default .hg-button.hg-standardBtn.hg-button-at{max-width:45px}.hg-theme-default .hg-button.hg-selectedButton{background:rgba(5,25,70,.53);color:#fff}.hg-theme-default .hg-button.hg-standardBtn[data-skbtn=".com"]{max-width:82px}.hg-theme-default .hg-button.hg-standardBtn[data-skbtn="@"]{max-width:60px}`;

class KeyBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layoutName: 'default',
      resolver: [],
    };
  }

  layout = {
    default: [
      '{esc} /N F1 F2 F3 F4 /F F5 F6 F7 F8 /F F9 F10 F11 F12 /S {ptsc} {sclk} {pause} /S /N /N /N /N',
      '` 1 2 3 4 5 6 7 8 9 0 - = {bksp} /S {ins} {home} {pgup} /S NLock N/ N* N-',
      '{tab} q w e r t y u i o p [ ] \\ /S {del} {end} {pgdn} /S N7 N8 N9 N+',
      "{lock} a s d f g h j k l ; ' {enter} /S /N /N /N /S N4 N5 N6 N+",
      '{Lshift} z x c v b n m , . / {Rshift} /S /N {up} /N /S N1 N2 N3 {enter3}',
      '{Lctrl} {Lgui} {Lalt} {space} {Ralt} {Rgui} {app} {Rctrl} /S {left} {down} {right} /S N0 N. {enter3}',
    ],
    shift: [
      '{esc} /N F1 F2 F3 F4 /F F5 F6 F7 F8 /F F9 F10 F11 F12 /S {ptsc} {sclk} {pause} /S /N /N /N /N',
      '~ ! @ # $ % ^ & * ( ) _ + {bksp} /S {ins} {home} {pgup} /S NLock / * -',
      '{tab} q w e r t y u i o p { } | /S {del} {end} {pgdn} /S N7 N8 N9 +',
      '{lock} a s d f g h j k l : " {enter} /S /N /N /N /S N4 N5 N6 +',
      '{Lshift} z x c v b n m < > ? {Rshift} /S /N {up} /N /S N1 N2 N3 {enter3}',
      '{Lctrl} {Lgui} {Lalt} {space} {Ralt} {Rgui} {app} {Rctrl} /S {left} {down} {right} /S N0 . {enter3}',
    ],
  };

  display = {
    '{esc}': 'Esc',
    '{del}': 'Delete',
    '{ins}': 'Insert',
    '{bksp}': 'Backspace',
    '{enter}': '&#8629',
    '{enter2}': '&#8629',
    '{enter3}': 'Enter',
    '{lock}': 'Caps Lock',
    '{tab}': 'Tab',
    '{Rshift}': 'Shift',
    '{Lshift}': 'Shift',
    '{up}': '&#8593',
    '{left}': '&#8592',
    '{down}': '&#8595',
    '{right}': '&#8594',
    '{Lctrl}': 'Ctrl',
    '{Rctrl}': 'Ctrl',
    '{Lgui}': 'Gui',
    '{Rgui}': 'Gui',
    '{Lalt}': 'Alt',
    '{Ralt}': 'AltGr',
    '{app}': 'App',
    '{pgdn}': 'PgDn',
    '{pgup}': 'PgUp',
    '{ptsc}': 'PrtSc',
    '{sclk}': 'SCLock',
    '{pause}': 'Pause',
    N0: '0',
    N1: '1',
    N2: '2',
    N3: '3',
    N4: '4',
    N5: '5',
    N6: '6',
    N7: '7',
    N8: '8',
    N9: '9',
    'N/': '/',
    'N*': '*',
    'N-': '-',
    'N+': '+',
    'N.': '.',
  };

  buttonTheme = [
    {
      class: 'Hidden',
      buttons: '/N /S /F',
    },
    {
      class: 'small-button',
      buttons: '/S',
    },
    {
      class: 'f-button',
      buttons: '/F',
    },
    {
      class: 'medium-button',
      buttons:
        '/N {esc} F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12 {ptsc} {sclk} {pause} ' +
        ' ` 1 2 3 4 5 6 7 8 9 0 - = {ins} {home} {pgup} NLock N/ N* N- ' +
        '~ ! @ # $ % ^ & * ( ) _ + { } : " < > ? ' +
        'q w e r t y u i o p [ ] {del} {end} {pgdn} N7 N8 N9 N+ ' +
        "a s d f g h j k l ; ' # N4 N5 N6 " +
        ' z x c v b n m , . / {up} N1 N2 N3 {enter3} ' +
        '{left} {down} {right} N. ',
    },
    {
      class: 'large-button',
      buttons:
        '{Rshift} {menu} {Rctrl} {Lctrl} {Lgui} {Rgui} {Lalt} {Ralt} {app}',
    },
    {
      class: 'larger-button',
      buttons: '{tab} \\ |',
    },
    {
      class: 'largest-button',
      buttons: '{lock}',
    },
    {
      class: 'Double-button',
      buttons: 'N0 {bksp}',
    },
    {
      class: 'DLarge-button',
      buttons: '{enter} {Lshift}',
    },
    {
      class: 'DLargest-button',
      buttons: '{Rshift}',
    },
    {
      class: 'SpaceBar-button',
      buttons: '{space}',
    },
  ];

  componentDidMount() {
    const keyGroups = baseKeyCodeTable
      .map((item) => {
        return item.groupName;
      })
      .concat(['Unknown keycodes']);
    console.log(keyGroups, baseKeyCodeTable);
    const rsolv = baseKeyCodeTable.map((item) => {
      const kk = item.keys.map(({ code, labels }) => {
        return {
          key: labels.primary,
          value: code,
        };
      });
      return kk.reduce((obj, item) => ((obj[item.key] = item.value), obj), {});
    });
    console.log(rsolv);
    this.setState({
      resolver: rsolv,
    });
  }

  onChange = (input) => {
    console.log('Input changed', input);
  };

  onKeyPress = (button) => {
    console.log('Button pressed', button, this.state.resolver);
    // Any language key pressed checker
    if (button.length === 1 && button.match(/\p{L}/u)) {
      const keyCode = this.state.resolver[0][button.toUpperCase()];
      console.log(keyCode);
      this.props.onKeySelect(keyCode);
    }
    // number key pressed checker
    if (button.length === 1 && button.match(/[0-9]/i)) {
      const keyCode = this.state.resolver[1][button];
      console.log(keyCode);
      this.props.onKeySelect(keyCode);
    }
    // symbols key pressed checker
    if (
      (button.length === 1 && button.match(/['+,\-.<`¡´º]/i)) ||
      button === '{lock}'
    ) {
      let keyCode = 0;
      if (button === '{lock}') {
        keyCode = this.state.resolver[2].CAPSLOCK;
      } else {
        keyCode = this.state.resolver[2][button];
      }
      console.log(keyCode);
      this.props.onKeySelect(keyCode);
    }
    // Special Keys pressed checker
    if (
      [
        '{bksp}',
        '{del}',
        '{enter}',
        '{esc}',
        '{ins}',
        '{space}',
        '{tab}',
      ].includes(button)
    ) {
      const map = {};
      map['{bksp}'] = 'BACKSPACE';
      map['{del}'] = 'DEL';
      map['{enter}'] = 'ENTER';
      map['{esc}'] = 'ESC';
      map['{ins}'] = 'INSERT';
      map['{space}'] = 'SPACE';
      map['{tab}'] = 'TAB';

      const keyCode = this.state.resolver[3][map[button]];
      console.log(keyCode);
      this.props.onKeySelect(keyCode);
    }
    // Modifier Keys pressed checker
    if (
      [
        '{Lalt}',
        '{Lctrl}',
        '{Lgui}',
        '{Lshift}',
        '{Ralt}',
        '{Rctrl}',
        '{Rgui}',
        '{Rshift}',
      ].includes(button)
    ) {
      const map = {};
      map['{Lalt}'] = 'LEFT ALT';
      map['{Lctrl}'] = 'LEFT CTRL';
      map['{Lgui}'] = 'LEFT GUI';
      map['{Lshift}'] = 'LEFT SHIFT';
      map['{Ralt}'] = 'RIGHT ALT';
      map['{Rctrl}'] = 'RIGHT CTRL';
      map['{Rgui}'] = 'RIGHT GUI';
      map['{Rshift}'] = 'RIGHT SHIFT';

      const keyCode = this.state.resolver[4][map[button]];
      console.log(keyCode);
      this.props.onKeySelect(keyCode);
    }
    // Arrows and control Keys pressed checker
    if (
      [
        '{app}',
        '{end}',
        '{home}',
        '{pgdn}',
        '{pgup}',
        '{up}',
        '{left}',
        '{right}',
        '{down}',
      ].includes(button)
    ) {
      const map = {};
      map['{app}'] = 'APP';
      map['{end}'] = 'END';
      map['{home}'] = 'HOME';
      map['{pgdn}'] = 'PAGE DOWN';
      map['{pgup}'] = 'PAGE UP';
      map['{left}'] = '←';
      map['{up}'] = '↑';
      map['{right}'] = '→';
      map['{down}'] = '↓';

      const keyCode = this.state.resolver[5][map[button]];
      console.log(keyCode);
      this.props.onKeySelect(keyCode);
    }
    // F keys pressed checker
    if (button.length <= 3 && button.match(/F[0-9]*/i)) {
      const keyCode = this.state.resolver[6][button];
      console.log(keyCode);
      this.props.onKeySelect(keyCode);
    }
    // Numpad number key pressed checker
    if (button.length === 2 && button.match(/N[0-9]/i)) {
      const keyCode = this.state.resolver[7][button.slice(-1)];
      console.log(keyCode);
      this.props.onKeySelect(keyCode);
    }
    // Numpad symbols key pressed checker
    if (button.length === 2 && button.match(/N[/*\-+.]/i)) {
      const keyCode = this.state.resolver[7][button.slice(-1)];
      console.log(keyCode);
      this.props.onKeySelect(keyCode);
    }
    // Numpad specific key pressed checker
    if (button === 'NLock' || button === '{enter3}') {
      const aux = button === 'NLock' ? 'NUMLOCK' : 'Enter';
      const keyCode = this.state.resolver[7][aux];
      console.log(keyCode);
      this.props.onKeySelect(keyCode);
    }
    if (['{ptsc}', '{sclk}', '{pause}'].includes(button)) {
      const map = {};
      map['{ptsc}'] = 'PRINT SCREEN';
      map['{sclk}'] = 'SCROLL LOCK';
      map['{pause}'] = 'PAUSE';

      const keyCode = this.state.resolver[8][map[button]];
      console.log(keyCode);
      this.props.onKeySelect(keyCode);
    }

    /**
     * If you want to handle the shift and caps lock buttons
     */
    // if (button === "{Lshift}" || button === "{lock}") this.handleShift();
  };

  handleShift = () => {
    const { layoutName } = this.state;

    this.setState({
      layoutName: layoutName === 'default' ? 'shift' : 'default',
    });
  };

  render() {
    return (
      <StyleWrapper>
        <Keyboard
          baseClass="FullKeyboard"
          keyboardRef={(r) => (this.keyboard = r)}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
          theme="hg-theme-default hg-layout-default myTheme"
          layoutName={this.state.layoutName}
          layout={this.layout}
          mergeDisplay
          display={this.display}
          buttonTheme={this.buttonTheme}
        />
      </StyleWrapper>
    );
  }
}

export default KeyBoard;
