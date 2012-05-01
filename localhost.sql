-- phpMyAdmin SQL Dump
-- version 4.0.0-dev
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 02, 2012 at 05:39 PM
-- Server version: 5.5.9
-- PHP Version: 5.2.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `family_tree`
--
CREATE DATABASE `family_tree` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `family_tree`;

-- --------------------------------------------------------

--
-- Table structure for table `profile_data`
--

CREATE TABLE `profile_data` (
  `id` int(7) NOT NULL AUTO_INCREMENT,
  `user_id` int(5) NOT NULL,
  `f_id` int(7) DEFAULT NULL,
  `m_id` int(7) DEFAULT NULL,
  `ch_ids` varchar(255) DEFAULT NULL,
  `spouse_id` int(7) DEFAULT NULL,
  `f_name` varchar(255) NOT NULL DEFAULT 'f_name',
  `l_name` varchar(255) NOT NULL DEFAULT 'l_name',
  `b_date` varchar(10) DEFAULT NULL,
  `d_date` varchar(10) DEFAULT NULL,
  `sex` varchar(1) NOT NULL DEFAULT 'm',
  `photo_url` varchar(255) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=128 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `prof_id` int(7) NOT NULL COMMENT 'link to user_data',
  `email` varchar(32) NOT NULL,
  `pass` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `prof_id` (`prof_id`,`email`),
  KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=28 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
