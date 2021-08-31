import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../Utils/Common";
import "./UserInforTable.css";
import config from "../../../../config.json";
function UserInforTable(props) {
  const searchFunction = () => {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  };
  //
  const [userEdit, setUserEdit] = useState(null);
  const handleCancel = () => {
    setActionDelete(false);
    setActionResetPass(false);
    setUserEdit(null);
    setStatus("");
    setError("");
  };
  const [actionDelete, setActionDelete] = useState(false);
  const handleDelete = () => {
    setActionDelete(true);
    setActionResetPass(false);
  };
  const [actionResetPass, setActionResetPass] = useState(false);
  const [newPass, setNewpass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const handleResetPass = () => {
    setActionResetPass(true);
    setActionDelete(false);
  };
  const resetPass = () => {
    if (newPass === "" || confirmNewPass === "")
      setError("Password is required!");
    else if (newPass != confirmNewPass)
      setError("Entered passwords do not match!");
    else {
      let token = getToken();
      axios
        .post(`/reset_password`, {
          token: token,
          userid: userEdit.id,
          newpassword: newPass,
        })
        .then((response) => {
          setStatus(response.data.message);
          setNewpass("");
          setConfirmNewPass("");
        });
    }
  };
  //
  const [data, setData] = useState([]);
  const deleteUser = () => {
    var token = getToken();
    axios.post(`/delete_user`, {
      token: token,
      userid: userEdit.id,
    });
    setActionDelete(false);
    setUserEdit(null);
  };
  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
    const interval = setInterval(() => {
      axios
        .get(`/get_user_infor?token=${token}`)
        .then((response) => setData(response.data));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="user-table">
      <div className="user-search">
        <input
          type="text"
          id="myInput"
          onKeyUp={searchFunction}
          placeholder="Search for names.."
        />
        <div></div>
      </div>
      <div className="user-table-container">
        <table id="myTable">
          <thead className="user-table-header">
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody class="user-table-body">
            {data.map((item, index) => {
              return (
                <tr>
                  <td>{item.id}</td>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>
                    <button
                      onClick={() => {
                        setUserEdit(item);
                      }}
                    >
                      Action
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {userEdit && (
        <div className="user-infor-editor">
          <h3 className="user-infor-editor-row-1">User Infor</h3>
          <div className="user-infor-editor-row-2">
            <div>
              Id :<span>{userEdit.id}</span>
            </div>
            <div>
              Username :<span>{userEdit.username}</span>
            </div>
            <div>
              Email :<span>{userEdit.email}</span>
            </div>
            <div>
              Role :<span>{userEdit.role}</span>
            </div>
          </div>
          <div className="user-infor-editor-row-3">
            <button onClick={handleResetPass}>Reset Password</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
      {actionDelete && (
        <div className="user-infor-editor-delete">
          <h4>Do you want to delete {userEdit.username} ?</h4>
          <div>
            <button onClick={deleteUser}>Yes</button>
            <button onClick={() => setActionDelete(false)}>No</button>
          </div>
        </div>
      )}
      {actionResetPass && (
        <div className="user-infor-editor-reset-pass">
          <h4 className="user-infor-editor-reset-pass-row-1">
            Reset Password for <span>{userEdit.username}</span>
          </h4>
          <div className="user-infor-editor-reset-pass-row-2">
            <div>New Password :</div>
            <input
              type="password"
              placeholder="Enter new password"
              onChange={(e) => {
                setNewpass(e.target.value);
                setStatus("");
                setError("");
              }}
            />
          </div>
          <div className="user-infor-editor-reset-pass-row-2">
            <div>Confirm New Password :</div>
            <input
              type="password"
              placeholder="Enter password again"
              onChange={(e) => {
                setConfirmNewPass(e.target.value);
                setStatus("");
                setError("");
              }}
            />
          </div>
          <div
            className={
              error != ""
                ? "user-infor-editor-reset-pass-error"
                : "user-infor-editor-reset-pass-status"
            }
          >
            {status}
            {error}
          </div>
          <div className="user-infor-editor-reset-pass-row-3">
            <button onClick={resetPass}>Submit</button>
            <button
              onClick={() => {
                setActionResetPass(false);
                setStatus("");
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInforTable;
