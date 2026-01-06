import http from "./index"


//登录
export function login(params={},headers={"Content-Type": "application/json"}){
    return http.get("user",{params},headers)
}
//获取数据
export function getlist(params={},headers={"Content-Type": "application/json"}){
    return http.get("list",{params,headers})
}
//添加
export function add(params={},headers={"Content-Type": "application/json"}){
    return http.post("list",params,headers)
}
// 修改（PUT 请求，通常用于完整更新资源）
export function update(params = {}, headers = {"Content-Type": "application/json"}) {
  return http.put(`list/${params.id}`,  params, headers )
}

// 部分修改（PATCH 请求，用于部分更新资源）
export function patchUpdate(params = {}, headers = {"Content-Type": "application/json"}) {
  return http.patch(`list/${params.id}`,  params, headers )
}

// 删除
export function remove(params = {}, headers = {"Content-Type": "application/json"}) {
  return http.delete("list/"+params.id,  {params, headers} )
}