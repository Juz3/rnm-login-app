/**
 *  <validate.js>
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
 * @author Jussi Koivumäki
 * 
 * First edit 2018-11-13
 * 
 * This is an external server-side validation file, which is called from routes.
 *
 */

var validationMethods = {};

// non-allowed chars, separated by comma: ";, {, \, |, }, /"
const illegalCharPattern = /^(?!.*(;|{|\||}|\\|\/)).*$/

// Request validation
validationMethods.validateRequest = function (requestBody) {

  let bodyLengthJson = JSON.stringify(requestBody).length;

  const maxBodyLength = 160;
  const minBodyLength = 30;
  
  console.log("req body length:", JSON.stringify(requestBody).length);

  // check for appropriate length of request body object as a string.
  if(bodyLengthJson < maxBodyLength && bodyLengthJson > minBodyLength) {

    console.log("request ok");
    return true;

  // send false for invalid requests
  } else {
    console.log("request invalid");
    return false;
  }
}

// Login validation
validationMethods.validateLogin = function (login, password) {

  console.log("inside server validation function.")

  let validLogin = false;
  let validPassword = false;

  // 4-16 characters with no white-space.
  if(login.length > 3 && login.length < 17) {

    let illegalLoginIdPattern = illegalCharPattern;
    let loginIdNonWhiteSpacePattern = /\s/
    let matchLoginId = illegalLoginIdPattern.test(login);
    let matchNonWhiteSpace = loginIdNonWhiteSpacePattern.test(login);
    console.log("login regex match:", matchLoginId, matchNonWhiteSpace);

    // negative, because if whitespace, = true! we dont want any in loginid.
    if(!matchNonWhiteSpace && matchLoginId) {
      validLogin = true;
    } else {
      validLogin = false;
    }
  }

  if(password.length > 3 && password.length < 65) {

    let pwPattern = illegalCharPattern;
    let matchPw = pwPattern.test(password);
    console.log("password regex match:", matchPw);

    if(matchPw) {
      validPassword = true;
    } else {
      validPassword = false;
    }
  }

  // if both login and password are valid, return true.
  if(validLogin && validPassword) {
    return true;
  } else {
    return false;
  }
};


// Register validation
validationMethods.validateRegister = function (userData) {
  //-----codehere------
  let validName = false;
  let validLogin = false;
  let validPassword = false;
  let validEmail = false;
  // status set to true for all for now
  let validStatus = true;

  console.log("userdata object:", userData);

  let name = userData[0];
  let login = userData[1];
  // let status = userData[2];
  let email = userData[3];
  let password = userData[4];


  if(name.length > 4 && name.length < 100) {
    let illegalNamePattern = /^(?!.*(\d|;|{|\||}|\\|\/)).*$/
    let matchName = illegalNamePattern.test(name);
    console.log("reg name regex match:", matchName);

    if(matchName) {
      validName = true;
    } else {
      validName = false;
    }
  }

  // 4-16 characters with no white-space.
  if(login.length > 3 && login.length < 17) {

    let illegalLoginIdPattern = illegalCharPattern;
    let loginIdNonWhiteSpacePattern = /\s/
    let matchLoginId = illegalLoginIdPattern.test(login);
    let matchNonWhiteSpace = loginIdNonWhiteSpacePattern.test(login);
    console.log("reg login regex match:", matchLoginId, matchNonWhiteSpace);

    // negative, because if whitespace, = true! we dont want any in loginid.
    if(!matchNonWhiteSpace && matchLoginId) {
      validLogin = true;
    } else {
      validLogin = false;
    }
  }

  if(password.length > 3 && password.length < 65) {
    // not allowed chars in following regex: "; { \ | } /"
    let pwPattern = illegalCharPattern;
    let matchPw = pwPattern.test(password);
    console.log("reg password regex match:", matchPw);

    if(matchPw) {
      validPassword = true;
    } else {
      validPassword = false;
    }
  }

  if(email.length > 5 && email.length < 100) {
    let emailPattern = illegalCharPattern;
    let matchEmail = emailPattern.test(email);
    console.log("reg email regex match:", matchEmail);

    if(matchEmail) {
      validEmail = true;
    } else {
      validEmail = false;
    }
  }

  
  console.log("reg status match:", validStatus);

  // if all are valid, return true.
  if(validName && validLogin && validPassword && validEmail && validStatus) {
    return true;
  } else {
    console.log("reg regex all:", validName, validLogin, validPassword, validEmail, validStatus);
    return false;
    
  }
};

/*
// Search validation
validationMethods.validateSearch = function (parameters) {
  //-----codehere------
};

// Add-to-Storage validation
validationMethods.validateAddToStorage = function (parameters) {
  //-----codehere------
};
*/

exports.data = validationMethods;
