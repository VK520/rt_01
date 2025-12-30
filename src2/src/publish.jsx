import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
const Publish = () => {
  const [collectionList, setCollectionList] = useState([]); 
  const [activeCateId, setActiveCateId] = useState(null); 
  const [articleList, setArticleList] = useState([]); 
  const [activeArticle, setActiveArticle] = useState(null); 
  const [isEditMode, setIsEditMode] = useState(false); 
  const [articleForm, setArticleForm] = useState({
    title: '',
    content: ''
  });
  const [showDeleteMenu, setShowDeleteMenu] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [showAddCateForm, setShowAddCateForm] = useState(false); 
  const [newCateName, setNewCateName] = useState(''); 
  const [cateError, setCateError] = useState('');
  const deleteMenuRef = useRef(null); 
  useEffect(() => {
    const fetchCate = async () => {
      try {
        const res = await axios.get('http://localhost:3000/cate');
        setCollectionList(res.data);
        if (res.data.length > 0) {
          setActiveCateId(res.data[0].id);
          fetchArticles(res.data[0].id);
        }
      } catch (err) {
        console.error('加载文集失败：', err);
      }
    };
    fetchCate();
  }, []);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (deleteMenuRef.current && !deleteMenuRef.current.contains(e.target)) {
        setShowDeleteMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  const fetchArticles = async (cateId) => {
    try {
      const res = await axios.get(`http://localhost:3000/articles?cateId=${cateId}`);
      setArticleList(res.data);
      if (res.data.length > 0) {
        setActiveArticle(res.data[0]);
        setIsEditMode(false); 
      } else {
        setActiveArticle(null);
      }
    } catch (err) {
      console.error('加载文章失败：', err);
    }
  };
  const handleCateClick = (id) => {
    setActiveCateId(id);
    fetchArticles(id);
  };
  const handleArticleClick = (article) => {
    setActiveArticle(article);
    setIsEditMode(false);
    setShowDeleteMenu(false); 
  };
  const handleNewArticle = () => {
    if (!activeCateId) {
      alert('请先选择一个文集！');
      return;
    }
    setIsEditMode(true);
    setArticleForm({ title: '', content: '' });
    setActiveArticle(null);
  };
  const handleEditArticle = () => {
    if (!activeArticle) return;
    setIsEditMode(true);
    setArticleForm({
      title: activeArticle.title,
      content: activeArticle.content
    });
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setArticleForm(prev => ({ ...prev, [name]: value }));
  };
  const handlePublishArticle = async () => {
    if (!articleForm.title.trim() || !articleForm.content.trim()) {
      alert('标题和内容不能为空！');
      return;
    }
    setLoading(true);
    try {
      if (activeArticle) {
        await axios.put(`http://localhost:3000/articles/${activeArticle.id}`, {
          ...activeArticle,
          title: articleForm.title,
          content: articleForm.content
        });
      } else {
        await axios.post('http://localhost:3000/articles', {
          cateId: activeCateId,
          title: articleForm.title,
          content: articleForm.content,
          status: 'published'
        });
      }
      await fetchArticles(activeCateId);
      setIsEditMode(false);
    } catch (err) {
      alert('发布失败，请重试！');
      console.error('发布文章错误：', err);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteArticle = async (id) => {
    if (!confirm('确定删除这篇文章吗？')) return;
    try {
      await axios.delete(`http://localhost:3000/articles/${id}`);
      await fetchArticles(activeCateId);
      setActiveArticle(null);
      setShowDeleteMenu(false);
    } catch (err) {
      alert('删除失败，请重试！');
      console.error('删除文章错误：', err);
    }
  };
  const handleOpenDeleteMenu = (e) => {
    e.stopPropagation();
    setShowDeleteMenu(prev => !prev);
  };
  const handleOpenAddCate = () => {
    setShowAddCateForm(true);
    setCateError('');
    setNewCateName('');
  };
  const handleCloseAddCate = () => {
    setShowAddCateForm(false);
    setCateError('');
  };
  const handleCateNameChange = (e) => {
    setNewCateName(e.target.value.trim());
    setCateError('');
  };

  const handleAddCate = async (e) => {
    e.preventDefault();
    if (!newCateName) {
      setCateError('文集名称不能为空！');
      return;
    }
    const isExist = collectionList.some(item => item.name === newCateName);
    if (isExist) {
      setCateError('该文集已存在！');
      return;
    }
    try {
      await axios.post('http://localhost:3000/cate', { name: newCateName });
      const res = await axios.get('http://localhost:3000/cate');
      setCollectionList(res.data);
      handleCloseAddCate();
    } catch (err) {
      setCateError('添加失败，请重试！');
      console.error('添加文集错误：', err);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#333', color: '#fff' }}>
      <div style={{ width: '180px', padding: '10px', borderRight: '1px solid #444' }}>
        <button style={{
          width: '100%', padding: '8px', marginBottom: '15px',
          background: '#555', border: '1px solid #777', borderRadius: '4px',
          color: '#fff', cursor: 'pointer'
        }}>回首页</button>
        {!showAddCateForm ? (
          <div 
            style={{ 
              marginBottom: '15px', color: '#ccc', cursor: 'pointer',
              padding: '8px', borderRadius: '4px'
            }}
            onClick={handleOpenAddCate}
            onMouseEnter={(e) => e.target.style.background = '#444'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            + 新建文集
          </div>
        ) : (
          <form onSubmit={handleAddCate} style={{ marginBottom: '15px' }}>
            <input
              type="text"
              value={newCateName}
              onChange={handleCateNameChange}
              placeholder="输入文集名称"
              style={{
                width: '100%', padding: '6px', marginBottom: '8px',
                background: '#555', border: '1px solid #666',
                borderRadius: '4px', color: '#fff', outline: 'none'
              }}
            />
            {cateError && <div style={{ color: '#ff4444', fontSize: '12px', marginBottom: '8px' }}>{cateError}</div>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="submit" 
                style={{
                  flex: 1, padding: '6px', border: '2px solid #0f0',
                  background: 'transparent', color: '#0f0', borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                提交
              </button>
              <button 
                type="button" 
                onClick={handleCloseAddCate}
                style={{
                  flex: 1, padding: '6px', border: 'none',
                  background: '#4169E1', color: '#fff', borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
            </div>
          </form>
        )}
        {collectionList.map(cate => (
          <div 
            key={cate.id}
            onClick={() => handleCateClick(cate.id)}
            style={{
              padding: '8px 10px', marginBottom: '5px', borderRadius: '4px',
              background: activeCateId === cate.id ? '#444' : 'transparent',
              borderLeft: activeCateId === cate.id ? '3px solid #4169E1' : 'none',
              cursor: 'pointer'
            }}
          >
            {cate.name}
            {cate.name === 'React相关' && <span style={{ float: 'right' }}>⚙️</span>}
          </div>
        ))}
      </div>
      <div style={{ width: '280px', padding: '10px', borderRight: '1px solid #444', background: '#fff', color: '#333' }}>
        <div 
          style={{ 
            padding: '8px', borderBottom: '1px solid #eee', 
            cursor: 'pointer', color: '#4169E1' 
          }}
          onClick={handleNewArticle}
        >
          <span style={{ fontWeight: 'bold' }}>+</span> 新建文章
        </div>
        <div style={{ marginTop: '10px' }}>
          {articleList.length > 0 ? (
            articleList.map(article => (
              <div 
                key={article.id}
                onClick={() => handleArticleClick(article)}
                style={{
                  padding: '10px', marginBottom: '8px', borderRadius: '4px',
                  background: activeArticle?.id === article.id ? '#f0f5ff' : 'transparent',
                  cursor: 'pointer', position: 'relative',
                  border: activeArticle?.id === article.id ? '1px solid #e1e8ff' : '1px solid transparent'
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{article.title}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  {article.content.length > 20 ? `${article.content.slice(0, 20)}...` : article.content}
                </div>
                {activeArticle?.id === article.id && (
                  <div 
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                    onClick={(e) => e.stopPropagation()} 
                  >
                    <span 
                      onClick={handleOpenDeleteMenu} 
                      style={{ cursor: 'pointer', color: '#666' }}
                    >
                      ⚙
                    </span>
                    {showDeleteMenu && (
                      <div 
                        ref={deleteMenuRef} 
                        style={{
                          position: 'absolute', top: '20px', right: '0',
                          background: '#fff', border: '1px solid #eee', 
                          borderRadius: '4px', padding: '5px', zIndex: 100,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div 
                          onClick={() => handleDeleteArticle(article.id)} 
                          style={{
                            padding: '5px 10px', fontSize: '12px', color: '#ff4444',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#f8f8f8'}
                        >
                          删除文章
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ padding: '10px', color: '#999', textAlign: 'center' }}>
              暂无文章，点击"+新建文章"创建
            </div>
          )}
        </div>
      </div>
      <div style={{ flex: 1, padding: '20px', background: '#fff', color: '#333' }}>
        {isEditMode ? (
          <div>
            <input
              type="text"
              name="title"
              value={articleForm.title}
              onChange={handleFormChange}
              placeholder="请输入文章标题"
              style={{
                width: '100%', padding: '10px', marginBottom: '15px',
                border: '1px solid #ddd', borderRadius: '4px',
                fontSize: '20px', fontWeight: 'bold', outline: 'none'
              }}
            />
            <textarea
              name="content"
              value={articleForm.content}
              onChange={handleFormChange}
              placeholder="请输入文章内容（支持markdown换行）"
              style={{
                width: '100%', height: '60vh', padding: '10px',
                border: '1px solid #ddd', borderRadius: '4px',
                fontSize: '14px', lineHeight: '1.6', outline: 'none',
                resize: 'none', fontFamily: 'inherit'
              }}
            />
            <button 
              onClick={handlePublishArticle} 
              disabled={loading} 
              style={{
                marginTop: '15px', padding: '8px 20px',
                background: '#4169E1', color: '#fff', border: 'none',
                borderRadius: '4px', cursor: 'pointer', fontSize: '14px'
              }}
            >
              {loading ? '发布中...' : activeArticle ? '保存修改' : '发布文章'}
            </button>
          </div>
        ) : (
          activeArticle ? (
            <div>
              <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                <button 
                  onClick={handleEditArticle} 
                  style={{
                    padding: '5px 10px', marginRight: '10px',
                    background: '#4169E1', color: '#fff', border: 'none',
                    borderRadius: '4px', cursor: 'pointer'
                  }}
                >
                  编辑文章
                </button>
                <span style={{ float: 'right', color: '#666' }}>已发布</span>
              </div>
              <h1 style={{ marginBottom: '20px', color: '#333' }}>{activeArticle.title}</h1>
              <div style={{ lineHeight: '1.8', fontSize: '16px', color: '#333' }}>
                {activeArticle.content.split('\n').map((line, idx) => (
                  <p key={idx} style={{ marginBottom: '10px' }}>{line}</p>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ color: '#999', textAlign: 'center', marginTop: '100px', fontSize: '16px' }}>
              请选择或新建文章
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default Publish;