'use strict'
// const Host = `https://egshorturl.herokuapp.com` remember!;
const Host = `http://localhost:8080`

const sendOldURLToServerWithNameOfNew = async () => {
  const oldURLvalue = document.getElementById("oldURLinput").value;
  const newURLvalue = document.getElementById("newURLinput").value;
  if (!validator.isURL(oldURLvalue)) {
    createErrorInputUI(document.getElementById("oldURLinput"), "Long Url Must Be Valid");
    return
  }
  if (!validator.isLength(newURLvalue, { min: 3, max: 15 })) {
    createErrorInputUI(document.getElementById("newURLinput"), "New Url Name Must be Minimum 3 and Maximum 15");
    return
  }
  if (!validator.isAlphanumeric(newURLvalue)) {
    createErrorInputUI(document.getElementById("newURLinput"), "New Url Name Must Contain Only AlphaBet and Numbers");
    return
  }
  try {
    const response = await axios.post(`${Host}/api/shorturl/${newURLvalue}`, { oldurl: oldURLvalue });
    const fullnewURL = `${Host}/${response.data}`;
    clearBadInput();
    document.getElementById("newURLlink").innerHTML = `New URL Is Born : <a href="${fullnewURL}" target="_blank">${fullnewURL}</a>`
  } catch (err) {
    createErrorInputUI(document.getElementById("newURLinput"), "URL is Taken");
  }
}

const getStatisticFromURL = async () => {
  const userURLValue = document.getElementById("userCustomUrl").value;
  if (!validator.isLength(userURLValue, { min: 3, max: 15 })) {
    createErrorInputUI(document.getElementById("userCustomUrl"), "New Url Name Must be Minimum 3 and Maximum 15");
    return
  }
  if (!validator.isAlphanumeric(userURLValue)) {
    createErrorInputUI(document.getElementById("userCustomUrl"), "New Url Name Must Contain Only AlphaBet and Numbers");
    return
  }
  try {
    const response = await axios.get(`${Host}/api/statistic/${userURLValue}`);
    const responseUrlOBJ = response.data;
    const divStatics = document.createElement("DIV");
    divStatics.classList.add("regularDiv");
    divStatics.innerHTML = `
  <h4>${userURLValue}</h4>
  <div class="statisticParag">
  <p>Special URL Created: <span class="boldWord">${responseUrlOBJ.creationDate}</span></p>
  <p>Number of Entries to URL: <span class="boldWord">${responseUrlOBJ.redirectCount}</span></p>
  <p>Original URL: <a href="${responseUrlOBJ.originalUrl} target="_blank"><span class="boldWord">${responseUrlOBJ.originalUrl}</span></a></p>
  </div>
  `;
    clearBadInput()
    document.getElementById("urlStaticSect").appendChild(divStatics);
  } catch (err) {
    createErrorInputUI(document.getElementById("userCustomUrl"), "Non Existing URL");
  }
}

const clearBadInput = () => {
  const badInputElemArray = document.getElementsByClassName("badInput");
  for (let value of badInputElemArray) {
    value.classList.remove("badInput");
  }
  const badInputParagArray = document.getElementsByClassName("badInputPara");
  for (let value of badInputParagArray) {
    value.remove();
  }
}

const createErrorInputUI = (inputElement, msg) => {
  clearBadInput();
  inputElement.classList.add("badInput");
  const msgPara = document.createElement("P");
  msgPara.classList.add("badInputPara")
  msgPara.innerText = `${msg}`
  inputElement.parentElement.appendChild(msgPara)
}

try {
  document.getElementById("createURLBtn").addEventListener("click", sendOldURLToServerWithNameOfNew);
  document.getElementById("getStatsticBtn").addEventListener("click", getStatisticFromURL);
  document.getElementById("logoutBtn").addEventListener("click", () => {
    document.cookie = `token=;Max-Age=-99999999;`;
    location.reload();
  })





  ///style
  document.getElementById("getUrlLink").addEventListener("click", () => {
    document.getElementById("getUrlSect").style.left = "0%"
    document.getElementById("getUrlLink").classList.add("active");
    document.getElementById("urlStaticSect").style.left = "100%"
    document.getElementById("getStatsLink").classList.remove("active")
    document.getElementById("aboutSect").style.left = "200%"
    document.getElementById("aboutLink").classList.remove("active")
  });
  document.getElementById("getStatsLink").addEventListener("click", () => {
    document.getElementById("getUrlSect").style.left = "-100%"
    document.getElementById("getUrlLink").classList.remove("active")
    document.getElementById("urlStaticSect").style.left = "0%"
    document.getElementById("getStatsLink").classList.add("active")
    document.getElementById("aboutSect").style.left = "100%"
    document.getElementById("aboutLink").classList.remove("active")
  });
  document.getElementById("aboutLink").addEventListener("click", () => {
    document.getElementById("getUrlSect").style.left = "-200%"
    document.getElementById("getUrlLink").classList.remove("active");
    document.getElementById("urlStaticSect").style.left = "-100%"
    document.getElementById("getStatsLink").classList.remove("active")
    document.getElementById("aboutSect").style.left = "0%"
    document.getElementById("aboutLink").classList.add("active");
  });

} catch (err) {

}