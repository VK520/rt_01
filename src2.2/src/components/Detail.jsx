import React from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import { Search } from 'react-vant'
export default function Detail() {
  let navigate=useNavigate()
  console.log(useLocation().search.split('=')[1])
  let [data,seData]=useLocation().search.split('=')[1]
  return (
    <div>
      <Search placeholder="input search text" style={{ width: 350 }} onFocus={()=>{navigate(-1)}} />
    </div>
  )
}
