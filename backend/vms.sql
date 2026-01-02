-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 02, 2026 at 05:56 PM
-- Server version: 5.7.24
-- PHP Version: 8.3.1
CREATE DATABASE vms;
USE VMS;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fekra_volunteers`
--

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `roleId` int(11) NOT NULL,
  `roleTitle` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` int(11) NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`roleId`, `roleTitle`, `description`, `createdAt`, `userId`, `updatedAt`, `updatedBy`, `deleted_at`) VALUES
(1002, 'Supervisor', 'Supervisor', '2025-09-10 15:22:33', 1001, '2026-01-02 17:25:40', NULL, NULL),
(1005, 'Standard', 'This is standared volunteering role!', '2025-09-12 00:44:42', 1001, '2025-09-11 21:44:42', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `taskId` int(11) NOT NULL,
  `taskTitle` varchar(50) NOT NULL,
  `taskDescription` text NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `volunteeringHours` decimal(10,2) NOT NULL,
  `teamVolunteerId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `completed` bit(1) NOT NULL DEFAULT b'0',
  `completionDate` date DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`taskId`, `taskTitle`, `taskDescription`, `startDate`, `endDate`, `volunteeringHours`, `teamVolunteerId`, `userId`, `createdAt`, `updatedAt`, `updatedBy`, `completed`, `completionDate`, `deleted_at`) VALUES
(1006, 'a test', 'testing the tasks', '2025-09-11', '2025-09-26', '4.00', 1002, 1001, '2025-09-11 23:34:50', '2025-09-11 20:34:50', 1001, b'1', '2025-10-14', NULL),
(1008, 'dd', 'dd', '2025-09-26', '2025-09-25', '4.00', 1003, 1001, '2025-09-26 02:20:50', '2025-09-25 23:20:50', 1001, b'1', '2025-10-21', NULL),
(1010, 'dfgdf', 'ghg', '2025-09-26', '2025-09-27', '4.00', 1003, 1001, '2025-09-26 02:22:20', '2025-09-25 23:22:20', 1001, b'1', '2025-10-21', NULL),
(1011, 'dfgdf', 'ghg', '2025-09-26', '2025-09-27', '4.00', 1003, 1001, '2025-09-26 02:22:54', '2025-09-25 23:22:54', 1001, b'1', '2025-10-21', NULL),
(1012, 'cnbcd', 'fhdfh', '2025-09-18', '2025-09-20', '22.00', 1002, 1001, '2025-09-26 02:26:33', '2025-09-25 23:26:33', 1001, b'1', '2025-10-14', NULL),
(1013, 'fdfhgdf', 'dfhdfhdf', '2025-09-20', '2025-09-19', '46.00', 1006, 1001, '2025-09-26 11:47:03', '2025-09-26 08:47:03', 1001, b'1', '2025-10-04', NULL),
(1014, 'rgdf', 'gfdgdf', '2025-09-18', '2025-09-27', '7.00', 1003, 1001, '2025-09-26 11:48:10', '2025-09-26 08:48:10', 1001, b'1', '2025-10-21', NULL),
(1015, 'dfgdf', 'dfgdfg', '2025-09-18', '2025-09-25', '8.00', 1006, 1001, '2025-09-26 11:48:43', '2025-09-26 08:48:43', 1001, b'1', '2025-10-04', NULL),
(1016, 'dfgdf', 'dfgdfg', '2025-09-26', '2025-10-03', '45.00', 1003, 1001, '2025-09-26 11:50:43', '2025-09-26 08:50:43', 1001, b'1', '2025-10-03', NULL),
(1017, 'ghgf', 'ghghg', '2025-09-26', '2025-10-04', '45.00', 1004, 1001, '2025-09-26 11:55:32', '2025-09-26 08:55:32', 1001, b'1', '2025-10-31', NULL),
(1018, 'dsfsd', 'sdsfd', '2025-09-26', '2025-09-27', '5.00', 1003, 1001, '2025-09-26 11:56:08', '2025-09-26 08:56:08', 1001, b'1', '2025-10-21', NULL),
(1019, 'gfhgh', 'gfhfgh', '2025-09-19', '2025-09-26', '6.00', 1004, 1001, '2025-09-26 11:57:00', '2025-09-26 08:57:00', 1001, b'1', '2025-10-04', NULL),
(1020, 'jhkjh', 'gkjhg', '2025-09-19', '2025-09-26', '7.00', 1002, 1001, '2025-09-26 13:00:17', '2025-09-26 10:00:17', 1001, b'1', '2025-10-14', NULL),
(1021, 'cxzcxssssss', 'zxczxczxs', '2025-09-18', '2025-09-26', '4.00', 1002, 1001, '2025-09-26 23:58:35', '2025-09-26 20:58:35', 1001, b'1', '2026-01-01', NULL),
(1022, 'fhgfhf', 'bfgng', '2025-09-25', '2025-09-26', '3.00', 1010, 1001, '2025-09-27 00:00:23', '2025-09-26 21:00:23', 1001, b'1', '2025-12-06', NULL),
(1023, 'sdfsdf', 'sdsdfs', '2025-10-01', '2025-10-29', '55.00', 1010, 1001, '2025-09-27 00:02:20', '2025-09-26 21:02:20', 1001, b'1', '2025-10-03', NULL),
(1024, 'xcvxcv', 'xvxc', '2025-09-26', '2025-09-04', '5.00', 1002, 1001, '2025-09-27 00:03:53', '2025-09-26 21:03:53', 1001, b'1', '2025-09-30', NULL),
(1025, 'xvcxcv', 'xcxcv', '2025-09-20', '2025-09-26', '6.00', 1002, 1001, '2025-09-27 00:14:15', '2025-09-26 21:14:15', 1001, b'1', '2025-10-14', NULL),
(1026, 'dfgdfg', 'dfgdfg', '2025-09-29', '2025-09-30', '5.00', 1003, 1001, '2025-09-29 20:15:52', '2025-09-29 17:15:52', 1001, b'1', '2026-01-01', NULL),
(1027, 'What', 'sdfsdfs', '2025-10-03', '2025-10-03', '5.00', 1017, 1001, '2025-10-03 21:19:33', '2025-10-03 18:19:33', 1001, b'1', '2025-10-03', NULL),
(1028, 'Haa?', 'sfsdfsd', '2025-10-02', '2025-10-04', '5.00', 1017, 1001, '2025-10-03 21:29:41', '2025-10-03 18:29:41', 1001, b'1', '2026-01-01', NULL),
(1029, 'lksdjfklsd', 'sdfsdfsd', '2025-10-09', '2025-10-16', '5.00', 1017, 1001, '2025-10-03 21:55:11', '2025-10-03 18:55:11', 1001, b'1', '2025-10-21', NULL),
(1030, 'etertret', 'dsfsdf', '2025-10-03', '2025-10-03', '5.00', 1017, 1001, '2025-10-03 21:57:21', '2025-10-03 18:57:21', 1001, b'1', '2025-10-03', NULL),
(1031, 'dfsfd', 'sdfdsfsdfdsds', '2025-10-03', '2025-10-10', '5.00', 1017, 1001, '2025-10-03 22:12:50', '2025-10-03 19:12:50', NULL, b'1', '2025-10-10', NULL),
(1032, 'dfsfd', 'sdfdsfsdfdsds', '2025-10-03', '2025-10-24', '5.00', 1017, 1001, '2025-10-03 22:13:28', '2025-10-03 19:13:28', 1001, b'1', '2025-10-21', NULL),
(1033, 'dfsfd', 'sdfdsfsdfdsds', '2025-10-03', '2025-10-24', '5.00', 1017, 1001, '2025-10-03 22:14:28', '2025-10-03 19:14:28', 1001, b'1', '2025-10-07', NULL),
(1034, 'dfsdfsd', 'fsdfsdf', '2025-09-25', '2025-10-10', '5.00', 1017, 1001, '2025-10-03 22:51:35', '2025-10-03 19:51:35', NULL, b'1', '2025-10-31', NULL),
(1035, 'dfdsfsd', 'sdfsdf', '2025-10-09', '2025-10-08', '1.00', 1003, 1001, '2025-10-06 00:06:27', '2025-10-05 21:06:27', 1001, b'1', '2025-10-21', NULL),
(1036, 'fsdfs', 'sdfsdfs', '2025-10-06', '2025-10-23', '4.00', 1019, 1001, '2025-10-06 22:45:39', '2025-10-06 19:45:39', 1001, b'1', '2025-10-21', NULL),
(1037, 'sfdsd', 'sdfsd', '2025-10-15', '2025-10-01', '1.00', 1019, 1001, '2025-10-06 22:55:44', '2025-10-06 19:55:44', NULL, b'1', '2025-10-28', NULL),
(1038, 'what', 'sfssghsdahgdfhdfhdfh', '2025-10-06', '2025-10-11', '5.00', 1011, 1001, '2025-10-07 22:12:37', '2025-10-07 19:12:37', 1001, b'1', '2025-10-08', NULL),
(1039, 'tdfhtfgh', 'fghfghfgh', '2025-10-06', '2025-10-09', '1.00', 1002, 1001, '2025-10-07 22:15:49', '2025-10-07 19:15:49', 1001, b'1', '2025-10-14', NULL),
(1040, 'Ha?', 'Whatt', '2025-10-07', '2025-10-14', '2.00', 1020, 1001, '2025-10-07 23:50:19', '2025-10-07 20:50:19', 1001, b'1', '2025-10-17', NULL),
(1041, 'sdfsdfsdf', 'dsfdsf', '2025-10-08', '2025-10-30', '5.00', 1017, 1001, '2025-10-17 23:03:36', '2025-10-17 20:03:36', 1001, b'1', '2025-10-17', NULL),
(1042, 'dsgfdgdfgdf', 'sfsdfsdgsdgs', '2025-10-10', '2025-10-18', '2.00', 1019, 1001, '2025-10-17 23:16:14', '2025-10-17 20:16:14', 1001, b'1', '2025-10-21', NULL),
(1043, 'sdfsdf', 'sdgsdgsd', '2025-10-09', '2025-11-01', '1.00', 1017, 1001, '2025-10-17 23:57:45', '2025-10-17 20:57:45', 1001, b'1', '2025-10-21', NULL),
(1044, 'fgfdgd', 'fdgdfg', '2025-10-17', '2025-10-25', '1.00', 1017, 1001, '2025-10-17 23:57:59', '2025-10-17 20:57:59', 1001, b'1', '2025-10-21', NULL),
(1045, 'This is a test Task Title', 'dfhgldfkjhg;ljkdfh;gdf', '2025-10-21', '2025-10-22', '1.00', 1002, 1001, '2025-10-21 18:08:39', '2025-10-21 15:08:39', 1001, b'1', '2025-10-21', NULL),
(1046, 'fdgdfgdfgfd', 'dfgdfgfdgfdfddfg', '2025-10-20', '2025-10-19', '1.00', 1017, 1001, '2025-10-21 19:30:40', '2025-10-21 16:30:40', 1001, b'1', '2025-10-21', NULL),
(1047, 'gdghfdg', 'fdgdfgdfg', '2025-10-20', '2025-10-24', '3.00', 1017, 1001, '2025-10-21 19:32:56', '2025-10-21 16:32:56', 1001, b'1', '2025-10-21', NULL),
(1048, 'What is this about!', 'it is about a task that will never finish!', '2025-10-16', '2025-10-22', '1.00', 1008, 1001, '2025-10-21 22:32:49', '2025-10-21 19:32:49', 1001, b'1', '2025-10-21', NULL),
(1049, 'sdfsdfsdf', 'sdfsdfsdfsdfsdfsdfsdf', '2025-10-15', '2025-10-29', '5.00', 1004, 1001, '2025-10-21 23:30:53', '2025-10-21 20:30:53', 1001, b'1', '2025-10-21', NULL),
(1050, 'dfgdfgdfgdf', 'fgdfgfdgfdgfdgfdgfd', '2025-10-08', '2025-10-28', '1.00', 1020, 1001, '2025-10-22 00:05:00', '2025-10-21 21:05:00', 1001, b'1', '2025-10-23', NULL),
(1051, 'vxcvfbfdb', 'cvbcvbcvbbdffd', '2025-10-07', '2025-10-29', '15.00', 1020, 1001, '2025-10-22 00:07:30', '2025-10-21 21:07:30', 1001, b'1', '2025-10-24', NULL),
(1052, 'sdfsdfs', 'sdfsdfsd', '2025-10-10', '2025-10-30', '5.00', 1020, 1001, '2025-10-22 00:08:44', '2025-10-21 21:08:44', 1001, b'1', '2025-10-30', NULL),
(1053, 'sdfsdfsf', 'sdfsdfsdf', '2025-10-02', '2025-10-29', '1.00', 1020, 1001, '2025-10-22 00:10:15', '2025-10-21 21:10:15', 1001, b'1', '2025-10-23', NULL),
(1054, 'sdfsdf', 'sdfsdcxdxfsdfbhdf', '2025-10-16', '2025-10-29', '3.00', 1020, 1001, '2025-10-22 00:11:14', '2025-10-21 21:11:14', 1001, b'1', '2025-10-21', NULL),
(1055, 'dffbdf', 'dfbdfb', '2025-10-21', '2025-10-15', '1.00', 1020, 1001, '2025-10-22 00:11:27', '2025-10-21 21:11:27', 1001, b'1', '2025-10-21', NULL),
(1056, 'ls;fjdslkjf', 'sdlkgjusd;lghj;lskdgj', '2025-10-22', '2025-10-27', '1.50', 1010, 1001, '2025-10-24 12:17:35', '2025-10-24 09:17:35', 1001, b'1', '2025-10-24', NULL),
(1057, 'gbdfhdf', 'fhfdhfdh', '2025-10-23', '2025-10-29', '3.50', 1004, 1001, '2025-10-24 12:34:27', '2025-10-24 09:34:27', 1001, b'1', '2025-10-28', NULL),
(1058, 'sdfsdfs', 'sdfsdfsdfsd', '2025-10-16', '2025-10-24', '1.00', 1004, 1001, '2025-10-24 12:35:04', '2025-10-24 09:35:04', 1001, b'1', '2025-10-24', NULL),
(1059, 'sfdsfsd', 'sdsdfsdfsd', '2025-10-10', '2025-10-31', '3.50', 1004, 1001, '2025-10-24 12:36:17', '2025-10-24 09:36:17', 1001, b'1', '2025-10-24', NULL),
(1060, 'sdfds', 'sdfdsf', '2025-10-14', '2025-10-16', '4.00', 1004, 1001, '2025-10-24 12:47:36', '2025-10-24 09:47:36', 1001, b'1', '2025-10-30', NULL),
(1061, 'responsresponsrespons', 'responsresponsresponsresponsresponsrespons', '2025-10-30', '2025-10-23', '1.00', 1014, 1001, '2025-10-31 19:34:05', '2025-10-31 17:34:05', 1001, b'1', '2025-11-07', NULL),
(1062, 'sdkfjsdsdkfjsdsdkfjsdsdkfjsd', 'sdkfjsdsdkfjsdsdkfjsdsdkfjsdsdkfjsdsdkfjsdsdkfjsd', '2025-10-15', '2025-11-06', '1.00', 1014, 1001, '2025-10-31 19:35:05', '2025-10-31 17:35:05', 1001, b'1', '2025-11-07', NULL),
(1063, 'sfsfsdsdf', 'sdfsdfsdfdsfds', '2025-10-30', '2025-11-07', '1.00', 1014, 1001, '2025-10-31 19:38:37', '2025-10-31 17:38:37', 1001, b'1', '2025-11-07', NULL),
(1064, 'ddddddddddddd', 'whatt?whatt?whatt?whatt?', '2025-10-16', '2025-11-07', '1.00', 1021, 1001, '2025-10-31 19:52:02', '2025-10-31 17:52:02', 1001, b'1', '2025-11-07', NULL),
(1065, 'updatedAtupdatedAtupdatedAt', 'updatedAtupdatedAtupdatedAtupdatedAtupdatedAtupdatedAt', '2025-10-08', '2025-11-07', '1.00', 1005, 1001, '2025-10-31 20:13:47', '2025-10-31 18:13:47', 1001, b'1', '2025-11-07', NULL),
(1066, 'This is a test for node.js', 'This is a test for node.jsThis is a test for node.jsThis is a test for node.js', '2025-12-30', '2026-01-06', '12.00', 1005, 1001, '2025-12-30 14:41:16', '2025-12-30 12:41:16', 1001, b'1', '2026-01-01', NULL),
(1067, 'This is a test for node.js', 'This is a test for node.jsThis is a test for node.jsThis is a test for node.js', '2025-12-30', '2026-01-06', '12.00', 1005, 1001, '2025-12-30 14:42:00', '2025-12-30 12:42:00', 1001, b'1', '2026-01-02', NULL),
(1068, 'this is another test for js node and express', 'This is a test for node.jsThis is a test for node.jsThis is a test for node.js', '2025-12-30', '2026-01-06', '12.00', 1005, 1001, '2025-12-30 14:43:01', '2025-12-30 12:43:01', 1001, b'1', '2025-12-30', NULL),
(1069, 'sdfdsfdsfsd', 'dsfsdgsdgds', '2025-12-29', '2026-01-08', '33.00', 1002, 1001, '2026-01-01 19:39:52', '2026-01-01 17:39:52', NULL, b'0', NULL, NULL),
(1070, 'sfdssfd', 'dfsfsdf', '2025-12-31', '2026-02-06', '34.00', 1002, 1001, '2026-01-01 19:40:22', '2026-01-01 17:40:22', NULL, b'0', NULL, NULL),
(1071, 'sdfdsfdsfsd', 'sfsdfsd', '2026-01-07', '2026-01-29', '33.00', 1002, 1001, '2026-01-01 19:42:30', '2026-01-01 17:42:30', 1001, b'1', '2026-01-09', NULL),
(1072, 'This is a new task', 'sdfsdf', '2026-01-01', '2026-01-08', '23.00', 1002, 1001, '2026-01-01 19:42:55', '2026-01-01 17:42:55', 1003, b'1', '2026-01-02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `teamId` int(11) NOT NULL,
  `teamName` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` int(11) NOT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`teamId`, `teamName`, `description`, `createdAt`, `userId`, `updatedBy`, `updatedAt`, `deleted_at`) VALUES
(1001, 'Database', 'some description', '2025-09-10 14:18:37', 1001, 1001, '2026-01-01 15:00:04', NULL),
(1003, 'Human Resources (HR)', 'This is the HR team!', '2025-09-10 14:35:51', 1001, 1001, '2026-01-01 17:22:16', NULL),
(1004, 'Managements', 'This is the Management Team.', '2025-09-10 16:01:05', 1001, 1001, '2026-01-02 14:36:21', NULL),
(1005, 'Logistics', 'This team is for logistics, helping the operation of events, and sending certificates to students upon their completion of a sessoin.', '2025-09-22 16:24:08', 1001, 1001, '2025-10-06 18:10:24', NULL),
(1006, 'www', 'wsgsdfghdfhgdwsgsdfgd hdfhgdwsgs dfghdfhgdwsgsdfghdfhgdwsgsdfghdfhgd', '2025-09-30 22:56:54', 1001, 1001, '2025-10-07 20:35:26', NULL),
(1007, 'fdfg', 'What is this about? this is for trjjrjrhe sone of biscuit!', '2025-10-06 23:30:28', 1001, 1001, '2025-10-07 20:50:34', NULL),
(1008, 'sdfsdf', 'This team is for something that I dont know, in fact, I dont care!', '2025-10-06 23:33:20', 1001, NULL, '2025-10-06 20:33:20', NULL),
(1009, 'sdfsdffdf', 'sj;glkj fslkdjf ;s dsf;hsdl ksd;lfkhsd ;sd;lkfjsd ;sd;lkf j', '2025-10-07 23:39:42', 1001, NULL, '2025-10-07 20:39:42', NULL),
(1010, 'Team Name', 'sfsdfsdgsdgsdgssssssssdgsdsdgsdgsdgd', '2025-12-10 17:07:39', 1001, 1001, '2025-12-10 15:13:08', NULL),
(1011, 'This is a new team test', 'what a fullkjkldsj', '2026-01-01 20:11:50', 1001, NULL, '2026-01-01 18:11:50', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `teamvolunteer`
--

CREATE TABLE `teamvolunteer` (
  `teamVolunteerId` int(11) NOT NULL,
  `volunteerId` int(11) NOT NULL,
  `teamId` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `roleId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `description` text NOT NULL,
  `volunteerTitle` varchar(50) NOT NULL,
  `active` bit(1) NOT NULL DEFAULT b'1',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `teamvolunteer`
--

INSERT INTO `teamvolunteer` (`teamVolunteerId`, `volunteerId`, `teamId`, `startDate`, `endDate`, `roleId`, `userId`, `updatedBy`, `createdAt`, `updatedAt`, `description`, `volunteerTitle`, `active`, `deleted_at`) VALUES
(1002, 1001, 1004, '2024-12-27', '2029-02-03', 1005, 1001, 1001, '2025-09-10 16:58:46', '2026-01-01 16:12:45', 'What is this?', 'The COOss', b'1', NULL),
(1003, 1019, 1004, '2025-09-25', '2025-10-01', 1005, 1001, 1001, '2025-09-25 16:42:33', '2025-10-21 17:15:22', 'sdgsdgsdgsdgssdgdsgsdsdgsdfsdfsds', 'sss', b'1', NULL),
(1004, 1016, 1004, '2025-09-17', '2025-09-24', 1005, 1001, 1001, '2025-09-25 16:43:51', '2025-12-30 10:39:40', 'HElloooHEllooo HEllooo HEllooo HEllooo HEllooo HEllooo  ', 'joejoemojo', b'0', NULL),
(1005, 1016, 1004, '2025-09-17', NULL, 1005, 1001, 1001, '2025-09-25 16:44:01', '2026-01-01 17:33:48', 'sgsdg', 'sdfsdfsddfd', b'1', NULL),
(1006, 1016, 1004, '2025-09-17', NULL, 1005, 1001, NULL, '2025-09-25 16:44:33', '2025-09-25 13:44:33', 'sgsdg', 'sdfsdfsd', b'1', NULL),
(1007, 1016, 1004, '2025-09-17', NULL, 1005, 1001, NULL, '2025-09-25 16:45:46', '2025-09-25 13:45:46', 'sgsdg', 'sdfsdfsd', b'1', NULL),
(1008, 1015, 1004, '2025-09-18', NULL, 1005, 1001, NULL, '2025-09-25 16:53:56', '2025-09-25 13:53:56', 'sgsdg', 'sssdgsdg', b'1', NULL),
(1009, 1019, 1004, '2025-09-18', NULL, 1005, 1001, NULL, '2025-09-25 22:04:42', '2025-09-25 19:04:42', 'dfdfhddf', 'hgdfhdf', b'1', NULL),
(1010, 1001, 1004, '2025-09-17', NULL, 1005, 1001, NULL, '2025-09-25 22:12:19', '2025-09-25 19:12:19', 'sfdsdfsd', 'What is this?', b'1', NULL),
(1011, 1001, 1001, '2025-10-01', NULL, 1005, 1001, NULL, '2025-09-25 22:13:21', '2025-09-25 19:13:21', 'sdgsdgsdsgd', 'skhsdlgkjsd', b'1', NULL),
(1012, 1001, 1004, '2025-09-18', NULL, 1005, 1001, NULL, '2025-09-25 22:14:37', '2025-09-25 19:14:37', 'dfhdfhdffhdhdfdfh', 'dfgdfhddfh', b'1', NULL),
(1013, 1001, 1003, '2025-09-18', NULL, 1005, 1001, NULL, '2025-09-25 22:28:44', '2025-09-25 19:28:44', 'ghfhgf', 'gfhgfhf', b'1', NULL),
(1014, 1018, 1004, '2025-09-19', NULL, 1005, 1001, NULL, '2025-09-26 11:56:44', '2025-09-26 08:56:44', 'fdgdg', 'fddfg', b'1', NULL),
(1015, 1001, 1004, '2025-09-19', NULL, 1005, 1001, NULL, '2025-09-26 12:05:03', '2025-09-26 09:05:03', 'sfsdds', 'sfdsd', b'1', NULL),
(1016, 1018, 1004, '2025-09-25', NULL, 1005, 1001, NULL, '2025-09-26 12:05:41', '2025-09-26 09:05:41', 'sdfsd', 'sdfsf', b'1', NULL),
(1017, 1020, 1006, '2025-10-03', '2025-10-12', 1005, 1001, 1001, '2025-10-03 21:19:13', '2025-10-18 22:06:31', '  useEffect(() =&amp;gt; {\n    goToTables();\n  }, [activeTab]);', 'What', b'0', NULL),
(1018, 1020, 1004, '2025-10-09', NULL, 1002, 1001, NULL, '2025-10-04 02:32:27', '2025-10-03 23:32:27', 'dsfsdf', 'dsfsdf', b'1', NULL),
(1019, 1020, 1005, '2025-10-25', NULL, 1005, 1001, 1001, '2025-10-04 02:34:46', '2025-10-17 20:19:35', 'xvcxvcxsdffffffujfjghfhkkjhgfkjhfkjhgb', 'Whatt?', b'1', NULL),
(1020, 1020, 1007, '2025-10-06', NULL, 1005, 1001, NULL, '2025-10-07 22:18:24', '2025-10-07 19:18:24', 'dfgdgdfgdgdg', 'dfgdfg', b'1', NULL),
(1021, 1021, 1009, '2025-10-22', NULL, 1005, 1001, NULL, '2025-10-31 19:47:48', '2025-10-31 17:47:48', 'volunteerIdvolunteerIdvolunteerId', 'volunteerIdvolunteerIdvolunteerId', b'1', NULL),
(1022, 1021, 1009, '2025-10-22', NULL, 1005, 1001, NULL, '2025-10-31 19:48:03', '2025-10-31 17:48:03', 'volunteerIdvolunteerIdvolunteerId', 'volunteerIdvolunteerIdvolunteerId', b'1', NULL),
(1023, 1021, 1009, '2025-10-22', NULL, 1005, 1001, NULL, '2025-10-31 19:48:16', '2025-10-31 17:48:16', 'volunteerIdvolunteerIdvolunteerId', 'volunteerIdvolunteerIdvolunteerId', b'1', NULL),
(1024, 1020, 1009, '2025-10-23', NULL, 1002, 1001, NULL, '2025-10-31 19:50:44', '2025-10-31 17:50:44', 'fsdfsdfsdfssdfsdfsdfsfsdsfddddddddddddsdf', 'vdsvsdsgsdgsdsdg', b'1', NULL),
(1025, 1019, 1009, '2025-10-15', NULL, 1005, 1001, NULL, '2025-10-31 19:51:03', '2025-10-31 17:51:03', 'ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 'sdddddddd', b'1', NULL),
(1026, 1003, 1001, '2026-01-01', NULL, 1005, 1001, NULL, '2026-01-01 20:58:33', '2026-01-01 18:58:33', 'sdfdsfd', 'sssssssssssss', b'1', NULL),
(1027, 1003, 1001, '2026-01-01', NULL, 1005, 1001, NULL, '2026-01-01 20:59:36', '2026-01-01 18:59:36', 'sdfsdfsdsfd', 'The COOss', b'1', NULL),
(1028, 1001, 1001, '2026-01-05', NULL, 1005, 1001, NULL, '2026-01-01 21:08:44', '2026-01-01 19:08:44', 'sdfsdfssdfsdf', 'What is this???', b'1', NULL),
(1029, 1003, 1005, '2026-01-08', NULL, 1005, 1001, NULL, '2026-01-02 11:14:54', '2026-01-02 09:14:54', 'sfdsfsdfdsfsdfsdfssdf', 'ssdfsf', b'1', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `passwordHash` varchar(2000) NOT NULL,
  `status` bit(1) NOT NULL DEFAULT b'1',
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userEmail` varchar(100) NOT NULL,
  `role` enum('Admin','CEO/COO','HR','Supervisor','Normal Volunteer') NOT NULL DEFAULT 'Normal Volunteer',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `userName`, `passwordHash`, `status`, `firstName`, `lastName`, `createdAt`, `updatedAt`, `userEmail`, `role`, `deleted_at`) VALUES
(1001, 'joe_1', '$2y$10$aAEPcC0Yy.KDBX6Sb6DGUOBsk.0EYM.qS8qSEA7GKyqeY9XagR8IC', b'0', 'Youssef', 'Shawwaa', '2025-09-10 14:11:17', '2026-01-02 10:05:07', 'test@gmail.com', 'Normal Volunteer', NULL),
(1002, 'lalaa', 'dsjhglkjsdhglksdjlsjk vl;kjwd;oiiet;woen;gjklds', b'1', 'soso', 'bobo', '2025-10-24 10:33:00', '2025-10-24 07:33:00', 'lala@gmail.com', 'Normal Volunteer', NULL),
(1003, 'joe_77', '$2b$10$wDoFXv5XA8Lq5f/eOcAnDeYU6.7j9su/q1ujLPDjT3FyvxrVu/tjC', b'1', 'Joe', '', '2025-11-10 20:17:56', '2026-01-02 16:57:30', 'youssefshawwa1@gmail.com', 'Admin', NULL),
(1004, 'yarabakr', '$2y$10$bIuzrnaIHMs6UWpQKpJSSeTLcOc1eQLRrcQK4MP.GFaY51sJXvegG', b'1', 'Yara', 'Bakr', '2025-11-11 19:42:16', '2025-11-11 17:42:16', 'bakryara1@gmail.com', 'Normal Volunteer', NULL),
(1005, 'loveYara', '$2y$10$XuGMXZT77JNMsRqD/VDIx.CA73oMYOvcMvUK8qgSpIuaw6MnyZ3tS', b'1', 'Yara', 'Love', '2025-11-11 19:43:22', '2025-11-11 20:27:46', 'yaralove@gmail.com', 'Normal Volunteer', NULL),
(1006, 'test1', '$2y$10$6Pht9/YBZ/62Q5yuMhwT1OoqfgsAhoFfU2B2yNlOeQqxUEUTns.QG', b'1', 'test1', 'test1LastName', '2025-11-12 00:25:08', '2025-11-11 22:25:08', 'youssefshawwa1@gmail.com', 'Normal Volunteer', NULL),
(1007, 'test2_2', '$2y$10$7jHxpsonZB8kQ9veuY0ySeGRXohQt/FZ5YZsUfb0smrtRbRWUNwn.', b'1', 'test2', 'test2Lst', '2025-11-12 00:30:44', '2025-11-11 22:30:44', 'youssefshawwa1@gmail.com', 'Normal Volunteer', NULL),
(1008, 'test3', '$2y$10$K9mOuUrEj2AhA5lWkyHcY.oP/UBEXmUEVc3D5FZB/ehCwrtOX.hT2', b'1', 'test3', 'last', '2025-11-12 00:37:54', '2025-11-11 22:47:32', 'youssefhsawwa1@gmail.com', 'Normal Volunteer', NULL),
(1009, 'test4', '$2y$10$4gmO07b24owcj62e3YGl3OQaon2GWont2jc/0NOsAEu.qNzfoKU/.', b'0', 'test4', 'test4Last', '2025-11-12 01:03:38', '2025-11-11 23:05:39', 'youssefshawwa1@gmail.com', 'Normal Volunteer', NULL),
(1010, 'lala', '$2b$10$2GeF5wn3KPP5ywQY8UARx.kiNq.hdYUt2dEJsOvWZnd1zzzLti2ba', b'1', 'lala', 'lala', '2025-12-06 14:39:01', '2025-12-06 12:39:01', 'lala@gmail.com', 'Normal Volunteer', NULL),
(1011, 'ssss', '$2b$10$S1q940JJiPYlgM5NBXPTIeAf19WIsD5Xp83MIPJV7OoWNUtiabkpa', b'1', 'lala', 'lala', '2025-12-06 14:39:53', '2025-12-06 12:39:53', 'lala@gmail.com', 'Normal Volunteer', NULL),
(1012, 'ss', '$2b$10$uqYNI4pADBeINi2RGWzJnuRj0JXiMDVGX9fDls6KnJPHdLc2dXUR.', b'1', 'lala', 'lala', '2025-12-06 14:48:55', '2025-12-06 12:48:55', 'lala@gmail.com', 'Normal Volunteer', NULL),
(1013, 'jojo', '$2b$10$1/.hMQlApHxU1RuUgbrIRuQsjd6io17MUepLknTk6CNFV5y4L2o2e', b'1', 'lala', 'lala', '2025-12-06 14:49:07', '2025-12-06 12:49:07', 'lala@gmail.com', 'Normal Volunteer', NULL),
(1014, 'joe', '$2b$10$2lstvZEvqn6/2E8BblID6.wIfYnDXaiDdx.27ZxeaB5dQYs0XJFM6', b'1', 'joe', 'joe', '2025-12-10 11:55:04', '2025-12-10 09:55:04', 'jo2@gmail.com', 'Normal Volunteer', NULL),
(1015, 'joes', '$2b$10$ywGEBSm8Egh6D21zDm.IC.Vkkr3P6WFCGMsgvDgwtYTfkK0i/RXiG', b'1', 'joe', 'joe', '2025-12-10 11:59:03', '2025-12-10 09:59:03', 'jo2@gmail.com', 'Normal Volunteer', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `verification_codes`
--

CREATE TABLE `verification_codes` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `code` varchar(6) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `isUsed` tinyint(1) DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `verification_codes`
--

INSERT INTO `verification_codes` (`id`, `userId`, `code`, `expiresAt`, `isUsed`, `createdAt`) VALUES
(80, 1006, '700592', '2025-11-11 22:31:59', 1, '2025-11-11 22:26:59'),
(81, 1006, '250214', '2025-11-11 22:32:15', 1, '2025-11-11 22:27:15'),
(87, 1009, '595605', '2025-11-11 23:08:51', 1, '2025-11-11 23:03:51');

-- --------------------------------------------------------

--
-- Table structure for table `volunteer`
--

CREATE TABLE `volunteer` (
  `volunteerId` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `birthDate` date NOT NULL,
  `insertionDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `major` varchar(50) NOT NULL,
  `university` varchar(50) NOT NULL,
  `userId` int(11) NOT NULL,
  `phone` int(50) NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `email` varchar(100) NOT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `gender` enum('Male','Female','','') NOT NULL,
  `nationality` varchar(100) NOT NULL,
  `residentCountry` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `volunteer`
--

INSERT INTO `volunteer` (`volunteerId`, `firstName`, `lastName`, `birthDate`, `insertionDate`, `major`, `university`, `userId`, `phone`, `updatedAt`, `email`, `updatedBy`, `gender`, `nationality`, `residentCountry`) VALUES
(1001, 'Yousseff', 'Shawwa', '2001-02-15', '2025-09-10 15:55:26', 'Computer Scince', 'LIU', 1001, 81879225, '2026-01-01 16:47:07', 'youssefshawwa1@gmail.com', 1001, 'Male', 'Syria', 'United Arab Emirates'),
(1002, 'Amena', 'Khatibb', '2005-01-15', '2025-09-11 23:36:58', 'Computer Scince', 'LIU', 1001, 81879225, '2026-01-01 22:54:21', 'amena@gmail.com', 1001, 'Female', 'Syrian', 'Syria'),
(1003, 'Name', 'Next', '2005-02-05', '2025-09-17 18:52:43', 'Computer Science', 'Lebanese  University', 1001, 81879225, '2025-09-17 15:52:43', 'example@example.com', NULL, 'Male', 'sy', 'lb'),
(1004, 'Test', 'last', '2001-05-12', '2025-09-17 19:09:34', 'Education', 'Lebanese University', 1001, 81879225, '2025-09-17 16:09:34', 'example@example.com', NULL, 'Male', 'sy', 'lb'),
(1005, 'Test', 'last', '2001-05-12', '2025-09-17 19:11:25', 'Education', 'Lebanese University', 1001, 81879225, '2025-09-17 16:11:25', 'example@example.com', NULL, 'Male', 'sy', 'lb'),
(1006, 'Youssef', 'Shawwa', '2025-09-11', '2025-09-17 19:33:54', 'Education', 'Lebanese  University', 1001, 81879225, '2025-09-17 16:33:54', 'youssefshawwa@gmail.com', NULL, 'Female', 'ps', 'other'),
(1007, 'Youssef', 'Shawwa', '2025-09-11', '2025-09-17 19:34:19', 'Education', 'Lebanese  University', 1001, 81879225, '2025-09-17 16:34:19', 'youssefshawwa@gmail.com', NULL, 'Female', 'ps', 'other'),
(1008, 'Youssef', 'Shawwa', '2025-09-11', '2025-09-17 19:34:35', 'Education', 'Lebanese  University', 1001, 81879225, '2025-09-17 16:34:35', 'youssefshawwa@gmail.com', NULL, 'Female', 'ps', 'other'),
(1009, 'Youssef', 'Shawwa', '2025-09-08', '2025-09-17 19:35:12', 'csc', 'Lebanese University', 1001, 81879225, '2025-09-17 16:35:12', 'youssefshawwa@gmail.com', NULL, 'Female', 'ps', 'ps'),
(1010, 'Youssef', 'Shawwa', '2025-09-03', '2025-09-17 19:36:10', 'sdfsdf', 'sfsd', 1001, 81879225, '2025-09-17 16:36:10', 'youssefshawwa@gmail.com', NULL, 'Male', 'sy', 'lb'),
(1011, 'Youssef', 'Shawwa', '2025-09-03', '2025-09-17 19:36:32', 'sdfsdf', 'sfsd', 1001, 81879225, '2025-09-17 16:36:32', 'youssefshawwa@gmail.com', NULL, 'Male', 'sy', 'lb'),
(1012, 'Youssef', 'Shawwa', '2025-09-03', '2025-09-17 19:36:39', 'sdfsdf', 'sfsd', 1001, 81879225, '2025-09-17 16:36:39', 'youssefshawwa@gmail.com', NULL, 'Male', 'sy', 'lb'),
(1013, 'Youssef', 'Shawwa', '2025-09-03', '2025-09-17 19:37:17', 'sdfsdf', 'sfsd', 1001, 81879225, '2025-09-17 16:37:17', 'youssefshawwa@gmail.com', NULL, 'Male', 'sy', 'lb'),
(1014, 'joe', 'sha', '2025-09-10', '2025-09-21 23:06:32', 'CS', 'LIU', 1001, 81879225, '2025-09-21 20:06:32', 'youssefshawwa1@gmail.com', NULL, 'Male', 'sy', 'lb'),
(1015, 'joe', 'sha', '2025-09-10', '2025-09-21 23:07:23', 'CS', 'LIU', 1001, 81879225, '2025-09-21 20:07:23', 'youssefshawwa1@gmail.com', NULL, 'Male', 'sy', 'lb'),
(1016, 'joe', 'sha', '2025-09-10', '2025-09-21 23:08:13', 'CS', 'LIU', 1001, 81879225, '2025-09-21 20:08:13', 'youssefshawwa1@gmail.com', NULL, 'Male', 'sy', 'lb'),
(1017, 'joe', 'sha', '2025-09-10', '2025-09-21 23:11:47', 'CS', 'LIU', 1001, 81879225, '2025-09-21 20:11:47', 'youssefshawwa1@gmail.com', NULL, 'Male', 'sy', 'lb'),
(1018, 'Youssef', 'Shawwa', '2025-09-04', '2025-09-22 14:04:57', 'sdfsdfsd', 'fsdf', 1001, 81879225, '2025-09-22 11:04:57', 'youssefshawwa@gmail.com', NULL, 'Male', 'sy', 'lb'),
(1019, 'Youssef', 'Shawwa', '2025-09-04', '2025-09-22 14:05:28', 'sdfsdfsd', 'fsdf', 1001, 81879225, '2025-09-22 11:05:28', 'youssefshawwa@gmail.com', NULL, 'Male', 'sy', 'lb'),
(1020, 'Youssefsdfsdfsf', 'Shawwa', '2025-09-03', '2025-09-25 16:57:07', 'sdsdf', 'sdfsd', 1001, 81879225, '2025-10-04 00:13:15', 'youssefshawwa@gmail.com', 1001, 'Female', 'ps', 'lb'),
(1021, 'sdafsf', 'sdfsdf', '2025-09-23', '2025-09-30 22:43:23', 'dfgdfgd', 'dfg', 1001, 81879222, '2025-10-31 18:52:33', 'gfhfgh@gmail.com', 1001, 'Female', 'sy', 'other'),
(1022, 'Joe', 'Joe', '2025-12-10', '2025-12-10 14:02:16', 'CS', 'LIU', 1001, 81879225, '2025-12-10 12:02:16', 'Joe@gmail.com', NULL, 'Male', 'lb', 'sy'),
(1023, 'soOO', 'Joeseph', '2025-12-10', '2025-12-10 14:02:25', 'CS', 'LIU', 1001, 81879225, '2025-12-10 12:53:26', 'Joe@gmail.com', 1001, 'Male', 'lb', 'sy'),
(1024, 'Youssef', 'Shawwa', '2025-12-31', '2026-01-01 15:43:14', 'CS', 'LIU', 1001, 81879225, '2026-01-01 13:43:14', 'youssefshawwa1@gmail.com', NULL, 'Female', 'sdfsdfsd', 'Lebanon'),
(1025, 'Youssef', 'Shawwa', '2026-01-01', '2026-01-01 15:45:45', 'CS', 'LIU', 1001, 81879225, '2026-01-01 13:45:45', 'youssefshawwa1@gmail.com', NULL, 'Male', 'sdfsdfsd', 'Syria');

-- --------------------------------------------------------

--
-- Table structure for table `volunteeringcertificate`
--

CREATE TABLE `volunteeringcertificate` (
  `certificateId` int(11) NOT NULL,
  `certificateNumber` varchar(255) NOT NULL,
  `volunteerId` int(11) NOT NULL,
  `certificateTitle` varchar(255) DEFAULT NULL,
  `certificateDescription` text,
  `issueDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `volunteeringHours` decimal(10,2) DEFAULT NULL,
  `totalHoursAtIssue` decimal(10,2) DEFAULT NULL,
  `issuedBy` int(11) NOT NULL,
  `updatedAt` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `customMessage` text,
  `certificateType` enum('appreciation','achievement','recognition') DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `certificateKind` enum('withHours','withoutHours') NOT NULL DEFAULT 'withoutHours',
  `emailSendCount` int(11) DEFAULT '0',
  `lastEmailSentAt` datetime DEFAULT NULL,
  `firstEmailSentAt` datetime DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `volunteeringcertificate`
--

INSERT INTO `volunteeringcertificate` (`certificateId`, `certificateNumber`, `volunteerId`, `certificateTitle`, `certificateDescription`, `issueDate`, `volunteeringHours`, `totalHoursAtIssue`, `issuedBy`, `updatedAt`, `customMessage`, `certificateType`, `updatedBy`, `certificateKind`, `emailSendCount`, `lastEmailSentAt`, `firstEmailSentAt`, `deleted_at`) VALUES
(11, 'FEKRA-acedfe11', 1001, '1001sssss', '1001sssssss', '2025-10-24 10:40:04', '4.00', '0.00', 1001, '2026-01-02 01:29:41', '1001dfs', 'appreciation', 1001, 'withHours', 0, NULL, NULL, NULL),
(12, 'FEKRA-c71caa75', 1001, 'c title', 'c description', '2025-10-24 11:38:30', '4.00', '73.00', 1001, '2025-10-24 12:07:35', 'this what apperas on the certificaate.', 'appreciation', NULL, 'withHours', 0, NULL, NULL, NULL),
(13, 'FEKRA-fca71ba8', 1001, 'c title', 'c descriptionc descriptionc descriptionc description', '2025-10-24 11:58:52', '15.00', '36.50', 1001, '2025-10-24 22:36:14', 'this what apperas on the certificaate.', 'appreciation', 1001, 'withHours', 0, NULL, NULL, NULL),
(14, 'FEKRA-475ea5fa', 1001, 'c title', 'c description', '2025-10-24 11:59:13', '5.00', '0.00', 1001, '2025-10-24 12:12:20', 'this what apperas on the certificaate.', 'appreciation', NULL, 'withHours', 0, NULL, NULL, NULL),
(15, 'FEKRA-b4815a19', 1001, 'c title', 'c description', '2025-10-24 12:00:46', '5.00', '43.00', 1001, NULL, 'this what apperas on the certificaate.', 'appreciation', NULL, 'withHours', 0, NULL, NULL, NULL),
(16, 'FEKRA-dc6ac8ae', 1001, 'c title', 'c descriptionc descriptionc descriptionc description', '2025-10-24 12:07:42', '5.00', '26.50', 1001, '2025-10-25 00:27:09', 'this what apperas on the certificaate.', 'appreciation', 1001, 'withHours', 0, NULL, NULL, NULL),
(17, 'FEKRA-de04a6cd', 1001, 'c title', 'c description', '2025-10-24 12:11:46', NULL, NULL, 1001, NULL, 'this what apperas on the certificaate.', 'appreciation', NULL, 'withoutHours', 0, NULL, NULL, NULL),
(18, 'FEKRA-a3fe3037', 1001, 'c title', 'c description', '2025-10-24 12:13:16', '5.00', '85.00', 1001, NULL, 'this what apperas on the certificaate.', 'appreciation', NULL, 'withHours', 0, NULL, NULL, NULL),
(19, 'FEKRA-a33b1b1c', 1001, 'c title', 'c description', '2025-10-24 12:13:35', '10.00', '80.00', 1001, NULL, 'this what apperas on the certificaate.', 'appreciation', NULL, 'withHours', 0, NULL, NULL, NULL),
(20, 'FEKRA-9461c00b', 1001, 'c title', 'c description', '2025-10-24 15:28:51', '40.00', '71.50', 1001, '2025-11-07 21:25:05', 'this what apperas on the certificaate.', 'appreciation', 1001, 'withHours', 11, '2025-11-07 21:25:05', '2025-11-07 20:11:51', NULL),
(21, 'FEKRA-14d33072', 1020, 'fglkjdhflkgjhdflkgjh', 'dfgfdgdf l;hgdfgfdgdf l;hgdfgfdgdf l;hgdfgfdgdf l;hg', '2025-10-03 16:08:52', '66.00', '66.00', 1001, '2026-01-02 00:39:19', 'dfgfdgdf l;hgdfgfdgdf l;hgdfgfdgdf l;hgdfgfdgdf l;hgdfgfdgdf l;hg', 'appreciation', NULL, 'withHours', 1, '2026-01-02 00:39:19', '2026-01-02 00:39:19', NULL),
(22, 'FEKRA-356c4ef2', 1021, 'This is to Cerrtify that this person was with us', 'This is to Cerrtify that this person was with usThis is to Cerrtify that this person was with us', '2025-10-24 16:46:19', NULL, NULL, 1001, NULL, 'This is to Cerrtify that this person was with usThis is to Cerrtify that this person was with us', 'appreciation', NULL, 'withoutHours', 0, NULL, NULL, NULL),
(23, 'FEKRA-c03eee3f', 1021, 'This is to Cerrtify that this person was with ', 'This is to Cerrtify that this person was with usThis is to Cerrtify that this person was with ', '2025-10-24 16:47:19', NULL, NULL, 1001, '2025-10-25 23:35:19', 'This is to Cerrtify that this person was with usThis is to Cerrtify that this person was with ', 'appreciation', 1001, 'withoutHours', 0, NULL, NULL, NULL),
(24, 'FEKRA-V-b01dfbbf', 1020, 'AA TEST', 'sfsdfsd sfsdfsd sfsdfsd sfsdfsd sfsdfsd sfsdfsd sfsdfsd sfsdfsd', '2025-10-31 19:03:13', NULL, NULL, 1001, NULL, 'This what will appear This what will appearThis what will appearThis what will appear', 'appreciation', NULL, 'withoutHours', 0, NULL, NULL, NULL),
(25, 'FEKRA-V-1854cb2b', 1021, 'whattt', 'some descriptoinsome descriptoinsome descriptoinsome descriptoin', '2025-10-31 19:07:44', NULL, NULL, 1001, NULL, 'some descriptoinsome descriptoinsome descriptoinsome descriptoinsome descriptoinsome descriptoin', 'appreciation', NULL, 'withoutHours', 0, NULL, NULL, NULL),
(26, 'FEKRA-V-45a90954', 1021, 'TESTTESTTESTTEST', 'TESTTESTTESTTESTTESTTESTTESTTEST', '2025-10-31 19:11:33', NULL, NULL, 1001, NULL, 'TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST', 'appreciation', NULL, 'withoutHours', 0, NULL, NULL, NULL),
(27, 'FEKRA-V-ca81d5b7', 1021, 'dfdfdf', 'fdddresetFormresetFormresetFormresetForm', '2025-10-31 19:15:06', NULL, NULL, 1001, NULL, 'resetFormresetFormresetFormresetFormresetFormresetForm', 'achievement', NULL, 'withoutHours', 0, NULL, NULL, NULL),
(28, 'FEKRA-V-7e60ff67', 1021, 'sdfsdfsdfsdf', 'sdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf', '2025-11-13 20:54:38', NULL, NULL, 1003, NULL, 'sdfsdfsdfsdfsdfsdfsdfsdfsdfsdf', 'appreciation', NULL, 'withoutHours', 0, NULL, NULL, NULL),
(29, 'FEKRA-V-5297c3e3', 1023, 'this is a test what the hell!', 'this is a test what the hell!this is a test what the hell!this is a test what the hell!this is a test what the hell!this is a test what the hell!this is a test what the hell!', '2025-12-30 17:47:22', NULL, NULL, 1001, NULL, 'this is a test what the hell!this is a test what the hell!this is a test what the hell!this is a test what the hell!this is a test what the hell!this is a test what the hell!', 'achievement', NULL, 'withoutHours', 0, NULL, NULL, NULL),
(30, 'FEKRA-V-a3d7e169', 1019, 'WHAT THE HELL', 'this is the perfection of aren\'t the go\'l \'\'\' \'\'\" \"\" this is the perfection of aren\'t the go\'l \'\'\' \'\'\" \"\" this is the perfection of aren\'t the go\'l \'\'\' \'\'\" \"\" ', '2025-12-30 17:58:54', '55.00', '70.00', 1001, '2025-12-30 19:33:51', 'this is the perfection of aren\'t the go\'l \'\'\' \'\'\" \"\" this is the perfection of aren\'t the go\'l \'\'\' \'\'\" \"\" this is the perfection of aren\'t the go\'l \'\'\' \'\'\" \"\" ', 'appreciation', 1001, 'withHours', 0, NULL, NULL, NULL),
(31, 'FEKRA-V-3abbac2c', 1020, 'THIS IS A TEST', 'THIS IS A TESTTHIS IS A TESTTHIS IS A TESTTHIS IS A TEST', '2025-12-30 19:36:07', '5.00', '81.00', 1001, '2025-12-30 23:34:56', 'THIS IS A TESTTHIS IS A TESTTHIS IS A TESTTHIS IS A TEST', 'appreciation', 1001, 'withHours', 11, '2025-12-30 23:34:56', '2025-12-30 23:26:47', NULL),
(32, 'FEKRA-V-3b913585', 1001, 'sdfsf', 'sdfsdfsd', '2026-01-02 01:24:00', '34.00', '147.50', 1001, NULL, 'sdffsdsdf', 'recognition', NULL, 'withHours', 0, NULL, NULL, NULL),
(33, 'FEKRA-V-ae265d20', 1001, 'sdfsdf', 'sdfsdf', '2026-01-02 01:24:37', NULL, NULL, 1001, NULL, 'sdfsdfs', 'appreciation', NULL, 'withoutHours', 0, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`roleId`),
  ADD KEY `fk_role_users` (`userId`),
  ADD KEY `fk_role_users_updatedBy` (`updatedBy`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`taskId`),
  ADD KEY `fk_tasks_teamvolunteer` (`teamVolunteerId`),
  ADD KEY `fk_tasks_users` (`userId`),
  ADD KEY `fk_tasks_users_updatedBy` (`updatedBy`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`teamId`),
  ADD KEY `fk_team_users` (`userId`),
  ADD KEY `fk_team_users_updatedBy` (`updatedBy`);

--
-- Indexes for table `teamvolunteer`
--
ALTER TABLE `teamvolunteer`
  ADD PRIMARY KEY (`teamVolunteerId`),
  ADD KEY `fk_teamvolunteer_role` (`roleId`),
  ADD KEY `fk_teamvolunteer_team` (`teamId`),
  ADD KEY `fk_teamvolunteer_users` (`userId`),
  ADD KEY `fk_teamvolunteer_users_updatedBy` (`updatedBy`),
  ADD KEY `fk_teamvolunteer_volunteer` (`volunteerId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `verification_codes`
--
ALTER TABLE `verification_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `volunteer`
--
ALTER TABLE `volunteer`
  ADD PRIMARY KEY (`volunteerId`),
  ADD KEY `fk_volunteer_users` (`userId`),
  ADD KEY `fk_volunteer_users_updatedBy` (`updatedBy`);

--
-- Indexes for table `volunteeringcertificate`
--
ALTER TABLE `volunteeringcertificate`
  ADD PRIMARY KEY (`certificateId`),
  ADD UNIQUE KEY `certificateNumber` (`certificateNumber`),
  ADD KEY `fk_certificate_volunteer` (`volunteerId`),
  ADD KEY `fk_certificate_issuedBy` (`issuedBy`),
  ADD KEY `fk_certificate_updatedBy` (`updatedBy`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1006;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `taskId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1073;

--
-- AUTO_INCREMENT for table `team`
--
ALTER TABLE `team`
  MODIFY `teamId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1012;

--
-- AUTO_INCREMENT for table `teamvolunteer`
--
ALTER TABLE `teamvolunteer`
  MODIFY `teamVolunteerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1030;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1016;

--
-- AUTO_INCREMENT for table `verification_codes`
--
ALTER TABLE `verification_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;

--
-- AUTO_INCREMENT for table `volunteer`
--
ALTER TABLE `volunteer`
  MODIFY `volunteerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1026;

--
-- AUTO_INCREMENT for table `volunteeringcertificate`
--
ALTER TABLE `volunteeringcertificate`
  MODIFY `certificateId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `role`
--
ALTER TABLE `role`
  ADD CONSTRAINT `fk_role_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_role_users_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `fk_tasks_teamvolunteer` FOREIGN KEY (`teamVolunteerId`) REFERENCES `teamvolunteer` (`teamVolunteerId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tasks_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tasks_users_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `team`
--
ALTER TABLE `team`
  ADD CONSTRAINT `fk_team_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_team_users_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `teamvolunteer`
--
ALTER TABLE `teamvolunteer`
  ADD CONSTRAINT `fk_teamvolunteer_role` FOREIGN KEY (`roleId`) REFERENCES `role` (`roleId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_teamvolunteer_team` FOREIGN KEY (`teamId`) REFERENCES `team` (`teamId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_teamvolunteer_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_teamvolunteer_users_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`userId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_teamvolunteer_volunteer` FOREIGN KEY (`volunteerId`) REFERENCES `volunteer` (`volunteerId`) ON UPDATE CASCADE;

--
-- Constraints for table `verification_codes`
--
ALTER TABLE `verification_codes`
  ADD CONSTRAINT `verification_codes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE;

--
-- Constraints for table `volunteer`
--
ALTER TABLE `volunteer`
  ADD CONSTRAINT `fk_volunteer_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_volunteer_users_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `volunteeringcertificate`
--
ALTER TABLE `volunteeringcertificate`
  ADD CONSTRAINT `fk_certificate_issuedBy` FOREIGN KEY (`issuedBy`) REFERENCES `users` (`userId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_certificate_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`userId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_certificate_volunteer` FOREIGN KEY (`volunteerId`) REFERENCES `volunteer` (`volunteerId`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
