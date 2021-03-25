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

import React from 'react';
import Styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { MdSave, MdCheck, MdRefresh } from 'react-icons/md';
import i18n from '../i18n';

const Styles = Styled.div`
  .saveBtn{
    position: absolute;
    bottom: 15px;
    margin-left: 20px;
  }
`;

class SaveChangesButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inProgress: false,
      success: false,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleButtonClick = async (event) => {
    this.setState(
      {
        inProgress: true,
      },
      async () => {
        await this.props.onClick(event);
        this.setState({
          success: this.props.isBeginUpdate ? !this.props.isBeginUpdate : true,
          inProgress: false,
        });
        this.timer = setTimeout(() => {
          this.setState({ success: false });
        }, 2000);
      }
    );
  };

  render() {
    const { inProgress, success } = this.state;
    const { successMessage } = this.props;

    const textPart = !this.props.floating && (
      <div className="">
        <Button
          variant="contained"
          color="primary"
          className={buttonClassname}
          disabled={inProgress || (this.props.disabled && !success)}
          onClick={this.handleButtonClick}
        >
          {success
            ? successMessage || i18n.components.save.success
            : this.props.children}
        </Button>
      </div>
    );

    const OptionalTooltip = (props) => {
      if (this.props.floating) {
        return <tooltip title={this.props.children}>{props.children}</tooltip>;
      }
      return props.children;
    };

    return (
      <OptionalTooltip>
        <Styles>
          <div className="">
            <Button
              disabled={inProgress || (this.props.disabled && !success)}
              color="primary"
              className="saveBtn"
              onClick={this.handleButtonClick}
            >
              {success ? (
                <MdCheck />
              ) : (
                <React.Fragment>
                  <MdSave size="30px" />
                  Save Changes
                </React.Fragment>
              )}
            </Button>
            {inProgress && <MdRefresh size={68} className="" />}
          </div>
          {textPart}
        </Styles>
      </OptionalTooltip>
    );
  }
}

export default SaveChangesButton;
