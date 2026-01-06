import React, { useState,useEffect } from 'react'
import myContext from '../context/context'
import styled from 'styled-components'
import Header from '../components/Header'
import Publish from '../components/Publish'
import List from '../components/List'
import { add,update,remove,getlist } from '../request/api'
import'@ant-design/v5-patch-for-react-19'
import { message } from 'antd'
const Main = styled.div`
`
export default function Home() {
    const [content,setContent] = useState('')
    const [show,setShow]=useState(true)
    const userdata = JSON.parse(localStorage.getItem('token'))
    const xx = (e)=>{setContent(e.target.value)}
    const fabu = ()=>{
        const obj ={
            uname:userdata.username,
            text:content,
            time:Date.now(),
            hui:[]
        }
        add(obj)
        message.success('发布成功')
        setContent('')
        setShow(!show)
        
    }
    const huifu = (info)=>{
        let obj = {
            uname:userdata.username,
            text:content,
            time:Date.now()
        }
        info.hui.push(obj)
        update(info)
        message.success('回复成功')
        setContent('')
        setShow(!show)
    }
    const del = async (info) => {
        await remove(info)
        message.success('删除成功')
        render()
        setShow(!show)
    }
    const delone = async (obj,info)=>{
        obj.hui=obj.hui.filter(item=> item !== info)
        await update(obj)
        message.success('删除成功')
        render()
        setShow(!show)
    }
    const [list, setList] = useState([])
    const render = async () => {
        let res = await getlist()
        res.sort((a, b) => b.time - a.time)
        setList(res)
    }
    useEffect(() => {
        render()
    }, [show])
    return (
        <Main>
            <myContext.Provider value={{userdata,content,xx,fabu,huifu,list,del,delone}}>
                <Header></Header>
                <Publish></Publish>
                <List></List>
            </myContext.Provider>
        </Main>
    )
}
