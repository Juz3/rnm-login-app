 /**
 *  <index.js>
 *
 *  Copyright information
 *
 *      Copyright (C) 2018 Jussi Koivumäki <firstname.lastname@cs.tamk.fi>
 *
 *  License
 * 
 *      Permission to use, copy, modify, and/or distribute this software 
 *      for any purpose with or without fee is hereby granted, provided that 
 *      the above copyright notice and this permission notice appear in all copies.
 *
 *      THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES 
 *      WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF 
 *      MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR 
 *      ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES 
 *      WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN 
 *      AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING 
 *      OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 * 
 * @author Jussi Koivumäki
 * 
 *
 */

import React from 'react';
import {
  Col,
  Container,
  Row } from 'reactstrap';

import { Link } from 'react-router-dom';

class AboutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      headingStyle: {
        color: '#fff'
      },

    };
  }

  render() {
    return (
      <div>
        <div className="onlyBgColor">
        <Container>
          <Row>
            <Col className="aboutColTop">
              <h2 style={this.state.headingStyle}>x</h2>
              <p style={this.state.headingStyle}><strong>x</strong></p>
              <p>x.</p>
              <p style={this.state.headingStyle}><strong>x</strong></p>
              <ul className="aboutULmid">
                <li className="aboutList">x</li> 
                <li className="aboutList">x</li>
              </ul>
              <p style={this.state.headingStyle}><strong>x</strong></p>
              <ul className="aboutULmid">
                <li className="aboutList">
                  xx
                </li>
                <li className="aboutList">
                  xx
                </li>
              </ul>
            </Col>
          </Row>
          <Row>
            <Col className="aboutColLeft">
              <h2>Frontend</h2>
              <ul className="aboutUL">
                <li>
                  <a className="nav-link" href="https://reactjs.org/">
                    React
                  </a>
                </li>
                <li>
                  <a className="nav-link" href="https://github.com/facebook/create-react-app">
                    Create React App
                  </a>
                </li>
                <li>
                  <a className="nav-link" href="https://github.com/axios/axios">
                    Axios
                  </a>
                </li>
                <li>
                  <a className="nav-link" href="https://reactstrap.github.io/">
                    Reactstrap
                  </a>
                </li>
                <li>
                  <a className="nav-link" href="https://www.npmjs.com/package/universal-cookie">
                    Universal-cookie
                  </a>
                </li>
              </ul>
            </Col>
            <Col className="aboutColRight">
              <h2>Backend</h2>
              <ul className="aboutUL">
                <li >
                  <a className="nav-link" href="https://nodejs.org/en/">
                      Node.js
                  </a>
                </li>
                <li >
                  <a className="nav-link" href="https://www.mysql.com/">
                    MySQL
                  </a>
                </li>
                <li >
                  <a className="nav-link" href="https://expressjs.com/">
                    Express
                  </a>
                </li>
                <li >
                  <a className="nav-link" href="https://www.npmjs.com/package/bcrypt">
                    Bcrypt
                  </a>
                </li>
                <li >
                  <a className="nav-link" href="https://jwt.io/">
                    Jsonwebtoken
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
        </div>
      </div>   
    );
  }
}

export default AboutPage;
