import React from 'react'
import axios from '../../../api/axios'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate()

    const Logout = async () => {
        try {
            await axios.delete('/logout')
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {/* Navbar */ }
            <nav className="main-header navbar navbar-expand navbar-dark">
                {/* Left navbar links */ }
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                    </li>
                    <li className="nav-item d-none d-sm-inline-block">
                        <Link to={ "/dashboard" } className="nav-link">Home</Link>
                    </li>
                </ul>
                {/* Right navbar links */ }
                <ul className="navbar-nav ml-auto">
                    <li>
                        <button onClick={ Logout } className="button is-light">
                            Log out
                        </button>
                    </li>
                </ul>
            </nav>
            {/* /.navbar */ }
        </div>
    )
}


export default Header