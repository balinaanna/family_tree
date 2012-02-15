-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Фев 15 2012 г., 14:52
-- Версия сервера: 5.5.9
-- Версия PHP: 5.2.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `family_tree`
--
CREATE DATABASE `family_tree` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `family_tree`;

-- --------------------------------------------------------

--
-- Структура таблицы `profile_data`
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
  `b_date` int(12) DEFAULT NULL,
  `d_date` int(12) DEFAULT NULL,
  `sex` varchar(1) NOT NULL DEFAULT 'm',
  `photo_url` varchar(255) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `profile_data`
--

INSERT INTO `profile_data` (`id`, `user_id`, `f_id`, `m_id`, `ch_ids`, `spouse_id`, `f_name`, `l_name`, `b_date`, `d_date`, `sex`, `photo_url`, `comment`) VALUES
(1, 1, 0, 0, '', NULL, '', '', 1989, 0, '', NULL, 'comment'),
(2, 1, 1, 0, '', NULL, '', '', 1990, 0, '', NULL, 'comment');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `prof_id` int(7) NOT NULL COMMENT 'link to user_data',
  `email` varchar(32) NOT NULL,
  `pass` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `prof_id` (`prof_id`,`email`),
  KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `prof_id`, `email`, `pass`) VALUES
(1, 1, 'email', '35f504164d5a963d6a820e71614a4009'),
(2, 0, 'email22', '77e319cf25636cf4f46ba9d797846048');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
