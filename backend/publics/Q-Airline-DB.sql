CREATE DATABASE airline_db;
USE airline_db;

-- Quản lý người dùng
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(255),
    phone_number VARCHAR(15),
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Quản lý phiên làm việc
CREATE TABLE sessions (
    session_id CHAR(36) PRIMARY KEY,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Quản lý đặt lại mật khẩu
CREATE TABLE password_resets (
    reset_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token CHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Xác thực hai yếu tố
CREATE TABLE two_factor_auth (
    tfa_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    secret_key VARCHAR(255) NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quản lý máy bay
CREATE TABLE airplanes (
    airplane_id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quản lý ghế ngồi trên máy bay
CREATE TABLE airplane_seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    airplane_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    seat_class ENUM('economy', 'business', 'first') DEFAULT 'economy',
    FOREIGN KEY (airplane_id) REFERENCES airplanes(airplane_id)
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
    ticket_price DECIMAL(10, 2) NOT NULL,
    ticket_class ENUM('economy', 'business', 'first') DEFAULT 'economy',
    status ENUM('scheduled', 'delayed', 'canceled', 'completed') DEFAULT 'scheduled',
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
    status ENUM('confirmed', 'canceled') DEFAULT 'confirmed',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
);

-- Quản lý vé
CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    flight_id INT NOT NULL,
    seat_number VARCHAR(10),
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
);

-- Quản lý thanh toán
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('credit_card', 'paypal', 'bank_transfer') NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- Quản lý hành lý
CREATE TABLE luggage (
    luggage_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    weight DECIMAL(5, 2) NOT NULL,
    type ENUM('carry-on', 'checked') NOT NULL,
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