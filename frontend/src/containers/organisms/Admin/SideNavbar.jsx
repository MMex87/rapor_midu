import { connect } from 'react-redux'
import { IconBuild, IconJurnal, IconPerson, IconPerson2 } from '../../../components/atoms/icon/Icon.jsx'
import { Link } from 'react-router-dom'

const SideNav = (props) => {
    return (
        <div>
            {/* Main Sidebar Container */ }
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                {/* Brand Logo */ }
                <Link to="/dashboard" className="brand-link">
                    <img src="../../../../assets/logo/logo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={ { opacity: '.8' } } />
                    <span className="brand-text font-weight-light">{ props.role } MIDU</span>
                </Link>
                {/* Sidebar */ }
                <div className="sidebar">
                    {/* Sidebar user panel (optional) */ }
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex flex-column container">
                        <div className="image">
                            <img src={ 'http://localhost:8076/assets/uploads/' + props.picture } className="img-circle justify-content-center" style={ { width: 200 } } alt="User Image" />
                        </div>
                        <div className="info container">
                            <Link to={ "/profile" } className="d-flex justify-content-center">{ props.name }</Link>
                        </div>
                        <div className="info container">
                            <span className='d-flex justify-content-center'>{ props.role }</span>
                        </div>
                    </div>
                    {/* Sidebar Menu */ }
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
                            <li className="nav-item">
                                { (props.role == 'Kepala Sekolah') ? (
                                    <Link className="nav-link" to={ '/kepala/dashboard' }>
                                        <i className="nav-icon fas fa-tachometer-alt" />
                                        <p>
                                            Dashboard
                                        </p>
                                    </Link>

                                ) : (
                                    <Link className="nav-link" to={ '/dashboard' }>
                                        <i className="nav-icon fas fa-tachometer-alt" />
                                        <p>
                                            Dashboard
                                        </p>
                                    </Link>
                                ) }
                            </li>
                            <li className="nav-item">
                                { (props.role == 'Kepala Sekolah') ? (
                                    <Link to={ "/kepala/siswa" } className="nav-link">
                                        <IconPerson />
                                        <p>
                                            Siswa
                                        </p>
                                    </Link>

                                ) : (
                                    <Link to={ "/siswa" } className="nav-link">
                                        <IconPerson />
                                        <p>
                                            Siswa
                                        </p>
                                    </Link>

                                ) }
                            </li>
                            <li className="nav-item">
                                { (props.role == 'Kepala Sekolah') ? (
                                    <Link to={ "/kepala/guru" } className="nav-link">
                                        {/* <IconPerson2 /> */ }
                                        <i className="fa-solid fa-chalkboard-user nav-icon"></i>
                                        <p>
                                            Guru
                                        </p>
                                    </Link>

                                ) : (

                                    <Link to={ "/guru" } className="nav-link">
                                        {/* <IconPerson2 /> */ }
                                        <i className="fa-solid fa-chalkboard-user nav-icon"></i>
                                        <p>
                                            Guru
                                        </p>
                                    </Link>
                                ) }
                            </li>
                            <li className="nav-item">
                                { (props.role == 'Kepala Sekolah') ? (
                                    <Link className="nav-link" to="/kepala/mapel">
                                        <IconJurnal />
                                        {/* <i className="nav-icon bi bi-journal" /> */ }
                                        <p>
                                            Mata Pelajaran
                                        </p>
                                    </Link>

                                ) : (
                                    <Link className="nav-link" to="/mapel">
                                        <IconJurnal />
                                        {/* <i className="nav-icon bi bi-journal" /> */ }
                                        <p>
                                            Mata Pelajaran
                                        </p>
                                    </Link>

                                ) }
                            </li>
                            <li className="nav-item">
                                { (props.role == 'Kepala Sekolah') ? (
                                    <Link to="/kepala/kelas" className="nav-link">
                                        <i className="fa-solid fa-school-flag nav-icon"></i>
                                        {/* <IconBuild /> */ }
                                        <p>
                                            Kelas
                                        </p>
                                    </Link>

                                ) : (
                                    <Link to="/kelas" className="nav-link">
                                        <i className="fa-solid fa-school-flag nav-icon"></i>
                                        {/* <IconBuild /> */ }
                                        <p>
                                            Kelas
                                        </p>
                                    </Link>

                                ) }
                            </li>
                            <li className="nav-item">
                                { (props.role == 'Super Admin') ? (
                                    <Link to="/user" className="nav-link">
                                        <i className="fa-solid fa-users-gear nav-icon"></i>
                                        {/* <IconBuild /> */ }
                                        <p>
                                            User Manage
                                        </p>
                                    </Link>

                                ) : '' }
                            </li>
                        </ul>
                    </nav>
                    {/* /.sidebar-menu */ }
                </div>
                {/* /.sidebar */ }
            </aside>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        name: state.user,
        picture: state.picture,
        role: state.role,
        tahun_ajar: state.tahun_ajar
    }
}

// export default SideNav

export default connect(mapStateToProps)(SideNav)