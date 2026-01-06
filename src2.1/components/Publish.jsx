import React,{useContext,useState,useEffect} from 'react'
import { add } from '../request/api'
import myContext from '../context/context'
export default function Publish() {
    const {userdata,content,xx,fabu} = useContext(myContext)
    
  return (
    <div>
      <textarea name="" id="" style={{width:500,height:100,fontSize:20}} value={content} onChange={xx}></textarea>
      <p><button onClick={()=>fabu()}>发布</button></p>
    </div>
  )
}
