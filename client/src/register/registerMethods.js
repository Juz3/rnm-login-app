 /**
 *  <registerMethods.js>
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
  ModalFooter } from 'reactstrap';

import { Redirect } from 'react-router-dom';

import LoginMethods from '../login/loginMethods';

class RegisterMethods extends React.Component {
  constructor(props) {
    super(props);
    this.state= { 
        username: '',
        loginID: '',
        //statusRole: 1,
        email: '',
        password: '',
        newUserCreated: false,
        modal: false,
        registerModalContent: 'placeholdervalue'
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  // client side registration validation function before sending to server
  validateRegister(payload) {

    console.log("payload name:", payload.name)

    let userNameValid = false;
    let loginIdValid = false;
    let userEmailValid = false;
    let loginPwValid = false;

    const loginIdNonWhiteSpacePattern = /\s/;
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
      console.log("register digit regex match:", matchLoginIdNonWhiteSpace);

      
      let matchLoginIdIllegal = illegalCharPattern.test(payload.login);
      console.log("register loginID legalchars:", matchLoginIdIllegal);

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
    

    // When data is valid, return true and continue register post.
    if(userNameValid && loginIdValid && userEmailValid && loginPwValid) {
      
      return true;

    } else {

      console.log("Registration data is invalid");
      return false;
    }
  }

  handleClick(event) {

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
      "name": self.state.username,
      "login": self.state.loginID,
      "status": 1,
      "email": self.state.email,
      "password": self.state.password
    }

    if(this.validateRegister(payload)) {

      // create http post request
      axios.post(apiBaseUrl+'register', payload)
      .then(function (response) {
          //console.log(response);
          
          if(response.data.code === 200) {
            console.log("registration successful");

            self.setState({
              modal: true,
              registerModalContent: 'User created successfully',
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
    } else {
      // error before post
      console.log("ValidateRegister returned false, check validation");
      
      self.setState({
        modal: true,
        registerModalContent: 'Invalid input. Check requirements'
      });
    }
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
              <Container className="registerForm">
                <Row className="registerForm">
                  <div className="registerForm">
                    <Form>
                      <FormGroup>
                        <Label for="Name">First and last name</Label>
                        <Input type="text" name="username" id="username" 
                        placeholder="First and last name" 
                        onChange = {(event) => 
                          this.setState({
                            username:event.target.value
                          })
                        }/>
                      </FormGroup>
                      <FormGroup>
                        <Label for="LoginID">Username</Label>
                        <Input type="text" name="loginID" id="loginID" 
                        placeholder="Username" 
                        onChange = {(event) => 
                          this.setState({
                              loginID:event.target.value
                            })
                          }/>
                      </FormGroup>
                      <FormGroup>
                        <Label for="email">Email</Label>
                        <Input type="email" name="email" id="email" 
                        placeholder="Email address" 
                        onChange = {(event) => 
                          this.setState({
                            email:event.target.value
                          })
                        }/>
                      </FormGroup>
                      <FormGroup>
                        <Label for="pw">Password</Label>
                        <Input type="password" name="password" id="password" 
                        placeholder="Password" 
                        onChange = {(event) => 
                          this.setState({
                            password:event.target.value
                          })
                        }/>
                      </FormGroup>
                      <Button className="submitBtn-register" 
                        onClick={(event) => 
                          this.handleClick(event)}>
                          Register
                      </Button>
                    </Form>
                    <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
                      <ModalBody className="registerModal">
                        {this.state.registerModalContent}
                      </ModalBody>
                      <ModalFooter className="registerModal">
                        <Button className="submitBtn-register" onClick={this.toggleModal}>OK</Button>{' '}
                        <Button className="submitBtn-register" onClick={this.toggleModal}>Cancel</Button>
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

export default RegisterMethods;