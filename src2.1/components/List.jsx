import dayjs from 'dayjs'
import React, { useContext, useState, useEffect } from 'react'
import myContext from '../context/context'
import { getlist, remove, update } from '../request/api'
import'@ant-design/v5-patch-for-react-19'
import { message } from 'antd'
export default function List() {
    const { userdata, content, huifu ,list,del,delone } = useContext(myContext)
    
    

    return (
        <div>
            {
                list.map(item => {
                    return (
                        <ul key={item.id}>
                            <li>{item.uname}</li>
                            <p>{item.text}</p>
                            <p>{dayjs(item.time).format('YYYY/MM/DD  HH:mm:ss')}</p>
                            <button onClick={() => huifu(item)}>回复</button>
                            <button onClick={() => del(item)}>删除</button>
                            {
                                item.hui.length > 0 &&
                                item.hui.map(i => {
                                    return (
                                        <div style={{ marginLeft: 20 }}>
                                            <li>{i.uname}</li>
                                            <p>{i.text}</p>
                                            <p>{dayjs(i.time).format('YYYY/MM/DD  HH:mm:ss')}</p>
                                            <button onClick={()=>{delone(item,i)}}>删除</button>
                                        </div>
                                    )
                                })
                            }
                        </ul>
                    )
                })
            }
        </div>
    )
}
