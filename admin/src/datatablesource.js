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
    field: "gender",
    headerName: "Gender",
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

export const bookingColumns = [
  { field: "id", headerName: "Booking ID", width: 110 },
  {
    field: "customer_name",
    headerName: "Customer Name",
    width: 200,
    renderCell: (params) => params.row.customer_name || "N/A",
  },
  {
    field: "email",
    headerName: "Customer Email",
    width: 230,
    renderCell: (params) => params.row.customer_email || "N/A",
  },
  {
    field: "flight_details",
    headerName: "Flight Details",
    width: 600,
    renderCell: (params) =>
      `${params.row.departure_airport} → ${params.row.arrival_airport} (${params.row.airplane_model})`,
  },
  {
    field: "departure_time",
    headerName: "Departure Time",
    width: 190,
    renderCell: (params) => {
      const depTime = new Date(params.row.departure_time);
      return depTime.toLocaleString();
    },
  },
  {
    field: "arrival_time",
    headerName: "Arrival Time",
    width: 190,
    renderCell: (params) => {
      const depTime = new Date(params.row.arrival_time);
      return depTime.toLocaleString();
    },
  },
  { field: "seat_number", headerName: "Seat Number", width: 100 },
  { field: "seat_class", headerName: "Seat Class", width: 100 },
  { field: "price", headerName: "Price ($)", width: 100 },
  {
    field: "booking_date",
    headerName: "Booking Date",
    width: 190,
    renderCell: (params) => {
      const bookTime = new Date(params.row.booking_date);
      return bookTime.toLocaleString();
    },
  },
  {
    field: "status",
    headerName: "Status",
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
            backgroundColor: statusColors[params.row.status] || "#757575",
            padding: "5px 10px",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          {params.row.status}
        </span>
      );
    },
  },
];

export const announcementsColumns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "title",
    headerName: "Title",
    width: 250,
    renderCell: (params) => params.row.title || "N/A",
  },
  {
    field: "content",
    headerName: "Content",
    width: 400,
    renderCell: (params) => params.row.content || "N/A",
  },
  {
    field: "sender_name",
    headerName: "Sender",
    width: 200,
    renderCell: (params) => params.row.sender_name === null ? "System" : params.row.sender_name,
  },
  {
    field: "created_at",
    headerName: "Date Created",
    width: 190,
    renderCell: (params) => {
      const createdAt = new Date(params.row.created_at);
      return createdAt.toLocaleString();
    },
  },
  {
    field: "is_read",
    headerName: "Read Status",
    width: 150,
    renderCell: (params) => {
      const statusColors = {
        true: "#4caf50", // Green for read
        false: "#f44336", // Red for unread
      };
      return (
        <span
          style={{
            color: "#fff",
            backgroundColor: params.row.is_read ? statusColors["true"] : statusColors["false"],
            padding: "5px 10px",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          {params.row.is_read ? "Read" : "Unread"}
        </span>
      );
    },
  },
];

export const promotionColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
  },
  {
    field: "image_url",
    headerName: "Image",
    width: 150,
    renderCell: (params) => (
      <img
        src={params.row.image_url || "https://i.ibb.co/MBtjqXQ/no-image.png"}
        alt="promotion"
        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
      />
    ),
  },
  {
    field: "title",
    headerName: "Title",
    width: 250,
    renderCell: (params) => params.row.title || "N/A",
  },
  {
    field: "description",
    headerName: "Description",
    width: 400,
    renderCell: (params) => params.row.description || "N/A",
  },
  {
    field: "destination",
    headerName: "Destination",
    width: 200,
    renderCell: (params) => params.row.destination || "N/A",
  },
  {
    field: "price",
    headerName: "Price ($)",
    width: 120,
    renderCell: (params) => {
      const price = parseFloat(params.row.price);
      return !isNaN(price) ? `$${price.toFixed(2)}` : "N/A";
    },
  },
  {
    field: "discount_percentage",
    headerName: "Discount (%)",
    width: 150,
    renderCell: (params) =>
      `${params.row.discount_percentage || 0}%`,
  },
  {
    field: "valid_period",
    headerName: "Valid Period (days)",
    width: 200,
    renderCell: (params) =>
      params.row.valid_period ? `${params.row.valid_period} days` : "N/A",
  },
  {
    field: "start_date",
    headerName: "Start Date",
    width: 190,
    renderCell: (params) => {
      const startDate = new Date(params.row.start_date);
      return startDate.toLocaleDateString();
    },
  },
  {
    field: "end_date",
    headerName: "End Date",
    width: 190,
    renderCell: (params) => {
      const endDate = new Date(params.row.end_date);
      return endDate.toLocaleDateString();
    },
  },
  {
    field: "created_at",
    headerName: "Date Created",
    width: 190,
    renderCell: (params) => {
      const createdAt = new Date(params.row.created_at);
      return createdAt.toLocaleString();
    },
  },
];

export const destinationColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
  },
  {
    field: "image_url",
    headerName: "Image",
    width: 150,
    renderCell: (params) => (
      <img
        src={params.row.image_url || "https://via.placeholder.com/150"}
        alt={params.row.name}
        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
      />
    ),
  },
  {
    field: "name",
    headerName: "Destination Name",
    width: 200,
  },
  {
    field: "description",
    headerName: "Description",
    width: 400,
    renderCell: (params) => (
      <span>
        {params.row.description.length > 100
          ? `${params.row.description.slice(0, 100)}...`
          : params.row.description}
      </span>
    ),
  },
  {
    field: "latitude",
    headerName: "Latitude",
    width: 120,
  },
  {
    field: "longitude",
    headerName: "Longitude",
    width: 120,
  },
];
