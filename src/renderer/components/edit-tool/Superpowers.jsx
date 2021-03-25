import React, { Component, Fragment } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default class Superpowers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comb: ["Ctrl", "Shift", "Alt", "AltGr", "Win"],
    };
  }

  render() {
    const title = <h6 className="title">ESC Key Information</h6>;

    const combinations = (
      <Fragment>
        <Row className="subtitle">
          <Col>
            <h6>Combine esc with</h6>
          </Col>
        </Row>
        <Row>
          {this.state.comb.map((type) => (
            <Col key={`custom-${type}`} className="mb-3" xs={2}>
              <Form.Check
                custom
                id={`custom-${type}`}
                label={type}
                checked={false}
                style={{ fontSize: "small" }}
              />
            </Col>
          ))}
        </Row>
      </Fragment>
    );

    const press = (
      <Fragment>
        <Row className="subtitle">
          <h6>Press & Hold it to</h6>
          <div style={{ marginLeft: "auto" }}>
            <Form.Check type="switch" id="custom-switch" label="" />
          </div>
        </Row>
        <Row>
          <span>layer shift</span>
        </Row>{" "}
        <Row>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((type) => (
            <Col key={`custom-${type}`} xs={1} style={{ padding: "10px" }}>
              <Button
                custom
                id={`custom-${type}`}
                style={{
                  padding: "5px",
                  color: type === "1" ? "white" : "black",
                  backgroundColor: type === "1" ? "blue" : "white",
                  borderColor: "gray",
                }}
              >
                {type}
              </Button>
            </Col>
          ))}
        </Row>
        <Row className="subtitle">
          <span>Act as a modifier</span>
        </Row>{" "}
        <Row>
          {["Ctrl", "Shift", "Alt", "AltGr", "Win"].map((type) => (
            <Col
              key={`custom-${type}`}
              xs={2}
              style={{ padding: "0", marginLeft: "5px", marginRight: "5px" }}
            >
              <Button
                custom
                id={`custom-${type}`}
                style={{
                  minWidth: "50px",
                  maxWidth: "50px",
                  padding: "5px",
                  paddingLeft: "0",
                  paddingRight: "0",
                  color: type === "1" ? "white" : "black",
                  backgroundColor: type === "1" ? "blue" : "white",
                  borderColor: "gray",
                }}
              >
                {type}
              </Button>
            </Col>
          ))}
        </Row>
      </Fragment>
    );

    return (
      <Container fluid className="superpowers">
        {title}
        {combinations}
        <hr className="hline"></hr>
        {press}
      </Container>
    );
  }
}
