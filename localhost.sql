-- phpMyAdmin SQL Dump
-- version 3.3.9.2
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Фев 23 2012 г., 00:13
-- Версия сервера: 5.5.9
-- Версия PHP: 5.2.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `family_tree`
--
CREATE DATABASE `family_tree` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=88 ;

--
-- Дамп данных таблицы `profile_data`
--

INSERT INTO `profile_data` VALUES(63, 13, 4, 3, '[]', 19, 'name2', 'name1', 1989, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(64, 13, 4, 3, '[]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(65, 13, 8, 7, '[]', 0, 'fname2', 'name2', 1990, 0, 'f', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(66, 13, 10, 9, '["1","2","22","23","24","25"]', 0, 'fname2', 'PAPA', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(67, 13, 8, 7, '["1","2","22","23","24","25"]', 0, 'fname3', 'MAMA', 1990, 0, 'f', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(68, 13, 10, 9, '[]', 0, 'fname2', 'UNCLE', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(69, 13, 12, 11, '["3","5"]', 0, 'fname2', 'name2', 1990, 0, 'f', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(70, 13, 14, 13, '["3","5"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(71, 13, 0, 0, '["7"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(72, 13, 16, 15, '["6","4"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(73, 13, 18, 17, '["6","4"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(74, 13, 0, 0, '["7"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(75, 13, 0, 0, '["8"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(76, 13, 0, 0, '["8"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(77, 13, 0, 0, '["9"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(78, 13, 0, 0, '["9"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(79, 13, 0, 0, '["10"]', 0, 'fname2', 'name2', 1990, 0, 'm', '', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(80, 13, 0, 0, '["10"]', 0, 'fname2', 'name2', 1990, 0, 'm', '', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(81, 13, 0, 0, '["19"]', 0, 'fname2', 'name2', 1990, 0, 'm', '', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(82, 13, 4, 3, '["19"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(83, 13, 4, 3, '["19"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(84, 13, 20, 21, '[]', 0, 'fname2', 'name2', 1990, 0, 'm', '', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(85, 13, 4, 3, '["19"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(86, 13, 0, 0, '["19"]', 0, 'fname2', 'name2', 1990, 0, 'm', '', '<p><strong>Im comment</strong></p>');
INSERT INTO `profile_data` VALUES(87, 13, 4, 3, '["19"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=14 ;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` VALUES(1, 1, 'email', '35f504164d5a963d6a820e71614a4009');
INSERT INTO `users` VALUES(2, 0, 'email22', '77e319cf25636cf4f46ba9d797846048');
INSERT INTO `users` VALUES(11, 0, 'true', '1f32aa4c9a1d2ea010adcf2348166a04');
INSERT INTO `users` VALUES(12, 0, 'mail@sss.com', '1f32aa4c9a1d2ea010adcf2348166a04');
INSERT INTO `users` VALUES(13, 0, 'email@com.com', '35f504164d5a963d6a820e71614a4009');
