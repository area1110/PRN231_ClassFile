import * as Route from "./common/routing.js";
import * as Const from "./common/const.js";

import { config } from "./common/config.js";
import { login } from "./component/auth/login.js";
import { index } from "./component/index.js";
import { signup } from "./component/auth/signup.js";
import { classAction } from "./component/class/class.js";
import { createPost } from "./component/post/create.js";
import { editProfile } from "./component/user/editprofile.js";
import { createClass } from "./component/class/create.js";
import { editPost } from "./component/post/edit.js";
import { classMember } from "./component/class/member.js";
import { editClass } from "./component/class/edit.js";

async function main() {
  await Route.includeHTML();
  Route.addAuthHeader();
  config();
  Route.logout();

  if (!Route.verifyAuth()) {
    return;
  }

  // Đăng kí các function với URL html
  if (Route.checkPath(Const.Path.Login)) {
    login();
  } else if (Route.checkPath(Const.Path.Index)) {
    index();
  } else if (Route.checkPath(Const.Path.Signup)) {
    signup();
  } else if (Route.checkPath(Const.Path.Class.Index)) {
    classAction();
  } else if (Route.checkPath(Const.Path.Post.Create)) {
    createPost();
  } else if (Route.checkPath(Const.Path.User.Edit)) {
    editProfile();
  } else if (Route.checkPath(Const.Path.Class.Create)) {
    createClass();
  } else if (Route.checkPath(Const.Path.Post.Edit)) {
    editPost();
  } else if (Route.checkPath(Const.Path.Class.Member)) {
    classMember();
  } else if (Route.checkPath(Const.Path.Class.Edit)) {
    editClass();
  }
}

$(document).ready(main);
