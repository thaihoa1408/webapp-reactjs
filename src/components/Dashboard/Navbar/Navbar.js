import React, { useEffect, useState } from "react";
import "./Navbar.css";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as BiIcons from "react-icons/bi";
import { getToken, getUser } from "../../Utils/Common";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../../../config.json";
export default function Navbar(props) {
  let user = getUser();
  const [isDropdownShow, setIsDropdownShow] = useState(false);
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
  const [changePassword, setChangePassword] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const handleSubmitChangePass = () => {
    if (oldPass === "" || newPass === "" || confirmPass === "") {
      setError("Password is required !");
    } else if (newPass != confirmPass) {
      setError("Entered passwords do not match!");
    } else {
      let token = getToken();
      axios
        .post(`/update_password`, {
          token: token,
          oldpassword: oldPass,
          newpassword: newPass,
        })
        .then((response) => {
          setStatus(response.data.message);
        })
        .catch((error) => {
          setError(error.response.data.message);
        });
    }
  };
  return (
    <div>
      <div className="navbar-container">
        <div className="navbar-icon" onClick={props.handleSetShowSidebar}>
          <FaIcons.FaBars />
        </div>
        <div className="navbar-text">Dashboard</div>
        <div className="user-container">
          <div className="user-icon">
            <FaIcons.FaUserAlt />
          </div>
          <div className="user-name">{user.username}</div>
          <div
            className={
              isDropdownShow
                ? "user-dropdown-icon active"
                : "user-dropdown-icon"
            }
            onClick={() => setIsDropdownShow(!isDropdownShow)}
            tabIndex="0"
            onBlur={() => setIsDropdownShow(false)}
          >
            <RiIcons.RiArrowDropDownLine />
          </div>
        </div>
        {isDropdownShow && (
          <div
            className="user-dropdown-menu"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div
              onClick={() => {
                setChangePassword(true);
                setIsDropdownShow(false);
              }}
            >
              <AiIcons.AiFillLock className="icons-user-menu" />
              <div>Change Password</div>
            </div>
            <div
              onClick={() => {
                setIsDropdownShow(false);
                props.handleLogout();
              }}
            >
              <BiIcons.BiLogOutCircle className="icons-user-menu" />
              <div>Logout</div>
            </div>

            {rightaccess && (
              <div
                onClick={() => {
                  setIsDropdownShow(false);
                }}
              >
                <RiIcons.RiAccountBoxFill className="icons-user-menu" />
                <Link to="/dashboard/manage_account" className="text-user-menu">
                  Account Management
                </Link>
              </div>
            )}

            {rightaccess && (
              <div
                onClick={() => {
                  setIsDropdownShow(false);
                }}
              >
                <AiIcons.AiTwotoneSetting className="icons-user-menu" />
                <Link
                  to="/dashboard/site_management"
                  className="text-user-menu"
                >
                  Site Management
                </Link>
              </div>
            )}

            {rightaccess && (
              <div
                onClick={() => {
                  setIsDropdownShow(false);
                }}
              >
                <AiIcons.AiFillEdit className="icons-user-menu" />
                <Link
                  to="/dashboard/datatype_editor"
                  className="text-user-menu"
                >
                  Datatype Editor
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      {changePassword && (
        <div className="change-password-container">
          <div>
            <div
              className="change-password-close"
              onClick={() => {
                setChangePassword(false);
                setError("");
                setStatus("");
              }}
            >
              <AiIcons.AiOutlineClose />
            </div>
            <div className="change-password-body">
              <div>Change Password</div>
              <div className="change-password-body-row">
                <div>Old Password</div>
                <div>
                  <input
                    type="password"
                    placeholder="Enter your old password"
                    onChange={(e) => {
                      setOldPass(e.target.value);
                      setError("");
                      setStatus("");
                    }}
                  />
                </div>
              </div>
              <div className="change-password-body-row">
                <div>New Password</div>
                <div>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    onChange={(e) => {
                      setNewPass(e.target.value);
                      setError("");
                      setStatus("");
                    }}
                  />
                </div>
              </div>
              <div className="change-password-body-row">
                <div>Confirm New Password</div>
                <div>
                  <input
                    type="password"
                    placeholder="Enter your password again"
                    onChange={(e) => {
                      setConfirmPass(e.target.value);
                      setError("");
                      setStatus("");
                    }}
                  />
                </div>
                <div
                  className={
                    error != ""
                      ? "change-password-error"
                      : "change-password-status"
                  }
                >
                  {error}
                  {status}
                </div>
              </div>
              <div className="change-password-action">
                <button
                  onClick={() => {
                    setChangePassword(false);
                    setError("");
                    setStatus("");
                  }}
                >
                  Cancel
                </button>
                <button onClick={handleSubmitChangePass}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
