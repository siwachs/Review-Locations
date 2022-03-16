import React, { useEffect, useState } from "react";
import UsersList from "./UsersList";
import ErrorModal from "../model/ErrorModal";
import LoadingSpinner from "../utils/Spinner/LoadingSpinner";
import { useHttpClient } from "../../hooks/http_hook";

function Users() {
  const [users, setUsers] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );
        setUsers(responseData.users);
      } catch (err) {}
    };
    getData();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {isLoading && (
        <div className="center">
          <LoadingSpinner></LoadingSpinner>
        </div>
      )}
      {!isLoading && users && <UsersList items={users}></UsersList>}
    </React.Fragment>
  );
}

export default Users;
