-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2026 at 04:56 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `document_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `bantex`
--

CREATE TABLE `bantex` (
  `id` int(11) NOT NULL,
  `nama_bantex` varchar(255) DEFAULT NULL,
  `department_id` int(11) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `document_date` date NOT NULL,
  `kode_bantex` varchar(100) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bantex`
--

INSERT INTO `bantex` (`id`, `nama_bantex`, `department_id`, `company_name`, `document_date`, `kode_bantex`, `created_by`, `created_at`) VALUES
(7, 'Surat Jalan', 2, 'Sakura', '2026-03-11', '8-90', 2, '2026-03-11 13:53:08'),
(8, 'Surattt', 1, NULL, '2026-03-14', '8-99', 2, '2026-03-14 06:53:07'),
(9, 'trial ', 3, NULL, '2026-03-14', '8-93', 2, '2026-03-14 07:24:16');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_active` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `is_active`) VALUES
(1, 'IT', 1),
(2, 'HR/GA', 1),
(3, 'QC', 1),
(4, 'PPIC', 1),
(5, 'Finance', 1);

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `bantex_id` int(11) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` text DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `bantex_id`, `file_name`, `file_path`, `uploaded_at`) VALUES
(1, 7, 'projekSakura.drawio.png', 'uploads\\projekSakura.drawio.png', '2026-03-11 13:53:08'),
(2, 7, 'ChatGPT_Image_Feb_15__2026__02_59_40_PM-removebg-preview.png', 'uploads\\ChatGPT_Image_Feb_15__2026__02_59_40_PM-removebg-preview.png', '2026-03-11 13:53:08'),
(3, 8, 'dashboard_siswa.png', 'uploads\\dashboard_siswa.png', '2026-03-14 06:53:07'),
(4, 9, 'matlan.png', 'uploads\\matlan.png', '2026-03-14 07:24:16');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff') DEFAULT 'staff',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Admin', 'admin@company.com', 'admin123', 'admin', '2026-02-18 14:26:19'),
(2, 'Farid', 'farid@sakura.com', '123456', 'staff', '2026-02-25 07:28:45'),
(3, 'nama', 'namasakura@gmail.com', '123456', 'staff', '2026-02-25 07:30:09'),
(6, 'example', 'example@company.com', '123456', 'staff', '2026-03-04 01:05:57'),
(7, 'Indri', 'Indri@company.com', '123456', 'staff', '2026-03-04 04:19:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bantex`
--
ALTER TABLE `bantex`
  ADD PRIMARY KEY (`id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bantex_id` (`bantex_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bantex`
--
ALTER TABLE `bantex`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bantex`
--
ALTER TABLE `bantex`
  ADD CONSTRAINT `bantex_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bantex_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`bantex_id`) REFERENCES `bantex` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
