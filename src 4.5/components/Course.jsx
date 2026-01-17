import React, { useEffect, useState, useCallback } from 'react'
import {
    Input, Layout, Button, Drawer, Table, Space, Pagination,
    DatePicker, message, Tabs
} from 'antd'
import {
    ReloadOutlined, PlusOutlined, ColumnHeightOutlined, SettingOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCourseList,
    addCourse,
    setCurrentPage,
    setPageSize,
    updateFormData,
    resetFormData
} from '../store';

const { Header, Content } = Layout;
const { RangePicker } = DatePicker;

// 星期配置
const WEEK_DAYS = [
    { key: '1', label: '星期一' },
    { key: '2', label: '星期二' },
    { key: '3', label: '星期三' },
    { key: '4', label: '星期四' },
    { key: '5', label: '星期五' },
    { key: '6', label: '星期六' },
    { key: '7', label: '星期日' },
];

// 工作日（周一至周五）
const WORK_DAYS = ['1', '2', '3', '4', '5'];
// 全周（周一至周日）
const ALL_DAYS = ['1', '2', '3', '4', '5', '6', '7'];

// 初始化时间段数据
const initTimeSlots = () => {
    const data = {};
    WEEK_DAYS.forEach(day => data[day.key] = []);
    return data;
};

// 从本地存储加载课程预约时间
const loadSavedTimeSlots = (courseId) => {
    const saved = localStorage.getItem(`courseTimeSlots_${courseId}`);
    return saved ? JSON.parse(saved) : initTimeSlots();
};

// 保存课程预约时间到本地存储
const saveTimeSlots = (courseId, timeSlots) => {
    localStorage.setItem(`courseTimeSlots_${courseId}`, JSON.stringify(timeSlots));
};

export default function Course() {
    const dispatch = useDispatch();
    const { list, total, currentPage, pageSize, formData } = useSelector(state => state.course);

    // 状态管理
    const [open, setOpen] = useState(false);
    const [timeDrawerOpen, setTimeDrawerOpen] = useState(false);
    const [currentCourseId, setCurrentCourseId] = useState(null);
    const [activeTabKey, setActiveTabKey] = useState('1');
    const [timeSlots, setTimeSlots] = useState(initTimeSlots());
    const [dateTimeRange, setDateTimeRange] = useState([]);

    // 加载数据方法
    const loadData = useCallback(() => {
        dispatch(fetchCourseList());
    }, [dispatch]);

    // 确保数据正确加载
    useEffect(() => {
        loadData();
    }, [loadData, currentPage, pageSize]);

    // 打开可约时间抽屉 - 加载保存的信息
    const handleOpenTimeDrawer = (id) => {
        if (!id) return message.warning('课程ID异常，请刷新重试');
        setCurrentCourseId(id);
        setTimeSlots(loadSavedTimeSlots(id));
        setDateTimeRange([]);
        setActiveTabKey('1');
        setTimeDrawerOpen(true);
    };

    // 添加时间段
    const handleAddTimeSlot = () => {
        if (!dateTimeRange || dateTimeRange.length < 2) {
            return message.warning('请选择完整的日期时间范围');
        }

        const newSlot = {
            id: Date.now(),
            dateTime: `${dateTimeRange[0].format('YYYY-MM-DD HH:mm')} 至 ${dateTimeRange[1].format('YYYY-MM-DD HH:mm')}`,
            start: dateTimeRange[0],
            end: dateTimeRange[1]
        };

        const newTimeSlots = { ...timeSlots };
        newTimeSlots[activeTabKey] = [...newTimeSlots[activeTabKey], newSlot];
        setTimeSlots(newTimeSlots);
        message.success('时间段添加成功');
    };

    // 删除时间段
    const handleDeleteTimeSlot = (id) => {
        const newTimeSlots = { ...timeSlots };
        newTimeSlots[activeTabKey] = newTimeSlots[activeTabKey].filter(item => item.id !== id);
        setTimeSlots(newTimeSlots);
        message.success('时间段已删除');
    };

    // 同步时间段到目标日期组
    const syncTimeSlots = (targetDays) => {
        const currentSlots = timeSlots[activeTabKey];
        if (currentSlots.length === 0) {
            return message.warning('当前页面没有可同步的时间段');
        }

        const newTimeSlots = { ...timeSlots };
        targetDays.forEach(day => {
            if (day !== activeTabKey) newTimeSlots[day] = [...currentSlots];
        });

        setTimeSlots(newTimeSlots);
        message.success(`已同步到${targetDays === WORK_DAYS ? '所有工作日' : '全周'}`);
    };

    // 保存预约时间
    const handleSaveTimeSlots = () => {
        if (!currentCourseId) return message.warning('课程信息异常，无法保存');
        saveTimeSlots(currentCourseId, timeSlots);
        message.success('预约时间已保存并与课程关联');
        setTimeDrawerOpen(false);
    };

    // 时间段表格列配置
    const timeTableColumns = [
        {
            title: '序号',
            render: (_, __, index) => index + 1,
            key: 'index',
        },
        {
            title: '日期时间范围',
            dataIndex: 'dateTime',
            key: 'dateTime',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    onClick={() => handleDeleteTimeSlot(record.id)}
                >
                    删除
                </Button>
            ),
        },
    ];

    // 生成Tabs内容
    const tabItems = WEEK_DAYS.map(day => ({
        key: day.key,
        label: day.label,
        children: (
            <div key={`tab-${day.key}`} style={{ padding: '16px 0' }}>
                <h4 style={{ margin: '0 0 16px 0' }}>
                    选择 {day.label} 的课开放预约的时间
                </h4>
                <Space key={`space-${day.key}`} orientation="vertical" size={16} style={{ marginBottom: 16, width: '100%' }}>
                    <RangePicker
                        key={`datetime-${day.key}`}
                        value={dateTimeRange}
                        onChange={(dates) => setDateTimeRange(dates || [])}
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        placeholder={['开始日期时间', '结束日期时间']}
                        style={{ width: '100%' }}
                    />
                    <Space style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Button
                            key={`btn-${day.key}`}
                            type="primary"
                            onClick={handleAddTimeSlot}
                        >
                            添加一行数据
                        </Button>
                        <Button 
                            icon={<SyncOutlined />} 
                            onClick={() => syncTimeSlots(WORK_DAYS)}
                            style={{ marginLeft: 8 }}
                        >
                            全工作日同步
                        </Button>
                        <Button 
                            icon={<SyncOutlined />} 
                            onClick={() => syncTimeSlots(ALL_DAYS)}
                            style={{ marginLeft: 8 }}
                        >
                            全周同步
                        </Button>
                    </Space>
                </Space>
                <Table
                    key={`table-${day.key}`}
                    dataSource={timeSlots[day.key]}
                    columns={timeTableColumns}
                    pagination={false}
                    rowKey="id"
                    bordered
                />
            </div>
        ),
    }));

    // 课程列表列配置
    const courseColumns = [
        { title: '课程名称', dataIndex: 'title', key: 'title' },
        { title: '限制人数', dataIndex: 'people', key: 'people' },
        { title: '持续时长(分钟)', dataIndex: 'duration', key: 'duration' },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space key={`action-${record.id}`}>
                    <Button size="small" key={`edit-${record.id}`}>编辑</Button>
                    <Button
                        size="small"
                        key={`time-${record.id}`}
                        onClick={() => handleOpenTimeDrawer(record.id)}
                    >
                        可约时间
                    </Button>
                    <Button size="small" key={`card-${record.id}`}>关联消费卡</Button>
                </Space>
            )
        }
    ];

    // 表单验证
    const validateForm = () => {
        if (!formData.title?.trim()) {
            message.warning('请输入课程名称');
            return false;
        }
        if (!formData.people || isNaN(Number(formData.people)) || Number(formData.people) <= 0) {
            message.warning('请输入有效的限制人数');
            return false;
        }
        if (!formData.duration || isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
            message.warning('请输入有效的持续时间');
            return false;
        }
        return true;
    };

    return (
        <div style={{ padding: '20px' }}>
            <Layout>
                <Header style={{ background: '#fff', padding: '0 20px' }}>
                    <Space align="center">
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>课程管理</span>
                        <Input placeholder='请输入课程名称搜索' style={{ width: 200 }} />
                        <Button onClick={loadData}>重置</Button>
                        <Button type='primary'>查询</Button>
                    </Space>
                </Header>

                <Content style={{ background: '#fff', padding: '20px' }}>
                    <Space style={{ marginBottom: 16 }}>
                        <Button type='primary' onClick={() => setOpen(true)}>
                            <PlusOutlined /> 新建课程
                        </Button>
                        <Button icon={<ReloadOutlined />} onClick={loadData} />
                        <Button icon={<ColumnHeightOutlined />} />
                        <Button icon={<SettingOutlined />} />
                    </Space>

                    {/* 新建课程抽屉 */}
                    <Drawer
                        open={open}
                        title='新建课程'
                        size="middle"
                        maskClosable={true}
                        onClose={() => {
                            setOpen(false);
                            dispatch(resetFormData());
                        }}
                        extra={[
                            <Button key="cancel" onClick={() => setOpen(false)}>取消</Button>,
                            <Button
                                key="submit"
                                type='primary'
                                onClick={() => {
                                    if (validateForm()) {
                                        dispatch(addCourse());
                                        setOpen(false);
                                        message.success('课程创建成功');
                                    }
                                }}
                            >
                                提交
                            </Button>
                        ]}
                    >
                        <Space orientation="vertical" size={16}>
                            {[
                                { label: '课程名称', key: 'title', type: 'text' },
                                { label: '限制人数', key: 'people', type: 'number', suffix: '人' },
                                { label: '持续时间', key: 'duration', type: 'number', suffix: '分钟' }
                            ].map(({ label, key, type, suffix }) => (
                                <div key={key}>
                                    <label style={{ display: 'block', marginBottom: 8 }}>{label}</label>
                                    <Input
                                        type={type}
                                        suffix={suffix}
                                        value={formData?.[key] || ''}
                                        onChange={e => dispatch(updateFormData({ [key]: e.target.value }))}
                                        placeholder={`请输入${label}`}
                                    />
                                </div>
                            ))}
                        </Space>
                    </Drawer>

                    {/* 可约时间设置抽屉 */}
                    <Drawer
                        open={timeDrawerOpen}
                        title={`编辑预约时间`}
                        size="large"
                        onClose={() => setTimeDrawerOpen(false)}
                        extra={[
                            <Button key="time-save" type='primary' onClick={handleSaveTimeSlots}>
                                保存
                            </Button>
                        ]}
                    >
                        <Tabs
                            activeKey={activeTabKey}
                            onChange={setActiveTabKey}
                            type="card"
                            items={tabItems}
                        />
                    </Drawer>

                    {/* 课程列表 */}
                    <Table
                        dataSource={list.length ? list : []}  
                        rowKey='id'
                        pagination={false}
                        bordered
                        columns={courseColumns}
                        locale={{ emptyText: '暂无课程数据，请添加课程' }}  
                    />

                    {/* 分页 */}
                    <div style={{ marginTop: 16, textAlign: 'right' }}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={total}
                            onChange={(page, newSize) => {
                                dispatch(setCurrentPage(page));
                                if (newSize) dispatch(setPageSize(newSize));
                            }}
                            showSizeChanger
                            showQuickJumper
                            showTotal={total => `共 ${total} 条记录`}
                            pageSizeOptions={[3, 5]}
                            size="middle"
                        />
                    </div>
                </Content>
            </Layout>
        </div>
    );
}