-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Фев 25 2012 г., 09:06
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=42 ;

--
-- Дамп данных таблицы `profile_data`
--

INSERT INTO `profile_data` (`id`, `user_id`, `f_id`, `m_id`, `ch_ids`, `spouse_id`, `f_name`, `l_name`, `b_date`, `d_date`, `sex`, `photo_url`, `comment`) VALUES
(1, 13, 4, 3, '["26","27","40"]', 19, 'name2', '1', 1989, 0, 'm', '1.jpg', '<p><strong>Im comment</strong></p>'),
(2, 13, 4, 3, 'null', 0, 'fname2', '2', 1990, 0, 'm', '2.jpg', '<p><strong>Im comment</strong></p>'),
(3, 13, 8, 7, '["1","2","22","23","24","25"]', 0, 'fname3', '3', 1990, 0, 'f', '3.jpg', '<p><strong>Im comment</strong></p>'),
(4, 13, 10, 9, '["1","2","22","23","24","25"]', 0, 'fname2', '4', 1990, 0, 'm', '4.jpg', '<p><strong>Im comment</strong></p>'),
(5, 13, 8, 7, 'null', 0, 'fname2', '5', 1990, 0, 'f', '5.jpg', '<p><strong>Im comment</strong></p>'),
(6, 13, 10, 9, 'null', 0, 'fname2', '6', 1990, 0, 'm', '6.jpg', '<p><strong>Im comment</strong></p>'),
(7, 13, 12, 11, '["3","5"]', 0, 'fname2', '7', 1990, 0, 'f', '7.jpg', '<p><strong>Im comment</strong></p>'),
(8, 13, 14, 13, '["3","5"]', 0, 'fname2', '8', 1990, 0, 'm', '8.jpg', '<p><strong>Im comment</strong></p>'),
(9, 13, 16, 15, '["6","4"]', 0, 'fname2', '9', 1990, 0, 'm', '9.jpg', '<p><strong>Im comment</strong></p>'),
(10, 13, 18, 17, '["6","4"]', 0, 'fname2', '10', 1990, 0, 'm', '10.jpg', '<p><strong>Im comment</strong></p>'),
(11, 13, 0, 0, '["7"]', 0, 'fname2', '11', 1990, 0, 'm', '11.jpg', '<p><strong>Im comment</strong></p>'),
(12, 13, 0, 0, '["7"]', 0, 'fname2', '12', 1990, 0, 'm', '12.jpg', '<p><strong>Im comment</strong></p>'),
(13, 13, 0, 0, '["8"]', 0, 'fname2', '13', 1990, 0, 'm', '13.jpg', '<p><strong>Im comment</strong></p>'),
(14, 13, 0, 0, '["8"]', 0, 'fname2', '14', 1990, 0, 'm', '14.jpg', '<p><strong>Im comment</strong></p>'),
(15, 13, 0, 0, '["9"]', 0, 'fname2', '15', 1990, 0, 'm', '15.jpg', '<p><strong>Im comment</strong></p>'),
(16, 13, 0, 0, '["9"]', 0, 'fname2', '16', 1990, 0, 'm', '16.jpg', '<p><strong>Im comment</strong></p>'),
(17, 13, 0, 0, '["10"]', 0, 'fname2', '17', 1990, 0, 'm', '17.', '<p><strong>Im comment</strong></p>'),
(18, 13, 0, 0, '["10"]', 0, 'fname2', '18', 1990, 0, 'm', '18.jpg', '<p><strong>Im comment</strong></p>'),
(19, 13, 20, 21, '["26","27","40"]', 0, 'fname2', '19', 1990, 0, 'm', '19.', '<p><strong>Im comment</strong></p>'),
(20, 13, 0, 0, '["19"]', 0, 'fname2', '20', 1990, 0, 'm', '20.', '<p><strong>Im comment</strong></p>'),
(21, 13, 0, 0, '["19"]', 0, 'fname2', '21', 1990, 0, 'm', '21.', '<p><strong>Im comment</strong></p>'),
(22, 13, 4, 3, 'null', 0, 'fname2', '22', 1990, 0, 'm', '22.jpg', '<p><strong>Im comment</strong></p>'),
(23, 13, 4, 3, 'null', 0, 'fname2', '23', 1990, 0, 'm', '23.jpg', '<p><strong>Im comment</strong></p>'),
(24, 13, 4, 3, 'null', 0, 'fname2', '24', 1990, 0, 'm', '24.jpg', '<p><strong>Im comment</strong></p>'),
(25, 13, 4, 3, 'null', 0, 'fname2', '25', 1990, 0, 'm', '25.jpg', '<p><strong>Im comment</strong></p>'),
(26, 13, 1, 19, '["30","37"]', 28, '', '26', 1990, 0, 'f', '26.jpg', '<p><strong>Im comment</strong></p>'),
(27, 13, 1, 19, '["33"]', 29, '', '27', 1990, 0, 'm', '27.jpg', '<p><strong>Im comment</strong></p>'),
(28, 13, 0, 0, '["30","37"]', 26, '', '28', 1990, 0, 'm', '28.jpg', '<p><strong>Im comment</strong></p>'),
(29, 13, 0, 0, '["33"]', 27, '', '29', 1990, 0, 'f', '29.jpg', '<p><strong>Im comment</strong></p>'),
(30, 13, 28, 26, '["34","35"]', 31, '', '30', 1990, 0, 'm', '30.jpg', '<p><strong>Im comment</strong></p>'),
(31, 13, 0, 0, '["34","35"]', 30, '', '31', 1990, 0, 'f', '31.jpg', '<p><strong>Im comment</strong></p>'),
(32, 13, 0, 0, '["36","38","39"]', 33, '', '32', 1990, 0, 'm', '32.jpg', '<p><strong>Im comment</strong></p>'),
(33, 13, 27, 29, '["36","38","39"]', 32, '', '33', 1990, 0, 'f', '33.jpg', '<p><strong>Im comment</strong></p>'),
(34, 13, 30, 31, 'null', 0, 'fname2', '34', 1990, 0, 'm', '34.jpg', '<p><strong>Im comment</strong></p>'),
(35, 13, 30, 31, 'null', 0, 'fname2', '35', 1990, 0, 'm', '35.jpg', '<p><strong>Im comment</strong></p>'),
(36, 13, 32, 33, 'null', 0, 'fname2', '36', 1990, 0, 'm', '36.jpg', '<p><strong>Im comment</strong></p>'),
(37, 13, 28, 26, 'null', 0, 'fname2', '37', 1990, 0, 'm', '37.jpg', '<p><strong>Im comment</strong></p>'),
(38, 13, 32, 33, 'null', 0, 'fname2', '38', 1990, 0, 'm', '38.jpg', '<p><strong>Im comment</strong></p>'),
(39, 13, 32, 33, 'null', 0, 'fname2', '39', 1990, 0, 'm', '39.jpg', '<p><strong>Im comment</strong></p>'),
(40, 13, 1, 19, 'null', 0, 'fname2', '40', 1990, 0, 'm', '40.jpg', '<p><strong>Im comment</strong></p>'),
(41, 13, 0, 0, 'null', 35, 'name2', '41', 1989, 0, 'm', '41.jpg', '<p><strong>Im comment</strong></p>');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
