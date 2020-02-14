import { observable, action } from "mobx";

/**
 * 个人信息存储
 */
class userInfo {
  @observable user = {
    userName: String,
    nickName: String,
    email: String,
    phone: Number,
    ID: String,
    Portrait: String
  };

  /**
   * 设置个人信息
   */
  @action.bound setUserInfo(user) {
    this.user.userName = user.username;
    this.user.nickName = user.nickname || "游客B243";
    this.user.email = user.email;
    this.user.phone = user.phone;
    this.user.ID = user.ID;
  }

  /**
   * 更新个人信息
   */
  @action.bound updateUserInfo(user) {
    this.user.userName = user.username;
    this.user.nickName = user.nickname;
    this.user.email = user.email;
    this.user.ID = user.real_auth_id;
  }

  @action.bound setUserPortrait(user) {}
}

export default userInfo;
