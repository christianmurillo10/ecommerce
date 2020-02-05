/*
SQLyog Community v13.1.5  (64 bit)
MySQL - 10.4.6-MariaDB-log : Database - e_live
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`e_live` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `e_live`;

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` smallint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `roles` */

insert  into `roles`(`id`,`name`,`description`,`created_at`,`updated_at`,`is_deleted`) values 
(1,'Superadministrator','Superadministrator','2019-10-23 05:03:01','2019-10-22 21:03:01',0),
(2,'Administrator','Administrator','2019-10-25 20:08:25','2019-10-25 20:08:25',0);

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role_id` int(11) NOT NULL COMMENT 'refd to roles.id',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `permission_type` smallint(1) NOT NULL DEFAULT 1 COMMENT '1=Role Permissions 2=User Permissions',
  `is_logged` smallint(1) NOT NULL DEFAULT 0 COMMENT '0=No 1=Yes',
  `is_active` smallint(1) NOT NULL DEFAULT 1 COMMENT '0=No 1=Yes',
  `is_deleted` smallint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `users` */

insert  into `users`(`id`,`email`,`username`,`password`,`role_id`,`created_at`,`updated_at`,`permission_type`,`is_logged`,`is_active`,`is_deleted`) values 
(1,'user01@mail.com','user01','$2b$10$PjNaNAV3jschHk7dZurCPOr6hjY4WeJDuWR7g1bvqnAvdECIJ7C.K',1,'2019-10-23 05:03:06','2019-10-22 21:03:06',1,1,1,0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
