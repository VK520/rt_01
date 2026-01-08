import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Input, Tabs, Drawer } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PullRefresh, List, Cell } from 'react-vant'
import axios from 'axios';
export default function Home() {
  let navigte = useNavigate()
  let [list, setList] = useState([])
  let [key, setKey] = useState('1')
  let [page, setPage] = useState(1)
  let [pagesize, setPageSize] = useState(4)
  let [total, setTotal] = useState(0)
  const [finished, setFinished] = useState(false)
  const { Search } = Input;
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const items = [
    {
      key: '1',
      label: '首页',
    },
    {
      key: '2',
      label: '动画',
    },
    {
      key: '3',
      label: '番剧',
    }
  ];
  const items1 = [
    {
      key: '1',
      label: '首页',
    },
    {
      key: '2',
      label: '动画',
    },
    {
      key: '3',
      label: '番剧',
    },
    {
      key: '4',
      label: '国创',
    },
    {
      key: '5',
      label: '音乐',
    }
  ];
  const onChange = key => {
    setKey(key)
    initList()
  };
  const initList = () => {
    setFinished(false)
    setPage(1)
    setList([])
  }
  const getlist = () => {
    const params = {
      _page: page,
      _limit: pagesize
    }
    if (key === '2') {
      params.type = '动画'
    }
    if (key === '3') {
      params.type = '番剧'
    }
    axios.get('http://localhost:3000/list', { params }).then(res => {
      setTotal(Number(res.headers['x-total-count']))
      setList([...list, ...res.data])
      setPage(page + 1)
      if (res.data.length < pagesize) {
        setFinished(true)
      }
    })
  }
  useEffect(() => {
    getlist()
  }, [])
  useEffect(() => {
    getlist()
  }, [key])
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onLoadRefresh = async (isRefresh) => {
    getlist()
  }
  const onRefresh = async () => {
    setFinished(false)
    await onLoadRefresh(true)
  }

  return (
    <div>
      <Search placeholder="input search text" onSearch={onSearch} style={{ width: 350 }} onClick={() => { navigte('/search') }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: "50px" }}>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        <p><DownOutlined onClick={() => showDrawer()} /></p>
      </div>
      <Drawer
        placement='top'
        closable={{ 'aria-label': 'Close Button' }}
        onClose={onClose}
        open={open}
        mask={{ blur: false }}
      >
        <Tabs defaultActiveKey="1" items={items1} />
      </Drawer>
      <PullRefresh onRefresh={onRefresh}>
        {/* List 组件可以与 PullRefresh 组件结合使用，实现下拉刷新的效果 */}
        <List finished={finished} onLoad={onLoadRefresh} finishedText='没有更多了' loadingText='加载中...' offset='1' >
          {list.map((item, i) => (
            <Cell key={i}>
              <img src={item.img} alt="" style={{ width: '200px', height: '100px' }} />
              <p>{item.title}</p>
            </Cell>
          ))}
        </List>
      </PullRefresh>
    </div>
  )
}
