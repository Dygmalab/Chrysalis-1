/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import KeyBoard from './Keyboard';
import Move from './Move';
import MediaKeys from './MediaKeys';
import Mouse from './Mouse';
import Special from './Special';

import Superpowers from './Superpowers';

const Styles = Styled.div`
// React Component Style for Keyboard configuration Tool

// @font-face {
//   font-family: "RobotoCondensed";
//   src: url("../../../assets/styles/fonts/RobotoCondensed-Regular.ttf")
//     format("truetype");
//   font-weight: normal;
//   font-style: normal;
// }

// //Variables

// $keyWidth: 100% * 0.043;
// $spacing: ($keyWidth * 0.25);
// $fSpacing: $keyWidth * 0.5;
// $keyQuater: $keyWidth * 1.25;
// $keyHalf: $keyWidth * 1.5;
// $keyPast: $keyWidth * 1.75;
// $keyDouble: $keyWidth * 2;
// $keysQuater: $keyWidth * 2.25;
// $keysPast: $keyWidth * 2.75;
// $keySpace: $keyWidth * 6.25;

.toolStyle {
  padding: 4px;
  // background-color: lightgrey;
  // position: fixed;
  // bottom: 0px;
  width: calc(100% - 64px);
  padding-left: 195px;
  .box1 {
    width: 26%;
  }
  .box2 {
    width: 22%;
  }
  .box3 {
    width: 36%;
  }
  .box4 {
    width: 13%;
    margin-right: 0 !important;
  }
  h3 {
    padding-left: 0.8rem;
    margin: 0;
    background-color: white;
    font-size: 1.25rem;
    font-family: "AktivGrotesk";
  }
  .raisedTitle {
    position: relative;
    padding-top: 0.1rem;
    background-color: white;
    padding-bottom: 0.1rem;
    border-bottom: 1px solid rgba(90, 90, 90, 0.4);
    border-radius: 6px;
    box-shadow: 0px 2px rgba(90, 90, 90, 0.3);
  }
  .no-top-border {
    border-radius: 0px 0px 6px 6px;
  }
  .simple-keyboard {
    margin-top: 0.1rem;
    font-family: "RobotoCondensed" !important;
    font-size: 0.8rem;
  }
  .hg-theme-default {
    background-color: white;
    .hg-button {
      box-sizing: border-box;
      box-shadow: none;
      border: 2px solid rgba(90, 90, 90, 0.5);
      padding: 0;
      height: 1.8rem;
      margin: 0px 0px !important;
    }
    .hg-row {
      justify-content: center;
      margin-bottom: 1px;
    }
  }

  .Hidden {
    color: transparent !important;
    background-color: transparent !important;
    border: 2px solid transparent !important;
    box-shadow: none !important;
    pointer-events: none;
    span {
      visibility: hidden;
    }
  }

  .right-spacing {
    margin-right: 1%;
    margin-top: 6px;
  }

  .small-button {
    max-width: $spacing;
    min-width: $spacing;
    margin: 0 !important;
  }
  .f-button {
    max-width: $fSpacing;
    min-width: $fSpacing;
    margin: 0 !important;
  }
  .medium-button {
    max-width: $keyWidth !important;
    min-width: $keyWidth !important;
    font-size: 0.9rem;
  }
  .large-button {
    max-width: $keyQuater;
    min-width: $keyQuater;
    font-size: 1rem;
  }
  .larger-button {
    max-width: $keyHalf;
    min-width: $keyHalf;
    font-size: 1rem;
  }
  .largest-button {
    max-width: $keyPast;
    min-width: $keyPast;
    font-size: 1rem;
  }
  .Double-button {
    max-width: $keyDouble;
    min-width: $keyDouble;
    font-size: 1rem;
  }
  .DLarge-button {
    max-width: $keysQuater;
    min-width: $keysQuater;
    font-size: 1rem;
  }
  .DLargest-button {
    max-width: $keysPast;
    min-width: $keysPast;
    font-size: 1rem;
  }
  .SpaceBar-button {
    max-width: $keySpace;
    min-width: $keySpace;
  }
}

.superpowers {
  .hline {
    width: "95%";
    justify-self: "center";
    margin: "0.6rem";
  }
  .title {
    text-align: center;
  }
  .subtitle {
    font-weight: 600;
  }
}
`;

const Toolbar = ({ onKeySelect }) => {
  return (
    <Styles>
      <Container fluid className="toolStyle">
        <Row>
          <Col xs={2}>
            <Row style={{ width: '100%', margin: '0' }}>
              <Col style={{ padding: '0' }}>
                <div className="raisedTitle" style={{ zIndex: 11 }}>
                  <h3>SUPER POWERS</h3>
                </div>
              </Col>
            </Row>
            <Row style={{ width: '100%', margin: '0' }}>
              <Col style={{ padding: '0' }}>
                <div
                  className="raisedTitle no-top-border"
                  style={{ zIndex: 10 }}
                >
                  <Superpowers />
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={10}>
            <Row>
              <Row style={{ width: '100%' }}>
                <Col>
                  <div className="raisedTitle" style={{ zIndex: 11 }}>
                    <h3>FULL KEYBOARD LAYOUT KEYS</h3>
                  </div>
                </Col>
              </Row>
              <Row style={{ width: '100%' }}>
                <Col>
                  <div
                    className="raisedTitle no-top-border"
                    style={{ zIndex: 10 }}
                  >
                    <KeyBoard onKeySelect={onKeySelect} />
                  </div>
                </Col>
              </Row>
            </Row>
            <Row style={{ width: '100%' }}>
              <div
                style={{ display: 'inline-block' }}
                className="right-spacing box1"
              >
                <div className="raisedTitle" style={{ zIndex: 9 }}>
                  <h3>MOVE TO LEVEL</h3>
                </div>
                <div
                  className="raisedTitle no-top-border"
                  style={{ zIndex: 8 }}
                >
                  <Move />
                </div>
              </div>
              <div
                style={{ display: 'inline-block' }}
                className="right-spacing box2"
              >
                <div className="raisedTitle" style={{ zIndex: 9 }}>
                  <h3>MEDIA KEYS</h3>
                </div>
                <div
                  className="raisedTitle no-top-border"
                  style={{ zIndex: 8 }}
                >
                  <MediaKeys />
                </div>
              </div>
              <div
                style={{ display: 'inline-block' }}
                className="right-spacing box3"
              >
                <div className="raisedTitle" style={{ zIndex: 9 }}>
                  <h3>MOUSE CONFIG OPTIONS</h3>
                </div>
                <div
                  className="raisedTitle no-top-border"
                  style={{ zIndex: 8 }}
                >
                  <Mouse />
                </div>
              </div>
              <div
                style={{ display: 'inline-block' }}
                className="right-spacing box4"
              >
                <div className="raisedTitle" style={{ zIndex: 9 }}>
                  <h3>SPECIAL KEYS</h3>
                </div>
                <div
                  className="raisedTitle no-top-border"
                  style={{ zIndex: 8 }}
                >
                  <Special />
                </div>
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    </Styles>
  );
};

export default Toolbar;
