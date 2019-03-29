 /**
 *  <signupMethods.js>
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

import {Button,
  Container, 
  Row, 
  Form, 
  FormGroup, 
  Input, 
  Label,
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Tooltip,
  UncontrolledTooltip } from 'reactstrap';

import { Redirect } from 'react-router-dom';

import Login from '../login/login';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state= { 
        name: '',
        loginID: '',
        //statusRole: 1,
        email: '',
        password: '',
        newUserCreated: false,
        modal: false,
        signupModalContent: 'placeholdervalue',
        toggleModalClicked: 0,
        regGuideStyle: {},
        toolTipStyle: {},
        signupValidated: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    this.setState({
      toggleModalClicked: this.state.toggleModalClicked + 1
    });
    if(this.state.toggleModalClicked >= 1) {
      this.setState({
        regGuideStyle: {
          color:'#ff8742',
          fontWeight: 'bold'
        },
        toolTipStyle: {
          color:'#ff8742',
          fontWeight: 'bold'
        }
      })
    }
    console.log("tmc", this.state.toggleModalClicked);
  }

  // client side signup validation function before sending to server
  validateSignup(payload) {

    console.log("payload name:", payload.name)

    let userNameValid = false;
    let loginIdValid = false;
    let userEmailValid = false;
    let loginPwValid = false;

    // for no whitespace in login id
    const loginIdNonWhiteSpacePattern = /\s/;
    // for illegal characters, used in many places
    const illegalCharPattern = /^(?!.*(;|{|\||}|\\|\/)).*$/;

    // username validation
    if(payload.name.length > 4 && payload.name.length < 100) {

      let matchName = illegalCharPattern.test(payload.name);
      console.log("name regex legalchars:", matchName);

      if(matchName) {
        userNameValid = true;
      } else {
        userNameValid = false;
      }
    }

    // loginID validation
    if(payload.login.length > 3 && payload.login.length < 17) {
      
      
      let matchLoginIdNonWhiteSpace = loginIdNonWhiteSpacePattern.test(payload.login);
      console.log("signup digit regex match:", matchLoginIdNonWhiteSpace);

      
      let matchLoginIdIllegal = illegalCharPattern.test(payload.login);
      console.log("signup loginID legalchars:", matchLoginIdIllegal);

      if(!matchLoginIdNonWhiteSpace && matchLoginIdIllegal) {
        loginIdValid = true;
      } else {
        loginIdValid = false;
      }
    }
    
    // email address validation
    if(payload.email.length > 5 && payload.email.length < 100) {

      let mailPattern = /^[A-Z0-9._%+-ÅÄÖ]+@[A-Z0-9.-ÅÄÖ]+\.[A-Z]{2,}$/i

      let matchEmail = mailPattern.test(payload.email);
      console.log("email regex long:", matchEmail);

      let matchEmail_Illegal = illegalCharPattern.test(payload.email);
      console.log("email regex legalchars:", matchEmail_Illegal);

      if(matchEmail && matchEmail_Illegal) {
        userEmailValid = true;
      } else {
        userEmailValid = false;
      }
    }
    
    // Password validation
    if(payload.password.length > 3 && payload.password.length <= 64) {

      let matchPw = illegalCharPattern.test(payload.password);
      console.log("password regex legalchars:", matchPw);

      if(matchPw) {
        loginPwValid = true;
      } else {
        loginPwValid = false;
      }
    }
    

    // When data is valid, return true and continue signup post.
    if(userNameValid && loginIdValid && userEmailValid && loginPwValid) {
      
      return true;

    } else {

      console.log("signup data is invalid");
      return false;
    }
  }

  // check if username is available before creating new
  checkAvailability() {

    var apiBaseUrl;

    if(process.env.NODE_ENV === 'production') {
      apiBaseUrl = "https://peaceful-fortress-30481.herokuapp.com/api/";
    } else {
      apiBaseUrl = "http://localhost:5000/api/";
    }

    // this object
    var self = this;

    // request payload

    var payload = {
      "name": self.state.name,
      "login": self.state.loginID,
      "status": 1,
      "email": self.state.email,
      "password": self.state.password
    }

    if(this.validateSignup(payload)) {

      // AXIOS POST HERE,
      // create http post request
      axios.post(apiBaseUrl+'checkSignupValid', payload)
      .then(function (response) {
          //console.log(response);
          
          if(response.data.status === 200) {
            console.log("Signup form data is valid");

            self.setState({
              signupValidated: true
            });
            console.log("res ",response.data);
            console.log("signupValidated");

            if(self.state.signupValidated) {
              
              self.userSignup();
            }

          } else if(response.data.status === 400) {
            console.log("Bad request, HTTP 400");

          } else if(response.data.status === 204) {
            console.log("Request Success, Username already in use");
            alert("Username already in use. (INSERT MODAL HERE)");
          } else {
            console.log("error occurred at signup validation: ",response.data);
          }
      })
      .catch(function (error) {
          console.log("error in axios post", error);
      });

    } else {
      // error before post
      console.log("ValidateSignup returned false, check validation");
      
      self.setState({
        modal: true,
        signupModalContent: 'Invalid input. Check requirements'
      });
    }
  }

  // create new user
  userSignup() {

    var apiBaseUrl;

    if(process.env.NODE_ENV === 'production') {
      apiBaseUrl = "https://peaceful-fortress-30481.herokuapp.com/api/";
    } else {
      apiBaseUrl = "http://localhost:5000/api/";
    }

    var self = this;

    var payload = {
      "name": self.state.name,
      "login": self.state.loginID,
      "status": 1,
      "email": self.state.email,
      "password": self.state.password
    }

    // create http post request
    axios.post(apiBaseUrl+'signup', payload)
    .then(function (response) {
        //console.log(response);
        
        if(response.data.code === 200) {
          console.log("signup successful");

          self.setState({
            modal: true,
            signupModalContent: 'User created successfully',
            newUserCreated:true
          });
          alert("New user created. modal?");
        } else {
          console.log("error occurred: ",response.data.code);
        }
    })
    .catch(function (error) {
        console.log("error in axios post", error);
    });

  }

  showRequirements(event) {
    console.log("REQUIREMENTS SHOW");
  }

  render() {
    // After login, redirect to home page
    if(this.state.newUserCreated) {
      return(
        <Redirect to="/home"/>
      )
    } else  {
      return (
        <div> 
          <div className="mainContainer">
              <Container className="signupForm">
                <Row className="signupForm">
                  <div className="signupForm">
                    <Form>
                      <FormGroup>
                        <Label for="Name">First and last name</Label>
                        <p className="regGuidePara" style={this.state.regGuideStyle}>4-100 characters, no numbers</p>
                        <Input type="text" name="name" id="name" 
                        placeholder="First and last name" 
                        onChange = {(event) => 
                          this.setState({
                            name:event.target.value
                          })
                        }>
                        </Input>
                        <UncontrolledTooltip className="regTooltip" placement="right" target="name" style={this.state.toolTipStyle}>
                          4-100 characters, no numbers
                        </UncontrolledTooltip>
                      </FormGroup>
                      <FormGroup>
                        <Label for="LoginID">Username</Label>
                        <p className="regGuidePara" style={this.state.regGuideStyle}>4-16 characters, no white space</p>
                        <Input type="text" name="loginID" id="loginID" 
                        placeholder="Username" 
                        onChange = {(event) => 
                          this.setState({
                              loginID:event.target.value
                            })
                          }>
                        </Input>
                        <UncontrolledTooltip className="regTooltip" placement="right" target="loginID" style={this.state.toolTipStyle}>
                        4-16 characters, no white space
                        </UncontrolledTooltip>
                      </FormGroup>
                      <FormGroup>
                        <Label for="email">Email</Label>
                        <p className="regGuidePara" style={this.state.regGuideStyle}>6-100 characters, something@some.domain</p>
                        <Input type="email" name="email" id="email" 
                        placeholder="Email address" 
                        onChange = {(event) => 
                          this.setState({
                            email:event.target.value
                          })
                        }>
                        </Input>
                        <UncontrolledTooltip className="regTooltip" placement="right" target="email" style={this.state.toolTipStyle}>
                          6-100 characters, something@some.domain
                        </UncontrolledTooltip>
                      </FormGroup>
                      <FormGroup>
                        <Label for="pw">Password</Label>
                        <p className="regGuidePara" style={this.state.regGuideStyle}>4-64 characters</p>
                        <Input type="password" name="password" id="password" 
                        placeholder="Password" 
                        onChange = {(event) => 
                          this.setState({
                            password:event.target.value
                          })
                        }>
                        </Input>
                        <UncontrolledTooltip className="regTooltip" placement="right" target="password" style={this.state.toolTipStyle}>
                          4-64 characters
                        </UncontrolledTooltip>
                      </FormGroup>
                      <Button className="submitBtn-signup" 
                        onClick={ () => 
                          //this.userSignup(event)}>
                          this.checkAvailability()}>
                          Sign up
                      </Button>
                    </Form>
                    <Modal size="sm" centered fade isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
                      <ModalBody className="signupModal">
                        {this.state.signupModalContent}
                      </ModalBody>
                      <ModalFooter className="signupModal">
                        <Button onClick={this.toggleModal}>OK</Button>
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

export default Signup;