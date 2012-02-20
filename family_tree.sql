-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Фев 20 2012 г., 22:25
-- Версия сервера: 5.5.16
-- Версия PHP: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `family_tree`
--

-- --------------------------------------------------------

--
-- Структура таблицы `profile_data`
--

CREATE TABLE IF NOT EXISTS `profile_data` (
  `id_num` int(7) NOT NULL AUTO_INCREMENT,
  `user_id` int(5) NOT NULL,
  `id` int(11) NOT NULL,
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
  PRIMARY KEY (`id_num`),
  KEY `id` (`id_num`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=88 ;

--
-- Дамп данных таблицы `profile_data`
--

INSERT INTO `profile_data` (`id_num`, `user_id`, `id`, `f_id`, `m_id`, `ch_ids`, `spouse_id`, `f_name`, `l_name`, `b_date`, `d_date`, `sex`, `photo_url`, `comment`) VALUES
(63, 13, 1, 4, 3, '[]', 19, 'name2', 'name1', 1989, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(64, 13, 2, 4, 3, '[]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(65, 13, 5, 8, 7, '[]', 0, 'fname2', 'name2', 1990, 0, 'f', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(66, 13, 4, 10, 9, '["1","2","22","23","24","25"]', 0, 'fname2', 'PAPA', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(67, 13, 3, 8, 7, '["1","2","22","23","24","25"]', 0, 'fname3', 'MAMA', 1990, 0, 'f', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(68, 13, 6, 10, 9, '[]', 0, 'fname2', 'UNCLE', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(69, 13, 7, 12, 11, '["3","5"]', 0, 'fname2', 'name2', 1990, 0, 'f', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(70, 13, 8, 14, 13, '["3","5"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(71, 13, 11, 0, 0, '["7"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(72, 13, 9, 16, 15, '["6","4"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(73, 13, 10, 18, 17, '["6","4"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(74, 13, 12, 0, 0, '["7"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(75, 13, 13, 0, 0, '["8"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(76, 13, 14, 0, 0, '["8"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(77, 13, 15, 0, 0, '["9"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(78, 13, 16, 0, 0, '["9"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(79, 13, 17, 0, 0, '["10"]', 0, 'fname2', 'name2', 1990, 0, 'm', '', '<p><strong>Im comment</strong></p>'),
(80, 13, 18, 0, 0, '["10"]', 0, 'fname2', 'name2', 1990, 0, 'm', '', '<p><strong>Im comment</strong></p>'),
(81, 13, 20, 0, 0, '["19"]', 0, 'fname2', 'name2', 1990, 0, 'm', '', '<p><strong>Im comment</strong></p>'),
(82, 13, 22, 4, 3, '["19"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(83, 13, 23, 4, 3, '["19"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(84, 13, 19, 20, 21, '[]', 0, 'fname2', 'name2', 1990, 0, 'm', '', '<p><strong>Im comment</strong></p>'),
(85, 13, 24, 4, 3, '["19"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>'),
(86, 13, 21, 0, 0, '["19"]', 0, 'fname2', 'name2', 1990, 0, 'm', '', '<p><strong>Im comment</strong></p>'),
(87, 13, 25, 4, 3, '["19"]', 0, 'fname2', 'name2', 1990, 0, 'm', 'image.jpg', '<p><strong>Im comment</strong></p>');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
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

INSERT INTO `users` (`id`, `prof_id`, `email`, `pass`) VALUES
(1, 1, 'email', '35f504164d5a963d6a820e71614a4009'),
(2, 0, 'email22', '77e319cf25636cf4f46ba9d797846048'),
(11, 0, 'true', '1f32aa4c9a1d2ea010adcf2348166a04'),
(12, 0, 'mail@sss.com', '1f32aa4c9a1d2ea010adcf2348166a04'),
(13, 0, 'email@com.com', '35f504164d5a963d6a820e71614a4009');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
