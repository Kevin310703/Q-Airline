CREATE DATABASE airline_db;
USE airline_db;

-- Quản lý người dùng
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    phone_number VARCHAR(15),
    birth_date DATE DEFAULT NULL,
    country VARCHAR(100) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    gender ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Vai trò trong hệ thống
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- Liên kết người dùng với vai trò
CREATE TABLE user_roles (
    user_role_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- Quản lý sân bay
CREATE TABLE airports (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    iata_code VARCHAR(10) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Quản lý máy bay
CREATE TABLE airplanes (
    airplane_id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100),
    year_of_manufacture YEAR,
    capacity INT NOT NULL,
    status ENUM('Active', 'Maintenance', 'Retired') DEFAULT 'Active',
	registration_number VARCHAR(50) UNIQUE,
	fuel_capacity DECIMAL(10,2),
	last_inspection_date DATE,
    avatar VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Quản lý ghế ngồi trên máy bay
CREATE TABLE airplane_seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    airplane_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,  -- Ví dụ: "1A", "10B"
    seat_class ENUM('Economy', 'Business', 'First') DEFAULT 'Economy',
    rows_number INT NOT NULL,           -- Số hàng (1, 2, 3, ...)
    is_occupied BOOLEAN DEFAULT false, -- Trạng thái ghế (true: đã đặt, false: còn trống)
    passenger_id INT DEFAULT NULL,     -- Liên kết với hành khách đã đặt (user_id)
    price DECIMAL(10, 2) DEFAULT NULL, -- Giá vé cho ghế (tùy chọn)
    notes VARCHAR(255) DEFAULT NULL,   -- Ghi chú đặc biệt (ví dụ: trẻ em, người khuyết tật)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (airplane_id) REFERENCES airplanes(airplane_id),
    FOREIGN KEY (passenger_id) REFERENCES users(user_id)
);

-- Quản lý chuyến bay
CREATE TABLE flights (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    airplane_id INT NOT NULL,
    departure_airport_id INT NOT NULL,
    arrival_airport_id INT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    actual_departure_time DATETIME NULL,
    status ENUM('Scheduled', 'Delayed', 'Canceled', 'Completed') DEFAULT 'Scheduled',
    FOREIGN KEY (airplane_id) REFERENCES airplanes(airplane_id),
    FOREIGN KEY (departure_airport_id) REFERENCES airports(airport_id),
    FOREIGN KEY (arrival_airport_id) REFERENCES airports(airport_id)
);

-- Quản lý đặt chỗ
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    flight_id INT NOT NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Confirmed', 'Canceled') DEFAULT 'Confirmed',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
);

-- Quản lý vé
CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    flight_id INT NOT NULL,
    seat_number VARCHAR(10),
    seat_class ENUM('Economy', 'Business', 'First') DEFAULT 'Economy',
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
);

-- Quản lý thanh toán
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('Credit_card', 'Paypal', 'Bank_transfer') NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- Quản lý hành lý
CREATE TABLE luggage (
    luggage_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    weight DECIMAL(5, 2) NOT NULL,
    type ENUM('Carry-on', 'Checked') NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- Quản lý khuyến mãi
CREATE TABLE promotions (
    promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quản lý thông báo
CREATE TABLE announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (role_name)
VALUES 
('Customer'),
('Staff'),
('Admin')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);
