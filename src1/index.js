/* 
  react:提供React的核心语法功能(组件/hook/虛拟DOM/基础语法useState useEffect....)
  react-dom:把React渲染到浏览器的DOM结构中ReactDOM.render(渲染的结构)
  react-script:提供项目构建 编译 运行工具 eg:npm start npm run build
6   
*/

import { StrictMode, Fragment } from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App'
// import App1 from './App1'
import App2 from './App2'

// const arr = [
//   { id:1,"name": "王", "age": 12, "children": [1, 3] },
//   { id:2,"name": "赵", "age": 12, "children": [1, 4] },
//   { id:3,"name": "杨", "age": 12, "children": [1, 5] },

// ]

// const change=()=>{
//   console.log(change);
  
// }
// document.getElementById用于获取id为root的标签 这个标签一般在public/index.html
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  // React.strictMode代表的是使用严格模式渲染组件
  /* 严格模式： 1-识别不安全的生命周期
               2-关于使用过时的ref API的警告
               3-意外检测的副作用
               4-检查过时的context API
  */
  <Fragment>
    {/* <div className='top'>man</div>
    <input></input>
    <img src="http://gips1.baidu.com/it/u=1024042145,2716310167&fm=3028&app=3028&f=JPEG&fmt=auto?w=1440&h=2560" alt='hhhhhhhhhh'></img>
    <label htmlFor=''></label> */}

    {/* <ul>
      {arr.map((item,index,arr)=>{
        return (
          <li key="item.id">
            <p>姓名:{item.name}</p>
            <p>年龄:{item.age}</p>
            <p>子女:{
                item.children.map((item1,index1)=>{
                  return(<p> {item1} </p>)
                })
              }</p>
          </li>
        

        )
      })}
    </ul>

    <div onClick={change}>0000</div>
    <div onClick={()=>{change()}}>0000</div> */}

  <App2></App2>
  </Fragment>
)



