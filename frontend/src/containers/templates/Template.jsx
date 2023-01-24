import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../organisms/Admin/Footer'
import SideNav from '../organisms/Admin/SideNavbar'
import Header from '../organisms/Admin/Header'


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