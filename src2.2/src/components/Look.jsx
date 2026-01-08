
import React,{useState} from 'react'
import { Search, Space,Button,Cell,List } from 'react-vant';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux'
import { addHistory } from '../store/modules/HistorySlice';
export default function Look() {
  let {history}=useSelector(state=>state.HistorySlice)
  let dispatch=useDispatch()
  let add=(name)=>{
    dispatch(addHistory(name))
  }
  let navigate=useNavigate()
  let [issearch,setIsSearch]=useState(false)
  let [list,setList]=useState([])
  let searchList=[
    {id:1,name:'火影'},
    {id:2,name:'海贼王'},
    {id:3,name:'咒术回战'},
    {id:4,name:'动漫'},
    {id:5,name:'原神'},
    {id:6,name:'绝区零'}
  ]
  let [searchContext,setSearchContext]=useState('')
  let sousuo=(name)=>{
    setIsSearch(true)
    getlist(name)
    add(name)
  }
  let onClose=()=>{
    setIsSearch(false)
    setSearchContext('')
  }
  let changeInput=(e)=>{
    setSearchContext(e)
  }
  let getlist=async (name)=>{
    const params={}
    if(name){
      params.title_like=name
      setSearchContext(name)
    }else{
      params.title_like=searchContext
    }
    
    let res=await axios.get('http://localhost:3000/list',{params})
    setList(res.data)
  }
  return (
    <div>
      <Search style={{ width: 350 }} onSearch={()=>sousuo()} value={searchContext} onChange={(e)=>changeInput(e)} autoFocus onClear={()=>onClose()}/>
      {issearch===false&&<div>
        <p>大家都在搜</p>
        <Space align="center">
          {searchList.map(item=>(
            <Button key={item.id} onClick={()=>sousuo(item.name)}>{item.name}</Button>
          ))}
        </Space>
      </div>}
      <h3>历史搜索记录</h3>
      <ul style={{display:'flex',gap:'20px',alignItems:'center',flexWrap:'wrap'}}>
        <li></li>
      </ul>
      {
          issearch&&
          <div>
            <List>
          {list.map((item, i) => (
            <Cell key={i}>
              <img src={item.img} alt="" style={{ width: '200px', height: '100px' }} />
              <p>{item.title}</p>
            </Cell>
          ))}
        </List>
          </div>
        }
        {history}
    </div>
  )
}
