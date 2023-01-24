import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route
} from "react-router-dom";
// import login dan register
import Login from "./containers/pages/login/Login";
import Register from "./containers/pages/Register"
// import Template
import Template from "./containers/templates/Template";
// import Admin
import Dashboard from "./containers/pages/admin/dashboard/Dashboard";
import Mapel from "./containers/pages/admin/mapel/Mapel";
import TambahMapel from "./containers/pages/admin/mapel/TambahMapel";
import EditMapel from "./containers/pages/admin/mapel/EditMapel";
import Siswa from "./containers/pages/admin/siswa/Siswa";
import TambahSiswa from "./containers/pages/admin/siswa/TambahSiswa";
import EditSiswa from "./containers/pages/admin/siswa/EditSiswa";
import Guru from "./containers/pages/admin/guru/Guru";
import TambahGuru from "./containers/pages/admin/guru/TambahGuru";
import EditGuru from "./containers/pages/admin/guru/EditGuru";
import Kelas from "./containers/pages/admin/kelas/Kelas";
// import Kepala Sekolah
import DashboardKep from "./containers/pages/kepala_sekolah/dashboard/Dashboard";
import MapelKep from "./containers/pages/kepala_sekolah/mapel/Mapel";
import SiswaKep from "./containers/pages/kepala_sekolah/siswa/Siswa";
import GuruKep from "./containers/pages/kepala_sekolah/guru/Guru";
import KelasKep from "./containers/pages/kepala_sekolah/kelas/Kelas";
// import profile
import Profile from "./containers/pages/admin/Profile";
import ProfileGuru from "./containers/pages/guru/Profile"
// import SuperUser
import User from "./containers/pages/admin/user_manage/user";
import TambahKepala from "./containers/pages/admin/user_manage/TambahKepala";
import TambahAdmin from "./containers/pages/admin/user_manage/TambahAdmin";


// template Guru
import TemplateGuru from './containers/templates/TemplateGuru'
// Tampilan Guru dan Wali Kelas
import DashboardGuru from './containers/pages/guru/dashboard/Dashboard'
import Nilai from "./containers/pages/guru/nilai/Nilai";
import WaliKelas from "./containers/pages/guru/wali_kelas/WaliKelas";
import DetailRapor from "./containers/pages/guru/wali_kelas/DetailRapor";
import DataMapel from "./containers/pages/admin/mapel/DataMapel";

// dashboard login


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* login dan register */ }
      <Route index element={ <Login /> } />
      <Route path="/register" element={ <Register /> } />

      {/* Super Admin */ }
      <Route path="/user" element={ <Template /> } >
        <Route index element={ <User /> } />
        <Route path="/user/tambah"
          element={ <TambahKepala /> } />
        <Route path="/user/tambahAdmin"
          element={ <TambahAdmin /> } />
      </Route>

      {/* Admin */ }
      <Route path="/dashboard" element={ <Template /> } >
        <Route index element={ <Dashboard /> } />
      </Route>
      <Route path="/mapel" element={ <Template /> } >
        <Route index element={ <Mapel /> } />
        <Route path="/mapel/tambah/:idKelas"
          element={ <TambahMapel /> } />
        <Route path="/mapel/edit/:idMapel"
          element={ <EditMapel /> } />
        <Route path={ "/mapel/dataMapel" } element={ <DataMapel /> } />
      </Route>
      <Route path="/siswa" element={ <Template /> } >
        <Route index element={ <Siswa /> } />
        <Route path="/siswa/tambah"
          element={ <TambahSiswa /> } />
        <Route path="/siswa/edit/:idSiswa"
          element={ <EditSiswa /> } />
      </Route>
      <Route path="/guru" element={ <Template /> } >
        <Route index element={ <Guru /> } />
        <Route path="/guru/tambah"
          element={ <TambahGuru /> } />
        <Route path="/guru/edit/:idGuru"
          element={ <EditGuru /> } />
      </Route>
      <Route path="/kelas" element={ <Template /> }>
        <Route index element={ <Kelas /> } />
      </Route>

      {/* Kepala Sekolah */ }
      <Route path="/kepala/dashboard" element={ <Template /> } >
        <Route index element={ <DashboardKep /> } />
      </Route>
      <Route path="/kepala/mapel" element={ <Template /> } >
        <Route index element={ <MapelKep /> } />
      </Route>
      <Route path="/kepala/siswa" element={ <Template /> } >
        <Route index element={ <SiswaKep /> } />
      </Route>
      <Route path="/kepala/guru" element={ <Template /> } >
        <Route index element={ <GuruKep /> } />
      </Route>
      <Route path="/kepala/kelas" element={ <Template /> }>
        <Route index element={ <KelasKep /> } />
      </Route>
      {/* profile */ }
      <Route path="/profile" element={ <Template /> }>
        <Route index element={ <Profile /> } />
      </Route>


      {/* Guru */ }
      <Route path="/dashboardGuru" element={ <TemplateGuru /> }>
        <Route index element={ <DashboardGuru /> } />
      </Route>
      <Route path="/UserGuru/nilai/:idMapel" element={ <TemplateGuru /> }>
        <Route index element={ <Nilai /> } />
      </Route>
      <Route path="/UserGuru/WaliKelas/:idKelas" element={ <TemplateGuru /> } >
        <Route index element={ <WaliKelas /> } />
        <Route path='/UserGuru/WaliKelas/:idKelas/:idSiswa/:semester/:jenisR' element={ <DetailRapor /> } />
      </Route>
      <Route path={ "/profileGuru" } element={ <TemplateGuru /> }>
        <Route index element={ <ProfileGuru /> } />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <RouterProvider router={ router } />
  );
}

export default App;
