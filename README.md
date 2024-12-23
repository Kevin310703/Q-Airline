# Q-Airline (Euphoria in Every Flight)

## Introduction

Q-Airline is a modern platform designed to manage and book airplane tickets, providing a convenient and efficient experience for both users and administrators. Built with Node.js, React.js (Vite), and MySQL, this application offers outstanding features to meet the diverse needs of the aviation industry.

## Features

- **User Management**: Register, log in, and manage user profiles securely.
- **Flight Search and Ticket Booking**:Search for flights based on criteria such as destination, time, and airline, quickly book tickets and manage booked ticket details.
- **Admin Panel**: Manage flight listings, user information, and system configurations efficiently.
- **Notifications and Promotions**: Receive updates about system changes and the latest promotional offers.
- **Responsive Design**: Enjoy a seamless experience across different devices, including desktops, laptops, tablets, and smartphones.

## Technology Stack

- **Frontend**: React.js with Vite.
- **Backend**: Node.js and Express.js.
- **Database**: MySQL.
- **Cloud Services**: Cloudinary for image management.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/Kevin310703/Q-Airline.git
```

2. Navigate to the project directory:

```bash
cd Q-Airline
```

3. There are 3 directories frontend, backend and adminadmin
for frontend
```bash
cd frontend
```

for backend
```bash
cd backend
```

for admin
```bash
cd admin
```

3. Install dependencies:

```bash
npm install
```

4. Set up environment variables:
   - Using a `.env` file in the root directory.
   - Add environment variables for MySQL connection, Cloudinary, and other sensitive information.

5. Start the development frontend server:

```bash
npm run dev
```
And open your browser and visit `http://localhost:5173` to access the application.

6. Start the development backend server:

```bash
npx nodemon index.js
```
And open your browser and visit `http://localhost:5000` to access the application.

7. Start the development admin server:

```bash
npm start
```
And open your browser and visit `http://localhost:3000` to access the application.

## Usage

Once the application is running, users can:

- Register, log in or reset password to their accounts.
- Search for flights based on their preferences.
- Book tickets securely.
- Update user infomation.
- Manage booked tickets.

Admin users can access additional functionalities through the admin panel, such as managing flight listings, airplane listings, ticket listing, notification or promotion, user information.

## About Us (Author)
We are a team of three students from The VNU University of Engineering and Technology (VNU-UET). Together, we developed Q-Airline as a project to apply our knowledge and skills in software development, aiming to create a practical and user-friendly solution for managing flight tickets.

- Chu Viet Kien (The Faculty of Agricultural Technology).
- Pham Mai Anh (The Faculty of Information Technology).
- Vu Thi Ngoc Thanh (The Faculty of Information Technology).

## Contact
Email: 21020830@vnu.edu.vn/kiencv.3107@gmail.com

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy coding!
