import "./edit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import useFetch from "../../hooks/useFetch";

const Edit = ({ inputs, title }) => {
  const navigate = useNavigate();

  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const [errors, setErrors] = useState({});

  const [seats, setSeats] = useState([]);

  const [airplaneRes, setAirplaneRes] = useState([]); // State lưu dữ liệu máy bay
  const [airportRes, setAirportRes] = useState([]);   // State lưu dữ liệu sân bay
  const [inputsState, setInputsState] = useState(inputs);
  const [userOptions, setUserOptions] = useState([]);

  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const path = location.pathname.split("/")[1];
  const { data, loading, error } = useFetch(`/api/${path}/${id}`);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosInstance.get("/api/users");
        const options = data.map((user) => ({
          value: user.id,
          label: user.username + " (" + user.role + ")",
        }));

        setUserOptions(options);

        setInputsState((prevInputs) =>
          prevInputs.map((input) =>
            input.id === "sender_name" ? { ...input, options } : input
          )
        );
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchSeats = async () => {
      if (path === "airplanes") {
        try {
          const response = await axiosInstance.get(`/api/airplane-seats/${id}`);
          setSeats(response.data);
        } catch (err) {
          console.error("Error fetching seats:", err);
        }
      }
    };

    fetchSeats();
    console.log(seats);
  }, [path, id]);

  useEffect(() => {
    const fetchAirplanesAndAirports = async () => {
      try {
        const airplaneRes = await axiosInstance.get("/api/airplanes");
        const airportRes = await axiosInstance.get("/api/airports");

        // Chuẩn hóa mảng options
        const airplaneOptions = airplaneRes.data?.map((airplane) => ({
          value: airplane.id, // Sử dụng `id` thay vì `airplane_id`
          label: `${airplane.model} (${airplane.registration_number})`,
        })) || [];

        const airportOptions = airportRes.data?.map((airport) => ({
          value: airport.id, // Sử dụng `id` thay vì `airport_id`
          label: `${airport.name}, ${airport.city} (${airport.country})`,
        })) || [];

        setAirplaneRes(airplaneRes.data);
        setAirportRes(airportRes.data);

        // Cập nhật inputsState
        setInputsState((prevInputs) =>
          prevInputs.map((input) => {
            if (input.id === "airplane_id") {
              return { ...input, options: airplaneOptions };
            }
            if (input.id === "departure_airport_id" || input.id === "arrival_airport_id") {
              return { ...input, options: airportOptions };
            }
            return input;
          })
        );
      } catch (error) {
        console.error("Failed to fetch airplanes or airports:", error);
        toast.error("Failed to fetch data. Please try again.");
      }
    };

    fetchAirplanesAndAirports();
  }, []);

  useEffect(() => {
    if (path === "airplane-flights" && data) {
      setInfo({
        ...data,
        status: data.status,
      });
    } else if (path === "announcements" && data) {
      setInfo({
        ...data,
      });
    } else if (data) {
      setInfo({
        ...data,
        dob: data.dob ? dayjs(data.dob).format("YYYY-MM-DD") : "",
      });
    }
  }, [data, path, airplaneRes, airportRes]);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      if (path === "users") {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");

        let imageUrl = info.avatar;

        if (file) {
          // Chuyển đổi file sang Base64
          const base64 = await toBase64(file);

          // Gửi Base64 tới API upload
          const uploadRes = await axiosInstance.post("/api/upload-avatar", { image: base64, name_folder: "user_uploads" });

          imageUrl = uploadRes.data.url;
        }

        const newUser = {
          ...info,
          avatar: imageUrl,
          role: info.role,
        };

        await axiosInstance.put(`/api/${path}/${id}`, newUser);

        // Gọi lại API `GET` để lấy dữ liệu mới nhất
        const res = await axiosInstance.get(`/api/users/${id}`);
        setInfo({
          ...res.data,
          dob: res.data.dob ? dayjs(res.data.dob).format("YYYY-MM-DD") : "",
        });

        toast.success("Cập nhật thông tin người dùng thành công!");
      } else if (path === "airplanes") {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");

        let imageUrl = info.avatar;

        if (file) {
          // Chuyển đổi file sang Base64
          const base64 = await toBase64(file);

          // Gửi Base64 tới API upload
          const uploadRes = await axiosInstance.post("/api/upload-avatar", { image: base64, name_folder: "airplane_uploads" });

          imageUrl = uploadRes.data.url;
        }

        const newAirplane = {
          ...info,
          last_inspection_date: dayjs(info.last_inspection_date).format("YYYY-MM-DD"),
          avatar: imageUrl,
        };

        const res = await axiosInstance.put(`/api/${path}/${id}`, newAirplane);

        setInfo({
          ...res.data,
          last_inspection_date: res.data.last_inspection_date
            ? dayjs(res.data.last_inspection_date).format("YYYY-MM-DD")
            : "",
        });

        toast.success("Infomation airplane updated successfully");
      } else if (path === "airports") {
        await axiosInstance.put(`/api/${path}/${id}`, { ...info });
        toast.success("Infomation airport updated successfully");
      } else if (path === "airplane-flights") {
        if (!validate()) {
          toast.error("Please fix the errors before submitting.");
          return;
        }

        try {
          const payload = {
            departure_time: info.departure_time
              ? dayjs(info.departure_time).format("YYYY-MM-DDTHH:mm:ss")
              : null,
            arrival_time: info.arrival_time
              ? dayjs(info.arrival_time).format("YYYY-MM-DDTHH:mm:ss")
              : null,
            status: info.status,
            airplane_id: parseInt(info.airplane_id) || null,
            departure_airport_id: parseInt(info.departure_airport_id) || null,
            arrival_airport_id: parseInt(info.arrival_airport_id) || null,
          };

          const response = await axiosInstance.put(`/api/${path}/${id}`, payload);

          if (response.status === 200) {
            toast.success("Flight information updated successfully!");
            // Cập nhật lại thông tin trong state (nếu cần)
            setInfo((prev) => ({ ...prev, ...payload }));
          }
        } catch (err) {
          console.error("Error updating flight information:", err);
          toast.error("Failed to update flight information.");
        }
      } else if (path === "promotions") {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");

        let imageUrl = info.image_url;

        if (file) {
          // Chuyển đổi file sang Base64
          const base64 = await toBase64(file);

          // Gửi Base64 tới API upload
          const uploadRes = await axiosInstance.post("/api/upload-avatar", { image: base64, name_folder: "offer_uploads" });

          imageUrl = uploadRes.data.url;
        }

        const newPromotions = {
          ...info,
          start_date: dayjs(info.start_date).format("YYYY-MM-DD"),
          end_date: dayjs(info.end_date).format("YYYY-MM-DD"),
          image_url: imageUrl,
        };

        const res = await axiosInstance.put(`/api/${path}/${id}`, newPromotions);

        setInfo({
          ...res.data,
          last_inspection_date: res.data.last_inspection_date
            ? dayjs(res.data.last_inspection_date).format("YYYY-MM-DD")
            : "",
        });

        toast.success("Infomation promotion updated successfully");
      } else if (path === "destinations") {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");

        let imageUrl = info.image_url;

        if (file) {
          // Chuyển đổi file sang Base64
          const base64 = await toBase64(file);

          // Gửi Base64 tới API upload
          const uploadRes = await axiosInstance.post("/api/upload-avatar", { image: base64, name_folder: "destination_uploads" });

          imageUrl = uploadRes.data.url;
        }

        const newDestinations = {
          ...info,
          latitude: parseFloat(info.latitude),
          longitude: parseFloat(info.longitude),
          image_url: imageUrl,
        };

        const res = await axiosInstance.put(`/api/${path}/${id}`, newDestinations);

        setInfo({
          ...res.data,
          last_inspection_date: res.data.last_inspection_date
            ? dayjs(res.data.last_inspection_date).format("YYYY-MM-DD")
            : "",
        });

        toast.success("Infomation destination updated successfully");
      }

      setTimeout(() => {
        window.location.reload();
      }, 4000);
    } catch (err) {
      console.error("Lỗi khi tải lên ảnh:", err);
      toast.error("Đã xảy ra lỗi khi cập nhật người dùng!");
    }
  };

  // Chuyển file sang Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const validate = () => {
    const newErrors = {};

    if (path === "users") {
      // Kiểm tra Username
      if (!info.username || info.username.trim() === "") {
        newErrors.username = "Username is required.";
      }

      // Kiểm tra Email
      if (!info.email || info.email.trim() === "") {
        newErrors.email = "Email is required.";
      } else if (!/^\S+@\S+\.\S+$/.test(info.email)) {
        newErrors.email = "Invalid email format.";
      }

      // Kiểm tra Số điện thoại
      if (!info.phone || info.phone.trim() === "") {
        newErrors.phone = "Phone number is required.";
      } else if (!/^\d{10,15}$/.test(info.phone)) {
        newErrors.phone = "Phone number must be between 10-15 digits.";
      }

      // Kiểm tra Mật khẩu
      if (info.password && info.password.trim() !== "") {
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(info.password)) {
          newErrors.password =
            "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, and a special character.";
        }
      }

      // Kiểm tra Address
      if (!info.address || info.address.trim() === "") {
        newErrors.address = "Address is required.";
      }
    } else if (path === "airplanes") {
      // Kiểm tra Model
      if (!info.model || info.model.trim() === "") {
        newErrors.model = "Model is required.";
      }

      // Kiểm tra Manufacturer
      if (!info.manufacturer || info.manufacturer.trim() === "") {
        newErrors.manufacturer = "Manufacturer is required.";
      }

      // Kiểm tra Year of Manufacture
      if (!info.year_of_manufacture || isNaN(info.year_of_manufacture)) {
        newErrors.year_of_manufacture = "Year of manufacture is required and must be a number.";
      } else if (info.year_of_manufacture < 1900 || info.year_of_manufacture > new Date().getFullYear()) {
        newErrors.year_of_manufacture = "Year of manufacture must be between 1900 and the current year.";
      }

      // Kiểm tra Registration Number
      if (!info.registration_number || info.registration_number.trim() === "") {
        newErrors.registration_number = "Registration number is required.";
      }

      // Kiểm tra Fuel Capacity
      if (!info.fuel_capacity || isNaN(info.fuel_capacity)) {
        newErrors.fuel_capacity = "Fuel capacity is required and must be a number.";
      } else if (info.fuel_capacity <= 0) {
        newErrors.fuel_capacity = "Fuel capacity must be greater than 0.";
      }

      // Kiểm tra Last Inspection Date
      if (!info.last_inspection_date || info.last_inspection_date.trim() === "") {
        newErrors.last_inspection_date = "Last inspection date is required.";
      } else {
        const currentDate = new Date();
        const inspectionDate = new Date(info.last_inspection_date);
        if (inspectionDate > currentDate) {
          newErrors.last_inspection_date = "Last inspection date cannot be in the future.";
        }
      }

      // Kiểm tra Capacity
      if (!info.capacity || isNaN(info.capacity)) {
        newErrors.capacity = "Capacity is required and must be a number.";
      } else if (info.capacity <= 0) {
        newErrors.capacity = "Capacity must be greater than 0.";
      }

      // Kiểm tra Status
      if (!info.status || info.status.trim() === "") {
        newErrors.status = "Status is required.";
      }
    } else if (path === "airports") {
      if (!info.name || info.name.trim() === "") {
        newErrors.name = "Airport name is required.";
      }

      if (!info.city || info.city.trim() === "") {
        newErrors.city = "City is required.";
      }

      if (!info.country || info.country.trim() === "") {
        newErrors.country = "Country is required.";
      }

      if (!info.iata_code || info.iata_code.trim() === "") {
        newErrors.iata_code = "IATA code is required.";
      } else if (info.iata_code.length !== 3) {
        newErrors.iata_code = "IATA code must be exactly 3 characters.";
      }
    } else if (path === "airplane-flights") {
      // Validate thời gian khởi hành
      if (!info.departure_time || info.departure_time.trim() === "") {
        newErrors.departure_time = "Departure time is required.";
      }

      // Validate thời gian hạ cánh
      if (!info.arrival_time || info.arrival_time.trim() === "") {
        newErrors.arrival_time = "Arrival time is required.";
      } else if (info.departure_time && info.arrival_time <= info.departure_time) {
        newErrors.arrival_time = "Arrival time must be after departure time.";
      }

      // Validate trạng thái
      if (!info.status || info.status.trim() === "") {
        newErrors.status = "Status is required.";
      }

      // Validate máy bay
      if (!info.airplane_id || isNaN(info.airplane_id)) {
        newErrors.airplane_id = "Airplane is required.";
      }

      // Validate sân bay khởi hành
      if (!info.departure_airport_id || isNaN(info.departure_airport_id)) {
        newErrors.departure_airport_id = "Departure airport is required.";
      }

      // Validate sân bay đến
      if (!info.arrival_airport_id || isNaN(info.arrival_airport_id)) {
        newErrors.arrival_airport_id = "Arrival airport is required.";
      } else if (info.departure_airport_id === info.arrival_airport_id) {
        newErrors.arrival_airport_id = "Departure and arrival airports must be different.";
      }
    } else if (path === "promotions") {
      // Validate Title
      if (!info.title || info.title.trim() === "") {
        newErrors.title = "Title is required.";
      }

      // Validate Description
      if (!info.description || info.description.trim() === "") {
        newErrors.description = "Description is required.";
      }

      // Validate Destination
      if (!info.destination || info.destination.trim() === "") {
        newErrors.destination = "Destination is required.";
      }

      // Validate Price
      if (!info.price || isNaN(info.price) || parseFloat(info.price) <= 0) {
        newErrors.price = "Price must be a positive number.";
      }

      // Validate Discount Percentage
      if (
        info.discount_percentage &&
        (isNaN(info.discount_percentage) ||
          parseFloat(info.discount_percentage) < 0 ||
          parseFloat(info.discount_percentage) > 100)
      ) {
        newErrors.discount_percentage = "Discount percentage must be between 0 and 100.";
      }

      // Validate Valid Period
      if (!info.valid_period || info.valid_period.trim() === "") {
        newErrors.valid_period = "Valid period is required.";
      }

      // Validate Start Date
      if (!info.start_date) {
        newErrors.start_date = "Start date is required.";
      }

      // Validate End Date
      if (!info.end_date) {
        newErrors.end_date = "End date is required.";
      } else if (new Date(info.end_date) <= new Date(info.start_date)) {
        newErrors.end_date = "End date must be after the start date.";
      }
    } else if (path === "destinations") {
      if (!info.name || info.name.trim() === "") {
        newErrors.name = "Name is required.";
      }

      if (!info.description || info.description.trim() === "") {
        newErrors.description = "Description is required.";
      }

      if (!info.latitude || isNaN(info.latitude)) {
        newErrors.latitude = "Latitude must be a valid number.";
      }

      if (!info.longitude || isNaN(info.longitude)) {
        newErrors.longitude = "Longitude must be a valid number.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  console.log(info);

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>

          <button onClick={handleBack} className="backButton">
            Back Page
          </button>
        </div>
        <div className="bottom">
          {path === "airports" || path === "airplane-flights" || path === "announcements" ? (
            <></>
          ) : (
            <>
              <div className="left">
                <img
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : info.avatar || info.image_url || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt=""
                />
              </div>
            </>
          )}
          <div className="right">
            <form onSubmit={handleClick}>
              {path === "airports" || path === "airplane-flights" || path === "announcements" ? (
                <></>
              ) : (
                <>
                  <div className="formInput">
                    <label htmlFor="file">
                      Image: <DriveFolderUploadOutlinedIcon className="icon" />
                    </label>
                    <input
                      type="file"
                      id="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{ display: "none" }}
                    />
                  </div>
                </>
              )}

              {path === "airplane-flights" ? (
                <>
                  {
                    inputsState.map((input) => (
                      <div className="formInput" key={input.id}>
                        <label>{input.label}</label>
                        {input.type === "select" ? (
                          <select
                            id={input.id}
                            value={info[input.id] || ""}
                            onChange={handleChange}
                          >
                            <option value="">Select {input.label.toLowerCase()}</option>
                            {input.options.map((option, index) => (
                              <option key={option.value || index} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            onChange={handleChange}
                            type={input.type}
                            placeholder={input.placeholder}
                            id={input.id}
                            value={
                              input.type === "date" && info[input.id]
                                ? dayjs(info[input.id]).format("YYYY-MM-DD")
                                : input.type === "datetime-local" && info[input.id]
                                  ? dayjs(info[input.id]).format("YYYY-MM-DDTHH:mm")
                                  : info[input.id] || ""
                            }
                          />
                        )}

                        {/* Hiển thị lỗi */}
                        {errors[input.id] && <span className="error-message">{errors[input.id]}</span>}
                      </div>
                    ))
                  }
                </>
              ) : (
                <>
                  {
                    inputs.map((input) => (
                      <div className="formInput" key={input.id}>
                        <label>{input.label}</label>
                        {input.type === "password" ? (
                          <div className="password-container">
                            <input
                              type={showPasswords[input.id] ? "text" : "password"}
                              id={input.id}
                              value={info[input.id] || ""}
                              onChange={handleChange}
                              placeholder={input.placeholder}
                            />
                            <button
                              type="button"
                              className="toggle-password"
                              onClick={() => togglePasswordVisibility(input.id)}
                            >
                              {showPasswords[input.id] ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        ) : input.type === "select" ? (
                          <select
                            id={input.id}
                            value={info[input.id] || ""}
                            onChange={handleChange}
                          >
                            <option value="">Select {input.label}</option>
                            {input.options.map((option, index) => (
                              <option key={option.value || index} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            onChange={handleChange}
                            type={input.type}
                            placeholder={input.placeholder}
                            id={input.id}
                            value={
                              input.type === "date" && info[input.id]
                                ? dayjs(info[input.id]).format("YYYY-MM-DD")
                                : input.type === "datetime-local" && info[input.id]
                                  ? dayjs(info[input.id]).format("YYYY-MM-DDTHH:mm")
                                  : info[input.id] || ""
                            }
                          />
                        )}

                        {/* Hiển thị lỗi */}
                        {errors[input.id] && <span className="error-message">{errors[input.id]}</span>}
                      </div>
                    ))
                  }
                </>
              )}

              < button type="submit" className="btn-submit">Send</button>
            </form>
          </div>
        </div>

        {path === "airplanes" && (
          <div className="seatingChart">
            <div className="top">
              <h1>Seating Chart</h1>
            </div>

            <div className="seatingGrid">
              {seats.map((seat) => (
                <div
                  key={seat.seat_number}
                  className={`seat ${seat.is_occupied ? "occupied" : "available"} ${seat.seat_class.toLowerCase()
                    }`}
                  onClick={() => navigate(`/airplanes/${id}/seat/${seat.seat_id}`)}
                >
                  {seat.seat_number}
                </div>
              ))}

              <div
                className="seat add-seat"
                onClick={() => navigate(`/airplanes/${id}/seat/new`)}
              >
                +
              </div>
            </div>

            <div className="legend">
              <div className="legendItem">
                <span className="seat business"></span> Business
              </div>
              <div className="legendItem">
                <span className="seat first"></span> First
              </div>
              <div className="legendItem">
                <span className="seat economy"></span> Economy
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default Edit;