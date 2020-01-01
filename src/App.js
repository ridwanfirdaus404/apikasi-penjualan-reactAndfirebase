import React from 'react';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';
//komponen registrasi
import Registrasi from './pages/registrasi';
//komponen login
import Login from './pages/login';
//komponen lupaPassword
import LupaPassword from './pages/lupa-password';
//komponen notfound
import NotFound from './pages/404';
//komponen pengaturan
import Private from './pages/private';

import PrivateRoute from './components/PrivateRoute';

import FirebaseProvider from './components/FirebaseProvider';

function App() {
  return (
    <FirebaseProvider>
      <Router>
        <Switch>
          <PrivateRoute path="/pengaturan" component={Private}></PrivateRoute>
          <PrivateRoute path="/produk" component={Private}></PrivateRoute>
          <PrivateRoute path="/transaksi" component={Private}></PrivateRoute>
          <PrivateRoute path="/" exact component={Private}></PrivateRoute>
          <Route path="/registrasi" component={Registrasi}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/lupa-password" component={LupaPassword}></Route>
          <Route component={NotFound}></Route>
        </Switch>
      </Router>
    </FirebaseProvider>
  );
}

 export default App;