// src/store/index.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

const mockCourseData = [
    { id: 1, title: 'React入门教程', people: 50, duration: 120 },
    { id: 2, title: 'Vue实战开发', people: 40, duration: 90 },
    { id: 3, title: 'JavaScript高级语法', people: 60, duration: 150 },
    { id: 4, title: 'CSS布局技巧', people: 30, duration: 60 },
    { id: 5, title: 'TypeScript基础', people: 35, duration: 80 },
    { id: 6, title: 'Redux状态管理', people: 45, duration: 100 },
    { id: 7, title: 'React Router使用', people: 25, duration: 70 },
    { id: 8, title: 'AntD组件库实战', people: 55, duration: 110 },
    { id: 9, title: '前端工程化', people: 48, duration: 130 },
    { id: 10, title: '前端性能优化', people: 52, duration: 140 }
];

const initialState = {
    list: [], total: mockCourseData.length, currentPage: 1, pageSize: 3,
    formData: { title: '', people: '', duration: '' }
};

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        fetchCourseList: (state) => {
            const start = (state.currentPage - 1) * state.pageSize;
            state.list = mockCourseData.slice(start, start + state.pageSize);
        },
        addCourse: (state) => {
            mockCourseData.push({
                id: Math.max(...mockCourseData.map(i => i.id)) + 1,
                title: state.formData.title,
                people: Number(state.formData.people),
                duration: Number(state.formData.duration)
            });
            state.total = mockCourseData.length;
            state.list = mockCourseData.slice(
                (state.currentPage - 1) * state.pageSize,
                state.currentPage * state.pageSize
            );
            state.formData = initialState.formData;
        },
        setCurrentPage: (state, { payload }) => {
            state.currentPage = payload;
        },
        setPageSize: (state, { payload }) => {
            state.pageSize = payload;
        },
        updateFormData: (state, { payload }) => {
            state.formData = { ...state.formData, ...payload };
        },
        resetFormData: (state) => state.formData = initialState.formData
    }
});

export const { fetchCourseList, addCourse, setCurrentPage, setPageSize, updateFormData, resetFormData } = courseSlice.actions;
export const store = configureStore({ reducer: { course: courseSlice.reducer } });