'use strict'

const signupToWebsite = async () => {
  const usernameValue = document.getElementById("signupUsernameInput").value;
  const passwordValue = document.getElementById("signupPasswordInput").value;
  const rePasswordValue = document.getElementById("signupRePasswordInput").value;
  if (passwordValue != rePasswordValue) {
    createErrorInputUI(document.getElementById("signupRePasswordInput"), "Passwords don't match");
    return
  }
  if (!validator.isLength(usernameValue, { min: 3, max: 15 }) || !validator.isAlphanumeric(usernameValue)) {
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
};

const loginToWebsite = async () => {
  const usernameValue = document.getElementById("loginUsernameInput").value;
  const passwordValue = document.getElementById("loginPasswordInput").value;
  try {
    const response = await axios.post(`${Host}/users/login`, { username: usernameValue, password: passwordValue });
    clearBadInput();
    alert("logged")
  } catch (err) {
    createErrorInputUI(document.getElementById("loginPasswordInput"), "Failed");
  }
}

document.getElementById("signupBtn").addEventListener("click", signupToWebsite);
document.getElementById("loginBtn").addEventListener("click", loginToWebsite);