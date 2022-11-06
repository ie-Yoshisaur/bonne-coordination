import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PageOne from './pages/PageOne';
import PageTwo from './pages/PageTwo';

const Main = () => {
    return (         
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/page1' element={<PageOne/>} />
            <Route path='/page2' element={<PageTwo/>} />
        </Routes>
    );
};

export default Main;
