import * as Route from "./common/routing.js";
import * as Const from "./common/const.js";
import { login } from "./auth/login.js";
import { loadInfo } from "./index.js";

function main() {
  Route.includeHTML();
  Route.addAuthHeader();

  if (Route.verifyAuth()) {
    return;
  }

  if (Route.checkPath(Const.Path.Login)) {
    login();
  } else if (Route.checkPath(Const.Path.Index)) {
    loadInfo();
  }
}

// Đăng ký sự kiện Ajax
$(document).ajaxSend(function (event, xhr, settings) {
  Swal.fire({
    title: "Processing",
    allowEscapeKey: false,
    allowOutsideClick: false,
    timer: 2000,
    didOpen: () => {
      Swal.showLoading();
    },
  });
});
$(document).ajaxError(function (event, xhr, settings) {
  let message = xhr.responseJSON?.message;
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    footer: xhr.status + " - " + xhr.statusText,
  });
});
$(document).ajaxComplete(function (event, xhr, settings) {
  if (xhr.status === Const.HttpCode.UnAuthorized) {
    // Route.redirect(Const.Path.Login);
  } else if (xhr.status === Const.HttpCode.Ok) {
    Swal.fire({
      position: "top-end",
      icon: "success", 
      title: "Successful",
      showConfirmButton: false,
      timer: 1500,
    });
  }
});
$(document).ready(main);
