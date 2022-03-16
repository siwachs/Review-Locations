import "./App.css";
import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Users from "./components/usersPage/Users";
import Header from "./components/navbar/mainHeader/Header";
import { AuthContext } from "./components/utils/Context/Auth_Context";
import { useAuth } from "./hooks/auth_hook";
import LoadingSpinner from "./components/utils/Spinner/LoadingSpinner";

//Code Splitting
const Auth = React.lazy(() => import("./components/auth/Auth"));
const NewPlaces = React.lazy(() =>
  import("./components/placesPage/newPlaces/NewPlaces")
);
const UserPlaces = React.lazy(() =>
  import("./components/placesPage/userPlaces/UserPlaces")
);
const UpdatePlace = React.lazy(() =>
  import("./components/placesPage/updatePlace/UpdatePlace")
);

function App() {
  const { login, logout, token, uid } = useAuth();

  let routes;
  if (token) {
    routes = (
      <React.Fragment>
        <Route exact path="/" element={<Users></Users>}></Route>
        <Route
          exact
          path="/:uid/places"
          element={<UserPlaces></UserPlaces>}
        ></Route>
        <Route exact path="/auth" element={<Auth></Auth>}></Route>
        <Route
          exact
          path="/places/new"
          element={<NewPlaces></NewPlaces>}
        ></Route>
        <Route
          exact
          path="/places/:placeid"
          element={<UpdatePlace></UpdatePlace>}
        ></Route>
        <Route exact path="/auth" element={<Auth></Auth>}></Route>
        <Route path="*" element={<Navigate to="/" />} />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route exact path="/" element={<Users></Users>}></Route>
        <Route
          exact
          path="/:uid/places"
          element={<UserPlaces></UserPlaces>}
        ></Route>
        <Route exact path="/auth" element={<Auth></Auth>}></Route>
        <Route path="*" element={<Navigate to="/auth" />} />
      </React.Fragment>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        uid: uid,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <Header></Header>
        <Suspense
          fallback={
            <div className="center">
              <LoadingSpinner></LoadingSpinner>
            </div>
          }
        >
          <div style={{ marginTop: "5rem" }}></div>
          <Routes>{routes}</Routes>
        </Suspense>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
