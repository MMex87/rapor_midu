import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../organisms/Guru/Footer'
import SideNav from '../organisms/Guru/SideNavbar'
import Header from '../organisms/Guru/Header'


const Template = () => {


    return (
        <>
            <Header />
            <Outlet />
            <SideNav />
            <Footer />
        </>
    )
}


export default Template