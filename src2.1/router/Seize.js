import React from 'react'
import { Navigate } from 'react-router-dom'
import { message } from 'antd'
import'@ant-design/v5-patch-for-react-19'
export default function Seize(props) {
  const data = props.children
  let token = localStorage.getItem('token')
  if(!token){
     message.warning('请先登录')
    return <Navigate to='/login' />
  }else {
    return data
  }
}
