export const userInputs = [
  {
    id: "username",
    label: "Username",
    type: "text",
    placeholder: "Nguyen Van A",
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "nguyenvana@gmail.com",
  },
  {
    id: "phone",
    label: "Phone number",
    type: "text",
    placeholder: "+84 012 3456 789",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
  },
  {
    id: "dob",
    label: "Date of Birth",
    type: "date",
    placeholder: "Vietnam",
  },
  {
    id: "country",
    label: "Country",
    type: "text",
    placeholder: "Vietnam",
  },
  {
    id: "address",
    label: "Address",
    type: "text",
    placeholder: "Xuan Thuy, Cau Giay, Hanoi",
  },
  {
    id: "gender",
    label: "Gender",
    type: "select",
    options: [
      { value: "Other", label: "Other" },
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ],
  },
  {
    id: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "Admin", label: "Admin" },
      { value: "Staff", label: "Staff" },
      { value: "Customer", label: "Customer" },
    ],
  },
];

export const planeInputs = [
  {
    id: "model",
    label: "Model",
    type: "text",
    placeholder: "Boeing 737",
  },
  {
    id: "manufacturer",
    label: "Manufacturer",
    type: "text",
    placeholder: "Boeing",
  },
  {
    id: "year_of_manufacture",
    label: "Year of Manufacture",
    type: "number",
    placeholder: "2020",
  },
  {
    id: "registration_number",
    label: "Registration Number",
    type: "text",
    placeholder: "VN-A321",
  },
  {
    id: "fuel_capacity",
    label: "Fuel Capacity (L)",
    type: "number",
    placeholder: "50000",
  },
  {
    id: "last_inspection_date",
    label: "Last Inspection Date",
    type: "date",
  },
  {
    id: "capacity",
    label: "Capacity",
    type: "number",
    placeholder: "180",
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "Active", label: "Active" },
      { value: "Maintenance", label: "Maintenance" },
      { value: "Retired", label: "Retired" },
    ],
  },
];

export const seatInputs = [
  {
    id: "seat_number",
    label: "Seat Number",
    type: "text",
    placeholder: "1A",
  },
  {
    id: "seat_class",
    label: "Seat Class",
    type: "select",
    options: [
      { value: "Economy", label: "Economy" },
      { value: "Business", label: "Business" },
      { value: "First", label: "First" },
    ],
  },
  {
    id: "rows_number",
    label: "Row Number",
    type: "number",
    placeholder: "1",
  },
  {
    id: "is_occupied",
    label: "Is Occupied",
    type: "select",
    options: [
      { value: 0, label: "Available" },
      { value: 1, label: "Occupied" },
    ],
  },
  {
    id: "passenger_id",
    label: "Passenger ID",
    type: "select",
    options: [
      { value: 0, label: "Nguyen Van A" },
    ],
  },
  {
    id: "price",
    label: "Price",
    type: "number",
    placeholder: "Enter price (e.g., 100.00)",
  },
  {
    id: "notes",
    label: "Notes",
    type: "text",
    placeholder: "Enter any notes (optional)",
  },
];

export const airportInputs = [
  {
    id: "name",
    label: "Airport Name",
    type: "text",
    placeholder: "Enter airport name",
  },
  {
    id: "city",
    label: "City",
    type: "text",
    placeholder: "Enter city name",
  },
  {
    id: "country",
    label: "Country",
    type: "text",
    placeholder: "Enter country name",
  },
  {
    id: "iata_code",
    label: "IATA Code",
    type: "text",
    placeholder: "Enter IATA code (e.g., HAN, SGN)",
  },
];

export const flightInputs = [
  {
    id: "airplane_id",
    label: "Airplane",
    type: "select",
    options: [], // Danh sách máy bay sẽ được fetch từ API và gán vào đây
  },
  {
    id: "departure_airport_id",
    label: "Departure Airport",
    type: "select",
    options: [], // Danh sách sân bay khởi hành sẽ được fetch từ API
  },
  {
    id: "arrival_airport_id",
    label: "Arrival Airport",
    type: "select",
    options: [], // Danh sách sân bay đến sẽ được fetch từ API
  },
  {
    id: "departure_time",
    label: "Departure Time",
    type: "datetime-local", // Hỗ trợ chọn cả ngày và giờ
  },
  {
    id: "arrival_time",
    label: "Arrival Time",
    type: "datetime-local",
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "Scheduled", label: "Scheduled" },
      { value: "Delayed", label: "Delayed" },
      { value: "Canceled", label: "Canceled" },
      { value: "Completed", label: "Completed" },
    ],
  },
];

export const ticketInputs = [
  {
    id: "flight_id",
    label: "Flight",
    type: "select",
    options: [],
    placeholder: "Select a flight",
  },
  {
    id: "seat_class",
    label: "Seat Class",
    type: "select",
    placeholder: "Select a class",
    options: [
      { value: "Economy", label: "Economy" },
      { value: "Business", label: "Business" },
      { value: "First", label: "First" },
    ],
  },
  {
    id: "seat_number",
    label: "Seat Number",
    type: "select",
    options: [],
    placeholder: "Select a seat",
  },
  {
    id: "price",
    label: "Price ($)",
    type: "number",
    placeholder: "Enter ticket price",
  },
];

export const announcementInputs = [
  {
    id: "title",
    label: "Title",
    type: "text",
    placeholder: "Enter the announcement title",
  },
  {
    id: "content",
    label: "Content",
    type: "textarea",
    placeholder: "Enter the announcement message",
  },
  {
    id: "sender_name",
    label: "Sender Name",
    type: "select",
    options: [],
  },
  {
    id: "is_read",
    label: "Read Status",
    type: "select",
    options: [
      { value: "1", label: "Read" },
      { value: "0", label: "Unread" },
    ],
  },
];

export const promotionInputs = [
  { id: "title", label: "Title", type: "text", placeholder: "Enter promotion title" },
  { id: "description", label: "Description", type: "textarea", placeholder: "Enter promotion details" },
  { id: "start_date", label: "Start Date", type: "date" },
  { id: "end_date", label: "End Date", type: "date" },
  { id: "discount_percentage", label: "Discount (%)", type: "number", placeholder: "Enter discount percentage" },
  { id: "destination", label: "Destination", type: "text", placeholder: "Enter destination" },
  { id: "price", label: "Price", type: "number", placeholder: "Enter price" },
  { id: "valid_period", label: "Valid Period (days)", type: "text", placeholder: "Enter valid period in days" },
];

export const destinationInputs = [
  {
    id: "name",
    label: "Destination Name",
    type: "text",
    placeholder: "Enter the name of the destination",
  },
  {
    id: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Provide a brief description of the destination",
  },
  {
    id: "latitude",
    label: "Latitude",
    type: "number",
    placeholder: "Enter the latitude",
  },
  {
    id: "longitude",
    label: "Longitude",
    type: "number",
    placeholder: "Enter the longitude",
  },
];
