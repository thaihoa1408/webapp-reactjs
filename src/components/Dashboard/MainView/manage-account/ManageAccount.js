import React, { useEffect, useState } from "react";
import "./ManageAccount.css";
import axios from "axios";
import { getToken } from "../../../Utils/Common";
import CreateUser from "./CreateUser";
import UserInforTable from "./UserInforTable";
import config from "../../../../config.json";
function ManageAccount(props) {
  const [select, setSelect] = useState([true, false]);
  const [rightaccess, setRightaccess] = useState(false);
  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
    axios
      .get(`/api/test/admin?token=${token}`)
      .then((response) => {
        setRightaccess(true);
      })
      .catch((error) => {
        setRightaccess(false);
      });
  }, []);
  return (
    <div className="manage-account">
      {!rightaccess && <div className="error">{rightaccess}</div>}
      {rightaccess && (
        <div className="manage-account-total">
          <div className="manage-account-header">
            <div
              className={select[0] ? "select-active" : "select-inactive"}
              onClick={() => setSelect([true, false])}
            >
              User List
            </div>
            <div
              className={select[1] ? "select-active" : "select-inactive"}
              onClick={() => setSelect([false, true])}
            >
              Create new user
            </div>
          </div>
        </div>
      )}
      {select[0] && <UserInforTable />}
      {select[1] && <CreateUser />}
    </div>
  );
}

export default ManageAccount;
