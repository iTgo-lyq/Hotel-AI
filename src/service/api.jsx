//*********API实现和路由拦截***********

import Taro from "@tarojs/taro";
import { HTTP_STATUS } from "@constants/status";
import { HTTP } from "@constants/api";

/**
 * originAPI
 */
const baseOptions = (param, method = "GET") => {
  let { url, data } = param;
  let contentType = "application/json";
  contentType = param.contentType || contentType;
  const option = {
    // url: url.indexOf("http") !== -1 ? url : "http://" + url,
    url: url,
    data: data,
    method: method,
    header: {
      "content-type": contentType,
      Authorization: "",
    },
    mode: "cors",
    success(res) {
      console.log(res)
      if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
        return console.log("api", "请求资源不存在");
      } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
        return console.log("api", "服务端出现了问题");
      } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
        let path = getCurrentPageUrl();
        if (path !== "pages/login/login") {
          Taro.navigateTo({
            url: "/pages/login/login",
          });
        }
        return console.log("api", "没有权限访问");
      } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
        let path = getCurrentPageUrl();
        if (path !== "pages/login/login") {
          Taro.navigateTo({
            url: "/pages/login/login",
          });
        }
        return console.log("api", "需要鉴权");
      } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
        return res.data;
      } else if (res.statusCode === HTTP_STATUS.SERVER_ERROR) {
        return console.log("请求失败");
      }
    },
    fail(e) {
      console.log("api", "请求接口出现问题", e);
    },
  };
  return Taro.request(option);
};

export const get = (url, data = "") => {
  let option = {
    url,
    data,
  };
  return baseOptions(option);
};

export const post = (url, data, contentType) => {
  let params = {
    url,
    data,
    contentType,
  };
  console.log(params);
  return baseOptions(params, "POST");
};
export const put = (url, data = "") => {
  let option = {
    url,
    data,
  };
  return baseOptions(option, "PUT");
};
/**
 * delete
 */
export const delet = (url, data = "") => {
  let option = {
    url,
    data,
  };
  return baseOptions(option, "DELETE");
};
