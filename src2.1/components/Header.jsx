import React,{useContext} from 'react'
import myContext from '../context/context'

export default function Header() {
    const {userdata} = useContext(myContext)
  return (
    <div>
      <h1>留言板</h1>
      <h3>当前用户名:{userdata.username}</h3>
    </div>
  )
}
