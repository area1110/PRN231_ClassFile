import * as Route from "./routing.js";
import * as Const from "./const.js";

export function config() {
  summerNoteConfig();
  cancelButton();
  ajaxEvent();
}

//Đăng ký cho summerNote
function summerNoteConfig() {
  if ($("textarea.summerNote").length){
    $("textarea.summerNote").summernote({
      lang: "vi-VN",
      height: 200,
    });
  }
}

// Đăng ký sự kiện cho button cancel(back)
function cancelButton() {
  $("button.cancelButton").click(function (event) {
    event.preventDefault();
    Route.back();
  });
}

// Đăng ký sự kiện Ajax
function ajaxEvent() {
  $(document).ajaxSend(function (event, xhr, settings) {
    if (
      settings.type === Const.HttpMethod.POST ||
      settings.type === Const.HttpMethod.PUT ||
      settings.type === Const.HttpMethod.DELETE
    )
      Swal.fire({
        title: Const.Message.Process,
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
  });

  $(document).ajaxSuccess(function (event, xhr, settings) {
    if (settings.suppressGlobalComplete) {
      return;
    }
    if (
      settings.type === Const.HttpMethod.POST ||
      settings.type === Const.HttpMethod.PUT ||
      settings.type === Const.HttpMethod.DELETE
    ) {
      Swal.fire({
        icon: "success",
        title: Const.Message.Success,
        showConfirmButton: false,
        timer: 1500,
      }).then(Route.back);
    }
  });

  $(document).ajaxError(function (event, xhr, settings) {
    console.log(xhr.responseJSON);
    let message = "";
    if (xhr.status === Const.HttpCode.UnAuthorized) {
      Route.redirect(Const.Path.Login);
    }
    if (xhr.status === 0) {
      message = Const.Message.ServerNotConnect;
    } else {
      message = xhr.responseJSON?.message;
    }
    Swal.fire({
      icon: "error",
      title: Const.Message.Oops,
      text: message,
      footer: xhr.status + " - " + xhr.statusText,
    }).then(function () {
      // Thực hiện các hành động sau khi báo lỗi
      if (xhr.status === Const.HttpCode.Forbiden) {
        Route.back();
      }
    });
  });
}
