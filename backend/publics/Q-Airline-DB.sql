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
    token VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE password_reset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Vai trò trong hệ thống
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (role_name)
VALUES 
('Customer'),
('Staff'),
('Admin')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

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

INSERT INTO airports 
(airport_id, name, city, country, iata_code, created_at, updated_at)
VALUES 
(1, 'Noi Bai International Airport', 'Ha Noi', 'Vietnam', 'HAN', '2024-12-04 00:23:41', '2024-12-12 13:07:03'),
(2, 'Tan Son Nhat International Airport', 'Ho Chi Minh City', 'Vietnam', 'SGN', '2024-12-04 00:24:23', '2024-12-04 00:24:23'),
(3, 'Da Nang International Airport', 'Da Nang', 'Vietnam', 'DAD', '2024-12-04 00:24:46', '2024-12-04 00:24:46'),
(4, 'Changi Airport', 'Singapore', 'Singapore', 'SIN', '2024-12-04 00:25:07', '2024-12-04 00:25:07');

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

INSERT INTO airplanes 
(airplane_id, model, manufacturer, year_of_manufacture, registration_number, fuel_capacity, last_inspection_date, capacity, status, created_at, updated_at, avatar)
VALUES 
(1, 'Boeing 737', 'Boeing', 2021, 'VN-A123', 5000.00, '2024-11-26', 180, 'Active', '2024-11-30 21:50:31', '2024-12-21 17:59:57', 'https://res.cloudinary.com/df3yjnxi2/image/upload/v1733124630/airplane_uploads/lounwym1sowsroxfpblk.jpg');

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

INSERT INTO airplane_seats 
(seat_id, airplane_id, seat_number, seat_class, rows_number, is_occupied, passenger_id, price, notes, created_at, updated_at)
VALUES
(1, 1, '1A', 'Business', 1, false, NULL, 800.00, NULL, '2024-12-02 10:54:33', '2024-12-21 18:05:14'),
(2, 1, '1B', 'Business', 1, false, NULL, 800.00, NULL, '2024-12-02 10:54:33', '2024-12-21 16:47:44'),
(3, 1, '1C', 'Business', 1, false, NULL, 800.00, NULL, '2024-12-02 10:54:33', '2024-12-21 16:51:33'),
(4, 1, '1D', 'Business', 1, false, NULL, 800.00, NULL, '2024-12-02 10:54:33', '2024-12-21 17:54:24'),
(5, 1, '2A', 'Business', 2, false, NULL, 800.00, NULL, '2024-12-02 10:54:33', '2024-12-21 16:51:33'),
(6, 1, '2B', 'Business', 2, false, NULL, 800.00, NULL, '2024-12-02 10:54:33', '2024-12-21 16:51:33'),
(7, 1, '2C', 'Business', 2, false, NULL, 800.00, NULL, '2024-12-02 10:54:33', '2024-12-21 16:51:33'),
(8, 1, '2D', 'Business', 2, false, NULL, 800.00, NULL, '2024-12-02 10:54:33', '2024-12-21 16:51:33'),
(9, 1, '3A', 'Business', 3, false, NULL, 800.00, NULL, '2024-12-02 10:54:33', '2024-12-21 16:51:33'),
(10, 1, '3B', 'Business', 3, false, NULL, 800.00, NULL, '2024-12-02 10:54:33', '2024-12-21 16:51:33'),
(29, 1, '16A', 'Economy', 16, false, NULL, 100.00, NULL, '2024-12-02 10:54:33', '2024-12-21 16:51:33'),
(30, 1, '16B', 'Economy', 16, false, NULL, 100.00, NULL, '2024-12-02 10:54:33', '2024-12-21 16:51:33'),
(31, 1, '16C', 'Economy', 16, false, NULL, 100.00, NULL, '2024-12-02 10:54:33', '2024-12-21 16:51:33'),
(76, 1, '23F', 'Economy', 23, true, 5, 100.00, NULL, '2024-12-02 10:54:33', '2024-12-21 18:00:28'),
(77, 1, '8A', 'First', 8, false, NULL, 1500.00, NULL, '2024-12-02 15:59:04', '2024-12-21 17:54:37'),
(78, 1, '8B', 'First', 8, false, NULL, 1500.00, NULL, '2024-12-02 16:08:16', '2024-12-21 16:49:05'),
(79, 1, '24F', 'Economy', 24, false, NULL, 100.00, 'New seat', '2024-12-21 18:01:12', '2024-12-21 18:01:12');

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

INSERT INTO flights 
(flight_id, airplane_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, actual_departure_time, status)
VALUES 
(1, 1, 3, 2, '2024-12-22 17:00:00', '2024-12-22 19:10:00', NULL, 'Delayed');

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

-- Quản lý điểm đến trên Google Map
CREATE TABLE destinations (
    destination_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO destinations (id, name, description, image_url, latitude, longitude, created_at, updated_at)
VALUES 
(1, 'Tokyo, Japan', 'A vibrant metropolis blending ultra-modern technology with traditional culture.', 'https://res.cloudinary.com/df3yjnxi2/image/upload/v1734722629/destination_uploads/grldpgbogqagldv4lf6v.jpg', 35.67620000, 139.65030000, '2024-12-21 02:23:47', '2024-12-21 18:09:21'),
(2, 'Paris, France', 'The city of love, art, and iconic landmarks like the Eiffel Tower.', 'https://res.cloudinary.com/df3yjnxi2/image/upload/v1734722808/destination_uploads/uv96j1nbnodk7giusddl.jpg', 48.85660000, 2.35220000, '2024-12-21 02:26:47', '2024-12-21 02:26:47'),
(3, 'New York, USA', 'The bustling city that never sleeps, home to countless iconic attractions.', 'https://res.cloudinary.com/df3yjnxi2/image/upload/v1734722842/destination_uploads/voknsg6a1vkvyxrclmfn.jpg', 40.71280000, -74.00600000, '2024-12-21 02:27:20', '2024-12-21 02:27:20'),
(4, 'Sydney, Australia', 'A stunning coastal city known for its iconic Opera House and beautiful harbors.', 'https://res.cloudinary.com/df3yjnxi2/image/upload/v1734722876/destination_uploads/twtf7py0tjwndrqcikxj.jpg', -33.86880000, 151.20930000, '2024-12-21 02:27:54', '2024-12-21 02:27:54');

-- Quản lý khuyến mãi
CREATE TABLE promotions (
    promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    destination VARCHAR(255) DEFAULT NULL,
    price DECIMAL(10, 2) DEFAULT NULL,
    valid_period VARCHAR(255) DEFAULT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO offers (promotion_id, title, description, start_date, end_date, discount_percentage, created_at, image_url, campaign_name, original_price, validity_period)
VALUES 
(1, 'Student Travel Pass', 'Special discounts for students exploring the world!', '2024-12-20', '2024-12-22', 35.00, '2024-12-20 03:33:24', 'https://res.cloudinary.com/df3yjnxi2/image/upload/v1734643332/offer_uploads/xzys1upcpg38iitceoxw.jpg', 'Global Campus Tour', 199.00, 'Summer Semester'),
(2, 'Asia Flight Mega Deal', 'Explore the Land of the Rising Sun with an incredible travel opportunity!', '2024-12-20', '2024-12-22', 30.00, '2024-12-20 03:42:51', 'https://res.cloudinary.com/df3yjnxi2/image/upload/v1734640972/offer_uploads/ryshnr3cwfjv3jmlypft.jpg', 'Japan Expedition', 290.00, 'Jan 15-30, 2025'),
(3, 'Weekend Flash Sale', 'Grab our special short-haul weekend flight promotions now!', '2024-12-20', '2024-12-22', 40.00, '2024-12-20 03:46:14', 'https://res.cloudinary.com/df3yjnxi2/image/upload/v1734641174/offer_uploads/ry7fcvua7nyillbcbs4z.jpg', 'Coastal Getaway', 129.00, 'Fri-Sun Weekly'),
(4, 'Midnight Flight Special', 'Exclusive late-night flight deals with unbeatable prices!', '2024-12-20', '2024-12-22', 25.00, '2024-12-20 03:48:34', 'https://res.cloudinary.com/df3yjnxi2/image/upload/v1734641315/offer_uploads/hqq5ly1yi6ykdxapk8vi.jpg', 'City Night Routes', 89.00, '22:00 - 04:00 Daily'),
(5, 'Business Class Upgrade', 'Luxury travel experience at an unbelievable price point!', '2024-12-20', '2024-12-22', 50.00, '2024-12-20 03:51:41', 'https://res.cloudinary.com/df3yjnxi2/image/upload/v1734641501/offer_uploads/ubcvfi5kh3xiogoyeljg.jpg', 'International Routes', 499.00, 'Feb 1-28, 2025'),
(6, 'Family Vacation Package', 'Complete family vacation package with multiple stops!', '2024-12-20', '2024-12-22', 45.00, '2024-12-20 03:53:28', 'https://res.cloudinary.com/df3yjnxi2/image/upload/v1734641608/offer_uploads/dv9ayq3besd1iryqirun.jpg', 'Multi-Destination Tour', 799.00, 'Mar 10-25, 2025');

-- Quản lý thông báo
CREATE TABLE announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sender_id INT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE user_announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    announcement_id INT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE, -- Trạng thái thông báo: false = chưa đọc, true = đã đọc
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (announcement_id) REFERENCES announcements(announcement_id) ON DELETE CASCADE
);
