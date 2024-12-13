export const userColumns = [
  { field: "id", headerName: "ID", width: 10 },
  {
    field: "user",
    headerName: "User",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={params.row.avatar || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
            alt="avatar"
          />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },

  {
    field: "address",
    headerName: "Address",
    width: 230,
  },
  {
    field: "country",
    headerName: "Country",
    width: 100,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 110,
  },
  {
    field: "role",
    headerName: "Role",
    width: 100,
  },
];

export const planeColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 10,
  },
  {
    field: "model",
    headerName: "Model",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={params.row.avatar || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
            alt="avatar"
          />
          {params.row.model}
        </div>
      );
    },
  },
  {
    field: "manufacturer",
    headerName: "Manufacturer",
    width: 150,
  },
  {
    field: "year_of_manufacture",
    headerName: "Year of Manufacture",
    width: 150,
    type: "string",
  },
  {
    field: "registration_number",
    headerName: "Registration Number",
    width: 150,
  },
  {
    field: "capacity",
    headerName: "Capacity",
    width: 150,
    renderCell: (params) => `${params.row.capacity} seats`,
  },
];

export const airportColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 10,
  },
  {
    field: "name",
    headerName: "Airport Name",
    width: 250,
  },
  {
    field: "city",
    headerName: "City",
    width: 150,
  },
  {
    field: "country",
    headerName: "Country",
    width: 150,
  },
  {
    field: "iata_code",
    headerName: "IATA Code",
    width: 100,
  },
];

export const flightColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
  },
  {
    field: "airplane_id",
    headerName: "Airplane",
    width: 200,
    renderCell: (params) =>
      `${params.row.airplane_model} (${params.row.airplane_registration})`,
  },
  {
    field: "departure_airport",
    headerName: "Departure Airport",
    width: 250,
    renderCell: (params) => params.row.departure_airport || "N/A",
  },
  {
    field: "arrival_airport",
    headerName: "Arrival Airport",
    width: 250,
    renderCell: (params) => params.row.arrival_airport || "N/A",
  },
  {
    field: "departure_time",
    headerName: "Departure Time",
    width: 180,
    renderCell: (params) => new Date(params.row.departure_time).toLocaleString(), // Format thời gian
  },
  {
    field: "arrival_time",
    headerName: "Arrival Time",
    width: 180,
    renderCell: (params) => new Date(params.row.arrival_time).toLocaleString(),
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: (params) => {
      const status = params.row.status || "";
      const statusColors = {
        Scheduled: "#4caf50",
        Delayed: "#ff9800",
        Canceled: "#f44336",
        Completed: "#2196f3",
      };

      return (
        <span
          style={{
            color: "#fff",
            backgroundColor: statusColors[status] || "#757575",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {status
            ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
            : "Unknown"}
        </span>
      );
    },
  },
];

export const notificationColumns = [
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "title",
    headerName: "Title",
    width: 230,
  },
  {
    field: "message",
    headerName: "Message",
    width: 200,
  },
];

export const ticketColumns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "airplane_model", headerName: "Airplane", width: 250,
    renderCell: (params) => {
      const content = params.row.airplane_model
        + "(" + params.row.airplane_registration_number + ")";
      return content;
    },
  },
  { field: "departure_airport", headerName: "Departure Airport", width: 250 },
  { field: "arrival_airport", headerName: "Arrival Airport", width: 250 },
  {
    field: "departure_time", headerName: "Departure Time", width: 190,
    renderCell: (params) => {
      const bookingDate = new Date(params.row.departure_time);
      const formattedDate = `${bookingDate.toLocaleDateString()} ${bookingDate.toLocaleTimeString()}`;
      return formattedDate;
    },
  },
  {
    field: "arrival_time", headerName: "Arrival Time", width: 190,
    renderCell: (params) => {
      const bookingDate = new Date(params.row.arrival_time);
      const formattedDate = `${bookingDate.toLocaleDateString()} ${bookingDate.toLocaleTimeString()}`;
      return formattedDate;
    },
  },
  { field: "seat_number", headerName: "Seat Number", width: 100 },
  { field: "seat_class", headerName: "Seat Class", width: 100 },
  { field: "price", headerName: "Price ($)", width: 100 },
  { field: "customer_name", headerName: "Customer", width: 150 },
  {
    field: "booking_date",
    headerName: "Booking Date",
    width: 190,
    renderCell: (params) => {
      const bookingDate = new Date(params.row.booking_date);
      const formattedDate = `${bookingDate.toLocaleDateString()} ${bookingDate.toLocaleTimeString()}`;
      return formattedDate;
    },
  },
  {
    field: "booking_status",
    headerName: "Booking Status",
    width: 150,
    renderCell: (params) => {
      const statusColors = {
        Confirmed: "#4caf50", // Green
        Canceled: "#f44336", // Red
      };
      return (
        <span
          style={{
            color: "#fff",
            backgroundColor: statusColors[params.row.booking_status] || "#757575", // Default color
            padding: "5px 10px",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          {params.row.booking_status}
        </span>
      );
    },
  },
];
