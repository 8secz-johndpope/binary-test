/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `usercredentials`;
CREATE TABLE `usercredentials` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userId` bigint(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=966 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `advert`;
CREATE TABLE `advert` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `mediaType` tinytext NOT NULL,
  `mediaLink` varchar(255) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `realm` varchar(255) DEFAULT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `verificationToken` varchar(255) DEFAULT NULL,
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

INSERT INTO `usercredentials` (`id`, `userId`, `password`) VALUES
(965, 1, '$2a$10$WDTEFfI8WHOdVjLMXEh7le.i9u1CwhxRkW5KPz5kaOGVtQRyvS9b.');


INSERT INTO `advert` (`id`, `title`, `description`, `mediaType`, `mediaLink`) VALUES
(1, 'Advert Video', 'Video for Car Cabs', 'video', '/uploads/video.mp4');
INSERT INTO `advert` (`id`, `title`, `description`, `mediaType`, `mediaLink`) VALUES
(2, 'Video', 'Video for cab drivers', 'video', '/uploads/video.mpo3');
INSERT INTO `advert` (`id`, `title`, `description`, `mediaType`, `mediaLink`) VALUES
(3, 'Video', 'Video for cab drivers', 'video', '/uploads/video.mpo3');
INSERT INTO `advert` (`id`, `title`, `description`, `mediaType`, `mediaLink`) VALUES
(4, 'Screenshot', 'for the cab drivers', 'image', '/file/'),
(5, 'Screenshot', 'for the cab drivers', 'image', '/file/'),
(6, 'Screenshot', 'for the cab drivers', 'image', '/file/screencapture-posinv-herokuapp-purchases-create-2020-09-20-00_55_01.png'),
(7, 'Screenshot', 'for the cab drivers', 'image', '/file/MixDrop - Watch KhudaHaafiz2020Hindi720pWEBDLx264AAC2.mp4'),
(8, 'Screenshot', 'for the cab drivers', 'image', '/file/MixDrop - Watch KhudaHaafiz2020Hindi720pWEBDLx264AAC2.mp4'),
(9, '12', '12121', 'image', '/file/How To Prove The Quran Has Been Preserved Accurately.mp4'),
(10, '12', '12121', 'video', '/file/How To Prove The Quran Has Been Preserved Accurately.mp4'),
(11, '2121', '1212', 'image', '/file/screencapture-posinv-herokuapp-purchases-create-2020-09-20-00_55_01.png');

INSERT INTO `user` (`id`, `username`, `email`, `realm`, `emailVerified`, `verificationToken`) VALUES
(1, 'shujahm', 'shujahm@gmail.com', NULL, NULL, NULL);



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;