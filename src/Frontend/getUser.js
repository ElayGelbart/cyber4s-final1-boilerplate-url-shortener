const Cookie = document.cookie;
const CookieArr = Cookie.split(";");
for (let value of CookieArr) {
  if (/username/.test(value)) {
    const CookieUserName = value.split("=")[1];
    document.getElementById("userGreeting").innerText = `hello ${CookieUserName}`;
    break;
  }

}