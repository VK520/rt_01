import React from 'react'
import { Outlet } from 'react-router-dom'
import { ConfigProvider } from 'antd';

export default function App() {
  return (
    <ConfigProvider theme={{
      token: { colorPrimary: '#1890ff', fontSize: 14, borderRadius: 4 }
    }}>
      <Outlet />
    </ConfigProvider>
  )
}
