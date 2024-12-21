import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axiosInstance from "../../config/axiosInstance";
import ModalConfirmDelete from "../modal/ModalConfirmDelete";
import { toast } from "react-toastify";
import ModalDelayFlight from "../modal/ModalDelayFlight";
import dayjs from "dayjs";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState();
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [showDelayModal, setShowDelayModal] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [newDepartureTime, setNewDepartureTime] = useState("");
  const [newArrivalTime, setNewArrivalTime] = useState("");

  const { data, loading, error } = useFetch(`/api/${path}`);

  useEffect(() => {
    setList(data)
  }, [data]);

  console.log(data);

  const openModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/${path}/${deleteId}`);
      const res = await axiosInstance.get(`/api/${path}`);
      setList(res.data);
      closeModal(); // Đóng modal sau khi xóa
      toast.success("Deleted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error('Failed to delete user!');
    }
  };

  const openDelayModal = (flightId, departureTime, arrivalTime) => {
    setSelectedFlightId(flightId);
    setNewDepartureTime(dayjs(departureTime).local().format("YYYY-MM-DDTHH:mm"));
    setNewArrivalTime(dayjs(arrivalTime).local().format("YYYY-MM-DDTHH:mm"));
    setShowDelayModal(true);
  };

  const closeDelayModal = () => {
    setShowDelayModal(false);
    setSelectedFlightId(null);
  };

  const handleDelay = async (newDepartureTime, newArrivalTime) => {
    if (!newDepartureTime || !newArrivalTime) {
      toast.error("Please select both departure and arrival times.");
      return;
    }

    try {
      const formattedDepartureTime = dayjs(newDepartureTime).format("YYYY-MM-DD HH:mm:ss");
      const formattedArrivalTime = dayjs(newArrivalTime).format("YYYY-MM-DD HH:mm:ss");

      await axiosInstance.put(`/api/airplane-flights/time/${selectedFlightId}`, {
        new_departure_time: formattedDepartureTime,
        new_arrival_time: formattedArrivalTime,
      });

      // Fetch lại danh sách sau khi cập nhật thành công
      const updatedList = await axiosInstance.get(`/api/airplane-flights`);
      setList(updatedList.data);

      closeDelayModal();

      toast.success("Flight times updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    } catch (error) {
      console.error("Failed to update flight times:", error);
      toast.error("Failed to update flight times. Please try again.");
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await axiosInstance.put(`/api/tickets/${id}/cancel`);
      toast.success("Booking canceled successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        console.log(params);
        return (
          <div className="cellAction">
            {path === "announcements" || path === "promotions" || path === "destinations" || path === "airplane-flights" ? (
              <Link to={`/${path}/edit/${params.row.id}`} style={{ textDecoration: "none" }}>
                <div className="viewButton">Edit</div>
              </Link>
            ) : (
              <Link to={`/${path}/${params.row.id}`} style={{ textDecoration: "none" }}>
                <div className="viewButton">View</div>
              </Link>
            )}

            <div
              className="deleteButton"
              onClick={() => openModal(params.row.id)}
            >
              Delete
            </div>

            {path === "airplane-flights" && (
              <div
                className="delayButton"
                onClick={() =>
                  openDelayModal(params.row.id, params.row.departure_time, params.row.arrival_time)
                }
              >
                Delay
              </div>
            )}

            {path === "tickets" && (
              <div
                className="cancelBookingButton"
                onClick={() => handleCancelBooking(params.row.booking_id)}
              >
                Cancel
              </div>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        {path}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>

      <DataGrid
        className="datagrid"
        rows={data}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={row => row.id}
      />

      {/* Modal */}
      <ModalConfirmDelete
        show={showModal}
        onClose={closeModal}
        onConfirm={handleDelete}
        entity={path}
      />

      <ModalDelayFlight
        show={showDelayModal}
        onClose={closeDelayModal}
        onConfirm={(newDepartureTime, newArrivalTime) => {
          // Xử lý cập nhật giờ bay
          handleDelay(newDepartureTime, newArrivalTime);
        }}
        initialDepartureTime={newDepartureTime}
        initialArrivalTime={newArrivalTime}
      />
    </div>
  );
};

export default Datatable;
