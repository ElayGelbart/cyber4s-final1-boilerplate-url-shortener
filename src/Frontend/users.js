'use strict'
// const Host = `https://egshorturl.herokuapp.com`;
const Host = `http://localhost:8080`;

const signupToWebsite = () => {
  const usernameValue = document.getElementById("signupUsernameInput").value;
  const passwordValue = document.getElementById("signupPasswordInput").value;
  const rePasswordValue = document.getElementById("signupRePasswordInput").value;
  if (passwordValue != rePasswordValue) {
    createErrorInputUI(document.getElementById("signupRePasswordInput"), "Passwords don't match");
    return
  }
  if (!validator.isLength(usernameValue, { min: 3, max: 15 }) || !validator.isAlphanumeric(newURLvalue)) {
    createErrorInputUI(document.getElementById("signupUsernameInput"), "Username invalid");
    return
  }
  if (!validator.isStrongPassword(passwordValue, { minLength: 8, maxLength: 30, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
    createErrorInputUI(document.getElementById("signupPasswordInput"), "Password not Strong enough");
    return
  }
  try {
    const response = await axios.post(`${Host}/users/signup`, { username: usernameValue, password: passwordValue });
    clearBadInput();
  } catch (err) {
    createErrorInputUI(document.getElementById("signupUsernameInput"), "Username Taken");
  }
}