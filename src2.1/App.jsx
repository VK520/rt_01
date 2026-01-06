import React, { useEffect, useState } from 'react'
import Router from './router/Router';
import styled from 'styled-components';
import myContext from './context/context';
import'@ant-design/v5-patch-for-react-19'
import { message } from 'antd'
const Main = styled.div`
    margin: 0 auto;
    
`
export default function App() {
    message.config({
        maxCount: 1, // 最多同时显示1个提示
    });
    return (
        <Main>
            <myContext.Provider value={{}}>
                <Router></Router>
            </myContext.Provider>
        </Main>
    )
}

