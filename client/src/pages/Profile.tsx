import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import fetchData from "../helper/apiCall";
import { jwtDecode } from "jwt-decode";
import { RootState } from "../redux/store";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  age: string;
  mobile: string;
  gender: string;
  address: string;
  pic: string;
}

interface FormDetails {
  firstname: string;
  lastname: string;
  email: string;
  age: string;
  mobile: string;
  gender: string;
  address: string;
  password: string;
  confpassword: string;
}

interface TokenPayload {
  userId: string;
}

const Profile: React.FC = () => {
  const token = localStorage.getItem("token");
  const { userId } = token ? jwtDecode<TokenPayload>(token) : { userId: '' };
  
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.root);
  
  const [file, setFile] = useState<string>("");
  const [newFile, setNewFile] = useState<File | null>(null); // For new file upload
  const [formDetails, setFormDetails] = useState<FormDetails>({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    mobile: "",
    gender: "neither",
    address: "",
    password: "",
    confpassword: "",
  });

  const getUser = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData<User>(`api/user/getuser/${userId}`);
      setFormDetails({
        firstname: temp.firstname,
        lastname: temp.lastname,
        email: temp.email,
        age: temp.age ?? "",
        mobile: temp.mobile ?? "",
        gender: temp.gender,
        address: temp.address,
        password: "",
        confpassword: "",
      });
      setFile(temp.pic);
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data.");
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (userId) getUser();
  }, [dispatch, userId]);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET!);
    data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME!);

    try {
      const response = await fetch(process.env.REACT_APP_CLOUDINARY_BASE_URL!, {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        return result.secure_url;
      } else {
        throw new Error(result.error.message);
      }
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
      return "";
    }
  };

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      firstname,
      lastname,
      email,
      age,
      mobile,
      address,
      gender,
      password,
      confpassword,
    } = formDetails;

    if (!email) {
      return toast.error("Email should not be empty");
    } else if (firstname.length < 3) {
      return toast.error("First name must be at least 3 characters long");
    } else if (lastname.length < 3) {
      return toast.error("Last name must be at least 3 characters long");
    } else if (password.length < 5) {
      return toast.error("Password must be at least 5 characters long");
    } else if (password !== confpassword) {
      return toast.error("Passwords do not match");
    }

    try {
      // If a new file is selected, upload it
      let newFileURL = file;
      if (newFile) {
        newFileURL = await uploadFile(newFile);
        // Add code to delete the old file from Cloudinary here
      }

      await toast.promise(
        axios.put(
          "/api/user/updateprofile",
          {
            firstname,
            lastname,
            age,
            mobile,
            address,
            gender,
            email,
            password,
            pic: newFileURL,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          loading: "Updating profile...",
          success: "Profile updated successfully",
          error: "Unable to update profile",
        }
      );

      setFormDetails({ ...formDetails, password: "", confpassword: "" });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Unable to update profile");
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="register-section flex-center">
          <div className="profile-container flex-center">
            <h2 className="form-heading">Profile</h2>
            <img
              src={file}
              alt="profile"
              className="profile-pic"
            />
            <form
              onSubmit={formSubmit}
              className="register-form"
            >
              <div className="form-same-row">
                <input
                  type="text"
                  name="firstname"
                  className="form-input"
                  placeholder="Enter your first name"
                  value={formDetails.firstname}
                  onChange={inputChange}
                />
                <input
                  type="text"
                  name="lastname"
                  className="form-input"
                  placeholder="Enter your last name"
                  value={formDetails.lastname}
                  onChange={inputChange}
                />
              </div>
              <div className="form-same-row">
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formDetails.email}
                  onChange={inputChange}
                />
                <select
                  name="gender"
                  value={formDetails.gender}
                  className="form-input"
                  id="gender"
                  onChange={inputChange}
                >
                  <option value="neither">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="form-same-row">
                <input
                  type="text"
                  name="age"
                  className="form-input"
                  placeholder="Enter your age"
                  value={formDetails.age}
                  onChange={inputChange}
                />
                <input
                  type="text"
                  name="mobile"
                  className="form-input"
                  placeholder="Enter your mobile number"
                  value={formDetails.mobile}
                  onChange={inputChange}
                />
              </div>
              <textarea
                name="address"
                className="form-input"
                placeholder="Enter your address"
                value={formDetails.address}
                onChange={inputChange}
                rows={2}
              />
              <div className="form-same-row">
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formDetails.password}
                  onChange={inputChange}
                />
                <input
                  type="password"
                  name="confpassword"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={formDetails.confpassword}
                  onChange={inputChange}
                />
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                className="form-input"
              />
              <button
                type="submit"
                className="btn form-btn"
              >
                Update
              </button>
            </form>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
};

export default Profile;
