 /**
 *  <loginMethods.js>
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
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';

import {
  Button,
  Container, 
  Row, 
  Form, 
  FormGroup, 
  Input, 
  Label,
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter
} from 'reactstrap';

class Login extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = { 
        loginID: '',
        password: '',
        isLogged: false,
        authToken: '',
        userID: '',
        loginModal: false,
        loginModalContent: 'placeholderValue',
        passwordRecoveryModalContent: 'placeholderz',
        passwordRecoveryModal: false,
        sendPasswordRecoveryEmail: false,
        recoveryEmail: 'placeholderRecoveryEmail'
    };

    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.togglePasswordRecoveryModal = this.togglePasswordRecoveryModal.bind(this);
    this.sendPasswordRecoveryEmail = this.sendPasswordRecoveryEmail.bind(this);
  }

  toggleLoginModal() {
    this.setState(prevState => ({
      loginModal: !prevState.loginModal
    }));
  }

  togglePasswordRecoveryModal() {
    this.setState(prevState => ({
      passwordRecoveryModal: !prevState.passwordRecoveryModal
    }));
  }

  sendPasswordRecoveryEmail() {
    console.log("given email address: ", this.state.recoveryEmail);
    this.setState({
      recoveryEmail: 'placeholderRecoveryEmail'
    });
  }

  onKeyPress(event) {
    if (event.which === 13 /* 13 == Enter-key */) {
      //console.log("event",event);
      event.preventDefault();

      this.handleClick(event);
    }
  }

  logInput(event) {
    console.log(event.target.value)
    this.setState({
      loginID:event.target.value
    })
  }

  // client side login validation function before sending to server
  validateLogin(login, password) {

    let loginIdValid = false;
    let loginPwValid = false;

    const loginIdNonWhiteSpacePattern = /\s/;
    const illegalCharPattern = /^(?!.*(;|{|\||}|\\|\/)).*$/;

    // loginID
    if(login.length > 3 && login.length < 17) {
      
      let matchLoginIdNonWhiteSpace = loginIdNonWhiteSpacePattern.test(login);
      console.log("login regex match:", matchLoginIdNonWhiteSpace);

      let matchLoginIdIllegal = illegalCharPattern.test(login);
      console.log("login illegal regex match:", matchLoginIdIllegal);

      if(!matchLoginIdNonWhiteSpace && matchLoginIdIllegal) {
        loginIdValid = true;
      } else {
        loginIdValid = false;
      }
    }

    // Password
    if(password.length > 3 && password.length <= 64) {
      
      let pwPattern = illegalCharPattern;

      let matchPw = pwPattern.test(password);

      console.log("password regex match:", matchPw);

      if(matchPw) {
        loginPwValid = true;
      } else {
        loginPwValid = false;
      }
    }

    // When both loginID and pw are valid, return true and continue login post.
    if(loginIdValid && loginPwValid) {
      
      return true;

    } else {

      console.log("Login ID or password is invalid");
      return false;
    }
  }

  handleClick(event){
    // api url
    var apiBaseUrl;
    if(process.env.NODE_ENV === 'production') {
      apiBaseUrl = "https://peaceful-fortress-30481.herokuapp.com/api/";
    } else {
      apiBaseUrl = "http://localhost:5000/api/";
    }

    // this object  
    var self = this;

    const cookies = new Cookies();

    // run client-side validation:
    if(this.validateLogin(self.state.loginID, self.state.password)) {
      
      // payload strings: These need to match table column names
      // Do not log this, because security.
      var payload = {
        "login": self.state.loginID,
        "password": self.state.password
      }

      // syntax: Axios.post().then().catch();
      axios.post(apiBaseUrl+'login', payload)
      .then(function (response) {
          // Axios response
          if(response.data.code === 200) {
            // LOGIN SUCCESS:
              self.setState({
                authToken: response.data.token,
                userID: response.data.userID
              });
              //console.log(self.state.authToken.payload["userID"].string);
              
              // Set JWT cookie, if identical one does not exist
              if(cookies.get('jwtAuth') === self.state.authToken) {
                //console.log("cookie match existing one");
              } else {
                // set jwt as cookie
                cookies.set('jwtAuth', self.state.authToken, { path: '/'});
              }

              self.setState({
                isLogged:true
              })
              console.log("Login successful! (loginmethods.js) login:", 
              self.state.isLogged + ", user ID: " + self.state.userID);

          } else if(response.data.code === 204) {

              //alert("Invalid username or password.");
              self.setState({
                loginModal: true,
                loginModalContent: 'Invalid username or password.'
              });
              
          } else {
              // Here might be a bug if jwt is not valid!!
              console.log(response.data.code)
              alert("name does not exist");
          }
      })
      // If there's an error
      .catch(function (error) {
          // log error
          alert("Sign in error, see console log");
          console.log("error in axios post", error);
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('error in response', error.response.data);
            console.log('error in response', error.response.status);
            console.log('error in response', error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser, 
            // and an instance of http.ClientRequest in node.js
            console.log('error in request', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error elsewhere', error.message);
          }
          console.log('error config: ', error.config);
      });
    } else {
      // error before post
      console.log("ValidateLogin returned false, check validation");
      //alert("Tarkista käyttäjätunnus ja salasana");
      self.setState({
        loginModal: true,
        loginModalContent: 'Invalid username or password.'
      });
    }
  }

  passwordRecovery(event) {

    var self = this;
    //alert("NODEMAILER HERE");
    self.setState({
      passwordRecoveryModal: true,
      passwordRecoveryModalContent: ''
    });
  }

  render() {
    
    // After login, redirect to home page
    if(this.state.isLogged) {
      return(
        <Redirect to="/home"/>
      )
    } else  {
      return (
        <div> 
          <div className="mainContainer">
              <Container className="loginForm">
                <Row className="loginForm">
                  <div className="loginForm">
                    <Form>
                      <FormGroup>
                        <Label for="loginID">Username</Label>
                        <Input type="text" name="text" id="loginID" 
                          placeholder="Username" 
                          onChange = {(event) => 
                            this.setState({
                              loginID:event.target.value
                            })
                          }
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="password">Password</Label>
                        <Input type="password" name="text" id="password" 
                          placeholder="Password" 
                          onChange = {(event) => 
                            this.setState({
                              password:event.target.value
                            })
                          }
                          onKeyPress = {(event) => 
                            this.onKeyPress(event)
                          } 
                        />
                      </FormGroup>

                    </Form>
                    <ul className="loginBtnList">
                      <li>
                      <Button 
                        className="submitBtn-login" 
                        id="submit-login" 
                        
                        onClick={(event) => {
                          this.handleClick(event);
                        }}>                        
                        Log in
                      </Button>
                      </li>
                      <li>
                        <Button 
                          className="pwRecoveryBtn" 
                          id="forgotPassword"
                          
                          onClick={(event) => {
                            this.passwordRecovery(event);
                          }}>
                          Forgot password?
                        </Button>
                      </li>
                    </ul> 
                    <Modal size="sm" centered fade isOpen={this.state.loginModal} 
                    toggle={this.toggleLoginModal} className={this.props.className}>
                      <ModalBody className="loginModal">
                        {this.state.loginModalContent}
                      </ModalBody>
                      <ModalFooter className="loginModal">
                        <Button onClick={this.toggleLoginModal}>OK</Button>
                      </ModalFooter>
                    </Modal>

                    <Modal size="sm" centered fade isOpen={this.state.passwordRecoveryModal} 
                    toggle={this.togglePasswordRecoveryModal} className={this.props.className}>
                      <ModalBody className="passwordRecoveryModal">
                        {this.state.passwordRecoveryModalContent}
                        <Form>
                          <FormGroup>
                            <Label for="email">Enter email address</Label>
                            <Input type="text" name="text" id="recoveryEmail" 
                              placeholder="Email address" 
                              onChange = {(event) => 
                                this.setState({
                                  recoveryEmail:event.target.value
                                })
                              }
                            />
                          </FormGroup>
                        </Form>
                      </ModalBody>
                      <ModalFooter className="passwordRecoveryModal">
                        <Button onClick={this.sendPasswordRecoveryEmail}>Send</Button>
                        <Button onClick={this.togglePasswordRecoveryModal}>Close</Button>
                      </ModalFooter>
                    </Modal>
                  </div>
                </Row>
              </Container>
          </div>
        </div>
      )
    }

    
  }
}

export default Login;