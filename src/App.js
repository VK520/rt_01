import React from "react";
import "./App.css"

class App extends React.Component {
  inputRef = React.createRef()
  state = {
    list: [],
    arr: [],
    filter: 'all' // 过滤状态 all所有 active正在进行 completed已完成
  }
  // 组件挂载时从本地存储中读取数据
  componentDidMount() {
    const saveList = localStorage.getItem('todolist')
    if (saveList) {
      this.setState({ list: JSON.parse(saveList) })
    }
  }
  // 添加
  addInputValue = () => {
    if (!this.inputRef.current.value.trim()) { //非空判断
      alert("内容不得为空，请重新输入！")
      return
    }
    const inputRef = this.inputRef.current.value.trim()
    console.log(inputRef);
    // prelist 旧表 newlist 新表
    this.setState((prelist) => {
      const newlist = [...prelist.list, inputRef];
      localStorage.setItem('todolist', JSON.stringify(newlist))
      return { list: newlist }
    })
    this.inputRef.current.value = ""
  };
  // 单个删除
  delSimpleItem(index) {
    this.setState((prelist) => {
      const newlist = prelist.list.filter((_, i) => i !== index);
      localStorage.setItem('todolist', JSON.stringify(newlist))
      return { list: newlist }
    })
  }
  // 批量删除
  delAllItem() {
    this.setState((prelist) => {
      const newlist = prelist.list.filter((_, i) => !prelist.arr.includes(i))

      localStorage.setItem('todolist', JSON.stringify(newlist));
      return {
        list: newlist,
        arr: []
      }
    });
  }
  // 获取选中的待办事项
  getChecked(e, index) {
    let newArr = [...this.state.arr]
    let i = newArr.indexOf(index)
    if (e.target.checked) {
      if (i === -1) {
        newArr.push(index)
      }
    } else {
      if (i !== -1) {
        newArr.splice(i, 1)
      }
    }
    this.setState({ arr: newArr })
  }
  // 过滤
  setFilter = (filter) => {
    this.setState({ filter })
  }


  render() {
    const { list, arr, filter } = this.state
    const totalCount = list.length // 总列表长度
    const checkedCount = arr.length // 选中的列表长度
    const isNoneChecked = checkedCount === 0 // 判断是否全部未勾选
    const filteredList = list.filter((_, i) => {
      if (filter === 'all') {
        return true
      }
      if (filter === 'active') {
        return !arr.includes(i)
      }
      if (filter === 'completed') {
        return arr.includes(i)
      }
      return false
    })
    const filteredarr = list.reduce((a, _, i) => {
      if ((filter === 'all') ||
        (filter === "active" && !arr.includes(i)) ||
        (filter === 'completed' && arr.includes(i))
      ) {
        a.push(i)
      }
      return a
    }, [])

    return (
      <>
        <div className="MainBox">
          <div className="box">
            <h2>-Today I Need To-</h2>
            <div className="inputBox">
              <input type="text" ref={this.inputRef} placeholder="Add new todo..."></input>
              <button onClick={() => this.addInputValue()}>Submit</button>
            </div>
            <div className="ulBox">
              <ul>
                {filteredList.map((item, filteredIndex) => {
                  const originalIndex = filteredarr[filteredIndex]
                  return (
                    <li key={originalIndex} className={arr.includes(originalIndex) ? 'checked' : ''}>
                      <input type="checkbox" 
                      onChange={(e) => this.getChecked(e, originalIndex)} 
                      checked={arr.includes(originalIndex)}></input>
                      <p>{item}</p>
                      <p onClick={() => this.delSimpleItem(originalIndex)}>X</p>
                    </li>
                  )
                })}
              </ul>
              <div className="bottomBox">
                <p>{totalCount - checkedCount} Item Left</p>
                {totalCount > 0 && (
                  <>
                    <button onClick={() => this.setFilter('all')}>All</button>
                    <button onClick={() => this.setFilter('active')}>Active</button>
                    <button onClick={() => this.setFilter('completed')}>Completed</button>
                    {!isNoneChecked && (
                      <button onClick={() => this.delAllItem()}>Clear Compeleted</button>
                    )}
                  </>
                )}
                {totalCount === 0 && 'Congrat,You Have No More Tasks To Do'}
              </div>
            </div>
          </div>
        </div>

      </>
    )
  }
}

export default App;
