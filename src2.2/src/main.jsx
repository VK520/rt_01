import React from 'react'
import { StrictMode } from 'react' //从react导出一个严格模式的组件
import { createRoot } from 'react-dom/client' //导出一个把react代码编译成虚拟DOM的方法
import App from './App.jsx' //导入app组件
import { RouterProvider } from 'react-router-dom'
import router from './Router/index.jsx'
import { Provider } from 'react-redux'
import store from './store'
createRoot(document.getElementById('root')).render(
  //给react所有的组件开启严格模式
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}>
    </RouterProvider>
    </Provider>
  </React.StrictMode>,
)
