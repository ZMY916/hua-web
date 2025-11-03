// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>("/api/auth/user/currentUser", {
    method: "GET",
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>("/api/auth/outLogin", {
    method: "POST",
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(
  body: API.LoginParams,
  options?: { [key: string]: any }
) {
  return request<API.LoginResult>("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    // ...(options || {}),
  });
}

/** 获取设备列表 */
export async function getDeviceList(options?: { [key: string]: any }) {
  return request<any>("/api/auth/device/list", {
    method: "GET",
    ...(options || {}),
  });
}

//获取设备属性
export async function getDeviceOptions(options?: { [key: string]: any }) {
  
  return request<any>("/api/auth/device/options", {
    method: "GET",
    params: {...options},
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
// export async function removeRule(options?: { [key: string]: any }) {
//   return request<Record<string, any>>("/api/rule", {
//     method: "POST",
//     data: {
//       method: "delete",
//       ...(options || {}),
//     },
//   });
// }
