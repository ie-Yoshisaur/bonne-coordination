import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import BodyType from './pages/BodyType';
import Clothes from './pages/Clothes';

const Main = () => {
    return (         
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/body-type' element={<BodyType/>} />
            <Route path='/clothes' element={<Clothes/>} />
        </Routes>
    );
};

export default Main;
