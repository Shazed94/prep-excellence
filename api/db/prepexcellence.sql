-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 15, 2023 at 09:50 AM
-- Server version: 10.3.37-MariaDB-0ubuntu0.20.04.1
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `prepexcellence`
--

-- --------------------------------------------------------

--
-- Table structure for table `applicants`
--

CREATE TABLE `applicants` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `job_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(191) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `referral` varchar(191) DEFAULT NULL,
  `school_college` varchar(191) DEFAULT NULL,
  `grade_year` varchar(191) DEFAULT NULL,
  `subjects` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `school_math_subject` varchar(191) DEFAULT NULL,
  `top_subjects` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `taught_class_before` tinyint(1) DEFAULT 0,
  `taught_details` text DEFAULT NULL,
  `tutored_before` tinyint(1) NOT NULL DEFAULT 0,
  `how_long` varchar(191) DEFAULT NULL,
  `tutored_subject` varchar(191) DEFAULT NULL,
  `sat_score_english` varchar(191) DEFAULT NULL,
  `sat_score_math` varchar(191) DEFAULT NULL,
  `sat_score_total` varchar(191) DEFAULT NULL,
  `p_sat_score` varchar(191) DEFAULT NULL,
  `act_english_score` varchar(191) DEFAULT NULL,
  `act_math_score` varchar(191) DEFAULT NULL,
  `act_science_score` varchar(191) DEFAULT NULL,
  `act_reading_score` varchar(191) DEFAULT NULL,
  `act_total_score` varchar(191) DEFAULT NULL,
  `ap_exam_scores` text DEFAULT NULL,
  `hsc_gpa` varchar(191) DEFAULT NULL,
  `college_gpa` varchar(191) DEFAULT NULL,
  `available` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `available_hour` varchar(191) DEFAULT NULL,
  `preference_schedule` text DEFAULT NULL,
  `hourly_rate` double DEFAULT NULL,
  `willing_create_lesson` tinyint(1) DEFAULT 0,
  `willing_topics` text DEFAULT NULL,
  `lesson_rate` text DEFAULT NULL,
  `artical_write` tinyint(1) DEFAULT 0,
  `artical_rate` double DEFAULT NULL,
  `short_description` longtext DEFAULT NULL,
  `is_agree` tinyint(1) DEFAULT 0,
  `cv_file` varchar(191) DEFAULT NULL,
  `publish_permission` tinyint(1) DEFAULT 0,
  `status` tinyint(4) DEFAULT 0,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_statuses`
--

CREATE TABLE `attendance_statuses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance_statuses`
--

INSERT INTO `attendance_statuses` (`id`, `name`, `is_active`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Absent', 1, NULL, NULL, NULL),
(2, 'Present', 1, NULL, NULL, NULL),
(3, 'Late', 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `attendance_students`
--

CREATE TABLE `attendance_students` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `course_id` bigint(20) UNSIGNED DEFAULT NULL,
  `attendance_status_id` bigint(20) UNSIGNED DEFAULT NULL,
  `course_schedule_id` bigint(20) UNSIGNED DEFAULT NULL,
  `date` date NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance_students`
--

INSERT INTO `attendance_students` (`id`, `student_id`, `employee_id`, `course_id`, `attendance_status_id`, `course_schedule_id`, `date`, `deleted_at`, `created_at`, `updated_at`) VALUES
(38, 65, 38, 26, 1, 778, '2023-02-07', NULL, '2023-02-05 00:47:24', '2023-02-05 00:47:24'),
(39, 66, 38, 26, 2, 778, '2023-02-07', NULL, '2023-02-05 00:47:24', '2023-02-05 00:47:24');

-- --------------------------------------------------------

--
-- Table structure for table `banks`
--

CREATE TABLE `banks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banks`
--

INSERT INTO `banks` (`id`, `name`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'MD Bank Ltd.', 1, 1, 1, '103.35.168.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', NULL, '2023-01-15 07:07:42', '2023-01-15 07:07:42'),
(2, 'ABC', 1, 1, 1, '103.117.195.130', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', NULL, '2023-01-17 00:12:38', '2023-01-17 00:12:38');

-- --------------------------------------------------------

--
-- Table structure for table `bank_accounts`
--

CREATE TABLE `bank_accounts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(191) NOT NULL,
  `bank_id` bigint(20) UNSIGNED DEFAULT NULL,
  `account_no` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bank_accounts`
--

INSERT INTO `bank_accounts` (`id`, `title`, `bank_id`, `account_no`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Meraz', 1, '1234567890', 1, 1, 1, '103.35.168.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', NULL, '2023-01-15 07:08:05', '2023-01-15 07:08:05');

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `type` tinyint(4) NOT NULL COMMENT '1=image, 2=video, 3=script',
  `image` varchar(100) DEFAULT NULL,
  `video` varchar(100) DEFAULT NULL,
  `embedded_code` text DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 1000,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `short_description`, `description`, `type`, `image`, `video`, `embedded_code`, `user_id`, `category_id`, `position`, `status`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'This is test post', 'Lorem Ipsum is simply dummy text of the printing', '<p><strong style=\"color: rgb(0, 0, 0);\">Lorem Ipsum</strong><span style=\"color: rgb(0, 0, 0);\">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>', 1, '/storage/page/2022/2022639d89ff35f55.jpeg', NULL, NULL, NULL, 1, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-05-18 23:38:11', '2022-12-17 09:21:03'),
(7, 'gfff', 'fsdfds', '<p><strong style=\"color: rgb(0, 0, 0);\">Lorem Ipsum</strong><span style=\"color: rgb(0, 0, 0);\">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>', 1, '/storage/page/2022/20226339c0c7b9d03.jpeg', NULL, NULL, 1, 1, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-05-19 00:07:57', '2022-10-02 16:47:34'),
(8, 'cvbcvbcvb', 'cvbcvb', '<p><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAACHgSURBVHgB7Z17dBxnffe/M7O7uqwkr23Jli0nkXwhiRPHEgE7ITaRSVo3B97XpjmQQHiJXShQaJtQ+kfe9+UlTuk5b09PU0wvp6FQktBTKC0lThsoaQpWsJ0mToJkHLCDL1pfdLeklbQrabU78/T5zWqllbSXmd3Z1czs8zmZsytpV7Gk3/f5XZ9nJAgsoT3QGZjxolnxKM2arDbLUG4AtABjcgAS+CNrptdJ/Dl/CGT4NiHGEEq8Tgrqj9CC/L2XmISQrClBNa4GfTEEO0JtIQgKRoLAFElDl3xoJyNnQCvA+JXRqIsFF4DUxf+AXRrUS5KKruP9bR0QmEIIIAdk8Gqlsh8KtjOwdugGb2u4KKQOaHg5xtSuV/vbghBkRAhgEWTw8Uq0SoqyT2NsPw9ZmuFsSBBdXBDPH+u77QgECxACQMLoY34ckKDsW6ZwpnQw6Ygmqc9rKjqEdyhjASRDG6bgYSRCmzJE6uD5w7O+CI6Ua1JddgLY1djZTuENj+cPwM0rvTlCPEw6wlT12XJLpMtCAItCnHYIMsKrWkEG7YlXetqeQRngagHoCW215xFI2qMQq70pSAgyD5FiqvqEm3MFVwrgjsbOZq+iPCLCHGvg4dEzbhWCqwRAhq8oyuNSwvAFFuNGIbhCACLUKS1uEoLjBbBr/enHheGXHsoRoGlfPdHXdhgOxrECoHImU+Sn+Q/QDMGyoSfLmvb5Y31tjuwyO04AerhTozwNxvZDYBucGhbJcBC7Npx6JO6Xu4Xx2w+quCmKfPQ9TZ0H4CAc4QGouuNR+KovmliOwEnewPYC2L2ucz+TZW78Isl1Ek7pKNtWAPqwml95nLvWRyFwLNwbHFYi6hN2HbazpQASDS35qKjwuAPyBqqq7bFjSGS7JPiuplMPexS5Uxi/e6C/Jf1N7Zgg20oAu9afepz/sp6BiPfdSECG/LTeuLQRtgiBRG2/zGDSEc+ketAOecGyC0DE++WJXfKCZRWAMP7yxg4iWLYcgCdErSLZLW/obz/bPV62o2aWxQPQD8wToqMQya4gQUiDtoc3zbpQYkruAajMKYxfsAiqEHWSbaDElNQD0A84W+YUCNLC84IDJ3q2P4sSUTIBzIY9nRAIslPScKgkIVBKzC8Q5ILCoZIlxkX3AKLUKciTUFzV2opdIi2qBxDGLyiAANkO2RCKSNE8QOI0NlHnFxQGNcu8Ea2tWGMTRfMANNsjjF9QKGRD8WraDVgciiIAmuoUg20Cy5DY/mJNkVoeAu1u6jzAIBdNsYLypRg9AksFkNi8rtf6RZdXUAwsrwxZFgJR0ktZO4TxC4qHbmNka7AIywRAG9hF0isoNmRjZGuwCEsEkIj7xekNVtAQ6MOOmzsgyAzZ2u51P7ekyFKwACju1yDbap+nk7m15U38j/f8IwTZYTJ72oomWcECSJzHL0Ifq3jgnq/jlpafCS+Qm0DitMDCKEgAFPqIm1FYx562F7CGh0DE793/ZR4O9UKQDdZ+17rOgkLvvAUgQp/c1PinTb3+fe98Ye65v3ICX/7k75gWAXmPD/AQKikktyPJ8uOFVIU8yJPZWxE1Q5CWjz/0n2hcM4I//cqHDb2ekl8y3lTIiEkE3/3xb+No5wfSvm+N/r439dxhx9afIjJdgy99428wGFqHMiGgj0qE8EHkQV6NsNkDa5+DIC1r147ib//yMPzcA3zhsU/h1OlNOd/zu/f/Ed7X9kLW1/yi+51zzxtW9nEvEdY9RZLIdC2+8Fd/z41/PcoOSdtz/Kr5exzn5QE0Wf6KI85VXyb+6Ivf0o2fIE/whceyC4CMmFbwXCz2EIv50t/9TXkaP4cxffymBSYxnQPQTSpE1SczZPCbNs7H7du3XeTXhazv2XHzywXH7N/84R+gu+8dKFfIJnetP3UIJjElAEp8GYNoeGXgs5/6N3z8oy8t+TyJIhupyW8+fPcnv40XXnkQZY+ER8wmxKYEIGr+6aFV/sk/+Rp+c9/xjF//9XvfSPu1dMmvGbr7tugCEOjwhFg2tUAbDuVnJz27IdDj+808zNl+24XZEOdizvcMDKzEp3/vUYQjlQs+byT5zQRVehIVn/KM+zNgamLUcBJMq78+kV1GrF0zisa1I/wa5XF9n17d2dzSqz+a/l78Pb+57xi+9e1fW/B5I8lvJqg8ms7416zux22bu7BmVT/W8uf06K8Ko4ZfRHiqBhF+XezZjItXN+P0+VYMDjfCJQS8uq3ioJEXG/IA5bD606p+PzfQ7bdd5PX70byMPBfhSBU+dvCxOS9Aoc+XP/EZ5AOt/p/5s+f15/7qMO7cdhzbtnThjtuO68Zu+vuNNOIffngAP37tN+AGuBdoMeIFFBjghhWfo7Lnsh1gWgpiMQ8uXFyPVSvDuOvOX6AY+HxxzMx45voCNPfTsu5XyIcv/d1TuGnjGXzugT/XLzL8jRvOw+edQT6QaO7k3+PeO36EAS6GqwPXw8nIsiRdnnjqR7lel9MDlGPsTyHP/+LVnL335h+eZCLVC/z9F+9Z0MgygiRJmNJWQqnw5LXSG+Xb3Bt8+98PwMGEPBGtJddpEjk9QDms/oshI33l1VvQP7hKT3ZraszN9GQj6QUq4ld4+fMHht8nyRKUSh881RWoqIznvdIbhcIpyhEc7AkqNa8U5V6gI9uLcnqAu5pOdZdz6ZO8wZP//2uW5gQksFdfiGLHO36c87W04ss+D2S+4tPzUkJ5wW897ui9CTm9QFYPsFu/q590AC6AOq00O9Oy7hzWrOxbchFU44rFKxa8j4z1+8/vAq0VlCBbAXmBptXdUMPZz3qSFBkefwVkb+mNn6AQS68QjTi2QlSpetjAlfDXXs30gqxlUBp3duLMTzNPLG/lFZaWxrdxy8afLRkaywU1lyana3Gx7x0Y4mXGIH/83vd36mL47Kf+FVbgW7MBM0NXwNR42q9TuENxfjauXo3h2jUVV3viGBpSMRNliEbnS9W1dTLq+LX1Zh+amrz6c7Ns4+XU0+ecGwFLsrKPPxzO+PVMX9jV2NkOxTknOldzA6ethDQLbzaxNAoJY1pah9vvHIFSu5Kv0HlPk+tE+4KI9i+sL9BK76n2QfKkd85k9BcvxnDmzMwCYzfCzp2V/Koy9R4XJMNZJ0Uz/gWZojwsOaTx9cD7vl5Uw09C4RNwDpOzNqvUBOBb1QhPoCEvMSz2Arrx85CHQp9UyNDPnInil9zor/GVPl9ee20aFy7E8NGP1hl+DyXCjofJtIG+I92X0nqA9ubOQDymlz5tfcYPzdE89tAfzhrm8uLlQqhY18IT1kpT70v1At6ayiXGT4b/2qvTGJ/QYBVmPAElwQ7OAZJkTIbTBoVqDKQY2x9w9eVPfsYWxk/ERvoR/sV/IXKuE+qE8YoReQGCYv5U4x8f1/Av35/ASy9NWmr8RFdX1NDrqCvsAuMnAjN+pD1GJa3fZpBKfrMys1DYU4p9rxNhxuv2PLlcVHavrZH0azFU2Ymc7zLsESh0qmhoBJsZn/scJbTf58ZvNsY3ipHvS7NBNBrhFmQoZNPPLP78EgEkzlqR2mFz9hQ4Q5+JKDf202c09PZrGB5h+sfZqPBJWL0qca1fK6F+lawLgzwCXRWNzboQsqLNr8iU3L70UgTFpKIie20vMlmDP/76H7tl9Z+FtdNegcVh0BIBeBW02z31pWTX6tWfDP2V11W8fd5ckknv6+2nCzj9y8TndDE0yrjtZl7J6Q/qQqje0pbWG6gTQ2DxhABo5S+28RMbN3kzfo2M/3//xWF3JL+LiFXhAEILS6JLBMAkXjdl5TX2TGHOv74Y0x+tgDzH8IjKBaHqQrhxk4qb1NdRecPN8K6oX/Da+GiP/kgx/w9eKN5sTxLqBezckT4BptFo963886TrCSzNARxwYws6/YDGga3yAm+cUi0z/sVQKEUXhVV79/wc9Ztb5kIibWp8bvXv6pq2PNldDIU+v3avf0lDbFKqxYs1H8eRd/8u8G5g5WDCC6qzJVcWYdAm+b+NHiOJf6M2qC16jQY2ycD475FNFvfnyB/WujgMWiCA3dd17md2/bcv4ujPPqAnwlYwPFL8H/oa/3/8w7/M4F2tF3DXXugi0CYT1SJa/Y1WZvKFjP79769BQ8N8gy1p+P/hf1h/nkReoyx4NAOJJXo1goHgrzDVOYGGN26CjQjEa9DKw6CO5CcWCEDTlH1OaX798PxDuGfXD1DvK/z4wGhxBysX8EZXnHuEc9j3MQUVciLe7+mJoZi0tlbodf9k8pvJ8POBDD5ycQTDvZcw2ncFo+NXEK1MhHItvbthOxY1xRaUA3Y1naK7u9hq8EO5l5cJN1dAqfNC4auX5JfmVqbrpn+JP7z8AKq1cRQCGSWFQaWEEuUPPbgKPk+i3t9zNQ4rIWO/+WYfN/7KBSHPpFyLy56bcU1pwpCynn9cpz8nIdDXrnk2ZBUFGXzoTK9u6KGzfRhh3YinGc32TdVg+7EPwW5wgw8e69nekvJxArtufGEf4R5pB4PsUeDxeuGt8PFHD7yVialNK0RAHuB7/zZTtDwgE01NHtx/fy2+851xvQJUKGT09fUKtm71YeNGX85yZzZIFHSNzdQhGN6Ap9++AxcHLyMyNZTW4BfT8tZu1Pfas5LEu8Irk3nAXAjEbavVjvG/9DoXwQ4ensVVzNA1Nb85hcQQ8W3AFxufw2N9H8Mall9SzL8N/uder6WVICP09MTx2mtTeg5gFjLu2lpZj+kbGjxo4IbftKGw4TxiOiwhPCYhGumHFBqAPyrhFv75c2MzCDNePvUa+z61o/atJOld4VCiKTb3G+PG3w47cp6vYlPcKNNU7mJ86aarG358uvo5PDjzDTwQ+wbygZpXD93vK3k49MrAFmx/5wDUUPq9AWToiUvmF09maxU9pKmtK/jWDnxR4b9abvBTEQmTYzIiY7yqE1/qNcLMlzB+g9TyMmoFD4Hsigx5LsxPWTLku2FXTvI/yt25V+Z/9H0SP/G+Hw9wIbwvbny7YSrvavXgxs1KIlkdYJZ7BLWyDsqWbbhyw14M3/6g/nHX7Neuj51FNRtHvdqD+ji/1F79eQN9rPagUJIGPz4i6yv9dCS9wS/mvGpuLMzOq78Ow5ytz/30PAG2b/lnM68tf87cP4/CoTvYCXwST0Gdyr/BRDX87stqork1ipyjEanU+mk0QsJo/S0Y3nAnBjffhxB/TolnPtTPCqFam+BiOcPFMjEnmgYuGPo4FTL4sWEydL66h+gxv5zgRGwDvhR5r+HX3/j6faizuQiSeYDuAfTNL3aGwqDz3PBM5FSD0jqc9N2DR1rehDYzrQ+pxUM8geOPmXZhpYM6uXQlIQGEw/NCSHoImgny8VyiolIG8wdwqvF+dPp/HScrt+Zt8ItJJqbEzyrvWfJ17/QQfN1voq3vebx34jgPD63Zz9ev+U293j+xCnZnxqvvc+/SBcAUtNp+6yOJYHN+TopmcORVjfqEJkGCYCQK7hm06BTvyIbnP8/FkU4gyT25lTwer6riz2WJPkl3KAH/D2er7kBn1U6c9e3Qr1IQG51C6HI/rkUu6CXJZIWm36vgTr91f9F+zXg8X82NX4n7YHckj57zJgTghFMfpJ/yFt1vWBOl6UNp/KIdXUZhPJ5g0Ulo0+P6CEM47sEleYu+Eh+v/mDBDSUjkMEPDp3HGDf6kd7LCPMVfwGzeSolrVZywUQOoMTsb/wEX7ia6XE2CZa2w+5M8es8TIVBViLJHkhVdZD5hZXAm+F34cnhj8DLVztvlPcmfEw/u8dKIv2jvLt6GaNjVzF8/hKmC2z45UsmQbGZKI8FudfUNGz91UdRxVd/jwNW/wQJm08KwBnb/k/mHwZZTW90xVwZNoni4406atLxxoLCGysen/HSIUErO3VY6XFo6ALiUesO5CqEgdkQiE3zVSg2AzYV0R+hJfoX9eO327/yswSm27wnsf/X/tsfCektHgZl6AnYAXUmpl/TkSn9Y8oPPLOC0DvYPEtOeolYNIqJ4YGEsV87j/HhQcsM3kzNPuf3UhWMX+Plr+nJOYNfTMPE7XAgAZoM9fC/V3PhLZUSwe1K+g4Xwa1IeIJlLDb0x1bmfA2FBum8RPDnJzDc2120FT5iYQ5wfopXgCYzl5ErtHrUjV8HJ0KVII8io9kpI9A6p3nl5TRtW1Ax8YnT8KwOwFO7At7a0jqxiJafGyIPMTk2apvwJhNhzYMfjdTjxHj2VaZuZguciuLhAuCLVLMTT3+TeB2LneFt/E2XgL7E5nISgi9QD2/NCsgV5o4nMUtYLe73Xw7OTlbhtYnV6IrU6ZcR6oe3wanwdb/ZIzEe/ztRARxffwDxTYkZGqrdx0LD+kUo1X7U1St53DizfIhpDBPTGgbDcfSMxfGt6I24zHKHdjp8gamU1zk2/CGoFOphjHsAhwqgqr8Z8qZq3ehnxobB4vMNLHUygpnhKRSL/rhBQ1kGsnVuyeh7Q3EMRuIY58Yf1+aratO57pjFjV6q8kPy19IdKFBn03Fno/BscoWHVyVugFPh9u2L1MPXXA/6k8+EriW8QDjEO7xR9Eaq8AfH3on2pgG8a+0I1vutE0REtWcpqkKLYtv0uQXHmo1MqhidUvVHujIxlq68tsjoUwkMOtd0CI2xlYUPkC83NCLRlFjFKP6ni4hPhBDlZcaXhypw9Opa3Oi7hE+s+ykCtR40ra1Ew0pemvTmX/8Ka/bJAZJGvyXajetmEnsiRng8nwxtUlf5TET56h9ls+ZARl/JxVBdC8mT2UTqHH56hCQpK3gIJDk2BNKh7nCaQW5PbUC/CBLD6Kgf09EOBMenEOxJeIKGVT40ralEoM7Dn1fAKHYwfiqxIjKhN6Xu017DO6SFYxGvXzHn7YblFZBWrMxp9Elo5t8JMz/Z4CFQs+M9gHSBtvFnX+FICPHa23FTw0Z4woPoHZrGCF8Zh0Zm9IvwVylYUevl3qECa7gYqqsyn4gQXqbwRzd6bvCMG35qJ7bSm99+4gqPhHq/hNpKvgJ6eS0kZjyvCQw5+yZ6STx89XdEFzgjtNCNwFBTrDvehJ0rRrFqRaJTOjIWmxNDhMfIdPUOJurzgTqvHiaRIAK13gXhUiyu8bBjElG5GqWARhB0o8/QjV0B46s9nb9LRr+ymiexlfOuf1A1t4Orenw1nA5fNgPkAZwtAILygB2549xfzGzCzoq35j4mISTFMBEh45/CwEiMh0oqQuMx/Tp3KXF0STJcosfK+CAOBj+L3sqb0FX1XlysuA2eamu3AOpGTwZPhq9l71SukLI31TIZfSpDzNy/3+4bXgwScH4STBjcLTioZnbxtX4FN7bU8GupGIjUcMnrSRjR+umzvOI0hq6JuD5inWjErYanJgDZY/5Xqw+b0XQl/565jD5JBTLcYsmA0acS1Iyv6LUuOjrRHQIYMfayYGy9odelimGKC4AMv2cwyoWRMLZYfN7bjM1OStJmmplhugb0j700nsErUgovIWYb00hNZpHHeESlNH+oFhn9yioe19cYM/pUzMwPVYftv+PLKK4QgJFEmBhUV2GSVaFaMh4zV1UouH5dlX6lE0MmYhNj+kUkvQMJQR/TkGTUVtXAy8uT186fRiGskqf5Ki9hba2Mam7Dnjz3JAzCeAhUO7IObsEdHmBq9jJQnLnIvcCtvgvIh8ViGOVJdPAqL5/mONF8sXeo9/nBlApEZ/JszHEB0QZkyV+HGn8ltlSaP8MzlQh8fGEw7gGcXv9PxR0CICgPMNCZDxYggFRIDFVrFGypvQ6B+h18teeNt2sDiIfHcr7XzKb8BaTpyjYohZ+QHdSMhzR05KHT6/+pkABomsz5laAeY7vFBjXr41cKcSpWN+oXrfZmxJCTLKMIVhFhxpuAdj7wKg9CNAwXcnwvgLA4Ec4XS8RgwujXSIXfVMNU/O+O8qeORAKAWzAogGylUKtJJ4bYaGJydQmz8zcST5KLtdJnwkwPoHrC+Q2wVHgnmAW5FprhcKTe4lWCrCBVDJQD0OSqNnjV1PxNOhqs8AAmzv3xuSgEYpCCHl5RCLninmAm7HmAe4EWT2kFkIp+a1QuBGqrSXXLv69gEsZzACec+mYGmamqBZmaDUiWQg0QjDXBLdRIhd9aqZsZM+pqlxm/BC1IPZkQ3ILBPCBio1n+QqlG4fd3MtoD8E27qgLEAx92SebBTxBuwWgirLlrJSuEbhO/i+pxd/3eqAIq84JDEG5hytgYQCkrQcXGX6AHmITxppbLegDgtbagrGpl6AFcJIBqqTABDDHjh/r6pop/AHAp4cW4oEwHlcEtGBTApGbTsxWXgUETPYAKl+UAvhgXQEdQv1ueexJhA1AvwC0U2gmOlG8IFKI7xMy2HFkX3MCI8VFgN4VBhWB0I4zbSqC8CKrbfFIAp+ACJBP7SSJMhEGE0Y0wTrnxhXESNq8LwDWlUBPNXTeEQX6p8B6A0UE41/UANC1Ij0kBdKDMcEMiXMommNtKoJKC+RDINZUgg1Ugwk3d4HwxUwFy0yYY4vjVtg561AUwWwlyRyJsEKtygOUUkr/AOSAzY9AVbuoBsHlbTxk8115GGWFVFWg5k+lCu8BmdoK5KgmWMGfr8vznXOIBTIRB5Y6ZnWBuaoJJmtaRfD4nAMWLIygjRBkUpk6CcFMSHEsXAlEewJiLxiJy4IYqUKEhkNnjEF0BN/5X+9uCyQ8XbD6VJO15CBxDoYNwgwYH4dy0+kvSwqmHhbuvpfIJg8JMlEGNdoHdtA8YGluwyC8QgMejx0ZlMRgnJkLN7QVwC8f62hYs8gsEkOgHuGQwrgwoNAcw2ghTVHcIhbGlIf6SA2gYmMgDHEIhs0BmxqDd0gNgaUL8JQLwevEMBIZx6lCdmePQPS4Zg9DUpTNvSwQwGwZ1wKmI/e6GMFMCdYcHkDpSy59J0p7BJ4E9C4HARWhQ09p0WgHMdoWdWQ1avgPfSk4hxyKamQPyxI2/1qaEfJH0Jf60B1JSGLSrqZMrRn4EDkP6P7J+nwB2KwO2MRESZSBXCZTuA7Zy6Aas7tns+ByARzRHaP9vuq95srzrCC8JOU4AOuf5P5/uHHmE7iLPxfBuIQYjUKzfePkWrLm01TWJL8GkzCF9RgHQhoFdTV0d3JTa4WR6+E/QMyuGzbNioBtpNMAShlywuZ5W+6YLba46+z8Jzbed6ElsfklH1jO5qScgOV0AqSQ9A3dv/g9EgYdQttBqv/byVqy9dIvrtjumwiTtiWxfz3onhtmegDtHI07zGv6Qs1fvNdIE8qWqdyuuP7vT3cbPV/9XetqeyfaarALQewJM+ypcSPBSE37n9/8f/uqpB/HWLzehHJiO1eD0lfvwdMc38eO3fh9uR5Zy97Ny3pbE48PheExPhp1/H7E0HH15h3613NCL99/3Mvbc/TrcBhn+mxc/hNcvfhjRWPnsAYip7Ilcr8l5g9lg6GvT19d9eh2Pm++AiwmN1eLkG9vQ8dN3IzJZhTUNI/D7c5+09d3w3rx3l81MhTHck/8tW/co53IejUgr/j+/+iS6B3dC1cpn+pOXPp95pa8tZ0PX0I2p4ioOexSHlkRNMji0Cv/0vb36tefuk/jw/S9yMYzCaVy+1oofdv1fjE26r7JjBCOrP2FIADRDcRdvjEmQH0YZkQyPsgnBbucLkeGfePu3cHm4DeUKrf7p5n7SYfjWhKqKQ9wL7INLc4FsZBPCcm6uTx2FoDj/JzyxpZCn3DG6+hOGb0irK8qlFSGjkAiocvT0t/ZhMlKl5wp2OIblDZ7gPvWf/yyMH+ZWf8LUzWndXhEyygv/freeMB/4+BFIT/I1ZAdvGe4t7ajF2su3YKByN37Q/WEMjm2GIFH3j2vGV3/C+IH6s+xa33kIkvw4BAuhSOjuWSEYZGK4H2+ffBFmcPPYQqEwaJ8/0dN22Mx7TAuAuGv9qW5JQjMES+FegH1E0+eOcmFGADS60HSxDWsvbYVgKfrMT+/2FpjEVAiURJK1g2DyUQiWwnMC6a+tDYvqezfjurM7XTWhaTUykz6PPDCcBKeiHy0tsbI6StE0J6WEEE7m5WR16Dyem16/Dy1v7RbGnwVKfI/13ZaXPeblAfQ3etjBeEyfFC3rhDgr5A2+wwXAm71mvQEluevPtwrDz0E+iW8qeXkAQj9LFFre/+OyIukNTud+adXEKn3Vv/7sDmH8BqBxZzNlz8XkLQAikXE7+ASJUkLe4JsypBczh0RU3bn1v/aJCo9B9HmfHOPOucg7BEoSV9lBjyJ1QoRCxvgR9wbcI7DPaXOfolV/I4/z3Xcr0uJRaOiTJP8MLYXd13XuZ5r8HATG4bY+vrcPoc4rergjMIcG7WChqz9hiQCIXRs6D/PSaFlMjAqWna8e79n+KCygoBwgFY8Hh8rpBhuC5YFszBPRDsEiLPMAxB2Nnc0eRRb5gKBYhOKq1lZI1WcxlnkAgv5hPDbLqyMnEOSCbMtK4ycsFQChJyaS6A8ILEbCE1YkvUu/bZHYtaHrOd6l2A+BoFAkduT41dYPoghY7gGS0KiESIoFhaInvWF2EEWiaAKgUQlV0/YIEQjyhWyHbCjTwbZWULQQKImoDAnyIWn8Vie9iymaB0gyWxnagzK5+6TAEkJM0j5YbOMniu4BkrynqbNVhr6JRngCQVb4gtnGKz4luVtp0T1AEvqBRI9AkAtN1md8Snar3pIJgKA6Lg0xQSBYSkg3/ivW1/qzUbIQKBURDgkWEaI8sZQrf5KSeoAks+GQKJEKiGUzfmJZPEASKpEqsnxUHLFSnpSq1JmNZRUAIURQntjB+IllCYFSoV+A16e1iWNWygj+t/ZOWjvWnPc/BTZi14bOQ2Di2EVXI+GJ41e3H4JNsJUAiN1NnQcY5K9AVIjcBpU5P1/qMmcubCcAQuQF7sIu8X46lj0HSMd8XlDe9yNwCV+1S7yfDlt6gFQoJNJ4XiC8geMISZp28Fhfm62LG7YXAKGHRAoOlds9ypwL66AD0+y66qfiCAEkEd7A9ujnxZq9ScVy4igBEMIb2BRe26eti8XcvVUMHCeAJHQco6bKXxHeYHmhCg/dMEW/Z4QDcawAktzV1PkoHckohFByQlSl44Z/CA7G8QIgRFhUUnTD94Rx2GnhTjpcIYAkQgjFhc7jp5tQO6G6YxRXCSCJEIKl8FVeezau4rCbDD+JKwWQJCkEniPcLXIE07gq1MmEqwWQiughGIV1MLDnvRE842bDT1I2Akiya0NnOy/dHeDh0T6IidMkepjDreGIU8uZ+VJ2AkjSHugMqH7sZ5B4nqDf7rUMYR18IXhWiahHymG1T0fZCiAVyhW8CtqZJO1z+YnW3MhZVzmFOLkQAkiD3mXWsF+CtJ3/ilrhYPROraQ9T+ENT2i7hNEvRAggB7p38KKVaWjnv6677S8I1sWvlyUoXeUc2hhFCCAPZhPpVv7La8a8lyh1Qh2aNfZTDAjyq8MXQVAYvDmEACyCkuoZP5oVGc08fGqWGAKSJN3AkCi7Mibpj7wMS0LJJJYQF1Yo8ToW5H+dEP8+IR6zj5GRyzJtLURQGLp1/Df+yH2Uy3pvGwAAAABJRU5ErkJggg==\"></p><p><strong style=\"color: rgb(0, 0, 0);\">Lorem Ipsum</strong><span style=\"color: rgb(0, 0, 0);\">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>', 1, '/storage/page/2022/20226339c0c7b9d03.jpeg', NULL, NULL, 1, 1, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-05-25 03:51:30', '2022-10-02 16:49:10'),
(9, 'New Blog test', 'write short des...', '<p>write des................</p>', 1, '/storage/page/639f32d93e5d11671377625.jpg', NULL, NULL, 1, 1, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-18 15:33:45', '2022-12-18 15:33:45');

-- --------------------------------------------------------

--
-- Table structure for table `blood_groups`
--

CREATE TABLE `blood_groups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blood_groups`
--

INSERT INTO `blood_groups` (`id`, `name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'A+', 1, NULL, NULL),
(2, 'A-', 1, NULL, NULL),
(3, 'B+', 1, NULL, NULL),
(4, 'B-', 1, NULL, NULL),
(5, 'AB+', 1, NULL, NULL),
(6, 'AB-', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `admin_read` tinyint(4) NOT NULL DEFAULT 0,
  `course_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `note` text DEFAULT NULL,
  `session_id` varchar(191) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart_course`
--

CREATE TABLE `cart_course` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cart_id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `fetcher` tinyint(1) NOT NULL DEFAULT 0,
  `fetcher_position` int(11) NOT NULL DEFAULT 1000,
  `type` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1=gallery, 2=blog',
  `title` varchar(100) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `status`, `fetcher`, `fetcher_position`, `type`, `title`, `short_description`, `description`, `category_id`, `image`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 1000, 2, 'Test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-05-18 22:15:32', '2022-08-23 10:27:16'),
(2, 1, 0, 1000, 2, 'test5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-05-18 22:41:50', '2022-05-18 22:38:20', '2022-05-18 22:41:50'),
(3, 0, 0, 1000, 1, 'test1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-05-18 22:44:39', '2023-01-29 13:39:03'),
(4, 1, 0, 1000, 1, 'test7', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-05-18 22:44:46', '2022-05-18 22:44:57'),
(5, 0, 0, 1000, 1, 'test8', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-05-18 22:44:52', '2023-01-29 13:39:20');

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED DEFAULT NULL,
  `receiver_id` bigint(20) UNSIGNED DEFAULT NULL,
  `chat_group_id` bigint(20) UNSIGNED DEFAULT NULL,
  `message` text DEFAULT NULL,
  `is_seen` tinyint(1) NOT NULL DEFAULT 0,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_chat_file`
--

CREATE TABLE `chat_chat_file` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `chat_id` bigint(20) UNSIGNED NOT NULL,
  `chat_file_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_files`
--

CREATE TABLE `chat_files` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_groups`
--

CREATE TABLE `chat_groups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_group_user`
--

CREATE TABLE `chat_group_user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `chat_group_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_users`
--

CREATE TABLE `chat_users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED DEFAULT NULL,
  `receiver_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_blocked` tinyint(1) NOT NULL DEFAULT 0,
  `blocked_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_users`
--

INSERT INTO `chat_users` (`id`, `sender_id`, `receiver_id`, `is_blocked`, `blocked_by`, `created_at`, `updated_at`) VALUES
(69, 75, 76, 0, NULL, '2023-02-04 08:43:14', '2023-02-04 08:43:14');

-- --------------------------------------------------------

--
-- Table structure for table `complains`
--

CREATE TABLE `complains` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `subject` varchar(191) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `review` text DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(60) NOT NULL,
  `phone_number` varchar(60) DEFAULT NULL,
  `subject` varchar(191) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_us`
--

CREATE TABLE `contact_us` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(191) DEFAULT NULL,
  `last_name` varchar(191) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  `state_or_region` varchar(191) DEFAULT NULL,
  `country` varchar(191) DEFAULT NULL,
  `student_grade` varchar(191) DEFAULT NULL,
  `course` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `other` varchar(191) DEFAULT NULL,
  `day_time` varchar(191) DEFAULT NULL,
  `message` longtext DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `limit` int(11) NOT NULL DEFAULT 0,
  `used` int(11) NOT NULL DEFAULT 0,
  `discount` double NOT NULL DEFAULT 0,
  `expiry_date` timestamp NULL DEFAULT NULL,
  `minimum_spend` double(8,2) DEFAULT 0.00,
  `maximum_spend` double(8,2) NOT NULL DEFAULT 0.00,
  `user_id` bigint(20) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `title`, `type`, `code`, `limit`, `used`, `discount`, `expiry_date`, `minimum_spend`, `maximum_spend`, `user_id`, `status`, `deleted_at`, `created_at`, `updated_at`) VALUES
(8, 'abc', 'Fixed', 'C1', 1, 1, 13, '2023-02-10 19:03:00', 0.00, 0.00, NULL, 1, NULL, '2023-02-02 08:04:01', '2023-02-04 08:26:16');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_type_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'subject',
  `course_type` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1=regular, 2= One on One',
  `name` varchar(191) DEFAULT NULL,
  `batch` varchar(100) DEFAULT NULL,
  `amount` double NOT NULL DEFAULT 0,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `duration_in_hour` double NOT NULL DEFAULT 0,
  `duration_in_week` int(11) NOT NULL DEFAULT 0,
  `course_location` varchar(191) DEFAULT NULL,
  `class_time` varchar(191) DEFAULT NULL,
  `course_outline` longtext DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 1000,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `level` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `course_type_id`, `course_type`, `name`, `batch`, `amount`, `start_date`, `end_date`, `duration_in_hour`, `duration_in_week`, `course_location`, `class_time`, `course_outline`, `position`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`, `image`, `level`) VALUES
(26, NULL, 1, 'SAT Couse (Meraz)', NULL, 235, '2023-02-07', '2023-02-21', 12, 2, 'Online', 'Day', NULL, 1000, 1, 1, 1, '123.253.215.149', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', NULL, '2023-02-02 08:02:21', '2023-02-02 08:02:21', '/storage/course/63dbb45db0bff1675342941.jpg', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `course_categories`
--

CREATE TABLE `course_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 1000,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_categories`
--

INSERT INTO `course_categories` (`id`, `name`, `image`, `position`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(14, 'SAT', '/storage/courseCategory/63dbb221225801675342369.jpg', 1000, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-02 07:52:49', '2023-02-02 07:52:49');

-- --------------------------------------------------------

--
-- Table structure for table `course_category_course_schedule`
--

CREATE TABLE `course_category_course_schedule` (
  `course_category_id` bigint(20) UNSIGNED NOT NULL,
  `course_schedule_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_course_category`
--

CREATE TABLE `course_course_category` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `course_category_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_course_category`
--

INSERT INTO `course_course_category` (`id`, `course_id`, `course_category_id`, `created_at`, `updated_at`) VALUES
(47, 26, 14, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `course_employee`
--

CREATE TABLE `course_employee` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_employee`
--

INSERT INTO `course_employee` (`id`, `course_id`, `employee_id`) VALUES
(38, 26, 38);

-- --------------------------------------------------------

--
-- Table structure for table `course_materials`
--

CREATE TABLE `course_materials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` tinyint(4) NOT NULL COMMENT '1=file, 2=video, 3=link',
  `file` varchar(100) DEFAULT NULL,
  `video` varchar(100) DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 1000,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_ratings`
--

CREATE TABLE `course_ratings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` double NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_reviews`
--

CREATE TABLE `course_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `review` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_schedules`
--

CREATE TABLE `course_schedules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `date` date DEFAULT NULL,
  `day` varchar(100) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `is_exam` tinyint(1) NOT NULL DEFAULT 0,
  `course_name` varchar(191) DEFAULT NULL,
  `classes` text DEFAULT NULL,
  `class_link` varchar(191) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_schedules`
--

INSERT INTO `course_schedules` (`id`, `course_id`, `employee_id`, `date`, `day`, `start_time`, `end_time`, `is_exam`, `course_name`, `classes`, `class_link`, `status`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(778, 26, 38, '2023-02-07', 'Tuesday', '13:01:00', '14:02:00', 0, 'abc', 'Class - 1', NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2023-02-05 00:47:05'),
(779, 26, 38, '2023-02-13', 'Monday', '13:01:00', '14:02:00', 0, 'abc', 'Class - 2', NULL, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(780, 26, 38, '2023-02-14', 'Tuesday', NULL, '23:59:00', 1, 'abc', 'Exam - 1', NULL, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(781, 26, 38, '2023-02-20', 'Monday', '13:01:00', '14:02:00', 0, 'abc', 'Class - 3', NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2023-02-05 00:47:08');

-- --------------------------------------------------------

--
-- Table structure for table `course_schedule_cancels`
--

CREATE TABLE `course_schedule_cancels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_schedule_id` bigint(20) UNSIGNED DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0=pending,1=approved,2=cancel',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_types`
--

CREATE TABLE `course_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 1000,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_types`
--

INSERT INTO `course_types` (`id`, `name`, `description`, `position`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'English', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-02 06:10:00', '2022-06-16 06:58:48'),
(2, 'English 2', 'das dsa dS', 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-05 16:55:52', '2022-06-19 14:49:32'),
(3, 'Calculas I', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-19 14:54:17', '2022-06-19 14:54:17'),
(4, 'Algebra 2', 'High school algebra 2', 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-10-02 17:32:07', '2022-10-02 17:32:07'),
(5, 'Test Mathematics', 'Write your description.', 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-18 09:14:07', '2022-12-18 09:14:07'),
(6, 'Mathematics', 'Test', 1000, 1, NULL, NULL, NULL, NULL, NULL, '2023-01-15 07:12:22', '2023-01-15 07:12:22');

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `name`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'HS Student', 1, NULL, NULL, NULL, NULL, NULL, '2022-05-26 11:09:05', '2023-01-09 12:15:45'),
(2, 'Maths Tutor', 1, NULL, NULL, NULL, NULL, '2022-06-16 08:31:36', '2022-06-16 05:44:30', '2022-06-16 08:31:36'),
(3, 'College Student', 1, NULL, NULL, NULL, NULL, NULL, '2022-06-16 05:45:11', '2023-01-14 11:57:32'),
(4, 'IIT-educated Mentor', 1, NULL, NULL, NULL, NULL, '2022-06-16 08:31:42', '2022-06-16 06:52:47', '2022-06-16 08:31:42'),
(5, 'College Graduate', 1, NULL, NULL, NULL, NULL, NULL, '2022-06-16 08:22:13', '2023-01-14 11:57:57'),
(6, 'Experienced Teacher', 1, NULL, NULL, NULL, NULL, NULL, '2023-01-08 08:02:37', '2023-01-14 11:58:09'),
(7, 'Professional', 1, NULL, NULL, NULL, NULL, NULL, '2023-01-09 12:17:20', '2023-01-09 12:18:39'),
(8, 'No Designations', 0, NULL, NULL, NULL, NULL, NULL, '2023-01-09 12:18:37', '2023-01-09 12:18:40');

-- --------------------------------------------------------

--
-- Table structure for table `emails`
--

CREATE TABLE `emails` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `subject` varchar(191) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `try` tinyint(4) NOT NULL DEFAULT 0,
  `is_sent` tinyint(4) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `file` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `emails`
--

INSERT INTO `emails` (`id`, `name`, `subject`, `email`, `message`, `try`, `is_sent`, `deleted_at`, `created_at`, `updated_at`, `file`) VALUES
(1, 'Ayah Ahmed', 'Test', 'info@stylezworld.com', 'Test.', 1, 1, NULL, '2022-10-02 21:14:06', '2022-10-02 21:14:10', NULL),
(2, 'Dr. Kaisar Alam', 'Test', 'kaisar.alam@prepexcellence.com', 'Test.', 1, 1, NULL, '2022-10-02 21:14:06', '2022-10-02 21:14:10', NULL),
(3, 'Reem Esseghir', 'Test', 'sharifsarkar78678@gmail.com', 'Test.', 1, 1, NULL, '2022-10-02 21:14:06', '2022-10-02 21:14:11', NULL),
(4, 'Malia x Ahmed', 'Test', 'sharifsarkar14786@gmail.com', 'Test.', 1, 1, NULL, '2022-10-02 21:14:06', '2022-10-02 21:14:11', NULL),
(5, 'Seth Pajak', 'Test', 'sharifsarkarPajak786@gmail.com', 'Test.', 1, 1, NULL, '2022-10-02 21:14:06', '2022-10-02 21:14:12', NULL),
(6, 'Areeq I. Hasan', 'Test', 'sharifsarkarHasan786@gmail.com', 'Test.', 1, 1, NULL, '2022-10-02 21:14:06', '2022-10-02 21:14:12', NULL),
(7, 'Nisarga Shashi', 'Test', 'sharifsarkarShashi786@gmail.com', 'Test.', 1, 1, NULL, '2022-10-02 21:14:06', '2022-10-02 21:14:13', NULL),
(8, 'Heera Bandi', 'Test', 'sharifsarkarBandi786@gmail.com', 'Test.', 1, 1, NULL, '2022-10-02 21:14:06', '2022-10-02 21:14:14', NULL),
(9, 'Admin ', 'test file', 'sw@2050.com', 'this is test file', 1, 1, NULL, '2022-11-12 17:18:22', '2022-11-12 17:23:17', NULL),
(10, 'Admin ', 'test file', 'admin@stylezworld.com', 'this is test file', 1, 1, NULL, '2022-11-12 17:18:22', '2022-11-12 17:23:22', NULL),
(11, 'Admin ', 'test', 'sw@2050.com', 'dsadsa', 1, 1, NULL, '2022-11-12 17:20:51', '2022-11-12 17:23:26', 'email/notification/1668273646_dd.jpeg'),
(12, 'Admin ', 'test', 'admin@stylezworld.com', 'dsadsa', 1, 1, NULL, '2022-11-12 17:20:51', '2022-11-12 17:43:21', 'email/notification/1668273646_dd.jpeg'),
(13, 'Admin ', 'test video', 'sw@2050.com', 'dsadas d', 1, 1, NULL, '2022-11-12 17:46:46', '2022-11-12 17:47:16', 'email/notification/1668275187_8 employee login.mp4'),
(14, 'Admin ', 'test video', 'karim.cse007@gmail.com', 'dsadas d', 1, 1, NULL, '2022-11-12 17:46:46', '2023-01-12 01:58:05', 'email/notification/1668275187_8 employee login.mp4'),
(15, 'Admin ', 'Test', 'sw@2050.com', 'test video', 1, 1, NULL, '2022-12-19 06:47:36', '2023-01-12 01:58:06', '/storage/email/notification/1671432456_campus 53.mp4'),
(16, 'Admin ', 'Test', 'admin@stylezworld.com', 'test video', 1, 1, NULL, '2022-12-19 06:47:36', '2023-01-12 01:58:08', '/storage/email/notification/1671432456_campus 53.mp4'),
(17, 'Sumon Std 2', 'January student', 'test1.prepexcel@gmail.com', 'Hello student. kemon aso?', 1, 1, NULL, '2023-01-12 01:44:03', '2023-01-12 01:58:09', '/storage/email/notification/1673505843_Brandcull Intro-1.mp4'),
(18, 'testt test', 'January student', 'karim.cse007@gmail.com', 'Hello student. kemon aso?', 1, 1, NULL, '2023-01-12 01:44:03', '2023-01-12 01:58:10', '/storage/email/notification/1673505843_Brandcull Intro-1.mp4'),
(19, 'Parents', 'Your Child is Absent', 'mdmeraz504622@gmail.com', 'Your Child was Absent today for class Winter Course (29 Jan 2023)', 1, 1, NULL, '2023-01-30 04:25:42', '2023-01-30 04:26:03', NULL),
(20, 'Parents', 'Your Child is Absent', 'mdmeraz504622@gmail.com', 'Your Child was Absent today for class Winter Course (29 Jan 2023)', 1, 1, NULL, '2023-01-30 04:28:37', '2023-01-30 04:29:03', NULL),
(21, 'Parents', 'Your Child is Late present', 'mdmeraz504622@gmail.com', 'Your Child was Late present today for class Winter Course (29 Jan 2023)', 1, 1, NULL, '2023-01-30 04:29:00', '2023-01-30 04:29:03', NULL),
(22, 'Parents', 'Your Child is Absent', 'mdmeraz504622@gmail.com', 'Your Child was Absent today for class Meraz Test Course', 1, 1, NULL, '2023-01-30 04:34:56', '2023-01-30 04:35:04', NULL),
(23, 'Parents', 'Your Child is Absent', 'test1stylezworld@gmail.com', 'Your Child was Absent today for class Meraz Test Course', 1, 1, NULL, '2023-01-30 04:35:19', '2023-01-30 04:36:05', NULL),
(24, 'Parents', 'Your Child is Absent', 'mdmeraz504622@gmail.com', 'Your Child was Absent today for class Meraz Test Course', 1, 1, NULL, '2023-01-30 04:35:20', '2023-01-30 04:36:06', NULL),
(25, 'Parents', 'Your Child is Absent', 'test1stylezworld@gmail.com', 'Your Child was Absent today for class Meraz Test Course', 1, 1, NULL, '2023-01-30 04:35:33', '2023-01-30 04:36:07', NULL),
(26, 'Parents', 'Your Child is Absent', 'mdmeraz504622@gmail.com', 'Your Child was Absent today for class Meraz Test Course', 1, 1, NULL, '2023-01-30 04:35:33', '2023-01-30 04:36:09', NULL),
(27, 'Parents', 'Your Child is Absent', 'test1stylezworld@gmail.com', 'Your Child was Absent today for class Meraz Test Course', 1, 1, NULL, '2023-01-30 04:35:42', '2023-01-30 04:36:10', NULL),
(28, 'Parents', 'Your Child is Late present', 'mdmeraz504622@gmail.com', 'Your Child was Late present today for class Meraz Test Course', 1, 1, NULL, '2023-01-30 04:35:42', '2023-01-30 04:36:11', NULL),
(29, 'Parents', 'Your Child is Absent', 'ttprepexcel@gmail.com', 'Your Child was Absent today for class SAT Couse (Meraz)', 1, 1, NULL, '2023-02-05 00:47:24', '2023-02-05 00:48:03', NULL),
(30, 'Parents', 'Your Child is Absent', 'ttprepexcel@gmail.com', 'Your Child was Absent today for class SAT Couse (Meraz)', 1, 1, NULL, '2023-02-05 00:47:24', '2023-02-05 00:48:04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` varchar(100) DEFAULT NULL,
  `designation_id` bigint(20) UNSIGNED DEFAULT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `nid` varchar(100) DEFAULT NULL,
  `marital_status_id` bigint(20) UNSIGNED DEFAULT NULL,
  `emergency_contact` varchar(100) NOT NULL,
  `present_address` text DEFAULT NULL,
  `permanent_address` text DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `hour_rate` double(8,2) NOT NULL DEFAULT 0.00,
  `salary_monthly` double(8,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employee_id`, `designation_id`, `father_name`, `mother_name`, `nid`, `marital_status_id`, `emergency_contact`, `present_address`, `permanent_address`, `join_date`, `hour_rate`, `salary_monthly`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, NULL, '54325432543', NULL, NULL, NULL, 0.00, 0.00, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, '20230001', 5, NULL, NULL, NULL, NULL, 'Meraz', '{\"city\":\"Toronto\",\"state\":\"Ontario\",\"country\":\"Canada\",\"zip\":\"M9A4X9\",\"address\":\"Toronto\"}', NULL, '2023-01-29', 32.00, 0.00, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-02 07:56:32', '2023-02-02 07:56:32');

-- --------------------------------------------------------

--
-- Table structure for table `employee_over_times`
--

CREATE TABLE `employee_over_times` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `date` date DEFAULT NULL,
  `working_hour` double NOT NULL DEFAULT 0,
  `hour_rate` double NOT NULL DEFAULT 0,
  `work_type` varchar(191) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `is_paid` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_over_time_employee_payment`
--

CREATE TABLE `employee_over_time_employee_payment` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_over_time_id` bigint(20) UNSIGNED NOT NULL,
  `employee_payment_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_payments`
--

CREATE TABLE `employee_payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `invoice_no` varchar(191) DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `date` date DEFAULT NULL,
  `regular_hour` double NOT NULL DEFAULT 0,
  `ot_hour` double NOT NULL DEFAULT 0,
  `total_hour` double NOT NULL DEFAULT 0,
  `regular_amount` double NOT NULL DEFAULT 0,
  `ot_amount` double NOT NULL DEFAULT 0,
  `total_amount` double NOT NULL DEFAULT 0,
  `regular_hour_rate` double NOT NULL DEFAULT 0,
  `ot_hour_rate` double NOT NULL DEFAULT 0,
  `payment_type` varchar(191) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_payment_employee_working`
--

CREATE TABLE `employee_payment_employee_working` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_payment_id` bigint(20) UNSIGNED NOT NULL,
  `employee_working_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_qualifications`
--

CREATE TABLE `employee_qualifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `exam_name` varchar(100) DEFAULT NULL,
  `institute` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(191) DEFAULT NULL,
  `result` varchar(100) DEFAULT NULL,
  `out_of_result` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_qualifications`
--

INSERT INTO `employee_qualifications` (`id`, `employee_id`, `exam_name`, `institute`, `state`, `country`, `result`, `out_of_result`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(77, 38, '', '', '', '', '', '', 1, NULL, NULL, NULL, NULL, NULL, '2023-02-02 07:56:32', '2023-02-02 07:56:32');

-- --------------------------------------------------------

--
-- Table structure for table `employee_workings`
--

CREATE TABLE `employee_workings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_schedule_id` bigint(20) UNSIGNED DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `date` date DEFAULT NULL,
  `working_hour` double NOT NULL DEFAULT 0,
  `hour_rate` double NOT NULL DEFAULT 0,
  `is_paid` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_workings`
--

INSERT INTO `employee_workings` (`id`, `course_schedule_id`, `employee_id`, `date`, `working_hour`, `hour_rate`, `is_paid`, `deleted_at`, `created_at`, `updated_at`) VALUES
(23, 778, 38, '2023-02-05', 1, 32, 0, NULL, '2023-02-05 00:47:05', '2023-02-05 00:47:05'),
(24, 781, 38, '2023-02-05', 1, 32, 0, NULL, '2023-02-05 00:47:08', '2023-02-05 00:47:08');

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(191) DEFAULT NULL,
  `time_type` tinyint(4) NOT NULL DEFAULT 1,
  `exam_start_date` date DEFAULT NULL,
  `exam_end_date` date DEFAULT NULL,
  `exam_start` timestamp NULL DEFAULT NULL,
  `exam_end` timestamp NULL DEFAULT NULL,
  `duration` double NOT NULL DEFAULT 0,
  `exam_type` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1=regular, 2=SAT',
  `question_type` tinyint(4) NOT NULL DEFAULT 1,
  `sat_section_id` bigint(20) DEFAULT NULL,
  `question` varchar(191) DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exam_questions`
--

CREATE TABLE `exam_questions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `question_bank_id` bigint(20) UNSIGNED DEFAULT NULL,
  `exam_id` bigint(20) UNSIGNED DEFAULT NULL,
  `question_type` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1=mcq, 2=cq',
  `question_part` tinyint(4) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '[option1, option2, option3,...]',
  `answer` text DEFAULT NULL,
  `mark` double NOT NULL DEFAULT 0,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `invoice_no` varchar(100) DEFAULT NULL,
  `expense_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sub_expense_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `expense_date` date DEFAULT NULL,
  `amount` double NOT NULL DEFAULT 0,
  `payment_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `bank_account_id` bigint(20) UNSIGNED DEFAULT NULL,
  `check_no` varchar(100) DEFAULT NULL,
  `check_date` date DEFAULT NULL,
  `note` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `invoice_no`, `expense_type_id`, `sub_expense_type_id`, `expense_date`, `amount`, `payment_type_id`, `bank_account_id`, `check_no`, `check_date`, `note`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, '3212', 1, 1, '2023-01-17', 500, 1, 1, 'undefined', '2023-01-17', 'ddd', 1, 1, 1, '103.117.195.130', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', NULL, '2023-01-17 00:15:10', '2023-01-17 00:15:10');

-- --------------------------------------------------------

--
-- Table structure for table `expense_types`
--

CREATE TABLE `expense_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expense_types`
--

INSERT INTO `expense_types` (`id`, `name`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Hello', 1, 1, 1, '103.35.168.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', NULL, '2023-01-15 07:09:52', '2023-01-15 07:09:52');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `question` varchar(100) NOT NULL,
  `answer` longtext DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `answer`, `status`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Molestiae vel invent', 'Cupidatat accusantiu', 1, NULL, NULL, NULL, NULL, '2022-05-08 02:11:50', '2022-05-08 00:22:44', '2022-05-08 02:11:50'),
(2, 'gggg', 'hhhh', 1, NULL, NULL, NULL, NULL, '2022-05-08 02:12:00', '2022-05-08 01:17:29', '2022-05-08 02:12:00'),
(3, 'faff', 'fdsafds', 1, NULL, NULL, NULL, NULL, NULL, '2022-05-08 02:12:17', '2022-05-08 02:12:17'),
(4, 'dsafds', 'fdsafdsa', 1, NULL, NULL, NULL, NULL, NULL, '2022-05-08 02:13:11', '2022-05-08 02:13:11'),
(5, 'dsaDS', 'DSAdsa', 1, NULL, NULL, NULL, NULL, NULL, '2022-05-08 02:13:19', '2022-05-08 02:13:19');

-- --------------------------------------------------------

--
-- Table structure for table `galleries`
--

CREATE TABLE `galleries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 1000,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery_items`
--

CREATE TABLE `gallery_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `gallery_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1=image, 2=video, 3= scripts',
  `image` varchar(100) DEFAULT NULL,
  `video` varchar(100) DEFAULT NULL,
  `embedded_code` text DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 1000,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `genders`
--

CREATE TABLE `genders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `genders`
--

INSERT INTO `genders` (`id`, `name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Male', 1, NULL, NULL),
(2, 'Female', 1, NULL, NULL),
(3, 'Other', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `home_sections`
--

CREATE TABLE `home_sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `section_design_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `section_name` varchar(191) NOT NULL,
  `section_name_is_show` tinyint(1) NOT NULL DEFAULT 1,
  `bg_type` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1=color, 2=image',
  `bg_image` varchar(100) DEFAULT NULL,
  `bg_color` varchar(100) DEFAULT NULL,
  `col` int(11) DEFAULT NULL,
  `row` int(11) DEFAULT NULL,
  `title` varchar(191) DEFAULT NULL,
  `sub_title` varchar(191) DEFAULT NULL,
  `text_align` tinyint(4) DEFAULT NULL COMMENT '1=left, 2=right',
  `type` tinyint(4) DEFAULT NULL COMMENT '1=image, 2=video, 3=script',
  `image` varchar(100) DEFAULT NULL,
  `video` varchar(100) DEFAULT NULL,
  `video_script` text DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `button_name` varchar(100) DEFAULT NULL,
  `button_url` varchar(100) DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 1000,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `home_sections`
--

INSERT INTO `home_sections` (`id`, `section_design_type_id`, `section_name`, `section_name_is_show`, `bg_type`, `bg_image`, `bg_color`, `col`, `row`, `title`, `sub_title`, `text_align`, `type`, `image`, `video`, `video_script`, `short_description`, `description`, `button_name`, `button_url`, `position`, `status`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'Patience Colon', 1, 1, NULL, '#643ec1', 3, 4, 'Elit quam et repudi', 'Dolor id ratione ex', 1, 1, '/storage/homeSection/2022/20226289de897a6af.jpeg', NULL, NULL, '<p>Rerum eveniet, qui d.</p>', '<p>Illum, tenetur sed c.</p>', 'Mannix Mckinney', 'Aliqua Qui unde inv', 1, 1, NULL, NULL, NULL, NULL, '2022-06-14 05:09:06', '2022-05-22 00:56:09', '2022-06-14 05:09:06'),
(2, 1, 'Axel Day', 1, 1, NULL, '#cc3360', 3, 744, 'Assumenda quia culpa', 'Et aliquid qui conse', 1, 1, '/storage/homeSection/2022/20226289e33f6eb8e.png', NULL, NULL, '<p>Recusandae. Veniam, .</p>', '<p>Minus error necessit.</p>', 'Penelope Contreras', 'Harum distinctio Cu', 0, 1, NULL, NULL, NULL, NULL, '2022-05-22 01:16:29', '2022-05-22 01:02:19', '2022-05-22 01:16:29'),
(3, 2, 'Test news', 1, 1, NULL, '#cd1d1d', 3, 1, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1000, 1, NULL, NULL, NULL, NULL, '2022-06-14 05:09:10', '2022-05-22 01:29:27', '2022-06-14 05:09:10'),
(4, 3, 'Half paralax', 1, 2, '/storage/homeSection/bg/1653204613_bg.png', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1000, 1, NULL, NULL, NULL, NULL, '2022-06-14 05:09:14', '2022-05-22 01:30:13', '2022-06-14 05:09:14'),
(5, 3, 'Testimonials', 1, 1, NULL, '#c4840e', 3, 1, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-14 05:09:52', '2022-06-19 17:19:11'),
(6, 6, 'Courses', 1, 1, NULL, '#e4ecf9', 3, 1, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, 'View more', '/page/courses-262506740', 0, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-14 05:10:25', '2023-01-31 01:38:22'),
(7, 7, 'Promotions', 1, 2, '/storage/homeSection/bg62af2da727bca1655647655.jpg', '#9f7575', 3, 1, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-14 05:10:43', '2022-06-19 17:19:11'),
(8, 8, 'Instructors', 1, 1, NULL, '#e4ecf9', 3, 1, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-14 05:11:02', '2022-06-19 17:19:11'),
(9, 10, 'Top Categories', 1, 1, NULL, '#211c1c', 3, 1, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, NULL, NULL, NULL, NULL, '2022-06-17 20:01:20', '2022-06-14 05:30:35', '2022-06-17 20:01:20');

-- --------------------------------------------------------

--
-- Table structure for table `home_works`
--

CREATE TABLE `home_works` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED DEFAULT NULL,
  `submission_last_date` timestamp NULL DEFAULT NULL,
  `file` varchar(100) DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `total_mark` double NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(191) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `vacancy` int(11) DEFAULT NULL,
  `job_context` text DEFAULT NULL,
  `job_responsibilities` text DEFAULT NULL,
  `employment_status` text DEFAULT NULL,
  `educational_requirements` text DEFAULT NULL,
  `experience_requirements` text DEFAULT NULL,
  `additional_requirements` text DEFAULT NULL,
  `job_location` text DEFAULT NULL,
  `salary` varchar(191) DEFAULT NULL,
  `compensation_benefits` text DEFAULT NULL,
  `gender` varchar(191) DEFAULT NULL,
  `last_date` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `title`, `image`, `vacancy`, `job_context`, `job_responsibilities`, `employment_status`, `educational_requirements`, `experience_requirements`, `additional_requirements`, `job_location`, `salary`, `compensation_benefits`, `gender`, `last_date`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Senior Software Engineer', '/job6371333e6845b1668363070.jpg', 5, '<p><strong style=\"color: rgb(0, 0, 0);\">Lorem Ipsum</strong><span style=\"color: rgb(0, 0, 0);\">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>', '<ul><li>In deep knowledge, and working experience in Microsoft .NET technologies including C#, ASP.NET</li><li>.NET CORE, MVC, Web API, WCF, ADO.NET, Entity Framework, LINQ.</li><li>Must-Know Development methodologies, Multithreading, OOP Design patterns, and principles.</li><li>Must have experience in Bootstrap, Ajax, JavaScript, JSON, CSS, HTML, DHTML.</li><li>Do not apply if you do not have a minimum of 4-5 years of experience in developing web applications with ASP.Net,</li></ul>', 'Full time', '<ul><li>B.Sc or M.Sc in CSE from any reputed university.</li></ul>', '<ul><li>4 to 5 year(s)</li></ul>', '<ul><li>Good command in written &amp; communication in English shall be given preference</li><li>Normal cognitive abilities including the ability to learn, recall, and apply certain practices and policies;</li><li>Strong analytical and communication ability;</li><li>Very good Communication Skill;</li></ul><p><br></p>', NULL, 'Negotiable', '<ul><li>Weekly 2 holidays</li><li>Lunch Facilities: Full Subsidize</li><li>Salary Review: Yearly</li><li>Festival Bonus: 2</li></ul><p><br></p>', 'Both males and females are allowed to apply', '2022-10-08', 1, 1, 1, '103.117.195.133', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36', NULL, '2022-09-28 06:55:24', '2023-01-10 08:14:05'),
(2, 'Hiring Assistance Teacher (English)', '/storage//job639ef38a110e61671361418.jpg', 2, '<p>Write job context</p>', '<p>sfsf</p>', 'Full Time', '<p>sdfs</p>', '<p>sfd</p>', '<p>sfd</p>', NULL, '50000', '<p>sf</p>', 'Both', '2023-01-22', 1, 1, NULL, '103.183.16.69', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', '2022-12-18 11:06:52', '2022-12-18 11:03:38', '2022-12-18 11:06:52'),
(3, 'Test Assistance Teacher', '/storage//job639ef563e80bd1671361891.jpg', 2, '<p><strong style=\"color: rgb(0, 0, 0);\">Lorem Ipsum</strong><span style=\"color: rgb(0, 0, 0);\">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>', '<p><strong style=\"color: rgb(0, 0, 0);\">Lorem Ipsum</strong><span style=\"color: rgb(0, 0, 0);\">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>', 'Full time', '<p><strong style=\"color: rgb(0, 0, 0);\">Lorem Ipsum</strong><span style=\"color: rgb(0, 0, 0);\">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>', '<p><strong style=\"color: rgb(0, 0, 0);\">Lorem Ipsum</strong><span style=\"color: rgb(0, 0, 0);\">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>', '<p><strong style=\"color: rgb(0, 0, 0);\">Lorem Ipsum</strong><span style=\"color: rgb(0, 0, 0);\">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>', NULL, '50,000', '<p><strong style=\"color: rgb(0, 0, 0);\">Lorem Ipsum</strong><span style=\"color: rgb(0, 0, 0);\">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>', 'Both', '2023-05-04', 1, 1, 1, '103.183.16.69', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', NULL, '2022-12-18 11:11:31', '2023-01-10 08:12:40');

-- --------------------------------------------------------

--
-- Table structure for table `marital_statuses`
--

CREATE TABLE `marital_statuses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `marital_statuses`
--

INSERT INTO `marital_statuses` (`id`, `name`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Married', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'UnMarried', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Divorced', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `alias` varchar(100) NOT NULL,
  `type` tinyint(4) NOT NULL COMMENT '1=admin, 2=employee, 3=student, 4=parent, 5=affiliation',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `name`, `alias`, `type`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Blog', 'Blog', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-03-30 05:36:38', '2022-07-04 03:13:26'),
(2, 'Blog Category', 'Blog Category', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-01 05:30:23', '2022-07-04 03:13:49'),
(3, 'Slider', 'Slider', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:14:25', '2022-07-04 03:14:25'),
(4, 'Promotion', 'Promotion', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:14:41', '2022-07-04 03:14:41'),
(5, 'Home Section', 'Home Section', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:10', '2022-07-04 03:15:10'),
(6, 'Gallery', 'Gallery', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:30', '2022-07-04 03:15:30'),
(7, 'Gallery Category', 'Gallery Category', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:52', '2022-07-04 03:15:52'),
(8, 'Web Information', 'Web Information', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:16:13', '2022-07-04 03:16:13'),
(9, 'Logo & Favicon', 'Logo & Favicon', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:16:25', '2022-07-04 03:16:25'),
(10, 'Social Link', 'Social Link', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:16:47', '2022-07-04 03:16:47'),
(11, 'Top Add', 'Top Add', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:06', '2022-07-04 03:17:06'),
(12, 'Page', 'Page', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:20', '2022-07-04 03:17:20'),
(13, 'Menu', 'Menu', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:39', '2022-07-04 03:17:39'),
(14, 'Widgets', 'Widgets', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:57', '2022-12-17 10:14:02'),
(15, 'Testimonial', 'Testimonial', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:15', '2022-07-04 03:18:15'),
(16, 'Faqs', 'Faqs', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:31', '2022-07-04 03:18:31'),
(17, 'Contact Form Request', 'Contact Form Request', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:53', '2022-07-04 03:18:53'),
(18, 'Role Permission', 'Role Permission', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:14', '2023-02-01 10:10:14'),
(19, 'User Permission', 'User Permission', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:28', '2023-02-01 10:10:28'),
(20, 'Role', 'Role', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:45', '2023-02-01 10:10:45'),
(21, 'Permission', 'Permission', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:01', '2023-02-01 10:11:01'),
(22, 'Role Menu', 'Role Menu', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:15', '2023-02-01 10:11:15'),
(23, 'Qualification', 'Qualification', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:29', '2023-02-01 10:11:29'),
(24, 'Religion', 'Religion', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:41', '2023-02-01 10:11:41'),
(25, 'Bank', 'Bank', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:56', '2023-02-01 10:11:56'),
(26, 'Bank Account', 'Bank Account', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:10', '2023-02-01 10:12:10'),
(27, 'Payment Type', 'Payment Type', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:26', '2023-02-01 10:12:26'),
(28, 'Expense Type', 'Expense Type', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:38', '2023-02-01 10:12:38'),
(29, 'Sub-expense Type', 'Sub-expense Type', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:51', '2023-02-01 10:12:51'),
(30, 'Expense', 'Expense', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:06', '2023-02-01 10:13:06'),
(31, 'Order', 'Order', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:24', '2023-02-01 10:13:24'),
(32, 'Students', 'Students', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:37', '2023-02-01 10:13:37'),
(33, 'Students Course', 'Students Course', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:50', '2023-02-01 10:13:50'),
(34, 'Coupon', 'Coupon', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:01', '2023-02-01 10:14:01'),
(35, 'Subject', 'Subject', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:15', '2023-02-01 10:14:15'),
(36, 'Course Category', 'Course Category', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:30', '2023-02-01 10:14:30'),
(37, 'Course', 'Course', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:43', '2023-02-01 10:14:43'),
(38, 'Schedule', 'Schedule', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:57', '2023-02-01 10:14:57'),
(39, 'Schedule Cancel Request', 'Schedule Cancel Request', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:12', '2023-02-01 10:15:12'),
(40, 'Section & Test Score', 'Section & Test Score', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:28', '2023-02-01 10:15:28'),
(41, 'Test', 'Test', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:42', '2023-02-01 10:15:42'),
(42, 'Test Result', 'Test Result', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:17', '2023-02-01 10:16:17'),
(43, 'Employees', 'Employees', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:31', '2023-02-01 10:16:31'),
(44, 'Working Hour', 'Working Hour', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:43', '2023-02-01 10:16:43'),
(45, 'Over Time', 'Over Time', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:55', '2023-02-01 10:16:55'),
(46, 'Payment', 'Payment', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:07', '2023-02-01 10:17:07'),
(47, 'Job', 'Job', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:19', '2023-02-01 10:17:19'),
(48, 'Applicant', 'Applicant', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:33', '2023-02-01 10:17:33'),
(49, 'Tutoring Request', 'Tutoring Request', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:45', '2023-02-01 10:17:45'),
(50, 'Message', 'Message', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:59', '2023-02-01 10:17:59'),
(51, 'Email Notification', 'Email Notification', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:25:19', '2023-02-01 10:25:19'),
(52, 'Sms Notification', 'Sms Notification', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:25:41', '2023-02-01 10:25:41'),
(53, 'Push Notification', 'Push Notification', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:00', '2023-02-01 10:26:00'),
(54, 'Admin Complain', 'Complain', 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:18', '2023-02-01 10:26:18'),
(55, 'Complain', 'Complain', 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:37', '2023-02-01 10:26:37'),
(56, 'My Working Hour', 'Working Hour', 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:54', '2023-02-01 10:26:54'),
(57, 'My Over Time', 'Over Time', 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:27:10', '2023-02-01 10:27:10'),
(58, 'My Payment', 'Payment', 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:27:30', '2023-02-01 10:27:30'),
(59, 'Employee Schedule', 'Schedule', 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:27:47', '2023-02-01 10:27:47'),
(60, 'Employee Courses', 'Courses', 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:05', '2023-02-01 10:28:05'),
(61, 'Employee Homework', 'Homework', 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:23', '2023-02-01 10:28:23'),
(62, 'Employee Course Material', 'Course Material', 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:39', '2023-02-01 10:28:39'),
(63, 'Employee Attendance', 'Attendance', 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:00', '2023-02-01 10:29:00'),
(64, 'Sat Raw Score', 'Sat Raw Score', 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:13', '2023-02-01 10:29:13'),
(65, 'Employee Test', 'Test', 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:31', '2023-02-01 10:29:31'),
(66, 'Employee Test Result', 'Test Result', 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:47', '2023-02-01 10:29:47'),
(67, 'Message', 'Employee Test Result', 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:35:23', '2023-02-01 10:35:23');

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `p_menu_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  `relation_id` bigint(20) UNSIGNED DEFAULT NULL,
  `relation_with` varchar(100) DEFAULT NULL,
  `menu_item_id` bigint(20) UNSIGNED DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 1000,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `p_menu_id`, `name`, `url`, `relation_id`, `relation_with`, `menu_item_id`, `position`, `status`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'Test', 'https://test.com', NULL, 'custom_link', NULL, 1, 1, NULL, NULL, NULL, NULL, '2022-06-15 06:07:24', '2022-05-23 02:38:01', '2022-06-15 06:07:24'),
(2, 1, 'Test2', 'https://test2.com', NULL, 'custom_link', 1, 0, 1, NULL, NULL, NULL, NULL, '2022-05-24 01:09:38', '2022-05-23 02:44:15', '2022-05-24 01:09:38'),
(3, 2, 'Test 3', 'https://test.com', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-05-23 03:09:46', '2022-05-23 03:09:46'),
(4, 2, 'Test5', 'https://test.com', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-05-23 03:09:54', '2022-05-23 03:09:54'),
(5, 1, 'test 3', 'https://test.com', NULL, 'custom_link', 2, 0, 1, NULL, NULL, NULL, NULL, '2022-05-24 01:08:12', '2022-05-23 03:10:01', '2022-05-24 01:08:12'),
(6, 1, 'Test 4', 'https://test.com', NULL, 'custom_link', 1, 0, 1, NULL, NULL, NULL, NULL, '2022-06-15 06:07:21', '2022-05-23 03:10:10', '2022-06-15 06:07:21'),
(9, 1, NULL, NULL, 1, 'page', NULL, 2, 1, NULL, NULL, NULL, NULL, '2022-06-15 06:07:32', '2022-05-24 02:04:33', '2022-06-15 06:07:32'),
(10, 1, NULL, NULL, 4, 'page', 9, 0, 1, NULL, NULL, NULL, NULL, '2022-06-15 06:07:28', '2022-05-24 02:04:33', '2022-06-15 06:07:28'),
(11, 1, 'Home', '/', NULL, 'custom_link', NULL, 0, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-13 05:43:54', '2022-06-14 05:34:33'),
(12, 1, 'About Us', '/about-us', NULL, 'custom_link', 6, 0, 1, NULL, NULL, NULL, NULL, '2022-06-15 06:07:18', '2022-06-14 05:32:49', '2022-06-15 06:07:18'),
(13, 1, NULL, NULL, 5, 'page', NULL, 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-15 06:07:45', '2023-01-31 09:53:28'),
(14, 1, NULL, NULL, 6, 'page', NULL, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-15 06:07:45', '2023-01-31 09:53:28'),
(15, 1, NULL, NULL, 7, 'page', NULL, 4, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-15 06:07:45', '2023-01-31 09:53:28'),
(16, 1, NULL, NULL, 8, 'page', NULL, 4, 1, NULL, NULL, NULL, NULL, '2022-06-19 17:34:54', '2022-06-15 06:07:45', '2022-06-19 17:34:54'),
(17, 1, NULL, NULL, 9, 'page', NULL, 5, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-15 06:07:45', '2023-01-31 09:53:28'),
(18, 1, NULL, NULL, 10, 'page', NULL, 6, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-19 17:30:50', '2023-01-31 09:53:28'),
(19, 1, NULL, NULL, 11, 'page', NULL, 6, 1, NULL, NULL, NULL, NULL, '2023-01-31 09:52:52', '2022-06-19 17:34:47', '2023-01-31 09:52:52'),
(20, 1, 'Career', '/career', NULL, 'custom_link', NULL, 7, 1, NULL, NULL, NULL, NULL, NULL, '2022-09-26 04:23:57', '2023-01-30 04:57:33'),
(21, 1, 'Test Exm', '/career', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, '2022-12-17 09:38:12', '2022-12-17 09:28:44', '2022-12-17 09:38:12'),
(22, 1, 'Test Menu', '/page/courses', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, '2022-12-17 09:55:30', '2022-12-17 09:54:12', '2022-12-17 09:55:30'),
(23, 1, 'Test Menu', '/page/blog', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, '2022-12-17 10:52:27', '2022-12-17 09:57:34', '2022-12-17 10:52:27'),
(24, 1, 'Test Menu', 'prepexcellence.stylezworld.net/page/courses-262506740', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, '2022-12-18 06:34:13', '2022-12-18 06:28:27', '2022-12-18 06:34:13'),
(25, 1, 'Menu test', '/career', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, '2022-12-18 06:39:03', '2022-12-18 06:37:16', '2022-12-18 06:39:03'),
(26, 1, NULL, NULL, 12, 'page', NULL, 1000, 1, NULL, NULL, NULL, NULL, '2022-12-18 06:51:09', '2022-12-18 06:44:21', '2022-12-18 06:51:09'),
(27, 1, NULL, NULL, 13, 'page', NULL, 1000, 1, NULL, NULL, NULL, NULL, '2022-12-18 07:06:22', '2022-12-18 06:55:45', '2022-12-18 07:06:22'),
(28, 1, NULL, NULL, 14, 'page', NULL, 1000, 1, NULL, NULL, NULL, NULL, '2022-12-18 07:06:19', '2022-12-18 07:01:44', '2022-12-18 07:06:19'),
(29, 1, NULL, NULL, 15, 'page', NULL, 8, 1, NULL, NULL, NULL, NULL, '2023-01-30 04:57:50', '2022-12-18 07:09:56', '2023-01-30 04:57:50'),
(30, 3, 'Home', '/', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:06:37', '2022-12-31 14:06:37'),
(31, 3, 'About Us', '/page/about-us-961575242', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:06:51', '2023-01-25 02:36:59'),
(32, 3, 'Blogs', '/page/blog-453459317', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:07:02', '2023-01-25 02:40:42'),
(33, 3, 'Free Classes', '/', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:07:16', '2022-12-31 14:07:16'),
(34, 3, 'Prep Courses', '/page/courses-262506740', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:07:34', '2023-01-25 04:04:31'),
(35, 3, 'Support', '#', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:07:45', '2022-12-31 14:07:45'),
(36, 4, 'Tutoring', '/page/tutoring-818576171', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:07:56', '2023-01-25 04:07:19'),
(37, 4, 'LSAT/ACT Tutoring', '/page/tutoring-818576171', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:08:07', '2023-01-25 04:08:54'),
(38, 4, 'Academic Tutoring', '/page/tutoring-818576171', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:08:18', '2023-01-25 04:08:57'),
(39, 4, 'College Admission', '/page/college-admission-869883604', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:08:28', '2023-01-25 04:09:23'),
(40, 4, 'College Admission Consulting', '#', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:08:39', '2022-12-31 14:08:39'),
(41, 5, 'Frequently Asked Questions', '#', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:08:50', '2022-12-31 14:08:50'),
(42, 5, 'How To Get Scholarships', '#', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:09:00', '2022-12-31 14:09:00'),
(43, 5, 'You Can Earn A Up To $200 Referral', '#', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:09:10', '2022-12-31 14:09:10'),
(44, 5, 'Become an affiliate partner', '#', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:09:20', '2022-12-31 14:09:20'),
(45, 5, 'Become an instructor', '/career', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:09:30', '2023-01-25 04:11:42'),
(46, 5, 'Contact US', '/page/contact-us-540083915', NULL, 'custom_link', NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:09:40', '2023-01-25 04:12:22'),
(47, 1, NULL, NULL, 16, 'page', NULL, 1000, 1, NULL, NULL, NULL, NULL, '2023-01-30 04:57:10', '2023-01-30 04:50:13', '2023-01-30 04:57:10'),
(48, 1, NULL, NULL, 8, 'page', NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-01-31 09:53:13', '2023-01-31 09:53:28'),
(49, 1, NULL, NULL, 17, 'page', NULL, 8, 1, NULL, NULL, NULL, NULL, NULL, '2023-01-31 09:53:13', '2023-01-31 09:53:28');

-- --------------------------------------------------------

--
-- Table structure for table `menu_permissions`
--

CREATE TABLE `menu_permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `menu_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menu_permissions`
--

INSERT INTO `menu_permissions` (`id`, `menu_id`, `permission_id`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-03-30 05:47:19', '2022-03-30 05:47:19'),
(2, 2, 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-05 16:44:52', '2022-06-05 16:44:52'),
(3, 2, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-05 16:44:52', '2022-06-05 16:44:52'),
(4, 2, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-05 16:44:52', '2022-06-05 16:44:52'),
(5, 2, 4, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-05 16:44:52', '2022-06-05 16:44:52'),
(6, 2, 5, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-05 16:44:52', '2022-06-05 16:44:52'),
(7, 1, 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-05 16:45:00', '2022-06-05 16:45:00'),
(8, 1, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-05 16:45:00', '2022-06-05 16:45:00'),
(9, 1, 4, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-05 16:45:00', '2022-06-05 16:45:00'),
(10, 1, 5, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-05 16:45:00', '2022-06-05 16:45:00'),
(11, 3, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:14:25', '2022-07-04 03:14:25'),
(12, 3, 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:14:25', '2022-07-04 03:14:25'),
(13, 3, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:14:25', '2022-07-04 03:14:25'),
(14, 3, 4, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:14:25', '2022-07-04 03:14:25'),
(15, 4, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:14:41', '2022-07-04 03:14:41'),
(16, 4, 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:14:41', '2022-07-04 03:14:41'),
(17, 4, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:14:41', '2022-07-04 03:14:41'),
(18, 4, 4, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:14:41', '2022-07-04 03:14:41'),
(19, 4, 5, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:14:41', '2022-07-04 03:14:41'),
(20, 5, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:10', '2022-07-04 03:15:10'),
(21, 5, 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:10', '2022-07-04 03:15:10'),
(22, 5, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:10', '2022-07-04 03:15:10'),
(23, 5, 4, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:10', '2022-07-04 03:15:10'),
(24, 6, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:30', '2022-07-04 03:15:30'),
(25, 6, 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:30', '2022-07-04 03:15:30'),
(26, 6, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:30', '2022-07-04 03:15:30'),
(27, 6, 4, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:30', '2022-07-04 03:15:30'),
(28, 6, 5, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:30', '2022-07-04 03:15:30'),
(29, 7, 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:52', '2022-07-04 03:15:52'),
(30, 7, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:52', '2022-07-04 03:15:52'),
(31, 7, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:52', '2022-07-04 03:15:52'),
(32, 7, 4, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:52', '2022-07-04 03:15:52'),
(33, 7, 5, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:15:52', '2022-07-04 03:15:52'),
(34, 8, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:16:13', '2022-07-04 03:16:13'),
(35, 8, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:16:13', '2022-07-04 03:16:13'),
(36, 9, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:16:25', '2022-07-04 03:16:25'),
(37, 9, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:16:25', '2022-07-04 03:16:25'),
(38, 10, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:16:47', '2022-07-04 03:16:47'),
(39, 10, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:16:47', '2022-07-04 03:16:47'),
(40, 11, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:06', '2022-07-04 03:17:06'),
(41, 11, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:06', '2022-07-04 03:17:06'),
(42, 12, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:20', '2022-07-04 03:17:20'),
(43, 12, 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:20', '2022-07-04 03:17:20'),
(44, 12, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:20', '2022-07-04 03:17:20'),
(45, 12, 4, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:20', '2022-07-04 03:17:20'),
(46, 12, 5, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:20', '2022-07-04 03:17:20'),
(47, 13, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:39', '2022-07-04 03:17:39'),
(48, 13, 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:39', '2022-07-04 03:17:39'),
(49, 13, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:39', '2022-07-04 03:17:39'),
(50, 13, 4, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:39', '2022-07-04 03:17:39'),
(51, 13, 5, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:39', '2022-07-04 03:17:39'),
(52, 14, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:57', '2022-07-04 03:17:57'),
(53, 14, 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:57', '2022-07-04 03:17:57'),
(54, 14, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:57', '2022-07-04 03:17:57'),
(55, 14, 4, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:57', '2022-07-04 03:17:57'),
(56, 14, 5, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:17:57', '2022-07-04 03:17:57'),
(57, 15, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:15', '2022-07-04 03:18:15'),
(58, 15, 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:15', '2022-07-04 03:18:15'),
(59, 15, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:15', '2022-07-04 03:18:15'),
(60, 15, 4, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:15', '2022-07-04 03:18:15'),
(61, 15, 5, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:15', '2022-07-04 03:18:15'),
(62, 16, 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:31', '2022-07-04 03:18:31'),
(63, 16, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:31', '2022-07-04 03:18:31'),
(64, 16, 3, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:31', '2022-07-04 03:18:31'),
(65, 16, 4, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:31', '2022-07-04 03:18:31'),
(66, 16, 5, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:31', '2022-07-04 03:18:31'),
(67, 17, 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:53', '2022-07-04 03:18:53'),
(68, 17, 4, 1, NULL, NULL, NULL, NULL, NULL, '2022-07-04 03:18:53', '2022-07-04 03:18:53'),
(69, 18, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:14', '2023-02-01 10:10:14'),
(70, 18, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:14', '2023-02-01 10:10:14'),
(71, 18, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:14', '2023-02-01 10:10:14'),
(72, 18, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:14', '2023-02-01 10:10:14'),
(73, 18, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:14', '2023-02-01 10:10:14'),
(74, 19, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:28', '2023-02-01 10:10:28'),
(75, 19, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:28', '2023-02-01 10:10:28'),
(76, 19, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:28', '2023-02-01 10:10:28'),
(77, 19, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:28', '2023-02-01 10:10:28'),
(78, 19, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:28', '2023-02-01 10:10:28'),
(79, 20, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:45', '2023-02-01 10:10:45'),
(80, 20, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:45', '2023-02-01 10:10:45'),
(81, 20, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:45', '2023-02-01 10:10:45'),
(82, 20, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:45', '2023-02-01 10:10:45'),
(83, 20, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:10:45', '2023-02-01 10:10:45'),
(84, 21, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:01', '2023-02-01 10:11:01'),
(85, 21, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:01', '2023-02-01 10:11:01'),
(86, 21, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:01', '2023-02-01 10:11:01'),
(87, 21, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:01', '2023-02-01 10:11:01'),
(88, 21, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:01', '2023-02-01 10:11:01'),
(89, 22, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:15', '2023-02-01 10:11:15'),
(90, 22, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:15', '2023-02-01 10:11:15'),
(91, 22, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:15', '2023-02-01 10:11:15'),
(92, 22, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:15', '2023-02-01 10:11:15'),
(93, 22, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:15', '2023-02-01 10:11:15'),
(94, 23, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:29', '2023-02-01 10:11:29'),
(95, 23, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:29', '2023-02-01 10:11:29'),
(96, 23, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:29', '2023-02-01 10:11:29'),
(97, 23, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:29', '2023-02-01 10:11:29'),
(98, 23, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:29', '2023-02-01 10:11:29'),
(99, 24, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:41', '2023-02-01 10:11:41'),
(100, 24, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:41', '2023-02-01 10:11:41'),
(101, 24, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:41', '2023-02-01 10:11:41'),
(102, 24, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:41', '2023-02-01 10:11:41'),
(103, 24, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:41', '2023-02-01 10:11:41'),
(104, 25, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:56', '2023-02-01 10:11:56'),
(105, 25, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:56', '2023-02-01 10:11:56'),
(106, 25, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:56', '2023-02-01 10:11:56'),
(107, 25, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:56', '2023-02-01 10:11:56'),
(108, 25, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:11:56', '2023-02-01 10:11:56'),
(109, 26, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:10', '2023-02-01 10:12:10'),
(110, 26, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:10', '2023-02-01 10:12:10'),
(111, 26, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:10', '2023-02-01 10:12:10'),
(112, 26, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:10', '2023-02-01 10:12:10'),
(113, 26, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:10', '2023-02-01 10:12:10'),
(114, 27, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:26', '2023-02-01 10:12:26'),
(115, 27, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:26', '2023-02-01 10:12:26'),
(116, 27, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:26', '2023-02-01 10:12:26'),
(117, 27, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:26', '2023-02-01 10:12:26'),
(118, 27, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:26', '2023-02-01 10:12:26'),
(119, 28, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:38', '2023-02-01 10:12:38'),
(120, 28, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:38', '2023-02-01 10:12:38'),
(121, 28, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:38', '2023-02-01 10:12:38'),
(122, 28, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:38', '2023-02-01 10:12:38'),
(123, 28, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:38', '2023-02-01 10:12:38'),
(124, 29, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:51', '2023-02-01 10:12:51'),
(125, 29, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:51', '2023-02-01 10:12:51'),
(126, 29, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:51', '2023-02-01 10:12:51'),
(127, 29, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:51', '2023-02-01 10:12:51'),
(128, 29, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:12:51', '2023-02-01 10:12:51'),
(129, 30, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:06', '2023-02-01 10:13:06'),
(130, 30, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:06', '2023-02-01 10:13:06'),
(131, 30, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:06', '2023-02-01 10:13:06'),
(132, 30, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:06', '2023-02-01 10:13:06'),
(133, 30, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:06', '2023-02-01 10:13:06'),
(134, 31, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:24', '2023-02-01 10:13:24'),
(135, 31, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:24', '2023-02-01 10:13:24'),
(136, 31, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:24', '2023-02-01 10:13:24'),
(137, 31, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:24', '2023-02-01 10:13:24'),
(138, 31, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:24', '2023-02-01 10:13:24'),
(139, 32, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:37', '2023-02-01 10:13:37'),
(140, 32, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:37', '2023-02-01 10:13:37'),
(141, 32, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:37', '2023-02-01 10:13:37'),
(142, 32, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:37', '2023-02-01 10:13:37'),
(143, 32, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:37', '2023-02-01 10:13:37'),
(144, 33, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:50', '2023-02-01 10:13:50'),
(145, 33, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:50', '2023-02-01 10:13:50'),
(146, 33, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:50', '2023-02-01 10:13:50'),
(147, 33, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:50', '2023-02-01 10:13:50'),
(148, 33, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:13:50', '2023-02-01 10:13:50'),
(149, 34, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:01', '2023-02-01 10:14:01'),
(150, 34, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:01', '2023-02-01 10:14:01'),
(151, 34, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:01', '2023-02-01 10:14:01'),
(152, 34, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:01', '2023-02-01 10:14:01'),
(153, 34, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:01', '2023-02-01 10:14:01'),
(154, 35, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:15', '2023-02-01 10:14:15'),
(155, 35, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:15', '2023-02-01 10:14:15'),
(156, 35, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:15', '2023-02-01 10:14:15'),
(157, 35, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:15', '2023-02-01 10:14:15'),
(158, 35, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:15', '2023-02-01 10:14:15'),
(159, 36, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:30', '2023-02-01 10:14:30'),
(160, 36, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:30', '2023-02-01 10:14:30'),
(161, 36, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:30', '2023-02-01 10:14:30'),
(162, 36, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:30', '2023-02-01 10:14:30'),
(163, 36, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:30', '2023-02-01 10:14:30'),
(164, 37, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:43', '2023-02-01 10:14:43'),
(165, 37, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:43', '2023-02-01 10:14:43'),
(166, 37, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:43', '2023-02-01 10:14:43'),
(167, 37, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:43', '2023-02-01 10:14:43'),
(168, 37, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:43', '2023-02-01 10:14:43'),
(169, 38, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:57', '2023-02-01 10:14:57'),
(170, 38, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:57', '2023-02-01 10:14:57'),
(171, 38, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:57', '2023-02-01 10:14:57'),
(172, 38, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:57', '2023-02-01 10:14:57'),
(173, 38, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:14:57', '2023-02-01 10:14:57'),
(174, 39, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:12', '2023-02-01 10:15:12'),
(175, 39, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:12', '2023-02-01 10:15:12'),
(176, 39, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:12', '2023-02-01 10:15:12'),
(177, 39, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:12', '2023-02-01 10:15:12'),
(178, 39, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:12', '2023-02-01 10:15:12'),
(179, 40, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:28', '2023-02-01 10:15:28'),
(180, 40, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:28', '2023-02-01 10:15:28'),
(181, 40, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:28', '2023-02-01 10:15:28'),
(182, 40, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:28', '2023-02-01 10:15:28'),
(183, 40, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:28', '2023-02-01 10:15:28'),
(184, 41, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:42', '2023-02-01 10:15:42'),
(185, 41, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:42', '2023-02-01 10:15:42'),
(186, 41, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:42', '2023-02-01 10:15:42'),
(187, 41, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:42', '2023-02-01 10:15:42'),
(188, 41, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:15:42', '2023-02-01 10:15:42'),
(189, 42, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:17', '2023-02-01 10:16:17'),
(190, 42, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:17', '2023-02-01 10:16:17'),
(191, 42, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:17', '2023-02-01 10:16:17'),
(192, 42, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:17', '2023-02-01 10:16:17'),
(193, 42, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:17', '2023-02-01 10:16:17'),
(194, 43, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:31', '2023-02-01 10:16:31'),
(195, 43, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:31', '2023-02-01 10:16:31'),
(196, 43, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:31', '2023-02-01 10:16:31'),
(197, 43, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:31', '2023-02-01 10:16:31'),
(198, 43, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:31', '2023-02-01 10:16:31'),
(199, 44, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:43', '2023-02-01 10:16:43'),
(200, 44, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:43', '2023-02-01 10:16:43'),
(201, 44, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:43', '2023-02-01 10:16:43'),
(202, 44, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:43', '2023-02-01 10:16:43'),
(203, 44, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:43', '2023-02-01 10:16:43'),
(204, 45, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:55', '2023-02-01 10:16:55'),
(205, 45, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:55', '2023-02-01 10:16:55'),
(206, 45, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:55', '2023-02-01 10:16:55'),
(207, 45, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:55', '2023-02-01 10:16:55'),
(208, 45, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:16:55', '2023-02-01 10:16:55'),
(209, 46, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:07', '2023-02-01 10:17:07'),
(210, 46, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:07', '2023-02-01 10:17:07'),
(211, 46, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:07', '2023-02-01 10:17:07'),
(212, 46, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:07', '2023-02-01 10:17:07'),
(213, 46, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:07', '2023-02-01 10:17:07'),
(214, 47, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:19', '2023-02-01 10:17:19'),
(215, 47, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:19', '2023-02-01 10:17:19'),
(216, 47, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:19', '2023-02-01 10:17:19'),
(217, 47, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:19', '2023-02-01 10:17:19'),
(218, 47, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:19', '2023-02-01 10:17:19'),
(219, 48, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:33', '2023-02-01 10:17:33'),
(220, 48, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:33', '2023-02-01 10:17:33'),
(221, 48, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:33', '2023-02-01 10:17:33'),
(222, 48, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:33', '2023-02-01 10:17:33'),
(223, 48, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:33', '2023-02-01 10:17:33'),
(224, 49, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:45', '2023-02-01 10:17:45'),
(225, 49, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:45', '2023-02-01 10:17:45'),
(226, 49, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:45', '2023-02-01 10:17:45'),
(227, 49, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:45', '2023-02-01 10:17:45'),
(228, 49, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:45', '2023-02-01 10:17:45'),
(229, 50, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:59', '2023-02-01 10:17:59'),
(230, 50, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:59', '2023-02-01 10:17:59'),
(231, 50, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:59', '2023-02-01 10:17:59'),
(232, 50, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:59', '2023-02-01 10:17:59'),
(233, 50, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:17:59', '2023-02-01 10:17:59'),
(234, 51, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:25:19', '2023-02-01 10:25:19'),
(235, 51, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:25:19', '2023-02-01 10:25:19'),
(236, 51, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:25:19', '2023-02-01 10:25:19'),
(237, 51, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:25:19', '2023-02-01 10:25:19'),
(238, 51, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:25:19', '2023-02-01 10:25:19'),
(239, 52, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:25:41', '2023-02-01 10:25:41'),
(240, 52, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:25:41', '2023-02-01 10:25:41'),
(241, 53, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:00', '2023-02-01 10:26:00'),
(242, 53, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:00', '2023-02-01 10:26:00'),
(243, 54, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:18', '2023-02-01 10:26:18'),
(244, 54, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:18', '2023-02-01 10:26:18'),
(245, 54, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:18', '2023-02-01 10:26:18'),
(246, 54, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:18', '2023-02-01 10:26:18'),
(247, 54, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:18', '2023-02-01 10:26:18'),
(248, 55, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:37', '2023-02-01 10:26:37'),
(249, 55, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:37', '2023-02-01 10:26:37'),
(250, 55, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:37', '2023-02-01 10:26:37'),
(251, 55, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:37', '2023-02-01 10:26:37'),
(252, 55, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:37', '2023-02-01 10:26:37'),
(253, 56, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:54', '2023-02-01 10:26:54'),
(254, 56, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:54', '2023-02-01 10:26:54'),
(255, 56, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:54', '2023-02-01 10:26:54'),
(256, 56, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:54', '2023-02-01 10:26:54'),
(257, 56, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:26:54', '2023-02-01 10:26:54'),
(258, 57, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:27:10', '2023-02-01 10:27:10'),
(259, 57, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:27:10', '2023-02-01 10:27:10'),
(260, 57, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:27:10', '2023-02-01 10:27:10'),
(261, 57, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:27:10', '2023-02-01 10:27:10'),
(262, 57, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:27:10', '2023-02-01 10:27:10'),
(263, 58, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:27:30', '2023-02-01 10:27:30'),
(264, 59, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:27:47', '2023-02-01 10:27:47'),
(265, 59, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:27:47', '2023-02-01 10:27:47'),
(266, 59, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:27:47', '2023-02-01 10:27:47'),
(267, 59, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:27:47', '2023-02-01 10:27:47'),
(268, 59, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:27:47', '2023-02-01 10:27:47'),
(269, 60, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:05', '2023-02-01 10:28:05'),
(270, 60, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:05', '2023-02-01 10:28:05'),
(271, 60, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:05', '2023-02-01 10:28:05'),
(272, 60, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:05', '2023-02-01 10:28:05'),
(273, 60, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:05', '2023-02-01 10:28:05'),
(274, 61, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:23', '2023-02-01 10:28:23'),
(275, 61, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:23', '2023-02-01 10:28:23'),
(276, 61, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:23', '2023-02-01 10:28:23'),
(277, 61, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:23', '2023-02-01 10:28:23'),
(278, 61, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:23', '2023-02-01 10:28:23'),
(279, 62, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:39', '2023-02-01 10:28:39'),
(280, 62, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:39', '2023-02-01 10:28:39'),
(281, 62, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:39', '2023-02-01 10:28:39'),
(282, 62, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:39', '2023-02-01 10:28:39'),
(283, 62, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:28:39', '2023-02-01 10:28:39'),
(284, 63, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:00', '2023-02-01 10:29:00'),
(285, 63, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:00', '2023-02-01 10:29:00'),
(286, 63, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:00', '2023-02-01 10:29:00'),
(287, 63, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:00', '2023-02-01 10:29:00'),
(288, 63, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:00', '2023-02-01 10:29:00'),
(289, 64, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:13', '2023-02-01 10:29:13'),
(290, 64, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:13', '2023-02-01 10:29:13'),
(291, 64, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:13', '2023-02-01 10:29:13'),
(292, 64, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:13', '2023-02-01 10:29:13'),
(293, 64, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:13', '2023-02-01 10:29:13'),
(294, 65, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:31', '2023-02-01 10:29:31'),
(295, 65, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:31', '2023-02-01 10:29:31'),
(296, 65, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:31', '2023-02-01 10:29:31'),
(297, 65, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:31', '2023-02-01 10:29:31'),
(298, 65, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:31', '2023-02-01 10:29:31'),
(299, 66, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:47', '2023-02-01 10:29:47'),
(300, 66, 2, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:47', '2023-02-01 10:29:47'),
(301, 66, 3, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:47', '2023-02-01 10:29:47'),
(302, 66, 4, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:47', '2023-02-01 10:29:47'),
(303, 66, 5, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:29:47', '2023-02-01 10:29:47'),
(304, 67, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:35:23', '2023-02-01 10:35:23');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_100000_create_password_resets_table', 1),
(2, '2016_06_01_000001_create_oauth_auth_codes_table', 1),
(3, '2016_06_01_000002_create_oauth_access_tokens_table', 1),
(4, '2016_06_01_000003_create_oauth_refresh_tokens_table', 1),
(5, '2016_06_01_000004_create_oauth_clients_table', 1),
(6, '2016_06_01_000005_create_oauth_personal_access_clients_table', 1),
(7, '2019_08_19_000000_create_failed_jobs_table', 1),
(8, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(9, '2022_03_23_111352_create_roles_table', 1),
(10, '2022_03_23_111353_create_menus_table', 1),
(11, '2022_03_23_111354_create_permissions_table', 1),
(12, '2022_03_23_111355_create_role_menu_permissions_table', 1),
(13, '2022_03_23_111356_create_genders_table', 1),
(14, '2022_03_23_111357_create_blood_groups_table', 1),
(15, '2022_03_23_111358_create_religions_table', 1),
(16, '2022_03_23_111359_create_users_table', 1),
(17, '2022_03_23_111400_create_user_menu_permissions_table', 1),
(18, '2022_03_23_111401_create_menu_permissions_table', 1),
(19, '2022_03_23_111402_create_contacts_table', 1),
(20, '2022_03_23_111403_create_sliders_table', 1),
(21, '2022_03_23_111404_create_section_design_types_table', 1),
(22, '2022_03_23_111405_create_home_sections_table', 1),
(23, '2022_03_23_111406_create_settings_table', 1),
(24, '2022_03_23_111407_create_categories_table', 1),
(25, '2022_03_23_111408_create_galleries_table', 1),
(26, '2022_03_23_111409_create_gallery_items_table', 1),
(27, '2022_03_23_111410_create_p_menus_table', 1),
(28, '2022_03_23_111411_create_menu_items_table', 1),
(29, '2022_03_23_111412_create_widgets_table', 1),
(30, '2022_03_23_111413_create_blogs_table', 1),
(31, '2022_03_23_111414_create_pages_table', 1),
(32, '2022_03_23_111415_create_faqs_table', 1),
(33, '2022_03_27_102517_create_designations_table', 1),
(34, '2022_03_27_102518_create_marital_statuses_table', 1),
(35, '2022_03_27_102519_create_employees_table', 1),
(36, '2022_03_27_102520_create_parents_table', 1),
(37, '2022_03_27_102521_create_students_table', 1),
(38, '2022_03_27_102522_create_siblings_table', 1),
(39, '2022_03_27_102523_create_work_experiences_table', 1),
(40, '2022_03_27_102524_create_employee_qualifications_table', 1),
(41, '2022_03_28_104014_create_course_types_table', 2),
(42, '2022_03_28_104015_create_courses_table', 2),
(43, '2022_03_28_104016_create_course_categories_table', 2),
(44, '2022_03_28_104017_create_course_schedules_table', 2),
(45, '2022_03_28_104018_create_student_courses_table', 2),
(46, '2022_03_28_104019_create_course_materials_table', 2),
(47, '2022_03_28_104020_create_home_works_table', 2),
(48, '2022_03_28_104021_create_student_home_works_table', 2),
(49, '2022_03_28_104022_create_course_reviews_table', 2),
(50, '2022_03_28_104023_create_course_ratings_table', 2),
(51, '2022_03_28_104024_create_course_employee_table', 2),
(52, '2022_03_28_104025_create_course_category_course_schedule_table', 2),
(53, '2022_05_30_061653_create_course_course_category_table', 3),
(54, '2022_06_02_054605_add_image_level_to_courses_table', 3),
(55, '2022_06_04_121301_create_pre_users_table', 4),
(56, '2022_06_04_123442_add_status_to_users_table', 4),
(57, '2022_06_05_073642_create_testimonials_table', 5),
(58, '2022_06_05_101016_create_promotions_table', 5),
(59, '2022_06_12_080819_create_coupons_table', 6),
(60, '2022_06_12_084741_create_carts_table', 6),
(61, '2022_06_12_084817_create_cart_course_table', 6),
(62, '2022_07_04_045014_create_attendance_statuses_table', 6),
(63, '2022_07_04_045037_create_attendance_students_table', 6),
(64, '2022_07_07_040030_create_question_banks_table', 7),
(65, '2022_07_07_040031_create_exams_table', 7),
(66, '2022_07_07_040032_create_exam_questions_table', 7),
(67, '2022_07_07_040033_create_student_answers_table', 7),
(68, '0000_00_00_000000_create_websockets_statistics_entries_table', 8),
(69, '2022_08_23_031633_create_course_schedule_cancels_table', 8),
(70, '2022_09_08_062322_create_contact_us_table', 9),
(71, '2022_09_08_092510_create_sat_sections_table', 9),
(72, '2022_09_08_092528_create_sat_scores_table', 9),
(73, '2022_09_11_055735_create_s_m_s_table', 9),
(74, '2022_09_11_055736_create_emails_table', 9),
(75, '2022_09_11_055737_create_push_notifications_table', 9),
(76, '2022_09_13_045438_create_employee_workings_table', 9),
(77, '2022_09_13_045439_create_employee_over_times_table', 9),
(78, '2022_09_13_045440_create_employee_payments_table', 9),
(79, '2022_09_13_045441_create_employee_payment_employee_working_table', 9),
(80, '2022_09_13_045442_create_employee_over_time_employee_payment_table', 9),
(81, '2022_09_14_050514_create_complains_table', 9),
(82, '2022_09_21_063618_create_tutoring_requests_table', 10),
(83, '2022_09_22_065247_create_chat_groups_table', 11),
(84, '2022_09_22_065248_create_chat_files_table', 11),
(85, '2022_09_22_065249_create_chats_table', 11),
(86, '2022_09_22_065250_create_chat_group_user_table', 11),
(87, '2022_09_22_065251_create_chat_chat_file_table', 11),
(88, '2022_09_22_082149_create_chat_users_table', 11),
(89, '2022_09_27_085217_create_jobs_table', 12),
(90, '2022_09_27_085218_create_applicants_table', 12),
(91, '2022_02_09_164214_create_expense_types_table', 13),
(92, '2022_02_09_164225_create_payment_types_table', 13),
(93, '2022_02_25_114144_create_banks_table', 13),
(94, '2022_02_25_114145_create_bank_accounts_table', 13),
(95, '2022_02_25_114146_create_sub_expense_types_table', 13),
(96, '2022_02_25_114147_create_expenses_table', 13),
(97, '2022_11_12_162631_create_add_file_email_table', 13),
(98, '2022_12_25_090414_create_tutorings_table', 14),
(99, '2023_01_25_035159_create_orders_table', 15),
(100, '2023_01_25_035200_create_order_payments_table', 15);

-- --------------------------------------------------------

--
-- Table structure for table `oauth_access_tokens`
--

CREATE TABLE `oauth_access_tokens` (
  `id` varchar(100) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `scopes` text DEFAULT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_access_tokens`
--

INSERT INTO `oauth_access_tokens` (`id`, `user_id`, `client_id`, `name`, `scopes`, `revoked`, `created_at`, `updated_at`, `expires_at`) VALUES
('001db391337f50ae6c5a05be3856efb751b0a4f2388511580336e8bc2add87a05997a2c114e36ac3', 1, 21, 'refreshToken', '[]', 0, '2023-01-02 07:24:45', '2023-01-02 07:24:45', '2023-07-02 07:24:45'),
('004372345d162cba951f18394438e9753bdaeb440d2d58873a68c2334f073e7c6aa68da328845a5e', 1, 3, 'refreshToken', '[]', 0, '2022-06-02 06:08:21', '2022-06-02 06:08:21', '2022-12-02 06:08:21'),
('005d5ec9961a638fe919a751267b536433340bbe972dae6a11acde4edbf9ef266b6881f181229ebb', 9, 21, 'authToken', '[]', 0, '2023-01-15 06:12:45', '2023-01-15 06:12:45', '2023-07-15 06:12:45'),
('014e0031f2b972ed05085bc7b4c4920d804911b81c2c4d12055329d05cb76fa4e3fc6051139aa66d', 1, 21, 'authToken', '[]', 0, '2023-01-30 07:54:05', '2023-01-30 07:54:05', '2023-07-30 07:54:05'),
('017b22621bb66f9f91e1a6a8d41c2ada238532a3ca5199fd85e6fc7813e8fe7d35aa6a61d5b7e029', 60, 21, 'authToken', '[]', 0, '2023-01-19 09:33:40', '2023-01-19 09:33:40', '2023-07-19 09:33:40'),
('019dad91b2e1ab610d2a0666e92738b89bb570b146d133d4ae7d7fc265a94ab5c515cc16ab4801ba', 67, 21, 'authToken', '[]', 0, '2023-01-22 13:32:47', '2023-01-22 13:32:47', '2023-07-22 13:32:47'),
('01c181c73b89148e44dacb47d9b08e3de7b24c951506b49f9c65de41f54306a634ee193716703351', 60, 21, 'authToken', '[]', 0, '2023-01-25 04:55:18', '2023-01-25 04:55:18', '2023-07-25 04:55:18'),
('0271a9a62a453d749dbfef7ed8eca9570541947697f92a4acfd561f68a225c246652c29a7917e469', 1, 21, 'refreshToken', '[]', 0, '2023-01-17 00:51:47', '2023-01-17 00:51:47', '2023-07-17 00:51:47'),
('02ee7b0ba5b2bea5abbfa2ab343a1e1b1d14a5df92787d7f597b959c25a2ef54bfdf4611e8dc2181', 9, 21, 'authToken', '[]', 0, '2023-01-04 16:36:56', '2023-01-04 16:36:56', '2023-07-04 16:36:56'),
('03871735c4ec8e20e995f0e1c86059428434c10c3992e5b63912173fa489b68f908690903244dad0', 1, 21, 'refreshToken', '[]', 0, '2022-12-17 09:53:18', '2022-12-17 09:53:18', '2023-06-17 09:53:18'),
('0418e5e35d837c3333b79091679bb5ed3e5317657571b94a5cbab796e604bc0accb99cbf7fb03d73', 58, 21, 'refreshToken', '[]', 0, '2023-01-22 11:34:23', '2023-01-22 11:34:23', '2023-07-22 11:34:23'),
('0499ccb9c28419b4be8c1c73fd95e17f5cb7a1a2d838aa0a06a2ad120763bfaf5a5f8f8231c8c856', 1, 1, 'authToken', '[]', 0, '2022-05-08 02:04:27', '2022-05-08 02:04:27', '2022-11-08 08:04:27'),
('04f2de969339e4683d57496397e6027de1630404f3d4ff7c97aee442a2ef3c2abf10698f8b04b526', 1, 3, 'authToken', '[]', 0, '2022-06-01 04:28:05', '2022-06-01 04:28:05', '2022-12-01 04:28:05'),
('050ee80652e2f28de00ef5ec975f4ef95616ad3ed2e701d18698b62f00e0ddeb2a7fda3935a0e125', 9, 21, 'refreshToken', '[]', 0, '2023-01-15 06:12:45', '2023-01-15 06:12:45', '2023-07-15 06:12:45'),
('0543dba965656afb2b14aea29d091ce6d31a9bce16606e49ff103b347f2813d5727873ee6fca03cc', 68, 21, 'refreshToken', '[]', 0, '2023-01-29 01:20:10', '2023-01-29 01:20:10', '2023-07-29 01:20:10'),
('05471534d5b2f2eea13604bbc242a57a87efadf04871bbee06dd280d476df4c96d9ff3530292d134', 58, 21, 'authToken', '[]', 0, '2023-01-30 04:25:19', '2023-01-30 04:25:19', '2023-07-30 04:25:19'),
('054e1c142ada6d51c0dde1eea9e7f513fd3ee52d909dbd5c96cf6f1e410e7730d638ffb9305f285f', 1, 3, 'refreshToken', '[]', 0, '2022-10-02 15:52:53', '2022-10-02 15:52:53', '2023-04-02 15:52:53'),
('05a1e504bf41b7556eac56b4ea26f0c465bf30ff0cb6f41985d401af303a50a633d2600a3824a759', 1, 21, 'authToken', '[]', 0, '2023-01-12 00:53:16', '2023-01-12 00:53:16', '2023-07-12 00:53:16'),
('05d34d647a7fa06b98741578d59d69207a14dd405d9f4a8eafdef1587d09d60aaa791f22d0c9b9dd', 67, 21, 'refreshToken', '[]', 0, '2023-01-25 05:05:33', '2023-01-25 05:05:33', '2023-07-25 05:05:33'),
('0613b0bb0fbcd5c1d2a14fc89e17f90bcba932597e9305d0c27cd07b4910b904e7e184f229b03fba', 65, 21, 'refreshToken', '[]', 0, '2023-01-14 12:51:42', '2023-01-14 12:51:42', '2023-07-14 12:51:42'),
('063c742d3da8cef3ae5548ad0a1b0d4c766da7e2151c7ac512474a9227e6e2f2b3465d0bb8a4a5ad', 33, 21, 'refreshToken', '[]', 0, '2023-01-05 09:53:48', '2023-01-05 09:53:48', '2023-07-05 09:53:48'),
('067c4db285b1d6212e3e55cafe94d8c9a1eaf60f21ddf0c13db7cc7b01304152443fd3a03266c750', 1, 3, 'refreshToken', '[]', 0, '2022-10-02 11:19:51', '2022-10-02 11:19:51', '2023-04-02 11:19:51'),
('069963cd41552190acbfd415ccafcf5359608ae2a1358de4fd8fa9f4be608e6e43cdcb5230c0d1b2', 33, 21, 'authToken', '[]', 0, '2023-01-08 11:47:47', '2023-01-08 11:47:47', '2023-07-08 11:47:47'),
('06e880aa9e8b6d11163c070b9ba91542f2bc6a19959c7e23396571a1bf73c6ba436fdbd8d5649c32', 36, 21, 'authToken', '[]', 0, '2023-01-04 09:18:37', '2023-01-04 09:18:37', '2023-07-04 09:18:37'),
('06f010f3d50905c6478fd1288b682512d35227d49746f1f0ba1e70212c89e4906bd585757b853c67', 1, 3, 'authToken', '[]', 0, '2022-05-24 10:48:30', '2022-05-24 10:48:30', '2022-11-24 10:48:30'),
('06f16c0b1bb2f2c650c4ae7dcfd124a9a15dc470c6c3f905e4fdf2a12ac8fccf48aea1825f3a0f94', 1, 3, 'refreshToken', '[]', 0, '2022-06-16 12:35:17', '2022-06-16 12:35:17', '2022-12-16 12:35:17'),
('070255676891500572602a9d1de1ac1d9393860da72133045fd6966eef4673f0b1620fca1f4e7b7a', 9, 3, 'authToken', '[]', 0, '2022-10-02 19:31:40', '2022-10-02 19:31:40', '2023-04-02 19:31:40'),
('0751984259c7974724dd68fef6ecd286c300ac5ae67ea5d8ec4166beb9ef52c7b80ad01ccda166b4', 1, 1, 'authToken', '[]', 0, '2022-04-02 23:25:53', '2022-04-02 23:25:53', '2022-10-03 05:25:53'),
('07b576bbcce8fbf317c10fdb78c3581c0dfe13c75b4bbefe468573eb24a2851e4bfc345b391a3c8f', 1, 21, 'refreshToken', '[]', 0, '2022-12-19 19:03:10', '2022-12-19 19:03:10', '2023-06-19 19:03:10'),
('07b5a32d0d4130efef2a2eec8d4f019299e78b025ca965a299b269f0f1e10faa12d6a8e7501b7ad1', 1, 21, 'authToken', '[]', 0, '2022-12-22 14:37:01', '2022-12-22 14:37:01', '2023-06-22 14:37:01'),
('08053c82f579d822baef74e869356aec5dcab683c56ce40a2fa75712065b62bb708c7efd8e8fe0ad', 1, 3, 'authToken', '[]', 0, '2022-10-02 15:52:53', '2022-10-02 15:52:53', '2023-04-02 15:52:53'),
('0855a6b4153ee73a4dff28bccc0549c06d57ea37d0c4397a4e87a1ee70910d4e2fc8294af9591b51', 1, 19, 'refreshToken', '[]', 0, '2022-11-13 16:33:12', '2022-11-13 16:33:12', '2023-05-13 16:33:12'),
('087f1f9441eeb1b9229208bc65bd5cdeaea579528cd1ccad153ec786d6522754360514410e91376a', 1, 21, 'refreshToken', '[]', 0, '2023-01-12 01:02:49', '2023-01-12 01:02:49', '2023-07-12 01:02:49'),
('08c7a260b449dd8c33ee28c6fc452f1378f848116d9a752a7964af58338f0e86dcca43e78eb8df57', 60, 21, 'refreshToken', '[]', 0, '2023-01-12 00:47:17', '2023-01-12 00:47:17', '2023-07-12 00:47:17'),
('091d39facede6d09648885df65601b78374f675488efe0c5164ba9472edd0a35d9746741844fb31e', 75, 21, 'refreshToken', '[]', 0, '2023-02-05 00:46:32', '2023-02-05 00:46:32', '2023-08-05 00:46:32'),
('097c92fb8739503082d9f053d55a0083482ce640cdf431731585ccb13401e66afacc82665b134a44', 1, 3, 'refreshToken', '[]', 0, '2022-07-16 06:15:36', '2022-07-16 06:15:36', '2023-01-16 06:15:36'),
('0992b0822389daecc997fc20bf6a612a819aaee09da5a01c81be9cea448b49fc3e9b5f82cf5efdcd', 1, 3, 'refreshToken', '[]', 0, '2022-08-24 07:22:04', '2022-08-24 07:22:04', '2023-02-24 07:22:04'),
('09cb907741f8cb80b4b4ab9089579c595ef55f53ba6d3a0b3ab1135b9a530e658a17911bfb2bbb4c', 1, 3, 'authToken', '[]', 0, '2022-06-08 09:08:40', '2022-06-08 09:08:40', '2022-12-08 09:08:40'),
('0a1b06f5c20b9e770485df52de50ba51709acf5057b8764153628d2a88f2746c8864539e9303f0e1', 1, 3, 'authToken', '[]', 0, '2022-06-05 15:52:47', '2022-06-05 15:52:47', '2022-12-05 15:52:47'),
('0a4669c4f3530485f0a6a1a58c835470fcb6eba814843951b8160fa31d37d036ded0cd4143356d8f', 3, 3, 'authToken', '[]', 0, '2022-09-25 12:08:08', '2022-09-25 12:08:08', '2023-03-25 12:08:08'),
('0aeb986cf3483781e974d26eb2a5fe0f1b931b0961d8af1226db9ea450ab2e136b0761cdfe6aa990', 1, 21, 'authToken', '[]', 0, '2023-01-22 11:33:55', '2023-01-22 11:33:55', '2023-07-22 11:33:55'),
('0b34bc2f9d8e56d6d2fd3921b00fe8c534d3361fd90eec43e2425d936e6f72f2b9a78ca7f4e07a5b', 1, 21, 'authToken', '[]', 0, '2022-12-17 09:17:41', '2022-12-17 09:17:41', '2023-06-17 09:17:41'),
('0b3b46213ce8f19886bcc9af7dfdd0911616e94d653e451e05a65b0d1fb4242b421014e3344baf0c', 67, 21, 'refreshToken', '[]', 0, '2023-01-22 13:46:31', '2023-01-22 13:46:31', '2023-07-22 13:46:31'),
('0ba2c2213fad0b68c2ad101e898c9bf18e7d5bf4de5ca3e4d668d1cf71d603c03cb1634f64cba218', 3, 19, 'authToken', '[]', 0, '2022-11-13 17:59:18', '2022-11-13 17:59:18', '2023-05-13 17:59:18'),
('0cb88ecda48e7f9a87b79bc6ffda832287a8f5d69700ca2cb439a02208bb3c7b61ec193bb992ca5e', 68, 21, 'refreshToken', '[]', 0, '2023-01-29 12:59:47', '2023-01-29 12:59:47', '2023-07-29 12:59:47'),
('0dbc7c0b3426da8525c520c409c6150d00aefb494863cc9e228bf8a62f42f174bc321187a3ca1c96', 1, 3, 'authToken', '[]', 0, '2022-06-02 06:08:21', '2022-06-02 06:08:21', '2022-12-02 06:08:21'),
('0e3867582928d05d10647838fdfffdd6631f5a329b7d946a31ba522508123b5227cc39a9d38e4a1a', 1, 21, 'authToken', '[]', 0, '2023-01-10 08:11:37', '2023-01-10 08:11:37', '2023-07-10 08:11:37'),
('0e4e1d23eb3f2ac2e62d84ef3eedf03008063d9a1ece7071980eda9b3c9783535e01ca1a01db4e76', 66, 21, 'refreshToken', '[]', 0, '2023-01-21 12:15:18', '2023-01-21 12:15:18', '2023-07-21 12:15:18'),
('0f659046284c09d31deff8ec9a9af2ed4864dd0a3051fd357bf78ae6712c969c3a8de020138df660', 1, 21, 'authToken', '[]', 0, '2023-01-03 11:27:31', '2023-01-03 11:27:31', '2023-07-03 11:27:31'),
('0fc8e5faeca9520ca992541338e6baf88c335c9eb9f61620444a54b569d1064208b0d948eaca19c3', 1, 3, 'authToken', '[]', 0, '2022-06-19 08:55:36', '2022-06-19 08:55:36', '2022-12-19 08:55:36'),
('0ffa1e99464a4f15427217343750227acf487b5c703638e773fb2e52a9b860802ae562fd61a73d3f', 1, 3, 'refreshToken', '[]', 0, '2022-06-19 14:52:52', '2022-06-19 14:52:52', '2022-12-19 14:52:52'),
('104e9dc77f0e6eec35c8d02b7d9d175684eafb4f32021b00b7f1955a4e56735bb180801dcfcd77c2', 1, 3, 'authToken', '[]', 0, '2022-06-14 04:59:30', '2022-06-14 04:59:30', '2022-12-14 04:59:30'),
('107c30eff4036b869d5ef7cb55775997faf29a485b1125a53be7827ffdbaeab7fe7add7805f4ecfc', 75, 21, 'authToken', '[]', 0, '2023-02-02 07:58:20', '2023-02-02 07:58:20', '2023-08-02 07:58:20'),
('10ccedf7a0467d09eee3ff32e11fd8e5ceb9280f404ce479bc5eb3727878e28f97238694044a3004', 3, 3, 'authToken', '[]', 0, '2022-10-02 11:42:36', '2022-10-02 11:42:36', '2023-04-02 11:42:36'),
('115d3af6c18c357d2d204003c8fab644951f90c02db3ac78e4d459ea96b2cc9af7a9c22135bbc398', 58, 21, 'refreshToken', '[]', 0, '2023-01-29 01:21:07', '2023-01-29 01:21:07', '2023-07-29 01:21:07'),
('11c8e8506da65ca5b9022170be73ec4de6f1e0c86307518c1e23c1c5c4f4aab9080e2c2df36c50b7', 7, 21, 'authToken', '[]', 0, '2023-01-04 09:44:48', '2023-01-04 09:44:48', '2023-07-04 09:44:48'),
('124ba7f64006ba9d8aab3035cc0eae747dd6b0cf7ccb215041474a367c3b36852e9cf59173b6a393', 1, 21, 'refreshToken', '[]', 0, '2023-01-14 04:21:28', '2023-01-14 04:21:28', '2023-07-14 04:21:28'),
('127ef3e16a03df86f03f43d625865cabbc4181b0538e13c7a25ad0259a5c181baa23a760fc764d64', 3, 3, 'authToken', '[]', 0, '2022-09-04 15:18:52', '2022-09-04 15:18:52', '2023-03-04 15:18:52'),
('1288e186908610656eeb8b18b78d8f4adebdd1618c85653a88652e45f7c350b7f8404f139e3d4edf', 66, 21, 'authToken', '[]', 0, '2023-01-21 12:21:39', '2023-01-21 12:21:39', '2023-07-21 12:21:39'),
('14954e0c65a4fe2339059bab29e15d9fd47b17151505bfc673c9a0ecf3c299457498878e5d16e1fb', 33, 21, 'authToken', '[]', 0, '2023-01-02 08:00:03', '2023-01-02 08:00:03', '2023-07-02 08:00:03'),
('1515afa5b5611482a43262a9f7cc264b3efb1c03df0a73d0fb13d6f9a4ccf1a38037372eeb141689', 1, 19, 'refreshToken', '[]', 0, '2022-11-12 16:57:44', '2022-11-12 16:57:44', '2023-05-12 16:57:44'),
('15f9da3e5275ac47d3d1a7eb7c4c14f6bed338d085069ca1b9c7523d9687a04696bdce3bb9ac537d', 16, 21, 'authToken', '[]', 0, '2022-12-25 15:34:54', '2022-12-25 15:34:54', '2023-06-25 15:34:54'),
('15fb05bf068834683c09d0b2002e34ddb074240bdbbea92a201ce556e74acc6a133be75d6dfeddbd', 1, 3, 'refreshToken', '[]', 0, '2022-06-19 05:09:50', '2022-06-19 05:09:50', '2022-12-19 05:09:50'),
('161b0240c6561d16842227bc136816766d28641d1c1ed79a1cbdabffaf6d1a2be2b2380f52deb0da', 1, 1, 'authToken', '[]', 0, '2022-05-07 22:42:19', '2022-05-07 22:42:19', '2022-11-08 04:42:19'),
('164a3db035b652dad9194ed3abf424f33970d72efa0a2d1325e59988d615c93a26b6236013b4b8e0', 1, 3, 'refreshToken', '[]', 0, '2022-09-08 04:51:32', '2022-09-08 04:51:32', '2023-03-08 04:51:32'),
('16613e4872331d32b63b764d4037f2c83a09eba7916e5dd9800b139fcc6430ea4fc11f4a8f299590', 1, 3, 'authToken', '[]', 0, '2022-10-02 21:26:52', '2022-10-02 21:26:52', '2023-04-02 21:26:52'),
('169c265405b2c8fb36a2decfa5e884b1c762868c2b131522c9b9f58a58a296df04d373bcf5429ac3', 1, 21, 'authToken', '[]', 0, '2022-12-20 17:22:44', '2022-12-20 17:22:44', '2023-06-20 17:22:44'),
('170f53795480994d4daccbc65ff60b9395bbb9565bf66bbabf7539c26fdba6da91f261892cda8050', 7, 3, 'authToken', '[]', 0, '2022-09-04 14:34:21', '2022-09-04 14:34:21', '2023-03-04 14:34:21'),
('173406b54b987ddb8105b69ff3d669dfb7f356ca9060d5d2d70cd96f261f6b25619c1a9db563f7aa', 1, 3, 'refreshToken', '[]', 0, '2022-07-14 07:07:50', '2022-07-14 07:07:50', '2023-01-14 07:07:50'),
('176a964de80a2d2f049175aeef4da927dbf7278572438c5d6b069e1b1505ef60095560cdffa13d0f', 60, 21, 'authToken', '[]', 0, '2023-01-12 00:47:17', '2023-01-12 00:47:17', '2023-07-12 00:47:17'),
('178bd6eb9bd275fd19b0e829ccc93a8265124d8ed2c56caf95251291b22708771555be4b8f2c3112', 67, 21, 'refreshToken', '[]', 0, '2023-01-22 13:32:47', '2023-01-22 13:32:47', '2023-07-22 13:32:47'),
('17cd0467bf7878fbb88f7427f26f9b7707ee3e7e96aef68dc652cafbb1e6ef13cf384d9552e8cca5', 4, 3, 'refreshToken', '[]', 0, '2022-06-02 09:35:33', '2022-06-02 09:35:33', '2022-12-02 09:35:33'),
('17dd226a619aaad9515faf7ed1ac623c01636a2522056083b7bb96875c11ad8b96526ff98ca1ae5d', 1, 21, 'authToken', '[]', 0, '2023-01-02 07:24:45', '2023-01-02 07:24:45', '2023-07-02 07:24:45'),
('17e79bd668ede0386b820b84e45ba07fe3d6159f63608f43674f4d99c2c6e65597d308fbd27ce075', 1, 3, 'refreshToken', '[]', 0, '2022-09-19 12:51:30', '2022-09-19 12:51:30', '2023-03-19 12:51:30'),
('184682730f213aeaf70fb8e2f7c7cd4b5751f6da668746a44cec7e29e5ecdbba12aab08885f8c5c2', 1, 3, 'authToken', '[]', 0, '2022-06-19 05:09:50', '2022-06-19 05:09:50', '2022-12-19 05:09:50'),
('188047447bbf7ea63aebd701f1dab4c3f1f736052ebf398127c6b8baa9315af19d67655e12326a4e', 66, 21, 'authToken', '[]', 0, '2023-01-21 13:16:47', '2023-01-21 13:16:47', '2023-07-21 13:16:47'),
('18c1dfc1250ae2315c849181a5774060ac7c419b03385ae387be493ba919435b9252d60d7ea3a195', 1, 3, 'refreshToken', '[]', 0, '2022-06-26 14:32:07', '2022-06-26 14:32:07', '2022-12-26 14:32:07'),
('190cb9c6677fbd062e8d55c55db7ecfd87a39597474489cb513345e4958d61fa31ae446987f3d783', 1, 21, 'refreshToken', '[]', 0, '2023-01-29 11:50:28', '2023-01-29 11:50:28', '2023-07-29 11:50:28'),
('193c190918bdc5e7623ce405ff853bdf8017b137b15855158753955164f03915157c949d398ae237', 33, 21, 'refreshToken', '[]', 0, '2023-01-02 07:55:22', '2023-01-02 07:55:22', '2023-07-02 07:55:22'),
('195ed774a1895ec0ef0058fb6a560949e10e35111e49a09f7e3fec919798fe9e3c2c69f6ab0a44eb', 77, 21, 'refreshToken', '[]', 0, '2023-02-04 08:22:45', '2023-02-04 08:22:45', '2023-08-04 08:22:45'),
('1965da14d68b1a4b68b2c253d88c64b0eeee29ad9b3174a6cf98efe90b86a865d5b3ec2ef6fa35ef', 1, 3, 'authToken', '[]', 0, '2022-06-15 06:04:30', '2022-06-15 06:04:30', '2022-12-15 06:04:30'),
('19c7c3698de0a0fbcd40a184b65d5bf42cf67e26184c4db1d8b2a799165f06eaf818ee19e9138329', 59, 21, 'refreshToken', '[]', 0, '2023-01-29 01:30:17', '2023-01-29 01:30:17', '2023-07-29 01:30:17'),
('1aba29979869d8eec34fc6d37bc6ae5a0ef0cf5a86e56bf46d9be310810479773efdaf75afb30bb8', 1, 3, 'authToken', '[]', 0, '2022-06-21 02:18:26', '2022-06-21 02:18:26', '2022-12-21 02:18:26'),
('1ac9d2ab8498847be3a648305677d8b1b7a542ea77fc9a86fd28bac9d276ca5a58696ac9b275e46d', 21, 3, 'authToken', '[]', 0, '2022-10-02 20:43:29', '2022-10-02 20:43:29', '2023-04-02 20:43:29'),
('1acf77d0a5ea1c31e60048370e0ab0abca1d4e080b810fd0f5b0a755f939706a98de71396b16499e', 1, 21, 'authToken', '[]', 0, '2023-02-02 07:51:34', '2023-02-02 07:51:34', '2023-08-02 07:51:34'),
('1b6b5314d137caa342952c7ff0f211853480fcb610a085096fdd84a8d3bea2b67e5579ee46404cbb', 1, 1, 'authToken', '[]', 0, '2022-03-30 23:31:06', '2022-03-30 23:31:06', '2022-10-01 05:31:06'),
('1bc66d086fe8a3fd283e5a6d68ff2d945c23527077bf73dcdbf47b891f8cabfdaafd3e46d571364f', 1, 3, 'refreshToken', '[]', 0, '2022-06-19 14:49:58', '2022-06-19 14:49:58', '2022-12-19 14:49:58'),
('1c867bae789922d07a38ae54a26e51dd34d8bf621859555b16025c01063471041b6376fecee33352', 1, 3, 'authToken', '[]', 0, '2022-08-24 10:02:12', '2022-08-24 10:02:12', '2023-02-24 10:02:12'),
('1cb6b40af2fdbba7baf202de100aefdd1d5c6a64dad13af62e4a848ae378786aaca9199713c468c9', 60, 21, 'authToken', '[]', 0, '2023-01-26 11:11:25', '2023-01-26 11:11:25', '2023-07-26 11:11:25'),
('1d335396c116460767391b7fb465392ba1c072b8c1ce2d92112b3723a493e406bcb68694a396b30a', 1, 3, 'authToken', '[]', 0, '2022-08-03 04:57:59', '2022-08-03 04:57:59', '2023-02-03 04:57:59'),
('1d697c804a5a574e89420187d8aa3220ceb8e927d4411ce2970f6a01ef1fe7a9c2a853006a9fc98a', 1, 3, 'authToken', '[]', 0, '2022-10-02 19:55:53', '2022-10-02 19:55:53', '2023-04-02 19:55:53'),
('1dc00f1e30f9271930f1020902da7ae1d9d646157cd7ad770368c417877614f547f4bc1e98cdc80e', 4, 19, 'refreshToken', '[]', 0, '2022-11-13 17:26:08', '2022-11-13 17:26:08', '2023-05-13 17:26:08'),
('1de5f52060190c0598be6f90f46442600b4b0bc2c485a73098488f80d118c152257844790e0e032d', 65, 21, 'refreshToken', '[]', 0, '2023-01-21 13:05:48', '2023-01-21 13:05:48', '2023-07-21 13:05:48'),
('1eb6e41463071e4ca380fcac1c97685842bd4c6feaf364fa8527fd8902dabc35e67fe982efcec1ca', 68, 21, 'refreshToken', '[]', 0, '2023-01-29 05:59:50', '2023-01-29 05:59:50', '2023-07-29 05:59:50'),
('1f40f747a0fa22f74b16072076e6c9e7f2eaf4ee68e9a1aa63ee2eaf4c82255d94d768910fef5c44', 7, 3, 'authToken', '[]', 0, '2022-08-10 06:05:43', '2022-08-10 06:05:43', '2023-02-10 06:05:43'),
('1f6cb902df27507f076cc2ca54a93e735621fd78db7ffe7155c041e778bed64d36a19a03609ccd86', 7, 3, 'refreshToken', '[]', 0, '2022-09-04 15:15:34', '2022-09-04 15:15:34', '2023-03-04 15:15:34'),
('1fc50049929cc6268749e548cc10ea002ad2424b90e34f10da61449c36005f4675cde3efee8364ee', 1, 3, 'refreshToken', '[]', 0, '2022-10-02 20:10:21', '2022-10-02 20:10:21', '2023-04-02 20:10:21'),
('20269cadba320db89e22766a39c0f2b07e41942bc7fb3b9533a29c99fa7cbcbeb7faa106591fc1e2', 1, 3, 'authToken', '[]', 0, '2022-06-21 13:27:40', '2022-06-21 13:27:40', '2022-12-21 13:27:40'),
('2047cd437c7f7df58b13af389259e01335b83d1a95fc0a5cb262bc98c7db8a5b8677946dc28dfb9c', 1, 21, 'refreshToken', '[]', 0, '2023-01-07 17:03:47', '2023-01-07 17:03:47', '2023-07-07 17:03:47'),
('2082d898d22a0e5fc4be9e1d15b03faba7cec3157ddfe182ce6fc8a12a7166ab5360cd65ce4cae98', 16, 5, 'authToken', '[]', 0, '2022-11-06 16:08:49', '2022-11-06 16:08:49', '2023-05-06 16:08:49'),
('208c1444157fe26c3e47779d76c7bbbff0a7307b561cfa5511aeabc7716d788d5505477bf35e75ea', 1, 3, 'refreshToken', '[]', 0, '2022-07-30 11:22:50', '2022-07-30 11:22:50', '2023-01-30 11:22:50'),
('20e63dfa836e7612d3b42fafec85c34f5ac16b7d70f747b16529d318ba8038e4be08d81902905fe6', 1, 3, 'refreshToken', '[]', 0, '2022-08-23 10:23:00', '2022-08-23 10:23:00', '2023-02-23 10:23:00'),
('211b6c61e0b678aa04bf56dfcd3eef57566515783cfac9f4fa5f4698a53c9c4ee6ca091bcdecfa59', 1, 3, 'refreshToken', '[]', 0, '2022-10-02 21:26:52', '2022-10-02 21:26:52', '2023-04-02 21:26:52'),
('2159396e058535ac83a75ee2f48a5fad2f1a11752e1cd25d5e591789e411db170f8337ced55be522', 60, 21, 'refreshToken', '[]', 0, '2023-01-10 06:29:57', '2023-01-10 06:29:57', '2023-07-10 06:29:57'),
('2246c0ea4ad39990867b4fce822a57879576196505a918d89011aa27fd1aa9e73e36e2f2c3fa9897', 60, 21, 'authToken', '[]', 0, '2023-01-19 00:55:14', '2023-01-19 00:55:14', '2023-07-19 00:55:14'),
('22673cd63495c05b251e45ef1fd1a08bbc53921623037af1728e4d6316bcdd9cc73f124d42b9300e', 1, 21, 'authToken', '[]', 0, '2023-01-16 12:12:56', '2023-01-16 12:12:56', '2023-07-16 12:12:56'),
('22909f16c50cebdfa6c03b7ad69bfd376d6220a0ec1e7dfb58588a2f99254f4dfb1ff9f54175782e', 7, 3, 'refreshToken', '[]', 0, '2022-08-21 15:15:48', '2022-08-21 15:15:48', '2023-02-21 15:15:48'),
('22a21cbe1e4cd9fa954dfd99755a47ca8a77217a67dbd499848e14d52199d1e503d958a83a906030', 1, 3, 'refreshToken', '[]', 0, '2022-06-19 05:00:28', '2022-06-19 05:00:28', '2022-12-19 05:00:28'),
('22ea02ef8217ba083c9f94b25eb11b2d15292c13d906f4ec5f782a8b56c0fe50c3b21e10d96b47be', 1, 21, 'authToken', '[]', 0, '2023-02-07 13:07:39', '2023-02-07 13:07:39', '2023-08-07 13:07:39'),
('232f2cc6b018201c2ff56c5ea39326e20242f63045933f8f3dde1b700674562f048e3875065b8e85', 76, 21, 'refreshToken', '[]', 0, '2023-02-05 00:38:04', '2023-02-05 00:38:04', '2023-08-05 00:38:04'),
('2342d5ea9f0a649f8e4cf1b9ae285b1c406a72a4a16a007976e4c133a1f4d4e892ac6bf266baf5ab', 63, 21, 'authToken', '[]', 0, '2023-01-14 12:15:44', '2023-01-14 12:15:44', '2023-07-14 12:15:44'),
('23b89afc0a87fd19131f5e59e660ca022b6f3f6ecff1701a6a03608a27f027f76eee0417250df955', 37, 21, 'authToken', '[]', 0, '2023-01-04 09:05:47', '2023-01-04 09:05:47', '2023-07-04 09:05:47'),
('2443f4b99427070de6af9d27415984cf3ae43249b0d9c5bc6af95e211f8aab2726d2273b259ce1f3', 1, 21, 'refreshToken', '[]', 0, '2023-01-02 07:54:11', '2023-01-02 07:54:11', '2023-07-02 07:54:11'),
('2480835f997fa16acca0ad99dfda740459b2791294a7cb368db358a4a4403a0173fe7d016306c966', 59, 21, 'authToken', '[]', 0, '2023-01-31 08:01:34', '2023-01-31 08:01:34', '2023-07-31 08:01:34'),
('24d1ae9f9e8fabc86f93d3a434ea99f01f26f4ee119d1e3ebcc66684ae06f023dcf93d0c78406642', 1, 3, 'authToken', '[]', 0, '2022-08-23 10:23:00', '2022-08-23 10:23:00', '2023-02-23 10:23:00'),
('24e4e52f0acc541192289c82a8e2a3d7b3753448388771bfd723bff7217c1f3468187dc5319f9a10', 63, 21, 'authToken', '[]', 0, '2023-01-14 12:06:44', '2023-01-14 12:06:44', '2023-07-14 12:06:44'),
('25d51a1e0cc7ffbd99a035fb155102609d93c1506e47901dd7ba4882a999e9aeb49c998c3997d044', 1, 21, 'refreshToken', '[]', 0, '2023-01-26 11:54:50', '2023-01-26 11:54:50', '2023-07-26 11:54:50'),
('2603d5457c837d38106db86e16aa9cd6841643fc203ffe8f1a8e450f2884854160108bc54dd04ab6', 59, 21, 'refreshToken', '[]', 0, '2023-01-31 08:01:34', '2023-01-31 08:01:34', '2023-07-31 08:01:34'),
('268b0501c405cf1871a1a1e74d06c67070f40eed6693869d772f7d29a9f5c1f2f20eaf50fb35c986', 9, 21, 'refreshToken', '[]', 0, '2023-01-04 16:36:56', '2023-01-04 16:36:56', '2023-07-04 16:36:56'),
('26c61458c379f1531784b11f3f10cb75b98d3cc87d147c0887721fa46577d55471574da81881133a', 1, 19, 'refreshToken', '[]', 0, '2022-11-13 17:01:59', '2022-11-13 17:01:59', '2023-05-13 17:01:59'),
('27665867c214a6a3f5466c8ef4a80c1d2a52073d0e621ff1bede8d2f801eda183da7f5543ea74549', 1, 21, 'refreshToken', '[]', 0, '2023-01-09 11:06:43', '2023-01-09 11:06:43', '2023-07-09 11:06:43'),
('27705f8997653090cff57882b4757af825e3a5806e8407762d24d6e51b32d50bfc6d32ba20f95c24', 1, 3, 'authToken', '[]', 0, '2022-06-17 20:01:03', '2022-06-17 20:01:03', '2022-12-17 20:01:03'),
('278feb506e27535f964e16a485b6794524045e77269c514027f8c65149782225eeb0036d7b7423af', 1, 19, 'refreshToken', '[]', 0, '2022-11-08 19:00:24', '2022-11-08 19:00:24', '2023-05-08 19:00:24'),
('27b46dd27f677531ca4a8e5a9e79f65136357474407276e65e1e04d2018b6ae514481d5e350eb181', 1, 21, 'refreshToken', '[]', 0, '2023-01-16 12:13:19', '2023-01-16 12:13:19', '2023-07-16 12:13:19'),
('27e1bde7d2739192a00706e1d8e612088db8db9ad55098a1fc5b17d75fbc505131f5fd7b1ccf07c0', 60, 21, 'refreshToken', '[]', 0, '2023-01-25 05:05:48', '2023-01-25 05:05:48', '2023-07-25 05:05:48'),
('2840a15475c968bc533a07f5ea6d6cf0dfa6286d604e23ebb7a8d05228f87c586079380c2667745c', 1, 19, 'refreshToken', '[]', 0, '2022-11-12 16:39:29', '2022-11-12 16:39:29', '2023-05-12 16:39:29'),
('2873218774683d78598f9c109edd20a9633bfde0081edf54f825d22d6062b6be40e592a1d67e12c6', 1, 3, 'authToken', '[]', 0, '2022-06-04 08:15:51', '2022-06-04 08:15:51', '2022-12-04 08:15:51'),
('287cd8f01843b04cf815e32e11c294aa9a416014b2b561ffeeb04afe3f709319af2cb4b068d25909', 1, 19, 'authToken', '[]', 0, '2022-11-07 16:35:10', '2022-11-07 16:35:10', '2023-05-07 16:35:10'),
('289ce3d1529ee0d017e2928566e58395200fada1c608e07554454817eed6f49093403a44251cb462', 16, 19, 'authToken', '[]', 0, '2022-11-13 15:07:10', '2022-11-13 15:07:10', '2023-05-13 15:07:10'),
('29b1d0d0af003083ad1d28b87cdc2546a5996696444843f1d61cbfabaa179c66f208a3f6138cbc7f', 1, 19, 'authToken', '[]', 0, '2022-11-13 17:01:59', '2022-11-13 17:01:59', '2023-05-13 17:01:59'),
('29cb7bbc455a67e4819e179a7708c78c28dd988c13fc9d197e13d3f1b0461c099f8b03b63211ace2', 1, 21, 'authToken', '[]', 0, '2023-01-26 00:11:15', '2023-01-26 00:11:15', '2023-07-26 00:11:15'),
('2a04644bf0492be0b0612635c3d330b2322e5ca02812d5d1c1089ae5e3f1e6367b553cbe9430b74f', 60, 21, 'refreshToken', '[]', 0, '2023-01-12 00:31:27', '2023-01-12 00:31:27', '2023-07-12 00:31:27'),
('2a1f08b4d9a05d677d3d4b057d6e80d86ff7ff2465dac5ec01d764740adbd156a00ffbfcc017cf2d', 63, 21, 'refreshToken', '[]', 0, '2023-01-17 00:52:04', '2023-01-17 00:52:04', '2023-07-17 00:52:04'),
('2a5f862ce77794587425721f2543e15ac09ca43ce78139f08e1ef071e69ba7ef51f6e6be7f07bde6', 1, 3, 'refreshToken', '[]', 0, '2022-06-15 06:04:30', '2022-06-15 06:04:30', '2022-12-15 06:04:30'),
('2a74a2e0c7d9fbc25cf0683e33cd9584683cffeb13e86580a3373575eca04cc263fc0a5ff43cf22c', 60, 21, 'authToken', '[]', 0, '2023-01-21 09:17:42', '2023-01-21 09:17:42', '2023-07-21 09:17:42'),
('2a7f3a4aefdf60d6b35fb93c0848934bf5ea50d09207ff948e6b2bbaf48094ae3f2f531f54ab66c9', 1, 3, 'authToken', '[]', 0, '2022-10-02 11:41:45', '2022-10-02 11:41:45', '2023-04-02 11:41:45'),
('2aa493f98cb673f333728733d3a9009e4d22986a345ca525638d66f7df2de87d126a0bae6a64a095', 1, 3, 'authToken', '[]', 0, '2022-09-18 13:27:40', '2022-09-18 13:27:40', '2023-03-18 13:27:40'),
('2afcfe40b984dd1752c3534506f82671ad7a405362962b0eb9ec266122b4ac3057049f947114599e', 1, 21, 'authToken', '[]', 0, '2022-12-20 22:15:36', '2022-12-20 22:15:36', '2023-06-20 22:15:36'),
('2b0cdad39f7c89cbbcbcc5507115fd576cc68e7221bc3b83f3deaca99021326489b707abb38e73a0', 69, 21, 'refreshToken', '[]', 0, '2023-01-27 15:52:49', '2023-01-27 15:52:49', '2023-07-27 15:52:49'),
('2b74227d9857f3fc850972de8dac4b1e4a0b020e583fa9250397ee246f34d1c98ea336be46d55370', 9, 3, 'refreshToken', '[]', 0, '2022-10-02 21:22:11', '2022-10-02 21:22:11', '2023-04-02 21:22:11'),
('2b7fe42d8e54a0d28786da6307235d4495fbe165815134ac94c997c6d6dfc0888e6ac0e1fd8b5863', 59, 21, 'refreshToken', '[]', 0, '2023-01-31 07:54:20', '2023-01-31 07:54:20', '2023-07-31 07:54:20'),
('2bbfe66b8c59efb1cd7b445be683f95a86bde711cd6a9c7b89822aa587249e92546e85a34c6a3886', 1, 3, 'authToken', '[]', 0, '2022-06-19 16:35:29', '2022-06-19 16:35:29', '2022-12-19 16:35:29'),
('2bc58e8cc69e7df9676b7a0a6c0783ed994ed2b1226ad9945a5bb39ab01195f1592df37b52e26ffe', 22, 3, 'refreshToken', '[]', 0, '2022-10-02 21:50:00', '2022-10-02 21:50:00', '2023-04-02 21:50:00'),
('2c445da55a795eaeb1ffc51d33223c72c15b88ca3e0ae6360a71979386ae43b3635898108e193e2e', 33, 21, 'refreshToken', '[]', 0, '2022-12-21 17:56:44', '2022-12-21 17:56:44', '2023-06-21 17:56:44'),
('2c6f46067096863aa9e32d79784113188fd88843768da9ab7083af01c9808567fe95706bb635f8e2', 60, 21, 'refreshToken', '[]', 0, '2023-01-29 00:45:43', '2023-01-29 00:45:43', '2023-07-29 00:45:43'),
('2ca8e7d6f28e6015f90f2cf44d5d9deb123697e9f7409bd63fd65dcf6a3e5219a4698ca508eaa64b', 60, 21, 'authToken', '[]', 0, '2023-01-25 05:35:03', '2023-01-25 05:35:03', '2023-07-25 05:35:03'),
('2cdaef7def2415639c13c24f2b501e66febf5124110692c9032f3b5a140fd0ce1937905e2f359358', 1, 21, 'authToken', '[]', 0, '2023-01-14 04:21:28', '2023-01-14 04:21:28', '2023-07-14 04:21:28'),
('2d6b74ab9c20363b8fa434590c52118c63e5c3c9a69641174a1cb6196fdcac2a1419cca587cedbd9', 1, 21, 'refreshToken', '[]', 0, '2023-01-21 12:02:09', '2023-01-21 12:02:09', '2023-07-21 12:02:09'),
('2de1e85a3da8375f46a77c19d0afdff6b8df26ac422270b9500d0ea7ae7db87c8a2f70f00f823602', 1, 3, 'authToken', '[]', 0, '2022-10-21 06:23:50', '2022-10-21 06:23:50', '2023-04-21 06:23:50'),
('2e20698c7aaf1d13f05407e92bd5ff59b51a8c8a2251965af48a3ca0bfa8837ea25f741ecf29150e', 60, 21, 'refreshToken', '[]', 0, '2023-01-26 11:11:25', '2023-01-26 11:11:25', '2023-07-26 11:11:25'),
('2ea3b06bfeba06ced3671d09d5d3a0aee59594f4bf7d37a6b0e16fc5ecbfd8e8048170b59f23ad7b', 1, 21, 'authToken', '[]', 0, '2023-01-25 02:13:14', '2023-01-25 02:13:14', '2023-07-25 02:13:14'),
('2eada0f4b8536e721a281f062c361786bfd6d48d7385684a02b66544058bf0ab06eda3a32bcbf443', 33, 21, 'refreshToken', '[]', 0, '2023-01-08 11:47:47', '2023-01-08 11:47:47', '2023-07-08 11:47:47'),
('2ecab49c836938357f5a45a9026b26a2277e3abbae5e1de1ff105a7c9ee11af6882444c2161c0122', 34, 21, 'authToken', '[]', 0, '2022-12-22 07:11:48', '2022-12-22 07:11:48', '2023-06-22 07:11:48'),
('2ece45589e9f42f28aedfad50d0a79cd06ee2d14ffbf9ec5b8e79d0e215a929e8ba65ce9773014a8', 1, 3, 'refreshToken', '[]', 0, '2022-08-29 12:24:30', '2022-08-29 12:24:30', '2023-03-01 12:24:30'),
('2ecf466d7c50dd460336a0d9d790063425a0dfcf294760816132e493b386384dbd3a91ccfd19539a', 1, 3, 'refreshToken', '[]', 0, '2022-05-24 10:52:40', '2022-05-24 10:52:40', '2022-11-24 10:52:40'),
('2ee7aa6ac623316b83a52d34882cb91811df054df6dce4ae0a0680a14289b20df8dc2ef0c4330ce2', 16, 21, 'refreshToken', '[]', 0, '2022-12-25 15:34:54', '2022-12-25 15:34:54', '2023-06-25 15:34:54'),
('2fd078e570276a42674784cd291b1046891f5934efccc00ecea28b550ea0af6dadc7397587165e56', 59, 21, 'refreshToken', '[]', 0, '2023-01-29 11:40:33', '2023-01-29 11:40:33', '2023-07-29 11:40:33'),
('2fde9445583b1bf3b50abddf3f85ce38b3a1f091623b94f9586e54eda219b3ca34446bd9b37d0659', 7, 3, 'authToken', '[]', 0, '2022-09-04 15:16:11', '2022-09-04 15:16:11', '2023-03-04 15:16:11'),
('30a59604b2614d9840537977b5d7f30a6f5412e21b0c96fc769bd631b9c7dc2b9391e0f0e48c1dad', 60, 21, 'refreshToken', '[]', 0, '2023-01-12 00:46:43', '2023-01-12 00:46:43', '2023-07-12 00:46:43'),
('30c1e4e1f1db0066688516c2eb19eeab259595296ffa2661810fbe28994f4743d55cc6d5b377c9f5', 70, 21, 'refreshToken', '[]', 0, '2023-01-30 01:51:49', '2023-01-30 01:51:49', '2023-07-30 01:51:49'),
('30d4ac1ed3b9295fa5fc57eba4974a65e329d0f521e2d993527f889a018f59b4b6534392443a544f', 1, 3, 'refreshToken', '[]', 0, '2022-06-17 20:01:03', '2022-06-17 20:01:03', '2022-12-17 20:01:03'),
('30eb59fa2acc75d4add6540d298092b82e917ec1e91744a24d444c14eeb43714a2b52d4229ee3e95', 16, 19, 'refreshToken', '[]', 0, '2022-11-13 15:07:11', '2022-11-13 15:07:11', '2023-05-13 15:07:11'),
('316a7467d40aa4d607f987ab7a7e72675458f79e0833e9083e96b63cbc2d15593114d77d89f88c2f', 1, 3, 'refreshToken', '[]', 0, '2022-07-28 12:22:00', '2022-07-28 12:22:00', '2023-01-28 12:22:00'),
('319f02500d870a0524df1d4185495040fe6f841713b2b34b0ef1bef856313a8213c3ec4f221f358b', 21, 3, 'refreshToken', '[]', 0, '2022-10-02 11:40:15', '2022-10-02 11:40:15', '2023-04-02 11:40:15'),
('3226e81f98ceabb3a27ccdbe8193c486bb4fc6d9e83cdcb5fa07e0b1f01e1dcdf71086d1da4561e2', 1, 21, 'authToken', '[]', 0, '2023-01-19 05:50:59', '2023-01-19 05:50:59', '2023-07-19 05:50:59'),
('3227e34d8f36aa2c2fcfc750632533a95baa2934a8fe4946a7622da1fcf2317473886464273d7c29', 1, 3, 'authToken', '[]', 0, '2022-06-16 03:54:11', '2022-06-16 03:54:11', '2022-12-16 03:54:11'),
('3386f8a8380c0b883af7b91037a76b63fdad8d16c50895a603ca206014c2dad3884c0aaa39380975', 1, 3, 'refreshToken', '[]', 0, '2022-09-01 05:35:43', '2022-09-01 05:35:43', '2023-03-01 05:35:43'),
('33c13b7257ff908330fe169e3cadbc7756d126024dd83b7010e482d461c516372b3676102f27dd7b', 1, 21, 'authToken', '[]', 0, '2023-01-12 01:02:49', '2023-01-12 01:02:49', '2023-07-12 01:02:49'),
('34539d1593288b7a960a26461a981b47431cd56c913f71542f77ca3e30c56ef14e50740e2b895708', 36, 21, 'refreshToken', '[]', 0, '2023-01-04 14:54:49', '2023-01-04 14:54:49', '2023-07-04 14:54:49'),
('34ec1206d7f121f86a3fb5bfb8f02a091c19f398ad0758b8edf1d365affa35a006360ba47b0da875', 1, 3, 'authToken', '[]', 0, '2022-06-05 07:09:37', '2022-06-05 07:09:37', '2022-12-05 07:09:37'),
('35571a0a13691eb19717a3e2620e226055d6f40fa1e9a1fa7722347800d3c61be28b3a11acb19f6a', 9, 3, 'refreshToken', '[]', 0, '2022-07-06 08:53:34', '2022-07-06 08:53:34', '2023-01-06 08:53:34'),
('35fe6f6015dd99d6f5ebdb6b9dc06d1812c4f27c84a603d9085c94552b48ab8108cd7baf8af3112e', 1, 3, 'authToken', '[]', 0, '2022-06-01 06:40:39', '2022-06-01 06:40:39', '2022-12-01 06:40:39'),
('36ee69a4df54277fa4f585776fd69ab1a69680c962eb63a2c71547824c488d8b50ac355fed92a5b0', 1, 21, 'refreshToken', '[]', 0, '2023-02-07 13:07:39', '2023-02-07 13:07:39', '2023-08-07 13:07:39'),
('372f5d598c5b8a36c894279c9e683ad220c2a8397b4a7dbd62e418e6045341adac6de8721fb6f19a', 1, 19, 'refreshToken', '[]', 0, '2022-11-13 18:13:14', '2022-11-13 18:13:14', '2023-05-13 18:13:14'),
('379a76d1ecbf7974b1f96b0afe6c53b28b352c9758ad65fafd1e012f7cddaaef0c81fe6fdf7c4680', 1, 21, 'refreshToken', '[]', 0, '2023-01-25 02:13:14', '2023-01-25 02:13:14', '2023-07-25 02:13:14'),
('37a72e171f509524ed0b341e54d7344ac3b907a5dc90fb47fa0d29a2305266448b14b9546e256792', 33, 21, 'authToken', '[]', 0, '2022-12-21 17:56:44', '2022-12-21 17:56:44', '2023-06-21 17:56:44'),
('37b5a4b14edbbc4c93469a9add69c096e82dd9e928dc0e6d479f471520304e4d38b8acc0468d7b65', 59, 21, 'authToken', '[]', 0, '2023-01-31 08:00:47', '2023-01-31 08:00:47', '2023-07-31 08:00:47'),
('380cd4d5a1bba390b58516a4b03e7457b731e35efdff5a61cabe2be73ed4dece94a606a509bb9f0c', 58, 21, 'refreshToken', '[]', 0, '2023-01-19 00:55:59', '2023-01-19 00:55:59', '2023-07-19 00:55:59'),
('381ab0b4fad22000f6744c55ed51309c79371b6fbcfa5edf899a65027597dcea26bd52533df8a14b', 1, 21, 'refreshToken', '[]', 0, '2023-01-02 07:53:03', '2023-01-02 07:53:03', '2023-07-02 07:53:03'),
('3908a65e01b53d8252edc12f90bc5071709a2bf5f841a5cbe77018481d8cce69316e3eee4df93543', 1, 3, 'refreshToken', '[]', 0, '2022-08-01 05:55:14', '2022-08-01 05:55:14', '2023-02-01 05:55:14'),
('3930b211b69784271f70ca5fc6a55a52ce467654f745b50197008e06f3f9690017a71416b5942eb5', 1, 3, 'refreshToken', '[]', 0, '2022-06-16 04:11:04', '2022-06-16 04:11:04', '2022-12-16 04:11:04'),
('39c4a40502fa6ad9a7cd0406a89d46b7feb2560123459c51404c0c2c9222125960f3d92924ab8acb', 1, 3, 'authToken', '[]', 0, '2022-06-07 11:40:59', '2022-06-07 11:40:59', '2022-12-07 11:40:59'),
('3a1e4d2f15f2a50ac8b4f2b3ef1d33fcb18893458b0a87283c514d019cd48752af69bba24f61fe53', 1, 3, 'refreshToken', '[]', 0, '2022-06-05 07:09:37', '2022-06-05 07:09:37', '2022-12-05 07:09:37'),
('3a6482a35f562346cae76eb462fb30de2a879e26a155980cf2205028e5f958e20e8256fb2e0efb87', 33, 21, 'authToken', '[]', 0, '2022-12-21 17:59:05', '2022-12-21 17:59:05', '2023-06-21 17:59:05'),
('3b1c55d4fd943f5d389efeb1f3cbc0146f140fdda1ca58beea16af2100e6a46a7edeadd8690f2c19', 1, 19, 'refreshToken', '[]', 0, '2022-11-12 18:12:38', '2022-11-12 18:12:38', '2023-05-12 18:12:38'),
('3b6969502406c4fff4f8f1cb2d46ceec8a563464752ed13dc667111c00241bffd8557868dee2f75a', 16, 5, 'refreshToken', '[]', 0, '2022-11-06 16:08:55', '2022-11-06 16:08:55', '2023-05-06 16:08:55'),
('3b6ded62663aad37ca242a730d8e68715aac39d437c1f8cddd9796078a20d74e4510ba3272c1eb34', 1, 1, 'authToken', '[]', 0, '2022-03-29 05:17:37', '2022-03-29 05:17:37', '2022-09-29 11:17:37'),
('3bc7dddf2793e20ee55ff87f21cfb77ec81a16f6b9a4b27b29f52e6a56e804dd6a32a4e68f71738a', 1, 3, 'authToken', '[]', 0, '2022-06-24 01:08:26', '2022-06-24 01:08:26', '2022-12-24 01:08:26'),
('3c19a09aa0d2571b0208c180e91f21491e7aecacbf15fad4b2f132a8b003aabcbeaffdd7b5db5351', 7, 21, 'refreshToken', '[]', 0, '2023-01-04 09:44:48', '2023-01-04 09:44:48', '2023-07-04 09:44:48'),
('3c1ad28117a104258d0b1c5d400ca4441fa27381b4741dded279c4dc5f6c48560cabc65228b9cbf7', 1, 3, 'authToken', '[]', 0, '2022-06-16 12:35:17', '2022-06-16 12:35:17', '2022-12-16 12:35:17'),
('3c7c38d3fd12465c2375135efb1b5f9412826e21a9b703a99592912d885012ee7673757a64777e40', 7, 3, 'authToken', '[]', 0, '2022-08-21 15:15:48', '2022-08-21 15:15:48', '2023-02-21 15:15:48'),
('3c8e882de14cee4b87fe6828e941082c8cf1f5bfa34a3ce4744fccfd929bb9be8a03890eba04e86f', 54, 21, 'authToken', '[]', 0, '2023-01-08 16:50:20', '2023-01-08 16:50:20', '2023-07-08 16:50:20'),
('3c9feb81f84f0de0c178fa0e2cf88fb042eaf25eb874faa77b2ea4e451c29b29abc8cb912190f26f', 59, 21, 'authToken', '[]', 0, '2023-01-29 13:13:57', '2023-01-29 13:13:57', '2023-07-29 13:13:57'),
('3ce76b37b881daddb3c8c962b1592e8b926bb462230dd8b18001b36e0b556f99ded09906e8f2a372', 1, 21, 'authToken', '[]', 0, '2023-01-14 02:11:45', '2023-01-14 02:11:45', '2023-07-14 02:11:45'),
('3dd79569e813c567af088c7c9cc680a031c6c7fd68d75df3406744364cf1f350e3ed2b630869d811', 1, 1, 'refreshToken', '[]', 0, '2022-04-02 23:25:53', '2022-04-02 23:25:53', '2022-10-03 05:25:53'),
('3e53e470624def95bea42fdeca151707329a95594e5e711f3ced674a121b818a040dd52242d0c66e', 65, 21, 'authToken', '[]', 0, '2023-01-14 12:51:41', '2023-01-14 12:51:41', '2023-07-14 12:51:41'),
('3ed4b5493dd11affe90093f9e713c3a1eca866e00eeedf7767b3b41c4f8a838603fd9ae2c74db354', 66, 21, 'refreshToken', '[]', 0, '2023-01-21 12:17:17', '2023-01-21 12:17:17', '2023-07-21 12:17:17'),
('3ee631669f8212d76dd041646ed010e44d354059c59fb7c1ab5005c94481e646a3e497dd06999cf3', 1, 21, 'authToken', '[]', 0, '2023-01-12 00:33:13', '2023-01-12 00:33:13', '2023-07-12 00:33:13'),
('3f20a158bd56f5f6e103f93382f97dc57f384d547812122b4d13f2c9d1a0717d55872524ce89dea0', 1, 3, 'refreshToken', '[]', 0, '2022-07-31 06:40:30', '2022-07-31 06:40:30', '2023-01-31 06:40:30'),
('3f43deb9f53372327564db91a449cd5bdbeae4a229f7d250332900a24a0c6ef14df4ff02d2c38e31', 1, 21, 'authToken', '[]', 0, '2022-12-18 05:58:23', '2022-12-18 05:58:23', '2023-06-18 05:58:23'),
('3fc3198e9238efa278222be16b649189f89634c9247ef3b484b61eed2313480e692eaac3d32c9133', 37, 21, 'refreshToken', '[]', 0, '2023-01-04 09:05:47', '2023-01-04 09:05:47', '2023-07-04 09:05:47'),
('3fd65e01b8f3cbc463f7141408aac76ec472ec24f5b9913c8bb40972997b3cfad2939435becafc84', 60, 21, 'authToken', '[]', 0, '2023-01-12 00:31:17', '2023-01-12 00:31:17', '2023-07-12 00:31:17'),
('3feeb71cac7ada65fefdb5df90e4e4a7229832930e60eec9b9aa53dd78af88429299f1eb2d715fc7', 1, 3, 'refreshToken', '[]', 0, '2022-06-04 08:15:51', '2022-06-04 08:15:51', '2022-12-04 08:15:51'),
('404e22e515860615523be88d3a280151c2175c3bf62c36a0418de287b50c601ecfde75ae769b5fc5', 60, 21, 'refreshToken', '[]', 0, '2023-01-31 07:54:35', '2023-01-31 07:54:35', '2023-07-31 07:54:35'),
('4087b4c57656f8fce122f5eee3b0680274d76dd58f747368b62e93c76951dcb94d9e7e7f0c4195ca', 60, 21, 'authToken', '[]', 0, '2023-01-12 00:31:51', '2023-01-12 00:31:51', '2023-07-12 00:31:51'),
('410a04f4bad2d52e2044a54c340727740e4d38a7540e5bea3e7f5701a7e96f10d91527009eb78b00', 1, 3, 'refreshToken', '[]', 0, '2022-10-02 19:55:53', '2022-10-02 19:55:53', '2023-04-02 19:55:53'),
('410ce8054e8a4fdd270cec57bf2ddfe63ae4fa40708cac7d688970fee7ab1805bba43a4bcd3b3e96', 1, 21, 'authToken', '[]', 0, '2023-01-22 14:24:39', '2023-01-22 14:24:39', '2023-07-22 14:24:39'),
('411966170f88f6980452643ba6b522526d978dc03eadb18f4da812c6d668d5f3e754de9693ad3ff8', 1, 1, 'refreshToken', '[]', 0, '2022-05-07 22:36:49', '2022-05-07 22:36:49', '2022-11-08 04:36:49'),
('416313fbc70445c978a322e34e77a17bc9cae95ebf4dcd2b13f3b50530ddfbd08dfd32d445365041', 1, 3, 'authToken', '[]', 0, '2022-07-21 07:17:30', '2022-07-21 07:17:30', '2023-01-21 07:17:30'),
('4222883bcd049b90bc245f1331d339b4ee9e0d6b4af5dc8ee3f56fe8265e396883949edaed373c7d', 1, 21, 'authToken', '[]', 0, '2023-01-16 12:08:04', '2023-01-16 12:08:04', '2023-07-16 12:08:04'),
('4262a263fc672100e37e3bdcde8e13c5dd8420f93639fcf91c7da024d2f052dd88f99080b9f0b1c8', 1, 3, 'authToken', '[]', 0, '2022-10-14 03:25:55', '2022-10-14 03:25:55', '2023-04-14 03:25:55'),
('42e16294ec453ee538a2838263f21e91c177ebbad9a954874b4b4148abac65b7c323e04df12f8ccc', 9, 3, 'authToken', '[]', 0, '2022-10-02 21:22:11', '2022-10-02 21:22:11', '2023-04-02 21:22:11'),
('431410c2f090b12ddd6c5184bdc361efe4be7855d336bd3e7d2ae779209b5e3977cadd38bc19e421', 1, 21, 'authToken', '[]', 0, '2023-01-19 00:55:03', '2023-01-19 00:55:03', '2023-07-19 00:55:03'),
('43c350fa5b190fa1b1061c68d6645ad6e0f17815f4ce6eaba1d77bc01e27113d930bed27a0c43a2e', 68, 21, 'authToken', '[]', 0, '2023-01-25 07:14:05', '2023-01-25 07:14:05', '2023-07-25 07:14:05'),
('43ff28963218d18eb3e607af550d1a9e5fae942005026b4ef0a69199f90d5a22307efcff1640cb39', 1, 21, 'authToken', '[]', 0, '2023-01-29 04:57:15', '2023-01-29 04:57:15', '2023-07-29 04:57:15'),
('4403bae766819033c7a73280c0cf77b5d59f68cf1b3b6a9e61f03c52754d856791502d3885593293', 63, 21, 'authToken', '[]', 0, '2023-01-16 12:26:39', '2023-01-16 12:26:39', '2023-07-16 12:26:39'),
('44139095858b7fe70231a4255f22e9ac8bcbce75cc69d4ba0c1cc6b20d363d725c22a77855bac269', 1, 3, 'authToken', '[]', 0, '2022-09-01 05:35:43', '2022-09-01 05:35:43', '2023-03-01 05:35:43'),
('4434d354aa46c67d7c72bfe31d6a2fa0c7f14864546d13816d4e82966904d863948e075cff9a7ff6', 60, 21, 'authToken', '[]', 0, '2023-01-25 07:11:14', '2023-01-25 07:11:14', '2023-07-25 07:11:14'),
('44a232638fed382ddd432678e9df1a60256c3eded6753db23df2e9038cc4baa993ed2995358225b3', 67, 21, 'authToken', '[]', 0, '2023-01-25 05:05:33', '2023-01-25 05:05:33', '2023-07-25 05:05:33'),
('44c3225847048f5ad6910a1cd17a68bbd3d58e10dafc6c78020548b16a618777f0d562e59d06f89d', 1, 21, 'refreshToken', '[]', 0, '2022-12-21 15:44:25', '2022-12-21 15:44:25', '2023-06-21 15:44:25'),
('4607c39b87b3314e668f2676d1e1abd123ee8ad4c6c1919821c3a6b708ccedd9347cfea177705bc8', 1, 21, 'authToken', '[]', 0, '2022-12-17 05:43:08', '2022-12-17 05:43:08', '2023-06-17 05:43:08'),
('461879355bf4be7562ce43355a39d18d9b4d60777e7dc9ef945ab5d6ede24baf1de8978ad7349925', 60, 21, 'authToken', '[]', 0, '2023-01-12 00:43:13', '2023-01-12 00:43:13', '2023-07-12 00:43:13'),
('46e9338b293f1a578685fb00e7cae9c88579b93a264632be809d238df1dea17a01cdc501c0b6636d', 1, 21, 'authToken', '[]', 0, '2023-01-10 05:42:40', '2023-01-10 05:42:40', '2023-07-10 05:42:40'),
('46f5f48ab80d6db07d0b517d995c6894c5cfc743d6e18e16753260d9b87d7f4a4031e687c7c5d88e', 1, 21, 'refreshToken', '[]', 0, '2023-01-29 08:14:45', '2023-01-29 08:14:45', '2023-07-29 08:14:45'),
('47976af582626d45087ae4634ab286b0882dabb33e3dc81e9de1a8ad910a48684b0bdd4f59504b2e', 3, 3, 'authToken', '[]', 0, '2022-08-21 16:27:42', '2022-08-21 16:27:42', '2023-02-21 16:27:42'),
('47d7908c0c48601499e4021c07207ffb596ab3854506f81c0485f4aaa5dffba1452549d14bfcd52b', 68, 21, 'authToken', '[]', 0, '2023-01-29 12:59:47', '2023-01-29 12:59:47', '2023-07-29 12:59:47'),
('47e2b2e89d243e234a300a1821a59d0c915cbb7c77d23e1c33758bfa360104488071a86a2864b49e', 59, 21, 'authToken', '[]', 0, '2023-01-31 07:54:20', '2023-01-31 07:54:20', '2023-07-31 07:54:20'),
('4808549ea5ee09bb76d5b6a7c7a2a1f8fbe5662ddd083e6f996d11f2534612c531fe7454686d0de5', 1, 3, 'authToken', '[]', 0, '2022-08-06 15:48:53', '2022-08-06 15:48:53', '2023-02-06 15:48:53'),
('4862853ee53ef6cf36273c4b80a16971d74284474f5b7c0f7844e36ad8d922f36e7e988f129ae2d0', 1, 21, 'refreshToken', '[]', 0, '2023-01-30 07:54:05', '2023-01-30 07:54:05', '2023-07-30 07:54:05'),
('48c48198a7b0a5b8582d7046e727b9859a2fcc5b9949c01313aa595692b53832b5f1b4b96d145c37', 35, 21, 'refreshToken', '[]', 0, '2023-01-29 01:31:23', '2023-01-29 01:31:23', '2023-07-29 01:31:23'),
('491ebae2cbb94633f8b4589a59b0a2f289ef8caf51dc79d73a4cacfd6294e6eb72a086ca214ce91d', 1, 21, 'refreshToken', '[]', 0, '2023-01-19 06:09:44', '2023-01-19 06:09:44', '2023-07-19 06:09:44'),
('494444d97938f775387131ad71fae9f8ee56a0fa794fc2f1335626e8fe654ff08d59b6e6e443b778', 76, 21, 'refreshToken', '[]', 0, '2023-02-02 08:06:16', '2023-02-02 08:06:16', '2023-08-02 08:06:16'),
('498151c69caef27f9bc446064284c68671e4446e80336bca9af55786189d88e37d3a872038d2aba3', 1, 1, 'refreshToken', '[]', 0, '2022-03-29 05:08:54', '2022-03-29 05:08:54', '2022-09-29 11:08:54'),
('49dcead7bca81f5444122acb30ca8ac5ee417ef05172f293c4723a4ced7332c44a947725eb6a3270', 1, 3, 'refreshToken', '[]', 0, '2022-06-21 02:18:26', '2022-06-21 02:18:26', '2022-12-21 02:18:26'),
('49e5f99823ebfd86df8dd9245c1fcd1d4a5c731453d0fa804238aa9be4c3e6e5d7ffd170bd65ee1b', 1, 21, 'authToken', '[]', 0, '2023-02-04 08:16:27', '2023-02-04 08:16:27', '2023-08-04 08:16:27'),
('4a11f4aeac299b279b6a3a14f794dc85d60d776965b2510d50f3db6d1eee623c20c0f319e1d5fa18', 1, 1, 'refreshToken', '[]', 0, '2022-03-29 05:35:15', '2022-03-29 05:35:15', '2022-09-29 11:35:15'),
('4a1c7c4b9ddabdd352f16edc4e7b59f578bbbbb2477ec08c9a54800f6155bf172e3ec84cc274d40f', 1, 1, 'refreshToken', '[]', 0, '2022-05-07 21:27:57', '2022-05-07 21:27:57', '2022-11-08 03:27:57'),
('4a20cd6e46d62419fe168135716921892ec7193ccf9c022fbfa0473cc56bdee5dfed2288faf896cd', 1, 3, 'authToken', '[]', 0, '2022-06-21 13:24:23', '2022-06-21 13:24:23', '2022-12-21 13:24:23'),
('4a4861c0478134977fd0057de1a49c9555aa34392e0b7089966da5165bb5cefa74b049efff6e825d', 1, 21, 'authToken', '[]', 0, '2023-01-02 07:54:11', '2023-01-02 07:54:11', '2023-07-02 07:54:11'),
('4a842cd3990f9b61a09aa9baba31098263de3bca8c696c51a56f63b080b4825fcbc7ad9a37012e46', 1, 21, 'authToken', '[]', 0, '2023-01-26 11:54:50', '2023-01-26 11:54:50', '2023-07-26 11:54:50'),
('4b650fa980aeb6b45a3cc6720f583c90dfe01a4bb447a92fed81ee821e24ed34cf41b232f7e20fcf', 9, 3, 'authToken', '[]', 0, '2022-07-06 08:53:33', '2022-07-06 08:53:33', '2023-01-06 08:53:33'),
('4b9e2f0c01e35505ec99f3b1b4c6290391cab035ec89607412a87a8867b30bf66ac83af458068e37', 1, 21, 'refreshToken', '[]', 0, '2022-12-17 05:43:44', '2022-12-17 05:43:44', '2023-06-17 05:43:44'),
('4bf714d5a0a624177feaef8e72f08b4999e4de04ba89466af0fe5585911cdf71ed8e7dfa7c45449b', 60, 21, 'authToken', '[]', 0, '2023-01-12 00:55:32', '2023-01-12 00:55:32', '2023-07-12 00:55:32'),
('4c53c7db741feed170c4d92a9f947c9a97c40d31733efb3e28effe9a3ec4751793ccb823926671c4', 63, 21, 'authToken', '[]', 0, '2023-01-17 00:52:04', '2023-01-17 00:52:04', '2023-07-17 00:52:04'),
('4c7d72c91e651f652374abf55382146b0ba86fa5bf4d4a5cb32ee9046df60b1a0201cf48c616e14c', 1, 1, 'refreshToken', '[]', 0, '2022-04-05 23:41:55', '2022-04-05 23:41:55', '2022-10-06 05:41:55'),
('4ccaff7fde60dc75e6d9da9a31047d7b8a85dffb6d7b74dfea552d80bec7c852cce9cfb440833773', 21, 3, 'refreshToken', '[]', 0, '2022-10-02 20:41:10', '2022-10-02 20:41:10', '2023-04-02 20:41:10'),
('4cff49b68a8471be8958a032c1fc6deb25b0a4f37186b1ad8eb5bcf8da5378a90a463ee14c1ac1b4', 1, 3, 'refreshToken', '[]', 0, '2022-10-02 11:41:45', '2022-10-02 11:41:45', '2023-04-02 11:41:45'),
('4d0d8d1cfccbe7872807fe80e6d885af1cd9cfb8698b5e932b415da1b9d79e028a47fef222804eae', 1, 21, 'refreshToken', '[]', 0, '2023-01-19 09:35:14', '2023-01-19 09:35:14', '2023-07-19 09:35:14'),
('4d10f03be2cefbf4b2ddb3aead4f5ec55b9a3abc1795facfcc027f9b5cfe09d80803ebb04c2a1fd4', 1, 3, 'authToken', '[]', 0, '2022-08-24 12:20:37', '2022-08-24 12:20:37', '2023-02-24 12:20:37'),
('4d1e9b5b79b20983301909aea793b9dda7ec5004a0cc523589ef7cf111ea494846917b0376253863', 1, 3, 'authToken', '[]', 0, '2022-09-19 12:03:35', '2022-09-19 12:03:35', '2023-03-19 12:03:35'),
('4d26cd45a91abae8ba235a106fa0cb00fb4d242a17927047a41b01dfab3e59dbae102f4660f31f2c', 1, 3, 'refreshToken', '[]', 0, '2022-05-25 03:41:38', '2022-05-25 03:41:38', '2022-11-25 03:41:38'),
('4d5721f1c8bcb23b3f08f93458a0ff1381781f66802457a198b623d3473f566c9e652f461bbc88ad', 60, 21, 'refreshToken', '[]', 0, '2023-01-21 09:17:42', '2023-01-21 09:17:42', '2023-07-21 09:17:42'),
('4d962eb84a563de64de61d0d0fbcee804ec968340e77dd3a9a5421ccfc066f1b23adfe35d2d7004d', 58, 21, 'refreshToken', '[]', 0, '2023-01-25 04:40:07', '2023-01-25 04:40:07', '2023-07-25 04:40:07'),
('4d991bf3de0b11e8b9929b7148d8e06dac0d7e339498dd0b863ebfed6399a29e5d93b55e1cbe8f42', 63, 21, 'authToken', '[]', 0, '2023-01-16 13:44:06', '2023-01-16 13:44:06', '2023-07-16 13:44:06'),
('4db943cf7e54889edebf6f4c381b5fbeed1de549baf6e7851702d7bb082208f4691f4d1c3873a590', 1, 3, 'refreshToken', '[]', 0, '2022-06-01 06:40:39', '2022-06-01 06:40:39', '2022-12-01 06:40:39'),
('4df1290691c2c29f78ec90c304950c00b2fd83ef825d94d374c6ebe16f067567ec57909a297da033', 66, 21, 'authToken', '[]', 0, '2023-01-21 12:17:17', '2023-01-21 12:17:17', '2023-07-21 12:17:17'),
('4e0dcb23c6593b0660ebb945c37a41748f6d8d2af28ff13b940349260cce67c30080d3e5740b9eba', 1, 21, 'refreshToken', '[]', 0, '2023-02-02 07:51:34', '2023-02-02 07:51:34', '2023-08-02 07:51:34'),
('4e50fb8d4b88d22632e61317f71f77517220361d5bcbf3756f08f20395d74ea9ac161f14871fd2fd', 1, 3, 'authToken', '[]', 0, '2022-10-14 03:30:03', '2022-10-14 03:30:03', '2023-04-14 03:30:03'),
('4e5fa620f64ea5cc7656456cf7fc370dbc086c6aa6c3d026a599b41f2393e03e1b89f1568cee8565', 9, 3, 'refreshToken', '[]', 0, '2022-10-02 19:38:49', '2022-10-02 19:38:49', '2023-04-02 19:38:49'),
('4eba0e454ef52943fec05a3bf83249d2b69f8b7bccd83d6c7ce6785d06959bec52ccc098bd5a275e', 1, 21, 'authToken', '[]', 0, '2023-01-10 06:07:56', '2023-01-10 06:07:56', '2023-07-10 06:07:56'),
('4ed178921471c674e677145d3b5862d0a8c67c61d3fdee903fa8b5b6f6391af5231f7f78ebb54c12', 58, 21, 'authToken', '[]', 0, '2023-01-15 06:16:55', '2023-01-15 06:16:55', '2023-07-15 06:16:55'),
('4f8fedd7b9ac6ccd9ad4d5aae1b13d306f75944822fffb0f4d117d351c0a93c5e8a8807c55253b39', 19, 3, 'authToken', '[]', 0, '2022-07-06 09:16:50', '2022-07-06 09:16:50', '2023-01-06 09:16:50'),
('4f95687199471bf1e05caeb73cd46fb6b7907dd7de1683013d8a333b1f2f82a6af8fe81cd47a20d0', 1, 3, 'refreshToken', '[]', 0, '2022-06-19 17:11:55', '2022-06-19 17:11:55', '2022-12-19 17:11:55'),
('4ff3003f8397ccd4445d29292bc9b4cf9bc800208286c1533b17851d40e4d8d3dcf5cd0436a0da1a', 1, 3, 'authToken', '[]', 0, '2022-06-26 14:32:07', '2022-06-26 14:32:07', '2022-12-26 14:32:07'),
('503c2e7dba7184a9884170ddb87edd78727d0ae854913e3342af21a27aa654504f4fa8129360d575', 59, 21, 'refreshToken', '[]', 0, '2023-01-10 06:48:35', '2023-01-10 06:48:35', '2023-07-10 06:48:35'),
('50429be397d9a8a9ec348bef12341b6d56d674442f41653c6e4be4421e5d8b0d10f993d14400fef1', 22, 3, 'authToken', '[]', 0, '2022-10-02 21:50:00', '2022-10-02 21:50:00', '2023-04-02 21:50:00'),
('50a9d66b14ffe5c6385ad43809e427ce4bd571f24109f2be72d59cec1c7688378174cc662d6313f7', 1, 21, 'authToken', '[]', 0, '2023-02-06 07:18:29', '2023-02-06 07:18:29', '2023-08-06 07:18:29'),
('50c1264d8297722b20885236d753505176cb772f9a332d6ef7ccc59904c7c292637aa11ac634ff03', 1, 21, 'refreshToken', '[]', 0, '2023-01-31 00:27:11', '2023-01-31 00:27:11', '2023-07-31 00:27:11'),
('51237a519e148b65b5aa87eed6ffc3ef4bf1b7c37375e342b558f3de421c6016c3d3f6a59da4464d', 1, 3, 'authToken', '[]', 0, '2022-07-14 07:07:50', '2022-07-14 07:07:50', '2023-01-14 07:07:50'),
('512397fdbb43f090704c218bf7dd23a83358373a340120e8c7ce2d243f8d4fb93cda632d98e8e038', 1, 1, 'authToken', '[]', 0, '2022-03-29 05:30:11', '2022-03-29 05:30:11', '2022-09-29 11:30:11'),
('51241a0f187744b250c7b4e3ec19fa434d5633b2486c25d43f37771944639e528c2b3115747c4789', 1, 19, 'authToken', '[]', 0, '2022-11-08 19:00:24', '2022-11-08 19:00:24', '2023-05-08 19:00:24');
INSERT INTO `oauth_access_tokens` (`id`, `user_id`, `client_id`, `name`, `scopes`, `revoked`, `created_at`, `updated_at`, `expires_at`) VALUES
('512b72a43634d8478dd7bb570bef180f15be7724f722d6ecedec80ed58c2826f120d92069bd97ace', 1, 1, 'authToken', '[]', 0, '2022-04-05 23:41:55', '2022-04-05 23:41:55', '2022-10-06 05:41:55'),
('5178b890986631cfe2e547238670d9f8232bb70fba71e721d2e58b980fa9490d09e32ac29cdd5a5d', 1, 3, 'authToken', '[]', 0, '2022-06-19 14:02:30', '2022-06-19 14:02:30', '2022-12-19 14:02:30'),
('533a7564a87f313ea09c100a528f535e45d8f54d5b93f1d9677bc838efb5db309c5420a93506836c', 1, 21, 'authToken', '[]', 0, '2023-01-04 14:26:35', '2023-01-04 14:26:35', '2023-07-04 14:26:35'),
('54cda4cb8b8af1cb00ad4ac1aec3e2afb88cfa3bcb0a89bf2c17b579ac32c57d66c24407c6edd4ea', 9, 21, 'refreshToken', '[]', 0, '2023-01-14 13:59:22', '2023-01-14 13:59:22', '2023-07-14 13:59:22'),
('5530a5bc4ad2073d9665ccb6d1fa2ee68e4e24f2aa5c25cc250e1417f7002c4a5464c4ae6600c61a', 58, 21, 'authToken', '[]', 0, '2023-01-25 07:16:05', '2023-01-25 07:16:05', '2023-07-25 07:16:05'),
('55a4728005bae22f1f14d12ddd02728b41a0ccbefdeec92e413596a5ea9df8cb7b18c7a7b4c10cf5', 68, 21, 'refreshToken', '[]', 0, '2023-01-25 07:14:05', '2023-01-25 07:14:05', '2023-07-25 07:14:05'),
('5614f3457daa96bfc4e1ca3263aa76fe90f28bd93df79cab14b68b375a2546b597f9b49c47c3768c', 1, 21, 'refreshToken', '[]', 0, '2023-01-29 23:13:25', '2023-01-29 23:13:25', '2023-07-29 23:13:25'),
('561fa98aac2dff687f97e71c49dbc2815d540d8802cd32a22ca2c12de5db3ba8714421b8c9bfd730', 1, 19, 'authToken', '[]', 0, '2022-11-12 18:12:38', '2022-11-12 18:12:38', '2023-05-12 18:12:38'),
('56615dad862873d780f037bc1b805724ba59d752b2ab7fa43cbec477cdece199648bd58c305a1122', 20, 3, 'authToken', '[]', 0, '2022-08-21 14:47:57', '2022-08-21 14:47:57', '2023-02-21 14:47:57'),
('567b2368110bd89cd1242980bbe03e7e4a7609ba4812818c93a9190bf8ce43d92d65df5a8db7bd65', 1, 3, 'authToken', '[]', 0, '2022-07-30 11:22:50', '2022-07-30 11:22:50', '2023-01-30 11:22:50'),
('56ea69a725b847f8ffbaafdbd978107664987b8d9eb9ff957c9485da694e380f4d3253d1d6de9488', 33, 21, 'authToken', '[]', 0, '2023-01-02 07:55:22', '2023-01-02 07:55:22', '2023-07-02 07:55:22'),
('57013dc5248c77d3aa704b35a8b173e505be62b7a3f6a541c8c0eefd7bf4de797dbec2ccdc70b9e4', 1, 3, 'authToken', '[]', 0, '2022-06-02 13:21:08', '2022-06-02 13:21:08', '2022-12-02 13:21:08'),
('57187ac61b283627392d1349f362059f381b4cf1fc51fd0500ae5f7b95698ffbdd0cf9335febe5c5', 58, 21, 'authToken', '[]', 0, '2023-01-25 04:40:07', '2023-01-25 04:40:07', '2023-07-25 04:40:07'),
('57bb908845098760506772e178545e62386a8d496a1204a88f1fbd3bfe888b9cc44f71234dc35b6e', 9, 21, 'refreshToken', '[]', 0, '2023-01-05 09:58:19', '2023-01-05 09:58:19', '2023-07-05 09:58:19'),
('57cc63dfff00e0e879c2a9f5d5242e6c817d7bbbd9b65de040e4bdb2c7f4dcd95d27e367261e8879', 59, 21, 'refreshToken', '[]', 0, '2023-01-29 06:19:52', '2023-01-29 06:19:52', '2023-07-29 06:19:52'),
('57fd7cc92cf102d9d3131e523b0641b5c3cfebf30f1c8a1f4c1e388eef4408784377b3aa813c8b29', 1, 3, 'authToken', '[]', 0, '2022-08-29 12:24:57', '2022-08-29 12:24:57', '2023-03-01 12:24:57'),
('5852993bc7d3003da13b57acc58aea1ff02b184f73b9a18b4c1a402b11ca776d2080e0484130e9eb', 1, 21, 'refreshToken', '[]', 0, '2022-12-19 06:03:55', '2022-12-19 06:03:55', '2023-06-19 06:03:55'),
('5857b8ff5a8861258b2540bbe18283747b6840f1a3cf156ef4436e3979c3a901c7b407b8e9ff033a', 1, 1, 'refreshToken', '[]', 0, '2022-03-29 05:20:51', '2022-03-29 05:20:51', '2022-09-29 11:20:51'),
('588935057560dd12027449249eee0ff03e5e541dc5586d809c7bfb49126bfb6630189943799f8025', 58, 21, 'refreshToken', '[]', 0, '2023-01-29 08:10:57', '2023-01-29 08:10:57', '2023-07-29 08:10:57'),
('58ad0fdea9baeb31d55236cc4cf7d63e42f8a313ea286988d8497689f1ea6711d5299d823d40f7da', 22, 3, 'authToken', '[]', 0, '2022-10-02 18:44:38', '2022-10-02 18:44:38', '2023-04-02 18:44:38'),
('58d045631771a946b9321fb6d2c218dcea70bde1df9af1e685a558f18a0679ba692ea08223be9798', 17, 3, 'authToken', '[]', 0, '2022-06-19 16:01:54', '2022-06-19 16:01:54', '2022-12-19 16:01:54'),
('58e1bee42af16a5a9231db2f8356d954047e00f82472481fa3b2d74c9add759d16262401540ff001', 1, 21, 'refreshToken', '[]', 0, '2022-12-26 07:44:00', '2022-12-26 07:44:00', '2023-06-26 07:44:00'),
('5973b9715a5de9785b2f20d5e2b5874f5123b166a96f07f7512cc0fa406a06a169453168a62deab1', 1, 21, 'authToken', '[]', 0, '2023-01-02 07:55:57', '2023-01-02 07:55:57', '2023-07-02 07:55:57'),
('5a21220e2603ed048090abd59a710da444c247ee9be187a2ff94a0384727fbfe6974ee5689a4b247', 1, 1, 'authToken', '[]', 0, '2022-05-07 21:27:57', '2022-05-07 21:27:57', '2022-11-08 03:27:57'),
('5a5e74d93473adba98a5e06056e29e16dbc75313501608e49de26387bf2a69cbe710568dc7388f4a', 1, 21, 'refreshToken', '[]', 0, '2022-12-31 07:52:24', '2022-12-31 07:52:24', '2023-07-01 07:52:24'),
('5a6941ea2ea1bc23623d6f5478960ec1502643c595a3d0ffc6a6e5a580c3762609c7cc62d29f94f6', 1, 21, 'refreshToken', '[]', 0, '2023-01-22 11:33:55', '2023-01-22 11:33:55', '2023-07-22 11:33:55'),
('5a75c0256884ebc9fddfe90a0f8dd6e41dd65158e97a4bf66587d790e4673c58764b0a69c60d02f3', 58, 21, 'authToken', '[]', 0, '2023-01-19 00:55:59', '2023-01-19 00:55:59', '2023-07-19 00:55:59'),
('5a93c569408409e6760257dd53ce5056d8ecefc6836682385dc3ea0aab13e2b1350b23c6506ed032', 1, 21, 'refreshToken', '[]', 0, '2023-02-05 00:38:00', '2023-02-05 00:38:00', '2023-08-05 00:38:00'),
('5b9123e0dcb07ef5be648aefb2a5564c73f507da4e48afb567fbd9efed7699a32a4839fbbf6a59a3', 1, 1, 'refreshToken', '[]', 0, '2022-05-08 02:04:27', '2022-05-08 02:04:27', '2022-11-08 08:04:27'),
('5b9848be316114389241e6e79e86e16e1cc6b5761564831157a98a7fd05fade994a02ee138edf7df', 1, 3, 'refreshToken', '[]', 0, '2022-05-25 10:23:18', '2022-05-25 10:23:18', '2022-11-25 10:23:18'),
('5bccb39affa52444e8dd24c5931ea538bcb8789294a8de6b1333ddaad03a7b103d7f3ea12559893e', 1, 3, 'refreshToken', '[]', 0, '2022-08-25 05:07:02', '2022-08-25 05:07:02', '2023-02-25 05:07:02'),
('5c8068c88fcff31462a9c359dfbdcc6d6e19422101bc22d122f1814a30edbdecae8edb3870c4eb95', 63, 21, 'refreshToken', '[]', 0, '2023-01-16 13:44:06', '2023-01-16 13:44:06', '2023-07-16 13:44:06'),
('5cacce9bdaddfa80f2dc906f34d443f907d5b11ff13e1a3cb2a8effad7a83477a58bf2c970b1dd62', 1, 1, 'refreshToken', '[]', 0, '2022-03-29 05:17:37', '2022-03-29 05:17:37', '2022-09-29 11:17:37'),
('5cb1ccbb74f5b7d3c70ea735294f0dca7064ff15440f59221415649b06b7b53b8b736e23295495ec', 1, 21, 'refreshToken', '[]', 0, '2022-12-14 16:25:51', '2022-12-14 16:25:51', '2023-06-14 16:25:51'),
('5cc1f25ae694ff34974fca5299395e346cdc4ac46ade8e01e42e46c2254d2c1a244f4c10f2b11081', 58, 21, 'refreshToken', '[]', 0, '2023-01-12 01:53:02', '2023-01-12 01:53:02', '2023-07-12 01:53:02'),
('5d1f1ed0cbaedf80bc3e6f1cc607f02b33c594df28176d9e1906393a9d67b6b47dee6d49156cbb3e', 35, 21, 'authToken', '[]', 0, '2023-01-29 08:14:51', '2023-01-29 08:14:51', '2023-07-29 08:14:51'),
('5d39f10ae358a9be133166a5dad8db8601400b8d8fb29922c6b4a942cd6414e86b23b798a750a3de', 18, 3, 'authToken', '[]', 0, '2022-06-19 16:57:09', '2022-06-19 16:57:09', '2022-12-19 16:57:09'),
('5d4996c133b79e6d852a6884237d001d9252850bfe9019f72514a6d13c9e9184042923c74122600e', 60, 21, 'refreshToken', '[]', 0, '2023-01-12 00:43:13', '2023-01-12 00:43:13', '2023-07-12 00:43:13'),
('5d80af78a398c6e69fd69e1d11538d1945db6470a87f2f397dcb14b058be4dd14a110a1e23c46976', 78, 21, 'refreshToken', '[]', 0, '2023-02-04 08:38:51', '2023-02-04 08:38:51', '2023-08-04 08:38:51'),
('5dc4684c1b562d4e8313704c5bece56ae26ab2f65696bc093fa5a9bc9f4b20696fdb725ae0359ff3', 7, 3, 'authToken', '[]', 0, '2022-09-04 15:15:34', '2022-09-04 15:15:34', '2023-03-04 15:15:34'),
('5e1f4d35b4c53524f670a0abcfce0c7e524bfeade587f085cfcfaad6ad4a788691927d0655b880fc', 1, 21, 'authToken', '[]', 0, '2023-01-14 11:08:38', '2023-01-14 11:08:38', '2023-07-14 11:08:38'),
('5e2a684fb30e5787c1815cb7cc752897c2a38cf4b8d0d2f40287721823fe3d68bef03ebe8c2f185c', 1, 3, 'refreshToken', '[]', 0, '2022-09-22 05:27:32', '2022-09-22 05:27:32', '2023-03-22 05:27:32'),
('5f705603389e4a48713d823976808942584c1094627d80d050623fd4da6af62a94fff24656f174cf', 63, 21, 'refreshToken', '[]', 0, '2023-01-17 07:16:23', '2023-01-17 07:16:23', '2023-07-17 07:16:23'),
('5f735578d47769b256710659a54dbb2c6d1de83f4452665444339e56e8462ae3fe0eb35c55b55543', 1, 3, 'refreshToken', '[]', 0, '2022-07-18 10:28:49', '2022-07-18 10:28:49', '2023-01-18 10:28:49'),
('5fd655b6170ae53019484f07de40de926537c55bef5cb10546ae081e020d379be696d36c1e07e36c', 7, 3, 'refreshToken', '[]', 0, '2022-08-10 06:05:43', '2022-08-10 06:05:43', '2023-02-10 06:05:43'),
('5fe0a755e035a1baf9fabdc014ff7317dcd226ff8d3bc164cca8c4ac9d0a55e5545dc64b316c429d', 35, 21, 'authToken', '[]', 0, '2022-12-22 10:47:45', '2022-12-22 10:47:45', '2023-06-22 10:47:45'),
('5fe7f48cac3dc12842443e91dfe73ebc3c409641ae652d1b85111c66a2f8f0d4ac419d00b4c93311', 1, 3, 'refreshToken', '[]', 0, '2022-05-24 10:48:30', '2022-05-24 10:48:30', '2022-11-24 10:48:30'),
('60282e8e1d3bf3905868b347dc42287e430566bb61b07fa24a9a1d83d82c5e6b875f40c3a392b973', 1, 21, 'authToken', '[]', 0, '2023-01-05 09:57:58', '2023-01-05 09:57:58', '2023-07-05 09:57:58'),
('60a724dca3fb561fb2908a7d8d269eff3ad17c13e67f6c0a842e90803d76935cb9e95e7b9aa4cd3c', 1, 3, 'refreshToken', '[]', 0, '2022-10-14 03:30:03', '2022-10-14 03:30:03', '2023-04-14 03:30:03'),
('614c2158ba4d50f64936ec5353f404d0fea5d9164a61818a8aefba740cf66a4a1a90f3786adf190f', 1, 3, 'authToken', '[]', 0, '2022-10-02 15:33:58', '2022-10-02 15:33:58', '2023-04-02 15:33:58'),
('6177fe8c3943b8a51a7c0623744e353c8e253e29604de0054089c116c47254420b4786b7475606df', 9, 19, 'refreshToken', '[]', 0, '2022-11-13 18:40:04', '2022-11-13 18:40:04', '2023-05-13 18:40:04'),
('622c1aee568f854cdcd4e5ed0bff86fa1683cb2e38f000abed79c015f446b8b8ba3a7dbd249a9d58', 66, 21, 'refreshToken', '[]', 0, '2023-01-21 13:16:47', '2023-01-21 13:16:47', '2023-07-21 13:16:47'),
('62a6bff1694da3a7cef5d5aee350cd655b9302ee8c56361983aee6236e763c9465001718da2c55da', 36, 21, 'refreshToken', '[]', 0, '2023-01-02 08:02:13', '2023-01-02 08:02:13', '2023-07-02 08:02:13'),
('62ab89bbe0431ee118d39ec2ad8c1228950b946ea1d420ef8ea07d2320c3024e91d53e27b05b6fda', 59, 21, 'refreshToken', '[]', 0, '2023-01-14 06:18:37', '2023-01-14 06:18:37', '2023-07-14 06:18:37'),
('62afec44e03e608972caf8951c1898c43c6d2b1af6b74478899940310e6ceaf4d61020250e2eeb7e', 1, 3, 'authToken', '[]', 0, '2022-07-31 06:40:30', '2022-07-31 06:40:30', '2023-01-31 06:40:30'),
('62ef9fbc16119611680efb3e0ecbc4e6b71606b98d03a5a25f6987ed59b31df648def7bdea763811', 66, 21, 'authToken', '[]', 0, '2023-01-21 12:15:18', '2023-01-21 12:15:18', '2023-07-21 12:15:18'),
('631d133bc12192422d00b7842879657846de56dadd72089f7a4eb984ef1a1a96c1275c0868dece18', 60, 21, 'refreshToken', '[]', 0, '2023-01-21 13:03:22', '2023-01-21 13:03:22', '2023-07-21 13:03:22'),
('631d384897ce7950cf64e47ba350ae781ca86edcc7d1cd618b15d6f2a7c6ef554c8d48d21c213d66', 1, 3, 'refreshToken', '[]', 0, '2022-10-02 19:25:25', '2022-10-02 19:25:25', '2023-04-02 19:25:25'),
('6349cd6e29efa575fd189de26a7c1691a70b0a16d2119d2c7068345a91be2ba5501ea02e42745695', 1, 3, 'refreshToken', '[]', 0, '2022-07-06 06:09:33', '2022-07-06 06:09:33', '2023-01-06 06:09:33'),
('635cf28c1b11265cec4c7bea21306ff68a6f275e5254dd4526ee9ae8a1957f06f66065eb7c627f4a', 1, 3, 'authToken', '[]', 0, '2022-06-15 07:30:14', '2022-06-15 07:30:14', '2022-12-15 07:30:14'),
('6397ee3691f4be8bb34efc1a4de17c2359222dbd0af31b0aceb679e778864db6d7078ec98530f824', 1, 21, 'refreshToken', '[]', 0, '2022-12-20 03:15:34', '2022-12-20 03:15:34', '2023-06-20 03:15:34'),
('639f1fbac75bb3814d9c4306ec9ce720c97e827df4ce4214b65cb81b7c00afaa3a464b017fe551b0', 1, 3, 'authToken', '[]', 0, '2022-09-04 14:04:38', '2022-09-04 14:04:38', '2023-03-04 14:04:38'),
('63d032f54bac5abd00ab81454452539b739248bd4e65bc334916f5a8a1abf28fca7175a8f76591a4', 1, 3, 'authToken', '[]', 0, '2022-06-06 07:37:42', '2022-06-06 07:37:42', '2022-12-06 07:37:42'),
('63da0e36d8f6ecc8ebaa714d63f529751b8d11ea09ebb81c4cdb50ee5ac367901acd4bddc2adc422', 38, 21, 'authToken', '[]', 0, '2023-01-04 09:17:28', '2023-01-04 09:17:28', '2023-07-04 09:17:28'),
('6420fe929ce4ae842c0a09f471159ac4c1a35857b6a1b58b9c914cc14717156c9029324deb3848e8', 75, 21, 'refreshToken', '[]', 0, '2023-02-02 07:58:20', '2023-02-02 07:58:20', '2023-08-02 07:58:20'),
('642c93f8e53864a8fe25b5a333834143e84069766caadccd7ff6ebf751400420f4a772b69262a8b5', 1, 19, 'refreshToken', '[]', 0, '2022-11-12 16:05:05', '2022-11-12 16:05:05', '2023-05-12 16:05:05'),
('64ff1de0dafeb8a8d9517a8d708bf19eb8278022d074cfc89b8cb0c31f628bc0c80325c5e6554d17', 1, 21, 'refreshToken', '[]', 0, '2022-12-22 14:37:02', '2022-12-22 14:37:02', '2023-06-22 14:37:02'),
('6501b08d3f4622f63013090de2a3c79d483e484d90cd6094ba4c741603f559a7aa3c9f0a4e3cc74b', 1, 3, 'authToken', '[]', 0, '2022-06-19 17:11:55', '2022-06-19 17:11:55', '2022-12-19 17:11:55'),
('65488ff99b3db5f25fb4d94a8bd22e25140639d00e5ff98d8da170b647c3f2cb8e680e4f3f17556a', 1, 3, 'authToken', '[]', 0, '2022-10-16 09:22:35', '2022-10-16 09:22:35', '2023-04-16 09:22:35'),
('654d2118d6ccdce95da2d11c9ce0b660c1e15969b3d6e15af129a5509626f4ce9ea29e563fd1eca8', 38, 21, 'refreshToken', '[]', 0, '2023-01-04 09:17:28', '2023-01-04 09:17:28', '2023-07-04 09:17:28'),
('65e63d24fc18229fa0f4040b312b723dc32b24d32c3ced2f95b763bb080824f433cd8614c6ca33e6', 1, 3, 'authToken', '[]', 0, '2022-08-10 14:27:46', '2022-08-10 14:27:46', '2023-02-10 14:27:46'),
('665044de94606e593cb9fe4de6704e38c7ee71f181c415c10bf715b2bc6ec0a177db14619622c9c6', 1, 3, 'refreshToken', '[]', 0, '2022-06-13 05:40:53', '2022-06-13 05:40:53', '2022-12-13 05:40:53'),
('66deaaca07aa3d8329dd6fb506caa82ea53eaacc1d9a51de06ff8d2f3f53f15a6eaacfbdbed96f1c', 60, 21, 'authToken', '[]', 0, '2023-01-12 01:41:10', '2023-01-12 01:41:10', '2023-07-12 01:41:10'),
('66e43b5976b48a9384b1320093642de7c93d24b3787078f73c1777db912e53b7c79659993c125679', 1, 21, 'authToken', '[]', 0, '2023-01-15 04:10:03', '2023-01-15 04:10:03', '2023-07-15 04:10:03'),
('67aa7023b6a20d7b309e891b8a38f5df1353715fff2eb5eee0c04bf58f38421397ff7fe5a6179b79', 58, 21, 'authToken', '[]', 0, '2023-01-14 05:57:48', '2023-01-14 05:57:48', '2023-07-14 05:57:48'),
('6825a05c04b6b880f5943f6e7627f1e23bc3cd6ba30239b87d2b62d01f9b97433f26cbaf44a7eb5f', 1, 3, 'refreshToken', '[]', 0, '2022-06-19 14:48:39', '2022-06-19 14:48:39', '2022-12-19 14:48:39'),
('686cc0da981c8719d632ffd800919b2d0516f1410f6fd52e360feb64c8b3bdd8a2106c479a4764fd', 1, 21, 'refreshToken', '[]', 0, '2023-02-04 08:16:27', '2023-02-04 08:16:27', '2023-08-04 08:16:27'),
('686f5662f9bc4c2aebd01005c9305b502acb61cd30e91e9be6e886b869ac73c47d4001339edfd691', 18, 3, 'refreshToken', '[]', 0, '2022-06-19 16:57:09', '2022-06-19 16:57:09', '2022-12-19 16:57:09'),
('68785f5353680e02a172c47658107a59c2bd1952ff4ef930b95e73d9fa9f128b5a766dc5fdbdc7d2', 1, 3, 'authToken', '[]', 0, '2022-06-17 05:55:37', '2022-06-17 05:55:37', '2022-12-17 05:55:37'),
('6895e6c733b8ce15874b152bb22bc3463aab3b39f27b977726ee42002b8871d8846f7216b745fe59', 1, 21, 'refreshToken', '[]', 0, '2023-01-29 08:07:25', '2023-01-29 08:07:25', '2023-07-29 08:07:25'),
('68f5460a2f1f4bc63f7fcc9573f5ecd5d958f6ad45ba3b9b12bd14d58d85c065433373e945b1d07a', 60, 21, 'refreshToken', '[]', 0, '2023-01-19 00:55:14', '2023-01-19 00:55:14', '2023-07-19 00:55:14'),
('69275567bcace365f303379e8eee5b8c4a516b587ffc31e5e0560d32e487ab777b4ec9c941d602b2', 7, 3, 'authToken', '[]', 0, '2022-08-21 14:49:00', '2022-08-21 14:49:00', '2023-02-21 14:49:00'),
('6968aa2d4f26e1752768633499f6b1581a4d211c4e13705390ba417ca6b56a8172c201100b225355', 19, 3, 'refreshToken', '[]', 0, '2022-07-06 08:09:24', '2022-07-06 08:09:24', '2023-01-06 08:09:24'),
('69771d37d28e616964060b9c7999e336781c670c2451877099d3e555483d7c2dec7947b159204888', 1, 3, 'refreshToken', '[]', 0, '2022-06-19 14:02:30', '2022-06-19 14:02:30', '2022-12-19 14:02:30'),
('6a0f74fad7e5be34a9b43a628f0928a16acd8d9b77c9333be69b4c0fb3e5f04d99ad0bc1caf6309b', 3, 3, 'authToken', '[]', 0, '2022-06-26 06:07:02', '2022-06-26 06:07:02', '2022-12-26 06:07:02'),
('6ae11aca0ec0cbfb577c2f3393262c6d0805c3bdb00e6c340b71d74eef56a712ded252345480ff37', 58, 21, 'refreshToken', '[]', 0, '2023-01-21 11:56:09', '2023-01-21 11:56:09', '2023-07-21 11:56:09'),
('6ae70fead66962e583864476378d91a25e5ae199f332c1c76772a7da9af69ff3d3030fad5cf9d017', 7, 3, 'refreshToken', '[]', 0, '2022-08-21 14:50:19', '2022-08-21 14:50:19', '2023-02-21 14:50:19'),
('6b040a72a8ff57de0083a3b5d50d9f52d4204478a678c3be52370bf7bee919cd0153ff24e2d984fb', 1, 21, 'refreshToken', '[]', 0, '2023-02-01 00:57:58', '2023-02-01 00:57:58', '2023-08-01 00:57:58'),
('6b067afab071814da3caf1075dd9062cdd8b73589415cf25b473b011e3bd34029415faa989fdabe0', 7, 21, 'authToken', '[]', 0, '2023-01-04 15:06:47', '2023-01-04 15:06:47', '2023-07-04 15:06:47'),
('6b0f383f916925f1ed92bae4816340eb9215e164a31ee90e22e9578f4a3c295f70646b1fb1863b7c', 1, 21, 'refreshToken', '[]', 0, '2023-01-26 00:11:15', '2023-01-26 00:11:15', '2023-07-26 00:11:15'),
('6b637dc232fd401e19e809e1a62eedd284b15fa246a06d90039ee1668078e639298291f452f4b197', 1, 21, 'refreshToken', '[]', 0, '2023-01-07 19:54:37', '2023-01-07 19:54:37', '2023-07-07 19:54:37'),
('6b94595adf2be72d025202b82254d4c3da36d323bf57a3ce48b929a4822699722508d204516aac4d', 1, 21, 'authToken', '[]', 0, '2023-01-19 09:29:50', '2023-01-19 09:29:50', '2023-07-19 09:29:50'),
('6bf23d0ee0a6e4465c599c410fc5cdb07fe8c4dc54a5daf06e6ba258eae1e58e4e66acccbca968d3', 1, 3, 'refreshToken', '[]', 0, '2022-08-24 12:20:37', '2022-08-24 12:20:37', '2023-02-24 12:20:37'),
('6c7f32d9a3d684a1ebc4b2d92c942baf12da58e92b3d9b387e073a5f2f6a3b74c6cbf753bcb85102', 33, 21, 'refreshToken', '[]', 0, '2022-12-31 07:44:05', '2022-12-31 07:44:05', '2023-07-01 07:44:05'),
('6c9c9f643f5ca11571608032cd503b80c22a53a40828b7aa560f9f83fa5d71caf0db3f05b113a3f8', 60, 21, 'authToken', '[]', 0, '2023-01-12 00:46:43', '2023-01-12 00:46:43', '2023-07-12 00:46:43'),
('6ce72ee766b342a2f974b1022fff4a0d0073760ebee852c1662498269972e4232754e2278f4eed84', 1, 3, 'authToken', '[]', 0, '2022-08-24 07:22:04', '2022-08-24 07:22:04', '2023-02-24 07:22:04'),
('6d63a527c67ec4b0b2a1a533d9c09dcdf4f56321f663d8250bca1dd1bc7e8cb9bd0b223d79bc435b', 60, 21, 'authToken', '[]', 0, '2023-01-31 07:54:35', '2023-01-31 07:54:35', '2023-07-31 07:54:35'),
('6e9ce3d53b840f5f8e8973f6a04ed088b9fb38a60667c51449be88d6c2a74af779f5d0054c005848', 1, 3, 'refreshToken', '[]', 0, '2022-06-06 07:37:42', '2022-06-06 07:37:42', '2022-12-06 07:37:42'),
('6f131e7d0af31e20b335d08e48e90539c125cd7fbde31fe88acce816dc417a3a66a8f77a43dcd2f2', 1, 3, 'refreshToken', '[]', 0, '2022-06-19 08:55:36', '2022-06-19 08:55:36', '2022-12-19 08:55:36'),
('6f2412f098eb67b47448076a92b262266f83ee37c32d90a92bf6cf32e454c92ebe948f88f9ab16f3', 1, 21, 'refreshToken', '[]', 0, '2023-01-08 17:01:16', '2023-01-08 17:01:16', '2023-07-08 17:01:16'),
('6fa873597a759836a1a24a8cd262003e01cbf0469c84376e682db87ab1eee91796336759b4003db7', 1, 3, 'refreshToken', '[]', 0, '2022-06-13 08:53:07', '2022-06-13 08:53:07', '2022-12-13 08:53:07'),
('705616ee4a33b026f004c77155c4bb707bbd2a0b7ef850be31aed35677618bd58724725dd9cb3de5', 1, 21, 'refreshToken', '[]', 0, '2023-01-10 08:11:37', '2023-01-10 08:11:37', '2023-07-10 08:11:37'),
('705a117e94e7bb41062609c56486a6c3a3947d197c5384ced33890b850095ae60ad29c1979b5a547', 1, 3, 'authToken', '[]', 0, '2022-05-25 10:23:18', '2022-05-25 10:23:18', '2022-11-25 10:23:18'),
('70b913ca4727bffda93f88797c6d4e964daea225302529f0570fde487355089da0c8b6c4b8188e16', 1, 21, 'authToken', '[]', 0, '2023-01-08 07:44:43', '2023-01-08 07:44:43', '2023-07-08 07:44:43'),
('70e5b2b710b02f7a84426a2de5e4afb1e8da5c49440597fefcf1f75900318cd896e5c6f6ffdc1101', 4, 19, 'authToken', '[]', 0, '2022-11-13 17:22:53', '2022-11-13 17:22:53', '2023-05-13 17:22:53'),
('719ae537860c572f17ae1536b4c648a548555d9ab373101075d908c115e356e6f42d74d70d4e0144', 68, 21, 'authToken', '[]', 0, '2023-01-25 06:03:54', '2023-01-25 06:03:54', '2023-07-25 06:03:54'),
('71faa6d5b33ae2d9d25c43a406c0e03842defff1cc6b7729698f2983f65b6eb1b10482f6cc866e3f', 59, 21, 'authToken', '[]', 0, '2023-01-10 06:48:35', '2023-01-10 06:48:35', '2023-07-10 06:48:35'),
('723e4f478744a1c0eaee2a98a50cdf801efc4f236929f77f433d5fe25afbcea46d3b1e238dd251db', 1, 3, 'authToken', '[]', 0, '2022-09-18 12:15:13', '2022-09-18 12:15:13', '2023-03-18 12:15:13'),
('724a8291f24fed75db34632d8201d4738ec57eb0a6e99de4e003abf371468ba46cfad9c303b07ca8', 33, 21, 'refreshToken', '[]', 0, '2022-12-21 17:59:05', '2022-12-21 17:59:05', '2023-06-21 17:59:05'),
('72af1b71473dbd0cd343ae8c13b418c196713704dc1403288de53390eec74a487ff4b8657b4e3eb1', 1, 21, 'authToken', '[]', 0, '2023-02-05 00:38:00', '2023-02-05 00:38:00', '2023-08-05 00:38:00'),
('735cb30e5f25738c7d669e3e39476985d2895d83463ba53a1d20efc5df95403a84fbb7968e298900', 1, 3, 'authToken', '[]', 0, '2022-08-25 05:07:02', '2022-08-25 05:07:02', '2023-02-25 05:07:02'),
('746675be9470fb587212424ca383cae5d9f3958af17e5ec5d3c2c3be87afc6388ceaea93bfde7f29', 1, 1, 'refreshToken', '[]', 0, '2022-03-30 23:31:06', '2022-03-30 23:31:06', '2022-10-01 05:31:06'),
('74e90cb84de1fdb86f45a8273e8c6461551624a3931d30c6a9a06f1061ebb1380f2356feeab60fba', 1, 1, 'refreshToken', '[]', 0, '2022-03-29 05:30:11', '2022-03-29 05:30:11', '2022-09-29 11:30:11'),
('74ee4b8829401cd5e252cf58ed554d8378a1f71d624ce858c6746f04024a04ba10bb4b1a645e14db', 22, 3, 'refreshToken', '[]', 0, '2022-10-02 18:44:38', '2022-10-02 18:44:38', '2023-04-02 18:44:38'),
('755fec3a028f7b6bb4faebb95eacb5e870b00bad7b6d7eb79017a886ba0ac6c32d1f9702d9f723cf', 1, 3, 'authToken', '[]', 0, '2022-06-13 09:45:32', '2022-06-13 09:45:32', '2022-12-13 09:45:32'),
('763e98e46168ccc01ff6539e90ccafc27582ca11693e60cde47214d47b8913b0dd7ee3305a470cf8', 1, 21, 'authToken', '[]', 0, '2022-12-14 16:25:51', '2022-12-14 16:25:51', '2023-06-14 16:25:51'),
('764ffaa9ea644de19a4c90f84edc427824f8834004a5e30c4bb226d4f22d5ed8499d46a4456ef4a7', 3, 3, 'refreshToken', '[]', 0, '2022-08-10 06:00:55', '2022-08-10 06:00:55', '2023-02-10 06:00:55'),
('768e4ec52ffd9f7f0cccda9e0bd97618426effa4863ac370ffa6e80e7c6a90b49ed11711522454ff', 58, 21, 'refreshToken', '[]', 0, '2023-01-15 06:16:55', '2023-01-15 06:16:55', '2023-07-15 06:16:55'),
('7702a2db8755251d4801859c7fd7fd85c8a8fb158a7a99355f0290a7b237dc5f66ad0b2ad03dcf9b', 3, 3, 'refreshToken', '[]', 0, '2022-06-19 16:26:11', '2022-06-19 16:26:11', '2022-12-19 16:26:11'),
('7703affe2d9b6984892641871ef01ad6a5af37bda8b582b650a538614510d632a324c413aa8da525', 16, 17, 'authToken', '[]', 0, '2022-11-07 06:12:52', '2022-11-07 06:12:52', '2023-05-07 06:12:52'),
('77ec61bde227d76038549673edff320c55db84ef1c4be95de800a5470fa6dd89c8330bf4fbc94e6a', 1, 21, 'authToken', '[]', 0, '2023-01-07 17:50:51', '2023-01-07 17:50:51', '2023-07-07 17:50:51'),
('77f6c7fcf005832fa1864eeb1a775f005b68d3ad1343f2ad471954c866dc9d5b7fc11565bec9b127', 1, 3, 'authToken', '[]', 0, '2022-07-15 08:33:35', '2022-07-15 08:33:35', '2023-01-15 08:33:35'),
('77fb3cd653875080946cc9f75d806d1e6bcbb76b9721d7f3aafdc8c3939498a1ade53b6a474cbe8f', 1, 21, 'refreshToken', '[]', 0, '2023-02-04 23:37:39', '2023-02-04 23:37:39', '2023-08-04 23:37:39'),
('782a4ea5a8ecd3185347b2691512c405978dffdf957be1eae853083acdde42e4bb5b6582322092fb', 1, 3, 'refreshToken', '[]', 0, '2022-09-26 04:23:14', '2022-09-26 04:23:14', '2023-03-26 04:23:14'),
('786bd80f25f0b00e802a2981d3cbe18e1b5dfcdf3eaab59fbf2a169857c035e159c1aee7c31dc8ba', 22, 3, 'authToken', '[]', 0, '2022-10-02 20:13:36', '2022-10-02 20:13:36', '2023-04-02 20:13:36'),
('78ce8bdaf0285a50274f154c532794834715b2af065e7c09609d545e8241daf4cf041aecaaeb85f0', 1, 3, 'refreshToken', '[]', 0, '2022-08-10 14:27:46', '2022-08-10 14:27:46', '2023-02-10 14:27:46'),
('78ef8d6be6c8ec48c3af93272f3438e4b28bc128505fe5b938c07254281916b58179c4b78eb5be43', 58, 21, 'refreshToken', '[]', 0, '2023-01-31 00:47:26', '2023-01-31 00:47:26', '2023-07-31 00:47:26'),
('795b0e91c99fc05ca1f9ed5a8b8dc7ecfc83a1f6a4f96556f982dff4fef3927c8f1f24bec2910fe2', 1, 3, 'refreshToken', '[]', 0, '2022-06-07 11:40:59', '2022-06-07 11:40:59', '2022-12-07 11:40:59'),
('7962741c759d57ae7bab1482926ce479c934bd9add568d9c6096b1d2e76df5d1eebafa066d5b2aa5', 74, 21, 'authToken', '[]', 0, '2023-01-31 00:42:46', '2023-01-31 00:42:46', '2023-07-31 00:42:46'),
('79880ad777a8c77f8247bb7ebc4eacce1f37ee87c9da51716c06779038897548cff2bb9211047b8d', 1, 21, 'refreshToken', '[]', 0, '2023-01-24 02:20:59', '2023-01-24 02:20:59', '2023-07-24 02:20:59'),
('79cc9b772bdb245bfbcec07a7cf3e4f0827001d406a8dda47081d8f3e880634d5120978d94b68c8a', 1, 3, 'refreshToken', '[]', 0, '2022-06-19 16:23:34', '2022-06-19 16:23:34', '2022-12-19 16:23:34'),
('79e93668fe1a46d9a2c28d436836d96571627c3d3c226c270aefc0d0a4a55e02dc4c2e4fcf67665d', 76, 21, 'authToken', '[]', 0, '2023-02-02 08:06:16', '2023-02-02 08:06:16', '2023-08-02 08:06:16'),
('7a3503e5b23549cae1a96eb67beb2e6ebda0561453b90b706b3649aaba980ad4f59e74923f9f2e8e', 1, 21, 'authToken', '[]', 0, '2023-01-16 12:13:19', '2023-01-16 12:13:19', '2023-07-16 12:13:19'),
('7a9ddacce644a7cb5960dfb078b1af8b43f9c1d8ce12c62e19953b83546c59965cda077eece212ae', 1, 21, 'authToken', '[]', 0, '2023-01-08 16:58:05', '2023-01-08 16:58:05', '2023-07-08 16:58:05'),
('7ac960b0f29ab62e67ae2c90dfda23e7ac0a985ebf1c15debb392bc92a655ba37db5a243bee4fd14', 1, 3, 'refreshToken', '[]', 0, '2022-06-21 13:24:23', '2022-06-21 13:24:23', '2022-12-21 13:24:23'),
('7ae31e8c3aba5ac497b2f4ac06d07ba4500410ac2003b26431664e47a4400727dfec39e22d76a49e', 1, 21, 'authToken', '[]', 0, '2022-12-21 15:08:27', '2022-12-21 15:08:27', '2023-06-21 15:08:27'),
('7b1d93b8c70d2b094b4734669bfc377ccc8646b416400c5760c8d6e09611392870e60a66c18d91e0', 1, 21, 'refreshToken', '[]', 0, '2023-01-11 07:39:14', '2023-01-11 07:39:14', '2023-07-11 07:39:14'),
('7b324c2d4a1bb8466b5932214fe12d596023ed847c44bf782090c48a8ef9baccc1fd8cb3dc4d7947', 1, 3, 'refreshToken', '[]', 0, '2022-06-24 01:08:26', '2022-06-24 01:08:26', '2022-12-24 01:08:26'),
('7b6abc5355b1d8b409d20f93f14d0c8b71929eba7b73f9f668abc3860355d58c4aa25f29ae8ad392', 60, 21, 'authToken', '[]', 0, '2023-01-25 05:05:48', '2023-01-25 05:05:48', '2023-07-25 05:05:48'),
('7c29dd479a75490a78d0d0b921ec93d4c054eea1b3bfc6c9f40dba42df49a54822d156904a7b663a', 1, 21, 'refreshToken', '[]', 0, '2023-01-26 11:06:25', '2023-01-26 11:06:25', '2023-07-26 11:06:25'),
('7c833063fad19a947172f67959be3300ba06b0b05213820662514b5b6bd5d591e3b09bf6bfb8a10d', 9, 3, 'authToken', '[]', 0, '2022-07-06 08:52:56', '2022-07-06 08:52:56', '2023-01-06 08:52:56'),
('7c979c28a24f649eb53763260797f4f9d798010f94c9d2b22edb8ec308a4ade0d19e7b7e0c268ee5', 63, 21, 'refreshToken', '[]', 0, '2023-01-14 12:06:44', '2023-01-14 12:06:44', '2023-07-14 12:06:44'),
('7d4ff42048a979f5e114514f20deaaa0fc5f50b1fe70f25b09923104d10614e94ec0f4068382aaa3', 59, 21, 'authToken', '[]', 0, '2023-01-25 05:04:47', '2023-01-25 05:04:47', '2023-07-25 05:04:47'),
('7e3208da6bce36e275edfde08a3d87cb29830fb555eab0e4941998e983a4d6b8becc55d8cb1c04f5', 1, 3, 'authToken', '[]', 0, '2022-06-01 06:35:28', '2022-06-01 06:35:28', '2022-12-01 06:35:28'),
('7e7cf06eb520d7437b4793fbc0d7de67311948a9c5b6df8659a97f238f79b0c5d5e7161375a95cdb', 33, 21, 'refreshToken', '[]', 0, '2022-12-26 08:11:23', '2022-12-26 08:11:23', '2023-06-26 08:11:23'),
('7e8e4779a5b50c4666cd75fbc6efaf26336684defd2ad3672b9f692dbaf468893e053ba075a89acf', 1, 21, 'authToken', '[]', 0, '2023-01-19 06:09:44', '2023-01-19 06:09:44', '2023-07-19 06:09:44'),
('7ee8f0ca71b46913ffab0e2252b9f425cfa75557961f6c2b64ceaa886531ce9c5733b7cf5a71b947', 74, 21, 'refreshToken', '[]', 0, '2023-01-31 00:42:46', '2023-01-31 00:42:46', '2023-07-31 00:42:46'),
('7f2b07f1421dc63be38e0b2355b316ddd092ee4f0a1b12f55120788d31822f986a4d6207709db875', 1, 1, 'authToken', '[]', 0, '2022-04-05 23:49:31', '2022-04-05 23:49:31', '2022-10-06 05:49:31'),
('7f6614fbd9ad117f3f25f925710ea9fa101b670278801a71ea42d38a94615035890b99748f49c51b', 1, 21, 'refreshToken', '[]', 0, '2023-01-08 07:44:44', '2023-01-08 07:44:44', '2023-07-08 07:44:44'),
('806a05ce9d1e6ebe462037a64503de083cb2a27d9276311f35140a1c9159fddda5ab6d6c0b82ec46', 21, 3, 'authToken', '[]', 0, '2022-10-02 11:40:15', '2022-10-02 11:40:15', '2023-04-02 11:40:15'),
('80b2c59d551af1cd3f24e1adb6caa9efc440269568f27e0a64fdcb4c05847b509d2eb920b8a12288', 1, 3, 'refreshToken', '[]', 0, '2022-08-10 05:24:51', '2022-08-10 05:24:51', '2023-02-10 05:24:51'),
('80c52cf45baab7aa34e61c7af155cdc038ae8275e2a78a4dba38494b2df336642ee971c769007377', 60, 21, 'authToken', '[]', 0, '2023-01-22 11:56:42', '2023-01-22 11:56:42', '2023-07-22 11:56:42'),
('80caf7e4b57db93b32664fabf119e94ca852602b86f7b343fd71e5041db0e090c392402dd1549532', 1, 3, 'refreshToken', '[]', 0, '2022-10-02 15:33:58', '2022-10-02 15:33:58', '2023-04-02 15:33:58'),
('8166beaac978cef8d3a778cf7c481164ac4a17d9878ecd167c9dbb7ceeed2ad84d6b983007d1a48e', 1, 3, 'authToken', '[]', 0, '2022-07-18 10:28:49', '2022-07-18 10:28:49', '2023-01-18 10:28:49'),
('81b68dad29583fa55aaa44fe3d5c05c49c5060ac537cb24b99ac0eaa6fda0a1b01fb9c2167f1c85c', 60, 21, 'refreshToken', '[]', 0, '2023-01-26 03:38:06', '2023-01-26 03:38:06', '2023-07-26 03:38:06'),
('81cd4233d8b6f2b911b7ef26d913c6dfda31bcc69836557de2c80b4716c309393757ab7f8d1700d9', 1, 3, 'authToken', '[]', 0, '2022-06-15 07:29:22', '2022-06-15 07:29:22', '2022-12-15 07:29:22'),
('81f7858a7c8c9d79301eb20358b2bbf14ff93dfc604bface556c42d3383067aa14bcc4b56d613581', 33, 21, 'authToken', '[]', 0, '2022-12-26 08:11:23', '2022-12-26 08:11:23', '2023-06-26 08:11:23'),
('824c007d1f84ce5f100d879054a41e7d5ae53cb67d0fd24f219ac95a5551aacf121ed94bb6260c8b', 16, 21, 'authToken', '[]', 0, '2022-12-20 16:52:00', '2022-12-20 16:52:00', '2023-06-20 16:52:00'),
('83638af0e3ad06803582db342ea8a63e27bbec78716f7093f602170711d1c4f41b88575f9eec7d89', 1, 21, 'authToken', '[]', 0, '2023-01-09 08:46:07', '2023-01-09 08:46:07', '2023-07-09 08:46:07'),
('83978df8197b3d895b939ad067cf5133c1386b08919c9f7fb1efbc3240addc2eb7c4f018428bdcf7', 1, 21, 'refreshToken', '[]', 0, '2022-12-17 09:17:41', '2022-12-17 09:17:41', '2023-06-17 09:17:41'),
('83b66ee5eb043bf70a065d58a99455f43cb9970f8a155ac1cde8d2f3b94317caac50df7ccb4fee12', 1, 3, 'authToken', '[]', 0, '2022-05-25 03:41:38', '2022-05-25 03:41:38', '2022-11-25 03:41:38'),
('83caf5b2f7a6a9f1be60fad5a267ee96a60cf380be330f2fa8a30143c43066e4788950676d70a593', 9, 3, 'authToken', '[]', 0, '2022-10-02 21:43:11', '2022-10-02 21:43:11', '2023-04-02 21:43:11'),
('83d3ea6f13b4e4a11ed650b1dcbcd6aca08aed19f51cfb9e891d4fc314a9782ab85647edb8d1f296', 1, 3, 'refreshToken', '[]', 0, '2022-08-13 08:53:53', '2022-08-13 08:53:53', '2023-02-13 08:53:53'),
('83fc574c03b9d24ce92810a57b2843adb4cbd72baba9ff1879e4ca648af020cf966c38b8fd99f076', 7, 3, 'authToken', '[]', 0, '2022-09-04 15:08:02', '2022-09-04 15:08:02', '2023-03-04 15:08:02'),
('84232d84d5c926216ed9e5aa8d579b666f8c9b6d58075d2680bf6addf499cd1058031259f9b86aaa', 1, 21, 'refreshToken', '[]', 0, '2022-12-17 10:17:48', '2022-12-17 10:17:48', '2023-06-17 10:17:48'),
('8458a04f58c9e5bae1e55eedb4bbe164d43ff106b6a95ac77c797a083dc5fa4f13a8149a5fbb6aec', 60, 21, 'refreshToken', '[]', 0, '2023-01-12 00:31:17', '2023-01-12 00:31:17', '2023-07-12 00:31:17'),
('847ad732ae47b03c727568ac282681b26e408d40ebd679f0661666f9e6057115d246d640e4b71bcb', 1, 3, 'refreshToken', '[]', 0, '2022-08-06 15:48:53', '2022-08-06 15:48:53', '2023-02-06 15:48:53'),
('84867971662856b4afacfd8b3653b75df8a4330991b1be3403b081a483bdd5950f4a729d3aebfdae', 1, 3, 'refreshToken', '[]', 0, '2022-06-16 12:21:23', '2022-06-16 12:21:23', '2022-12-16 12:21:23'),
('8525a0e9f3dba7397673a3d0ca3e41b244260ae16585754892efdb919e0b72662a01e8ee41dc850d', 1, 21, 'authToken', '[]', 0, '2023-01-14 11:40:14', '2023-01-14 11:40:14', '2023-07-14 11:40:14'),
('855748841466daf72f2517bee7ff3576ee4cff8c5be4b38be705529b938325bc4aba441eed51a6bf', 1, 3, 'refreshToken', '[]', 0, '2022-09-18 13:27:40', '2022-09-18 13:27:40', '2023-03-18 13:27:40'),
('85a2c432d68fe55cb839cc7d1dd10a946c91e246e86e596db19bb38160547fbad453cafa784f5e12', 7, 3, 'refreshToken', '[]', 0, '2022-09-08 04:55:49', '2022-09-08 04:55:49', '2023-03-08 04:55:49'),
('8699fc220e425042337ad0ea1775e184286b49c168adaa82f00945ab5f55f93ef9ed043a2acf1b1c', 1, 3, 'authToken', '[]', 0, '2022-08-01 05:55:14', '2022-08-01 05:55:14', '2023-02-01 05:55:14'),
('86a539072c389a74e03ebace8b8b6774769285df7331cfcbdd1e0f56da67f52e45ed395d106141ee', 1, 21, 'authToken', '[]', 0, '2023-01-17 00:09:24', '2023-01-17 00:09:24', '2023-07-17 00:09:24'),
('86ca5e9b92e84a09fec6011af6b6bea9242a7cf3af0854e2f3e9ced2657bcba6044905d5c73045d3', 60, 21, 'refreshToken', '[]', 0, '2023-01-19 09:33:40', '2023-01-19 09:33:40', '2023-07-19 09:33:40'),
('877c3cdd144bffd6880e8d8902f372e54f092b460477f8a08428c0269883ff2b9e45d3cbafa8836b', 1, 3, 'refreshToken', '[]', 0, '2022-06-15 13:09:25', '2022-06-15 13:09:25', '2022-12-15 13:09:25'),
('8783bce37da4f62d1aa8d2aa47b680599b14df64a24d34526f2cb40949b0b8376e1f3d7ecbb0c3de', 1, 19, 'authToken', '[]', 0, '2022-11-13 16:33:12', '2022-11-13 16:33:12', '2023-05-13 16:33:12'),
('88170aadc644dc1662a49b62ce3d23e73223f9c3f62ecb0454a1048dca689d3483ca5b5227df4b05', 1, 3, 'authToken', '[]', 0, '2022-05-26 06:33:00', '2022-05-26 06:33:00', '2022-11-26 06:33:00'),
('8829588ccd28c463083b57337c9d6b908e73c38db90f3b0a78de532dd12dbfef49110fbedeb9d922', 74, 21, 'refreshToken', '[]', 0, '2023-01-30 04:03:00', '2023-01-30 04:03:00', '2023-07-30 04:03:00'),
('884820bd35d11c75f8c76ed05f7486f08de755dc010cff804ed61101297d7f9e2a6d4a66b697731f', 1, 3, 'refreshToken', '[]', 0, '2022-10-02 07:01:51', '2022-10-02 07:01:51', '2023-04-02 07:01:51'),
('8850fa0c96a639e6c5ca91f97eb7f8abe34c6b79f670fedd9a3758dab4f75d6f71f45cf79c606c46', 1, 21, 'authToken', '[]', 0, '2023-01-26 11:06:25', '2023-01-26 11:06:25', '2023-07-26 11:06:25'),
('894379c17ca7f70b7ed15b03c73e9259ba426f8230a3c37613ea8b66f76f7be03df8f68d6f5d9777', 1, 3, 'refreshToken', '[]', 0, '2022-10-02 21:09:46', '2022-10-02 21:09:46', '2023-04-02 21:09:46'),
('8a3cc5de3047ddac40262cb9ef8201c6a231f157e9a21cd39b07a8bcd082201592d3c344af754699', 77, 21, 'authToken', '[]', 0, '2023-02-04 08:22:45', '2023-02-04 08:22:45', '2023-08-04 08:22:45'),
('8a4c71386789d6ec4c45183ed1ef90169a3cfd7958c5ba1574b8a3472e8be880eb31eeb6c54e0ed4', 59, 21, 'authToken', '[]', 0, '2023-01-29 01:30:17', '2023-01-29 01:30:17', '2023-07-29 01:30:17'),
('8a93ac9875897e7ed71686cceada1ec49c53160904557a0c54857016e6604422bf7224a7b3c6acd5', 1, 3, 'authToken', '[]', 0, '2022-07-06 06:09:33', '2022-07-06 06:09:33', '2023-01-06 06:09:33'),
('8a963787fb42ac796ec3b8bf983331a36cbe2d2867a57cde74af72c9658e7874456b85873b997f55', 1, 3, 'refreshToken', '[]', 0, '2022-10-14 03:25:55', '2022-10-14 03:25:55', '2023-04-14 03:25:55'),
('8b24e9d06825890c2f084e1c4cfeae10ceea2236f08339bcf0b86ebf8e49f67bf4beba12be88498b', 1, 21, 'refreshToken', '[]', 0, '2022-12-22 05:35:16', '2022-12-22 05:35:16', '2023-06-22 05:35:16'),
('8b7175b9a8d5dceb604143116b9be93e7cb5abc5e9c9610397d54f104c85d1347c31a525607a84b5', 9, 3, 'refreshToken', '[]', 0, '2022-10-02 19:36:12', '2022-10-02 19:36:12', '2023-04-02 19:36:12'),
('8b9b0141e0e853111ffdaec82c5b8c153119673b738e088e38cfcdf9e7cb7f3a62b55aab86210ff3', 1, 3, 'refreshToken', '[]', 0, '2022-10-02 19:11:19', '2022-10-02 19:11:19', '2023-04-02 19:11:19'),
('8c0bb73a69d41599b560044a75e6d9599aecfa4f0431a67fe478915d5f1b60eebcb814adb32e99a3', 1, 3, 'authToken', '[]', 0, '2022-06-13 05:40:53', '2022-06-13 05:40:53', '2022-12-13 05:40:53'),
('8c83c582656b88cc667843f3d4f8553dde6ddb7ba8e270620444e1cce538242ac2dbabbd6cde8dd0', 33, 21, 'authToken', '[]', 0, '2023-01-04 14:55:08', '2023-01-04 14:55:08', '2023-07-04 14:55:08'),
('8ca166e32263e55b1e686f4df0d113b205e249f963cba20f5e1f47cac18d839ee91beb716feac7b2', 1, 3, 'authToken', '[]', 0, '2022-06-15 05:09:59', '2022-06-15 05:09:59', '2022-12-15 05:09:59'),
('8e40764850c013124b0f6216622da8e93a71364ef7463fb0a848f09e5edbb2aa8db70fa1303752df', 7, 21, 'refreshToken', '[]', 0, '2023-01-04 15:06:47', '2023-01-04 15:06:47', '2023-07-04 15:06:47'),
('901c5e951654e6baf1da06ec0aff001a02b727b60b47bfdb43475ad2e784d7371c2c50932f235436', 1, 3, 'authToken', '[]', 0, '2022-06-15 13:09:25', '2022-06-15 13:09:25', '2022-12-15 13:09:25'),
('906d4f87f63b002fd70b13cdff7439de05e4fac89efc20b004095ae30b289e8247d80ce71d66e45e', 58, 21, 'refreshToken', '[]', 0, '2023-01-14 11:09:44', '2023-01-14 11:09:44', '2023-07-14 11:09:44'),
('9087abae1dfb092b167c76b3ad9105a4067142b10a2081f31ac600fdbbb8163ab3c632a1277751bc', 1, 3, 'refreshToken', '[]', 0, '2022-06-02 08:42:29', '2022-06-02 08:42:29', '2022-12-02 08:42:29'),
('90f8cffccf319253dc02a94cd7e7e0f2a8927162c1cf2f350f07fdd39272e2ba515c3f4c45b8634b', 1, 21, 'refreshToken', '[]', 0, '2022-12-27 17:33:25', '2022-12-27 17:33:25', '2023-06-27 17:33:25'),
('91278368553bccafcb6183de7259475bdd7f997a63d4fc3a520ed2a6571248b26c5cd53db31d2fac', 1, 3, 'authToken', '[]', 0, '2022-05-26 11:04:33', '2022-05-26 11:04:33', '2022-11-26 11:04:33'),
('9142aef92fae36a971faf126510e0400eb0c82671eb2ecbf56e4bcb2332520f0fada6c5f5c6bf8b5', 16, 17, 'refreshToken', '[]', 0, '2022-11-07 06:12:52', '2022-11-07 06:12:52', '2023-05-07 06:12:52'),
('915fa0dff53da3c5200afb5f0721ed4a65d76f4bfa2a93984be8a9720eb9055179cea2ed9a1bfadc', 16, 21, 'refreshToken', '[]', 0, '2022-12-20 16:52:00', '2022-12-20 16:52:00', '2023-06-20 16:52:00'),
('917d18fb4ef2fab6ffe436dab676cba9b1371b8d46688b4c5c48845be8eee3682718d9e62dfe4d65', 1, 3, 'refreshToken', '[]', 0, '2022-06-05 15:52:47', '2022-06-05 15:52:47', '2022-12-05 15:52:47'),
('91c4e7b213a418134561cbed6336bee3d46cc58b163434d64f47fd74c33095ab962c42c97dd93561', 1, 19, 'authToken', '[]', 0, '2022-11-13 16:43:15', '2022-11-13 16:43:15', '2023-05-13 16:43:15'),
('921dc654929fa109b4409e2aef8012209515cb67647060777a63a92a4458b28dbd3e0f4707eef6b5', 32, 21, 'refreshToken', '[]', 0, '2022-12-20 08:52:46', '2022-12-20 08:52:46', '2023-06-20 08:52:46'),
('922086633f7934d6cd93b43aef4585cc92c420fd3a83f9649a07c5b72be19582b16755f1b0fba79d', 16, 3, 'authToken', '[]', 0, '2022-10-26 04:57:28', '2022-10-26 04:57:28', '2023-04-26 04:57:28'),
('922f1a5e34a2735d49115363edd7937a7c3656a7b02664d0ed72cff2033862ab64db37cfde5abc6a', 76, 21, 'authToken', '[]', 0, '2023-02-05 00:38:04', '2023-02-05 00:38:04', '2023-08-05 00:38:04'),
('923e3577d280e7a5a14623e2783441f8d2f9289c426c24c721249b267ecb892aca58c608353feb10', 1, 21, 'refreshToken', '[]', 0, '2023-01-29 00:45:49', '2023-01-29 00:45:49', '2023-07-29 00:45:49'),
('929dca5fbc8cbe8b8771be726a0a2231fec04f893837e4b10d5a5bcda8bf22d586be4643ca5ae58e', 16, 3, 'refreshToken', '[]', 0, '2022-10-26 04:57:28', '2022-10-26 04:57:28', '2023-04-26 04:57:28'),
('9368d5b31ab4389142bf12e0ca3f995a91f8a704d65a1bbffb229b65fa7ca595550dfe2a47209b82', 1, 21, 'authToken', '[]', 0, '2022-12-29 09:03:23', '2022-12-29 09:03:23', '2023-06-29 09:03:23'),
('93ce1f2353a851d99f7b243fde5e49ea3cd3fe540edd39c2e17c501f38baacfa11f4b1d79c89b5f8', 9, 3, 'refreshToken', '[]', 0, '2022-07-06 08:52:56', '2022-07-06 08:52:56', '2023-01-06 08:52:56'),
('9404db966a09d461ff8219f678de0c3e11a3f0466e5bac4b6ec7df66938c269b31d837c0ed213539', 1, 19, 'authToken', '[]', 0, '2022-11-12 16:57:44', '2022-11-12 16:57:44', '2023-05-12 16:57:44'),
('9429d390d477888eed2f30b380b02a3a3c4a9e28e4ccfd32ae4d6069c5f4fb9c8a1276b6bd7f111f', 1, 3, 'authToken', '[]', 0, '2022-07-28 12:22:00', '2022-07-28 12:22:00', '2023-01-28 12:22:00'),
('9449dee49a89ed3fcbcba4c59475b99b8dbea0e0df2c74005db495cbb754629e1960f06ca4710190', 1, 21, 'authToken', '[]', 0, '2023-01-11 07:39:14', '2023-01-11 07:39:14', '2023-07-11 07:39:14'),
('949e474d9842ec6358824f3fea8eb93c82b6aea0ae2080168467484a2d32e2c838e8137675de800e', 9, 3, 'refreshToken', '[]', 0, '2022-10-02 20:16:44', '2022-10-02 20:16:44', '2023-04-02 20:16:44'),
('94e755e6d5dc0da784ebc75ce303d4694d24237408dba587ab929b0d80db78697d971d2941a666cb', 1, 21, 'authToken', '[]', 0, '2022-12-17 10:17:48', '2022-12-17 10:17:48', '2023-06-17 10:17:48'),
('94fa60900d8586ff0b326bad0a2516763175f910dc97f249d2c318a0748a976731c55d98cd4dfd74', 34, 21, 'refreshToken', '[]', 0, '2022-12-22 07:11:48', '2022-12-22 07:11:48', '2023-06-22 07:11:48'),
('95704635b63b5f5140420cea815400c6d03ff04ad66bb0268c4aeecc5866889728bd3b03d76a498c', 60, 21, 'refreshToken', '[]', 0, '2023-01-15 04:07:25', '2023-01-15 04:07:25', '2023-07-15 04:07:25'),
('9571aae343efa13411b7ae4dcc496bced78cd5a6bed9a257c724755c72350129723ea1e5e64f0010', 1, 3, 'refreshToken', '[]', 0, '2022-06-19 16:35:29', '2022-06-19 16:35:29', '2022-12-19 16:35:29'),
('95756b84c42174fa7e2238910b8a14b5d552c94d8cee358689f145dd38eb6e9ca4f5fc0fe0b45935', 1, 21, 'authToken', '[]', 0, '2023-01-02 15:52:16', '2023-01-02 15:52:16', '2023-07-02 15:52:16'),
('959aac1033dc09f6220e772c16d2284e74209c54cd545279979325c5080fbf46c96000dbb5f97662', 1, 17, 'authToken', '[]', 0, '2022-11-07 06:13:54', '2022-11-07 06:13:54', '2023-05-07 06:13:54'),
('95e1c8da297568a9c32e5c9f78920b8c173a3956b6475b0b5787841aba88538435268ccb3f779474', 60, 21, 'authToken', '[]', 0, '2023-01-26 03:38:06', '2023-01-26 03:38:06', '2023-07-26 03:38:06'),
('96473edfcfd7e53d7bdc8fb0df48235319f7ce53e9aaa35b8692f1d2e53d4da0e3a9796060135349', 1, 3, 'authToken', '[]', 0, '2022-05-24 10:52:40', '2022-05-24 10:52:40', '2022-11-24 10:52:40'),
('968b82ffb652c6e27b5922d9cc3a5f208e540625a869d274fed809c4f43e2ca72d26deda31f5cc3c', 33, 21, 'refreshToken', '[]', 0, '2023-01-02 07:56:24', '2023-01-02 07:56:24', '2023-07-02 07:56:24'),
('96a8300d629a4d6704294d163b77989ca1802a69c4bfc80d8faac3068701efdaeef327a252597785', 1, 21, 'authToken', '[]', 0, '2022-12-20 08:59:50', '2022-12-20 08:59:50', '2023-06-20 08:59:50'),
('96b4ea5b1300407fcfe7478ffc627b4ed90937c794bc9ac1928e9f7a8cb183452d219765239a688c', 1, 21, 'authToken', '[]', 0, '2023-01-21 09:06:31', '2023-01-21 09:06:31', '2023-07-21 09:06:31'),
('96e8399a75a194ec49ad9a9035a961f11d89876a6d9f8ccbdc2cc03ec448923e2491576c7a3e737f', 1, 21, 'authToken', '[]', 0, '2023-01-02 07:53:02', '2023-01-02 07:53:02', '2023-07-02 07:53:02'),
('970fd266f1b6339596fcf5e05f6a8bed30744e3518a2e6f9c86a901cddc4231eed4f6e71f082ef9d', 1, 1, 'authToken', '[]', 0, '2022-04-03 22:34:11', '2022-04-03 22:34:11', '2022-10-04 04:34:11'),
('974171536ce2df229b1c9350c7f8d3ec5caf067774ec604dc4b6bd453572e6866928da008b8d5d40', 75, 21, 'authToken', '[]', 0, '2023-02-05 00:46:32', '2023-02-05 00:46:32', '2023-08-05 00:46:32'),
('9759be0de4362b67a237a814aae0dfaf7923b51dc3afb83773cd4745ad3f738ba2015289e54bd661', 19, 3, 'authToken', '[]', 0, '2022-07-06 08:09:24', '2022-07-06 08:09:24', '2023-01-06 08:09:24'),
('98569a4dd456a5b384b937ec39e9503dd33d03d12de3a143872707f9b9211ccdbeb2bd95e2b9eab9', 1, 3, 'refreshToken', '[]', 0, '2022-06-15 07:30:14', '2022-06-15 07:30:14', '2022-12-15 07:30:14'),
('986ae0e7cbe356cdc346d04667e0709d8894b753efcac8470ce0436816860f9a2717707431051963', 1, 21, 'authToken', '[]', 0, '2023-01-09 11:06:43', '2023-01-09 11:06:43', '2023-07-09 11:06:43'),
('98abbdd42b5de15743ab4105314f09adbefd683ce5d8570abc2d01c19aaa97742ecbd5f0b7a39f73', 63, 21, 'authToken', '[]', 0, '2023-01-14 12:14:23', '2023-01-14 12:14:23', '2023-07-14 12:14:23'),
('98b2604cba4328ea3cdbc21a7768534f67d59632bdf8557ae2683deca75f47d29bd4fce4190a3008', 35, 21, 'refreshToken', '[]', 0, '2023-01-29 08:14:51', '2023-01-29 08:14:51', '2023-07-29 08:14:51'),
('992ff6f7111e1f1a697d85a2ee9cf503178bc2ac1869b1806347ed0dd12e1c19141d4e990212d529', 1, 21, 'authToken', '[]', 0, '2022-12-18 14:38:30', '2022-12-18 14:38:30', '2023-06-18 14:38:30'),
('9988095c1cafa3e4c083e50989e5b55fa3be3c0dbeb1519c0c052b38995385d2e4e7efb50abc85f6', 7, 3, 'authToken', '[]', 0, '2022-09-08 04:55:49', '2022-09-08 04:55:49', '2023-03-08 04:55:49'),
('999fa30f69092a475d9f93a9c527e33c44764019fd831c7838c4eb8acd67622b054f0dc1089bce2a', 1, 19, 'authToken', '[]', 0, '2022-11-12 16:39:29', '2022-11-12 16:39:29', '2023-05-12 16:39:29'),
('99d9de7a5476e747ffe20afb16e3849620091c6ea4bd2720fd64d8b1501d8f195d42ff7e2cd47650', 58, 21, 'refreshToken', '[]', 0, '2023-01-25 07:16:05', '2023-01-25 07:16:05', '2023-07-25 07:16:05'),
('99f89672dacc4ab3c8479efeb59ba2266fa2c9573bac095cf762af161234f0eedb8845726d153338', 60, 21, 'authToken', '[]', 0, '2023-01-29 00:45:43', '2023-01-29 00:45:43', '2023-07-29 00:45:43'),
('9a0254220eb5a8d1d7e045866d9c97cd0f36ad0a3d158f5290f7c02eae78be790437c603b46580b3', 9, 3, 'refreshToken', '[]', 0, '2022-10-02 21:43:11', '2022-10-02 21:43:11', '2023-04-02 21:43:11'),
('9a1a29be6888330ce56650d51f70d0fc335d5db902c1e425b76ab41ecfc12fb87319e84aa60b5066', 1, 3, 'authToken', '[]', 0, '2022-07-20 05:05:07', '2022-07-20 05:05:07', '2023-01-20 05:05:07'),
('9a63b3ad1d89e547c21bb8023ffc67d615db8c7eea470e37c50e6ef6efb7fd4648d5e229198a7523', 1, 21, 'refreshToken', '[]', 0, '2023-01-18 01:40:01', '2023-01-18 01:40:01', '2023-07-18 01:40:01'),
('9aa4a1b48d7e1ff522ff9f3b2c51d764ad95fa346c4dbd0dc79b40013e1a2eafcfec9b7a914716fd', 1, 3, 'authToken', '[]', 0, '2022-06-22 05:58:32', '2022-06-22 05:58:32', '2022-12-22 05:58:32'),
('9aca505d9faefafb99cde2f2a07fbf4a3d5a2630874bf30f6483d3dac6fe8f93af4b7f7339eeae5c', 1, 21, 'authToken', '[]', 0, '2022-12-18 14:45:03', '2022-12-18 14:45:03', '2023-06-18 14:45:03'),
('9b5b9387a4c908b8f3bf45c6abf726356537cbeb49425aa98f61127616429565a41898164565422b', 54, 21, 'authToken', '[]', 0, '2023-01-09 11:58:34', '2023-01-09 11:58:34', '2023-07-09 11:58:34'),
('9b5e18692b9407228610b3d0be5cf55512cb01c28144c5a96e068869bffd825c9ef62d059f332bf7', 60, 21, 'refreshToken', '[]', 0, '2023-01-22 11:56:42', '2023-01-22 11:56:42', '2023-07-22 11:56:42'),
('9b9c2c6e115c5f88ee96e94f51ab64d1d54fa8b5b186db2ba174e24beb956c1107dc72d31b8c352b', 59, 21, 'refreshToken', '[]', 0, '2023-01-31 08:00:47', '2023-01-31 08:00:47', '2023-07-31 08:00:47'),
('9baae6a1bfbb20a91d4c1de7b8e82b628ab04370bc559b5900c00a34b10681b49f74d0b40a32611a', 1, 3, 'authToken', '[]', 0, '2022-08-13 08:53:53', '2022-08-13 08:53:53', '2023-02-13 08:53:53'),
('9c58158c1d96827aaf105b5a33ffca256e9dade471af28617f7dcb184c27e68e36a22bd814e5372d', 1, 3, 'refreshToken', '[]', 0, '2022-07-15 08:33:35', '2022-07-15 08:33:35', '2023-01-15 08:33:35'),
('9d3ca86459b5f8502cc57568a06df82238a78d67e2944f373194832a5936dfda7ee6f7ec1c48cc94', 1, 1, 'refreshToken', '[]', 0, '2022-05-07 23:11:21', '2022-05-07 23:11:21', '2022-11-08 05:11:21'),
('9d4598fd794006b73e1ee2eb8a7e234c4a490ba1ad0de1521a39362bfd803d95a2ac8ca255f11695', 22, 3, 'authToken', '[]', 0, '2022-10-02 18:39:53', '2022-10-02 18:39:53', '2023-04-02 18:39:53'),
('9d79a32a2b41ff8b7d3cb7d007348c56733a2c8d3f4635faa76880c750cc98d0a966eb10f9f84eec', 1, 3, 'refreshToken', '[]', 0, '2022-06-13 09:45:32', '2022-06-13 09:45:32', '2022-12-13 09:45:32'),
('9d97fe204fbbee59c97432688d95ca331cba7f83e851117541ced279d917163ef3bdd28cc2f0d7b0', 1, 21, 'refreshToken', '[]', 0, '2023-01-22 14:24:39', '2023-01-22 14:24:39', '2023-07-22 14:24:39'),
('9da3e1328e74491f37a27efeaec4c1cd58c68ac82f946ebb234932d09fdfc609f176288b7aaa5cbf', 1, 3, 'authToken', '[]', 0, '2022-10-02 07:01:51', '2022-10-02 07:01:51', '2023-04-02 07:01:51'),
('9df8e77ce493716578fc904985f764a61a87c1293b0dd34568ce9408543779e2b1567caf49c02f77', 1, 21, 'authToken', '[]', 0, '2023-01-29 00:45:49', '2023-01-29 00:45:49', '2023-07-29 00:45:49'),
('9ec83341a4785e5aff95b3b704024daa160d148962fdc02199692a60e9c47e2a49ab0658723f4bbb', 1, 1, 'authToken', '[]', 0, '2022-03-29 05:20:51', '2022-03-29 05:20:51', '2022-09-29 11:20:51'),
('9f455a29bc73bab7d97953444b28b543601dc637726c8df227f7d04c8360cfbb78da3e7559959dbc', 59, 21, 'refreshToken', '[]', 0, '2023-01-25 05:36:01', '2023-01-25 05:36:01', '2023-07-25 05:36:01'),
('9fa3502262f16f636a170d2acb627bf33243412a7d09a0102f7fa4999433761fa50a1b52f07f21a4', 60, 21, 'refreshToken', '[]', 0, '2023-01-25 04:55:18', '2023-01-25 04:55:18', '2023-07-25 04:55:18'),
('9fe78ea5099f945d477618bbb5bb3e299330810fb57e7b23a8cdc93810b76e803315497347070a17', 3, 3, 'authToken', '[]', 0, '2022-08-10 06:00:55', '2022-08-10 06:00:55', '2023-02-10 06:00:55'),
('9feef79b4a6e8dc450ea22b6e56615ed7496be0d7ed76c249dcb9210a597dc7e7a0db9bfdda16d98', 3, 3, 'refreshToken', '[]', 0, '2022-09-26 06:55:30', '2022-09-26 06:55:30', '2023-03-26 06:55:30'),
('a006d212d7f0970bf62cfc9de8a587f587862f5d417ba25212765d835269c8ae8b7e867698da5013', 1, 3, 'authToken', '[]', 0, '2022-06-13 10:46:05', '2022-06-13 10:46:05', '2022-12-13 10:46:05'),
('a0420efd22aa21957b2d8082470dad071e51624dabc266d3582c214094fc20b847817876742b231b', 60, 21, 'authToken', '[]', 0, '2023-01-21 13:03:22', '2023-01-21 13:03:22', '2023-07-21 13:03:22'),
('a044ecd6d2dd90f225ed8ca4221015894a48cd304f0a04117ee045d5b185335e493533fff5a1aa35', 36, 21, 'authToken', '[]', 0, '2023-01-04 14:54:49', '2023-01-04 14:54:49', '2023-07-04 14:54:49'),
('a097a04b5f2cde45f193f7504ac936ccd7f5adb64141e47ba91cf03e6f8b15ff4a832110cac1ce56', 1, 1, 'authToken', '[]', 0, '2022-05-07 22:13:36', '2022-05-07 22:13:36', '2022-11-08 04:13:36'),
('a0a9b5ed5667b3861fffcec1ae974333defd195733435afbeb688936d8634761445cfc7c28d68be8', 35, 21, 'authToken', '[]', 0, '2023-01-29 01:31:23', '2023-01-29 01:31:23', '2023-07-29 01:31:23'),
('a18a3fd608a6245bd6d0ed425d4ab26500a967dfde3029cf74e1ff6f8ca897fc8823c44a5ca5a68f', 1, 21, 'authToken', '[]', 0, '2023-01-07 17:03:47', '2023-01-07 17:03:47', '2023-07-07 17:03:47'),
('a2819646b53a6f14d850c18e73fa837f015129a39531fbfc1552b3d74e75350699c05dd64a1ff93c', 58, 21, 'authToken', '[]', 0, '2023-01-12 01:53:02', '2023-01-12 01:53:02', '2023-07-12 01:53:02'),
('a2b244ce64294a83062448ef0a13217e43de28f466336224cae30d6f3abcb7ca805d48de5cf030dc', 58, 21, 'authToken', '[]', 0, '2023-01-29 08:10:57', '2023-01-29 08:10:57', '2023-07-29 08:10:57'),
('a321a773f23585d20f3152fec341bb799d63c9195749b4a405dae755c0ecb6693c9a7689b9865b39', 1, 21, 'authToken', '[]', 0, '2023-01-02 08:00:20', '2023-01-02 08:00:20', '2023-07-02 08:00:20'),
('a3cff2b51963dfbce6578ce4554218722c135b22fffa6f964449986221476f6e56fc78ce1cdfb85c', 1, 3, 'authToken', '[]', 0, '2022-06-19 05:00:28', '2022-06-19 05:00:28', '2022-12-19 05:00:28'),
('a3e43cbcf1f84e298a91fe75fca024877731148b577725450835e9110449a1dcd39ef6c6dedfb6a6', 1, 21, 'refreshToken', '[]', 0, '2023-01-29 04:57:15', '2023-01-29 04:57:15', '2023-07-29 04:57:15'),
('a485a2ea4900db38a837929d44d493128b3c7388abd24306c1f90c6279eedea9173a40c58b2d0d71', 1, 17, 'refreshToken', '[]', 0, '2022-11-07 06:13:54', '2022-11-07 06:13:54', '2023-05-07 06:13:54'),
('a4a69256657982daec5fc09a17e9a2047172b24d1cf6b6310b5070400b4d479a027684d8cb90a6a9', 1, 21, 'refreshToken', '[]', 0, '2023-01-10 06:07:56', '2023-01-10 06:07:56', '2023-07-10 06:07:56'),
('a510b9769f968c1c02b17054de72c5031f19c06c6f133a1ebcfdf35fdd951325e17322ac39fe781c', 1, 3, 'refreshToken', '[]', 0, '2022-09-18 12:15:29', '2022-09-18 12:15:29', '2023-03-18 12:15:29');
INSERT INTO `oauth_access_tokens` (`id`, `user_id`, `client_id`, `name`, `scopes`, `revoked`, `created_at`, `updated_at`, `expires_at`) VALUES
('a519374436dd05c049cedcff367e2648c8033c7a8346c0ddb2908c3252c7e111d99b119509de15e4', 3, 3, 'refreshToken', '[]', 0, '2022-08-21 16:27:42', '2022-08-21 16:27:42', '2023-02-21 16:27:42'),
('a51f5f0907c1550cd718da7621aaa2c72a012c7fdc4de523000afe25f87c693f2eb1bc79281573ae', 1, 21, 'refreshToken', '[]', 0, '2023-01-07 17:50:51', '2023-01-07 17:50:51', '2023-07-07 17:50:51'),
('a588c9121c40e04d1167326f84e5c4a00ee8051572b935afc37dcaeb2ac365800e3a98a2434e88a6', 1, 19, 'authToken', '[]', 0, '2022-11-10 18:21:49', '2022-11-10 18:21:49', '2023-05-10 18:21:49'),
('a63eb30cae385c5fb2b2a7169fce3d284434fd7e512675d0eceb1c089acec8f33ab0b01cdca0f2f5', 1, 19, 'refreshToken', '[]', 0, '2022-11-10 18:21:49', '2022-11-10 18:21:49', '2023-05-10 18:21:49'),
('a646544b0b9077fc2b06123af9d63651251f20addb9b1b111bed3f84b7c11f850f982f6b4695ff5b', 1, 21, 'authToken', '[]', 0, '2022-12-26 07:44:00', '2022-12-26 07:44:00', '2023-06-26 07:44:00'),
('a65445c8776ecb5a8d404259d209a04a32312a31282a30afeeb0d393ba624b93b00e2b54eb74e899', 1, 21, 'refreshToken', '[]', 0, '2023-01-21 11:50:23', '2023-01-21 11:50:23', '2023-07-21 11:50:23'),
('a6b6c1afb2d16eb9cfb519992cd1715b9ead7a7577f97dbee6573f93a282796552a0cca42caf7f8f', 1, 3, 'authToken', '[]', 0, '2022-09-18 12:15:29', '2022-09-18 12:15:29', '2023-03-18 12:15:29'),
('a6d3c64e0024f22284a49043931d371387bb9e86629047cbc62d8b411af74e0bbe155d7415dbfaa5', 1, 3, 'refreshToken', '[]', 0, '2022-06-23 03:29:20', '2022-06-23 03:29:20', '2022-12-23 03:29:20'),
('a71aa98ff66295315e6fa61da13dc2ff370f390fc7b96932a4d5d71eec8593db621323d4565bd18a', 1, 1, 'authToken', '[]', 0, '2022-03-29 05:35:15', '2022-03-29 05:35:15', '2022-09-29 11:35:15'),
('a788d88fe66822dc7d7cf2c7796a86f0db2b9e6875e7359448af37f58446e40bdc97c1e1384820f2', 65, 21, 'refreshToken', '[]', 0, '2023-01-14 12:48:55', '2023-01-14 12:48:55', '2023-07-14 12:48:55'),
('a91ab78628b0ea2c263fafc6857157f32f5095694e8aff8839401068a0ead87572619f48d271a228', 16, 3, 'authToken', '[]', 0, '2022-06-16 14:36:22', '2022-06-16 14:36:22', '2022-12-16 14:36:22'),
('a933f3903b83606968f0215754cf34d8e60235b184d2fa4d024fdd0f9feea503d62c10ccf4fc72e3', 1, 3, 'refreshToken', '[]', 0, '2022-06-16 03:54:11', '2022-06-16 03:54:11', '2022-12-16 03:54:11'),
('a977e66392f1262c166d90ba1be451a17c52fa382be4979d49d30349b3de0d240f51d168fca8653b', 1, 3, 'authToken', '[]', 0, '2022-07-20 09:57:41', '2022-07-20 09:57:41', '2023-01-20 09:57:41'),
('a993579a80ef5e8708579b0989e45c560238da0f175ad1124819275aecaee7e0ef1def317e76cca2', 1, 21, 'refreshToken', '[]', 0, '2022-12-21 15:08:27', '2022-12-21 15:08:27', '2023-06-21 15:08:27'),
('a9abf1487ab9647ea7b6f2fe187fb40e61c745bf265a618fa2c787be31f0e14157c84e93f6605ab0', 1, 21, 'authToken', '[]', 0, '2023-01-21 12:23:06', '2023-01-21 12:23:06', '2023-07-21 12:23:06'),
('a9d34e5b48cc66bc74248dfb49bede498548e6d107124cfd6526444d84f8c001acee8b4709474e43', 63, 21, 'authToken', '[]', 0, '2023-01-16 12:19:07', '2023-01-16 12:19:07', '2023-07-16 12:19:07'),
('a9d39f5c1301ec28dca3f48e0f1e762a14e9faeb87a2eaf7586b0c6c08531e204f0d0e616532d571', 1, 3, 'refreshToken', '[]', 0, '2022-08-04 05:20:40', '2022-08-04 05:20:40', '2023-02-04 05:20:40'),
('aac4adbc01e87bddd26395468359776da3b53442e406b146a19c84d2bfdf74aa6bccf425d34295d4', 63, 21, 'refreshToken', '[]', 0, '2023-01-14 12:15:44', '2023-01-14 12:15:44', '2023-07-14 12:15:44'),
('ab916f4982306bbc99c7deb033968a900263e0e461cbff477f5d419aaa70df47360c39e35dd35f45', 1, 3, 'refreshToken', '[]', 0, '2022-06-19 14:40:48', '2022-06-19 14:40:48', '2022-12-19 14:40:48'),
('abb4e7380b2b64692122d900d2a7032d472929ac4025537f67e41adf3a54fddf2e21b8c81e19e320', 58, 21, 'refreshToken', '[]', 0, '2023-01-25 04:39:14', '2023-01-25 04:39:14', '2023-07-25 04:39:14'),
('abd885c523095fc3e42f749d5e2a233da580460528b8b810a06c0f4677480d0f68db669f8a5a0986', 1, 21, 'refreshToken', '[]', 0, '2022-12-29 09:03:23', '2022-12-29 09:03:23', '2023-06-29 09:03:23'),
('ac08cc358b878ad0530c7e2ce7b17e37fd524e5c30dc89d043493e3ffa4c13eb5acef28c079da130', 1, 3, 'authToken', '[]', 0, '2022-09-18 11:51:09', '2022-09-18 11:51:09', '2023-03-18 11:51:09'),
('ac10a83a2eacb3c5525ab5feb67738bdfa02a084aa427878ed46f2f7a18f89af2dc5ca7facd3a8bc', 36, 21, 'refreshToken', '[]', 0, '2023-01-04 09:18:37', '2023-01-04 09:18:37', '2023-07-04 09:18:37'),
('ac28c4bd2867eeb265fcc4332f1ff8e133f44552a42b3be1c47891f43f9bc409a38ee59b89fc0b9f', 1, 21, 'refreshToken', '[]', 0, '2023-01-16 12:08:04', '2023-01-16 12:08:04', '2023-07-16 12:08:04'),
('ac7764462f7ca55534dea7b6846f32d25f4d7a3cbf014a2575e012c9f8c33d897379b953161b3c3a', 1, 3, 'authToken', '[]', 0, '2022-07-04 03:12:51', '2022-07-04 03:12:51', '2023-01-04 03:12:51'),
('acf3e87858fb44426945914e2d57173846db561257a00c40627f2ad50c211c4002e2ce426fb23728', 1, 21, 'refreshToken', '[]', 0, '2022-12-20 17:22:44', '2022-12-20 17:22:44', '2023-06-20 17:22:44'),
('ae6f77ce1a3bb96eee1259c1edc2a76e1ac3a4168f2722ec9d92dd0ef49625c1d0cbd0676eb9914c', 67, 21, 'refreshToken', '[]', 0, '2023-01-31 00:41:29', '2023-01-31 00:41:29', '2023-07-31 00:41:29'),
('af00d292965b5a2f8a25ea4f3b84c23fc86ee9444d74730c31bfc6c58064a8d1137c31b9ffb0e815', 1, 3, 'refreshToken', '[]', 0, '2022-07-21 07:17:30', '2022-07-21 07:17:30', '2023-01-21 07:17:30'),
('af1628c6efbcbc6e0c25d36501e402818787637b20a71eec7c7bd10369d60c9a423c8f8c54c3945f', 59, 21, 'refreshToken', '[]', 0, '2023-01-29 13:13:57', '2023-01-29 13:13:57', '2023-07-29 13:13:57'),
('af18eb7a5f7f060d2f06a423b0c137a0b8bd5237072bbde27b8bb272de913657248caf1bd6209a76', 35, 21, 'refreshToken', '[]', 0, '2022-12-22 10:47:45', '2022-12-22 10:47:45', '2023-06-22 10:47:45'),
('af676e874455f1a07a914d6fb7d48fe71a8c704cafad9f759455277a6cdc58851266df304b407a24', 1, 3, 'authToken', '[]', 0, '2022-07-16 06:15:36', '2022-07-16 06:15:36', '2023-01-16 06:15:36'),
('b02a34d96642579ca15b4cd9afa0b30eb48010cb4e3e46880c112f75dc1ea12d6da4d038d5bad334', 1, 21, 'authToken', '[]', 0, '2023-01-09 09:56:20', '2023-01-09 09:56:20', '2023-07-09 09:56:20'),
('b07f5fb4920a7f2a79788c1929cc3a5ca4e72a7057ac48bc34559cdc811d0a618045f6c13ec14b6f', 1, 3, 'refreshToken', '[]', 0, '2022-06-02 13:21:08', '2022-06-02 13:21:08', '2022-12-02 13:21:08'),
('b097dbe89ddc8fa51862003fac41556a25e02525882240da3f37cf50a24157cf2c250a8dae8a7f70', 1, 21, 'authToken', '[]', 0, '2023-01-16 12:03:07', '2023-01-16 12:03:07', '2023-07-16 12:03:07'),
('b0f0cd9c21346b66062f534d48b61a0367fd82f7b01e7f62c60c810351523661ae5e4e02fa9bc2ec', 35, 21, 'authToken', '[]', 0, '2023-01-25 07:18:50', '2023-01-25 07:18:50', '2023-07-25 07:18:50'),
('b14de61dd04e9e83fc13220a1dd58ff4e5a93e165082d1d28334f15bfd89bc1d16d5ad3046767e5a', 1, 3, 'authToken', '[]', 0, '2022-08-10 05:24:51', '2022-08-10 05:24:51', '2023-02-10 05:24:51'),
('b1537dc357664bd0162f7e3d2556c29e7601a2c45d9761120ef754a8118d661f67c73d91e0ac73f1', 9, 21, 'authToken', '[]', 0, '2023-01-05 09:58:19', '2023-01-05 09:58:19', '2023-07-05 09:58:19'),
('b1c67b51dcd04989b662e961a482ac1a28d51d73cb09020650a138c5d7f0ddf867d3a29dde695b56', 70, 21, 'authToken', '[]', 0, '2023-01-30 01:53:58', '2023-01-30 01:53:58', '2023-07-30 01:53:58'),
('b219d9e0082fb1744abe416ee47efcd3469594d8fb78e2fc68103ebc101e8fa1aff7759813632e34', 59, 21, 'refreshToken', '[]', 0, '2023-01-25 05:04:47', '2023-01-25 05:04:47', '2023-07-25 05:04:47'),
('b26a4659112b2a11974e17a80f9c2f2ad2d67950f6536a4c71cd0a4bcc256b30ff1c07c552132aaf', 9, 3, 'authToken', '[]', 0, '2022-10-02 20:16:44', '2022-10-02 20:16:44', '2023-04-02 20:16:44'),
('b28a8d66aed2b640f5753e0ae3b6d08b1b68419021b0e15cfefc732367be626dfaac46bbc63305e3', 68, 21, 'authToken', '[]', 0, '2023-01-29 05:59:50', '2023-01-29 05:59:50', '2023-07-29 05:59:50'),
('b28e828843a78e57b7db78817f82bc1770026bf8ea545ec75b3da36a219bc461e6eab00120bfcd5e', 1, 3, 'refreshToken', '[]', 0, '2022-09-25 12:07:04', '2022-09-25 12:07:04', '2023-03-25 12:07:04'),
('b29ec891353f29526d8ae311336233523d51a1206d4bdc60da3d12d315e9d08a54f2b160ae53bd65', 1, 3, 'authToken', '[]', 0, '2022-06-19 14:40:48', '2022-06-19 14:40:48', '2022-12-19 14:40:48'),
('b2c909d35dea7df1c84bfb251c64c48e77abfe33ad18b798dbc151c727850cee9528a6f39a9138d7', 68, 21, 'refreshToken', '[]', 0, '2023-01-25 06:03:54', '2023-01-25 06:03:54', '2023-07-25 06:03:54'),
('b2e7c9cb7b721b6f282a8984b2c68a62d406ca3ea4b9f0cc82636ec1fb15b3b1f98aafdfaff34fe0', 33, 21, 'authToken', '[]', 0, '2023-01-02 07:56:24', '2023-01-02 07:56:24', '2023-07-02 07:56:24'),
('b32efdcab8ecaf55cf0bb02978eeca8b885238c18ab1fc74e5c7cd809f657b5a2c8806300dd43cf0', 1, 3, 'refreshToken', '[]', 0, '2022-06-01 06:35:28', '2022-06-01 06:35:28', '2022-12-01 06:35:28'),
('b3370181483d3ca334a7452eda7fad3787908686f21098dd62bae774bf05db35f4639a9dfa0183be', 1, 3, 'authToken', '[]', 0, '2022-05-24 10:46:17', '2022-05-24 10:46:17', '2022-11-24 10:46:17'),
('b42e0fd7479c1d345d492a14798255986d4338de543b8bc15162a920cdd654c457b65c86c588b9fa', 1, 21, 'refreshToken', '[]', 0, '2023-01-12 00:54:46', '2023-01-12 00:54:46', '2023-07-12 00:54:46'),
('b465d788bcca560c8681fbe3e2d309bc594d21f28fa5b88f9a1567af96383e72514a8a65fa941c98', 1, 19, 'refreshToken', '[]', 0, '2022-11-13 16:43:15', '2022-11-13 16:43:15', '2023-05-13 16:43:15'),
('b49665b55d8efb78938acf4907ebdcc39ad1034c5c0dd6d4a8c9006a8e4338e307dcd0d52e451738', 1, 1, 'refreshToken', '[]', 0, '2022-04-03 22:34:11', '2022-04-03 22:34:11', '2022-10-04 04:34:11'),
('b4a8f5c7fb3cae36711de116898984dafd112f700628704f64d0a9329edff550f3d0c2b6c3e968e5', 1, 21, 'refreshToken', '[]', 0, '2023-01-05 09:57:58', '2023-01-05 09:57:58', '2023-07-05 09:57:58'),
('b543c5ad32ec37b8df7936b79355737be8268a37ba7efd460813fa92cbd9de6ed1369225e83f11a2', 1, 3, 'authToken', '[]', 0, '2022-06-13 08:53:07', '2022-06-13 08:53:07', '2022-12-13 08:53:07'),
('b556104b2f8cca266247a137fb6ea21481edbeeb65eb4c7607e38ce9cd3cfec922e5b6e9f5d9192f', 54, 21, 'refreshToken', '[]', 0, '2023-01-08 12:29:01', '2023-01-08 12:29:01', '2023-07-08 12:29:01'),
('b5e1ba34de66d6eef13e39fde3ea4705e66bdfd9c15a6d49ca0a2a96e01b9b612e48c0cd7e3929de', 1, 21, 'refreshToken', '[]', 0, '2022-12-22 14:37:01', '2022-12-22 14:37:01', '2023-06-22 14:37:01'),
('b60e2fe5fd03882c58d267302c9b2b54451b63c9bfbd2bcbc7811dae59964954874e3a9924008f56', 1, 3, 'authToken', '[]', 0, '2022-09-08 04:51:32', '2022-09-08 04:51:32', '2023-03-08 04:51:32'),
('b69cc52fcb8f8d525a9b247d939acfa622369ad81e6a1f870d66946b385d5939f0dc6dc0029ddd53', 1, 3, 'authToken', '[]', 0, '2022-08-24 15:39:48', '2022-08-24 15:39:48', '2023-02-24 15:39:48'),
('b6b8b7574ea96ed62c741b30fdc99d81c83dfefde409bfcf3e0e0fcb249ae898247ff884ff3ce5e1', 1, 21, 'authToken', '[]', 0, '2023-02-04 23:37:39', '2023-02-04 23:37:39', '2023-08-04 23:37:39'),
('b6cb7930083aaf010861bb150d1aaad857b2694280dab8996eca1a8747c55049b574023425c43dfa', 1, 3, 'authToken', '[]', 0, '2022-09-19 12:51:30', '2022-09-19 12:51:30', '2023-03-19 12:51:30'),
('b7a84259915ffdf8b42c101a524352dda8eefdb7d6ced42e05fb0008c4696a97f62991ea2faa0209', 4, 19, 'refreshToken', '[]', 0, '2022-11-13 17:22:53', '2022-11-13 17:22:53', '2023-05-13 17:22:53'),
('b80f8ba17788c28c5771576f106442f23d76ff933753904f03e4f611d4af47507e06746ee0e04f8c', 1, 3, 'refreshToken', '[]', 0, '2022-07-20 05:05:07', '2022-07-20 05:05:07', '2023-01-20 05:05:07'),
('b84e8f0c8ced457366156ac346454c3bf802dbd6f0d0d58936557434ddc66ff896871cda71757ffc', 65, 21, 'authToken', '[]', 0, '2023-01-21 13:05:48', '2023-01-21 13:05:48', '2023-07-21 13:05:48'),
('b899e6e38cc952145478e4ab3725f98c86597424a6f6317e71d15f1c98c14e069ab40fa3bde92a6f', 60, 21, 'authToken', '[]', 0, '2023-01-15 04:07:25', '2023-01-15 04:07:25', '2023-07-15 04:07:25'),
('b97313a05e2f06aa1df289218eb0277c384c120f559d303c769866de60f7361dd9d91ba612981995', 70, 21, 'refreshToken', '[]', 0, '2023-01-30 01:53:58', '2023-01-30 01:53:58', '2023-07-30 01:53:58'),
('b97bcaedb94b211c3bdaec5efdb054f6b3b9ef7f694ee383b0a386e3d2efacbaa55a1cb700a7347d', 59, 21, 'authToken', '[]', 0, '2023-01-29 06:19:52', '2023-01-29 06:19:52', '2023-07-29 06:19:52'),
('b98f2af243ab03e5fe1d922c6797f356018bdf8ebd9b0567a89b967b6d664e10c3b2926aaf2eb887', 1, 21, 'refreshToken', '[]', 0, '2023-01-09 08:46:07', '2023-01-09 08:46:07', '2023-07-09 08:46:07'),
('b99dc0e6c14dfa771592e2469973ac621f0509b099a8b86b9266fe44799d21847e6283b099704fc0', 1, 3, 'authToken', '[]', 0, '2022-10-02 21:09:46', '2022-10-02 21:09:46', '2023-04-02 21:09:46'),
('ba3760203c22cf025abd7757a2f66507bd079b7b01e498ee982ef07c2c6fb69ec3dbb1d3b0461496', 1, 21, 'refreshToken', '[]', 0, '2023-01-21 12:23:06', '2023-01-21 12:23:06', '2023-07-21 12:23:06'),
('ba8faa2d5c71d4c9ec69d7b2b1b20ec17b1bd0e801e64ae4a42a1ac0f4460d4075ea011fc9174b3a', 58, 21, 'refreshToken', '[]', 0, '2023-01-30 04:25:19', '2023-01-30 04:25:19', '2023-07-30 04:25:19'),
('bb540321629011be2eee58e79e75af084ba2608f1cd2cfe42e7f6dba71604eaef6c9891d8c777f8d', 1, 21, 'authToken', '[]', 0, '2023-01-29 23:13:25', '2023-01-29 23:13:25', '2023-07-29 23:13:25'),
('bb60133c41a316cb767557e968103aff3e0c151e6b23fc9af859dbb7f90365d18336d081baf15e73', 35, 21, 'refreshToken', '[]', 0, '2023-01-25 07:18:50', '2023-01-25 07:18:50', '2023-07-25 07:18:50'),
('bb6cae8d49725205e821256a1c4b6319ba8c34ec768a94494a6c81428b277164df9d24b47deec5eb', 1, 1, 'refreshToken', '[]', 0, '2022-05-07 22:13:36', '2022-05-07 22:13:36', '2022-11-08 04:13:36'),
('bc08e9924fffce6573e1021a8863a35e35f26b892f3c7fec5ae92b447cc80bb0f559c4c3ed2c6e76', 1, 3, 'refreshToken', '[]', 0, '2022-08-03 04:57:59', '2022-08-03 04:57:59', '2023-02-03 04:57:59'),
('bc1ed681ad5c8c42fe6f279460073b849c5e06cf32b6cd59afb66151192bbcb2f522f171d04babec', 7, 3, 'authToken', '[]', 0, '2022-07-06 08:49:29', '2022-07-06 08:49:29', '2023-01-06 08:49:29'),
('bc611d9a1dffec23873a6bc372e1cf923148d76e65015780a1981c20a60f66ef790ec9b96b9ffb70', 1, 3, 'refreshToken', '[]', 0, '2022-05-24 10:46:17', '2022-05-24 10:46:17', '2022-11-24 10:46:17'),
('bc9f11c1738f9ea37d9af0579461fc70972c87e9fd06747463a1bce9b282aca74c46ce12eb0ff5f8', 1, 21, 'refreshToken', '[]', 0, '2022-12-18 05:58:23', '2022-12-18 05:58:23', '2023-06-18 05:58:23'),
('bcd936e716c27f3060d74fdefe1ea59254db6b52bdf0fbe03839abdd8e71560449e15cadddd3e187', 3, 21, 'authToken', '[]', 0, '2023-01-08 08:49:06', '2023-01-08 08:49:06', '2023-07-08 08:49:06'),
('bce1c9a5757d77a17d014b3b4b6ecbd3b12c23e0538349d7c78bd067011711792983f31e7c5acef5', 36, 21, 'authToken', '[]', 0, '2023-01-04 09:31:32', '2023-01-04 09:31:32', '2023-07-04 09:31:32'),
('bd3f7e8e840b2c595d930f381e1438599a0425045b0ff84cdcbb2ae03f29ec91ff9419969d7551d8', 1, 21, 'refreshToken', '[]', 0, '2023-01-02 08:00:20', '2023-01-02 08:00:20', '2023-07-02 08:00:20'),
('bd58edf3aba6b274fc2f32054b34d0183f18aee7f469ae9a6101d3e7083be4983b236ada133f57a3', 33, 21, 'refreshToken', '[]', 0, '2023-01-02 08:00:03', '2023-01-02 08:00:03', '2023-07-02 08:00:03'),
('bd7af0508258ec7cc8fc93d974052d4541c4c324b3a069e49363605a3a81bc41e155a4d2e9ec1290', 27, 19, 'authToken', '[]', 0, '2022-11-13 19:29:51', '2022-11-13 19:29:51', '2023-05-13 19:29:51'),
('bd8d0149dbe8eeca4e32fb1b8a33b9e62e30b2b61dcfb5d5468dce4cb87cc94f3a6d6b29558bea25', 1, 21, 'authToken', '[]', 0, '2023-01-19 09:35:14', '2023-01-19 09:35:14', '2023-07-19 09:35:14'),
('bdf1d6f935748d46855504be229208d332c97f257a47e97a144c41619eff47172ebfec24b17759a3', 1, 3, 'authToken', '[]', 0, '2022-09-22 05:27:32', '2022-09-22 05:27:32', '2023-03-22 05:27:32'),
('be263b786c85c13f3ab3d16dc5fea646dc19d92c5459e23c06bf8192e7f74c745cfcde58ea66ba15', 1, 21, 'refreshToken', '[]', 0, '2023-01-21 09:06:31', '2023-01-21 09:06:31', '2023-07-21 09:06:31'),
('bf01d48cff434142583c73521e6a7ecb83ed2165fecd88d8e647dd18f312c0c96f53e2a50098f2f8', 1, 21, 'authToken', '[]', 0, '2023-01-16 12:23:27', '2023-01-16 12:23:27', '2023-07-16 12:23:27'),
('bf78f554861df0acc68ce594a4c721ed31572880bfcd88bc2ae375a778a0424edddfc85d35d6ad43', 1, 21, 'authToken', '[]', 0, '2023-01-24 02:20:59', '2023-01-24 02:20:59', '2023-07-24 02:20:59'),
('c093736a8b93061c47c99f705d490c4dbc18154d19111eebfa42447e13a35610ef37874819a15698', 3, 3, 'authToken', '[]', 0, '2022-09-26 06:55:30', '2022-09-26 06:55:30', '2023-03-26 06:55:30'),
('c148d396cad1898523ce125254f5d52d4e63af209641a3f518633c1705404b463beef8592480d757', 54, 21, 'refreshToken', '[]', 0, '2023-01-08 16:50:20', '2023-01-08 16:50:20', '2023-07-08 16:50:20'),
('c1fdeac1b40700238199a54fd483c76bfd17a0ea720598fc31257aa7020197483849ed984d0ae4ea', 1, 21, 'refreshToken', '[]', 0, '2023-02-06 07:18:29', '2023-02-06 07:18:29', '2023-08-06 07:18:29'),
('c2432a027f2d69c9d6f569e7b9c4d1b57c8c4e919ae7bc8e0e4dd0aaff0e3a6f6e7c01d3cf5d418b', 1, 3, 'refreshToken', '[]', 0, '2022-10-21 06:23:50', '2022-10-21 06:23:50', '2023-04-21 06:23:50'),
('c2788b76585c08a6c4a5a2c550f606038a68c9984d75e776b310eedf80ec4e4bc1c8760851cd26be', 1, 1, 'refreshToken', '[]', 0, '2022-04-05 23:49:31', '2022-04-05 23:49:31', '2022-10-06 05:49:31'),
('c2dce09d09f159c8f345a70a3576804a81641640206f79de907457c9473fd551e894504eda6fa71a', 1, 3, 'authToken', '[]', 0, '2022-06-19 14:52:52', '2022-06-19 14:52:52', '2022-12-19 14:52:52'),
('c340250ead5fe62f92f09c42cb099443c2144bcd263d755c81fa3c7ecb6ffba07295e955aad77a0b', 7, 3, 'refreshToken', '[]', 0, '2022-09-04 14:34:21', '2022-09-04 14:34:21', '2023-03-04 14:34:21'),
('c3ce49a5ced1ad67a79e21aa142611b0251f75707f2170d380ac0a742e8c989face83ceecc505a2b', 1, 21, 'authToken', '[]', 0, '2022-12-19 06:03:55', '2022-12-19 06:03:55', '2023-06-19 06:03:55'),
('c3dfda2f72b01ba2b8d37dbc3d05e8aaf57c6b1531c09c3072ec51e27d251b3a1e8feb58db293613', 1, 1, 'authToken', '[]', 0, '2022-05-07 22:38:13', '2022-05-07 22:38:13', '2022-11-08 04:38:13'),
('c3e99380c292d6cdcf5bb6af0becd399553a596b590dcfd773b8f06b014e5f6ce80e26e33b775689', 58, 21, 'authToken', '[]', 0, '2023-01-29 01:21:07', '2023-01-29 01:21:07', '2023-07-29 01:21:07'),
('c447b1436c75ca48078ebae12efdfff71b1faee1907cd30bdb28bc966100db3db671dd276a8e9e8c', 36, 21, 'authToken', '[]', 0, '2023-01-02 08:02:13', '2023-01-02 08:02:13', '2023-07-02 08:02:13'),
('c4f587989c056f0237ff7395e72b6c8279b182dd150a1e01c0d5fb61ff9eaa4b826a64f6f3f585d5', 58, 21, 'authToken', '[]', 0, '2023-01-31 00:47:26', '2023-01-31 00:47:26', '2023-07-31 00:47:26'),
('c518ce4905bbfe1a20e9b4116a19c304ada1719061a6e7a5b4c15cd3e92551557b9e2513a6bfc813', 3, 3, 'refreshToken', '[]', 0, '2022-06-26 06:07:02', '2022-06-26 06:07:02', '2022-12-26 06:07:02'),
('c59cb6b7512477528d903fd4e2aaba4e6ec216ac5f09543dfe5c5379fc68ffbc1666ecd36030296c', 67, 21, 'authToken', '[]', 0, '2023-01-22 13:46:31', '2023-01-22 13:46:31', '2023-07-22 13:46:31'),
('c5e2c38e326c9647db15e41695e0e126b27d0fca0e5054a144a90b8cdcd1c729446e23fff91fcfbd', 1, 3, 'refreshToken', '[]', 0, '2022-09-18 11:51:09', '2022-09-18 11:51:09', '2023-03-18 11:51:09'),
('c5e2e31d9c47c31467037b1b7a5f890675604333bb5898030ab2a0d14c8081a57e5890e7663f1c60', 1, 19, 'authToken', '[]', 0, '2022-11-10 17:32:55', '2022-11-10 17:32:55', '2023-05-10 17:32:55'),
('c6a00dd2e2ff059a2f1baaa33001628e2cb42b93f22c4a4221632e98c29f10c70b999db4cddd8833', 1, 21, 'authToken', '[]', 0, '2023-01-04 06:59:47', '2023-01-04 06:59:47', '2023-07-04 06:59:47'),
('c6ae0a8f5398538d4672dcd9d43d803bb6b2f2b09696a0d4cc399d8abef253c30659cb810ab54e0d', 1, 21, 'refreshToken', '[]', 0, '2023-01-15 04:10:03', '2023-01-15 04:10:03', '2023-07-15 04:10:03'),
('c6f39e6e0be02a4c8ba45e3c5ddebf841fc606d382b000b25b7bfae8df9bdd3d1a6b82cd174739dd', 1, 21, 'refreshToken', '[]', 0, '2023-01-04 14:26:36', '2023-01-04 14:26:36', '2023-07-04 14:26:36'),
('c730f0dcddcaebf7c3079485ec368436d9746fe4c073af57273bc14dae7aa5642925a87deae5f02a', 1, 21, 'refreshToken', '[]', 0, '2023-01-22 01:18:20', '2023-01-22 01:18:20', '2023-07-22 01:18:20'),
('c75b3e32acd8594b586a209a1db3d9715562fa8ffdeffbbb164aa6004d9c96a19e2bb09081dc8d21', 1, 3, 'refreshToken', '[]', 0, '2022-09-04 14:04:38', '2022-09-04 14:04:38', '2023-03-04 14:04:38'),
('c7b3bb42a4a5a98903169fc9d022a3546111c7f361b24c441d97a52715b5ca502a380c08f866bd9c', 1, 21, 'refreshToken', '[]', 0, '2022-12-17 05:43:08', '2022-12-17 05:43:08', '2023-06-17 05:43:08'),
('c7ea9443399d2b99ac0c5d7f80da97f2fb52028a18895aac36c00ce1dd89c085549554a599bd58c5', 1, 21, 'refreshToken', '[]', 0, '2023-01-17 00:09:24', '2023-01-17 00:09:24', '2023-07-17 00:09:24'),
('c808f74b01d84b7a98c37b1c8263234bc1f4898020a922b33e721c0e7cb3c8e70f21e2aeb4490816', 1, 21, 'refreshToken', '[]', 0, '2023-01-19 05:50:59', '2023-01-19 05:50:59', '2023-07-19 05:50:59'),
('c82506adc7d27e14e722e2ad93123e3034406cc0722793bd831c0292d8f9cfc378d79e189893f913', 63, 21, 'authToken', '[]', 0, '2023-01-17 07:16:23', '2023-01-17 07:16:23', '2023-07-17 07:16:23'),
('c8647b5cb400050e7ad82078d42d8310fda248d77e429cf79b08d7279acc86c76e5d7d1f0f1e7d24', 4, 19, 'authToken', '[]', 0, '2022-11-13 17:26:08', '2022-11-13 17:26:08', '2023-05-13 17:26:08'),
('c86b4880bfbc8b74ebd0fc66e926b1b02b11c8483be8b066e504cee076501b213823c8db88fcbca4', 9, 21, 'authToken', '[]', 0, '2023-01-14 13:59:22', '2023-01-14 13:59:22', '2023-07-14 13:59:22'),
('c940add3eb7e384c6ce9cc7ea5f9380c88887e39ddd100dd8dc74b1ad0cd749902ee0946c42a6c35', 1, 3, 'authToken', '[]', 0, '2022-06-02 08:42:29', '2022-06-02 08:42:29', '2022-12-02 08:42:29'),
('c9d9970de70e1656637dd583b7c65d5b55eb89eb7e1ac07d3528462ab4fa8926282333a4cd244249', 1, 21, 'refreshToken', '[]', 0, '2022-12-20 22:15:36', '2022-12-20 22:15:36', '2023-06-20 22:15:36'),
('c9f9972cd1d9f2eff9e22f1908ce01e30f50423907f26b3301d6f5f6c3544b7e5ce9b51fb28ba459', 21, 3, 'refreshToken', '[]', 0, '2022-10-02 20:43:29', '2022-10-02 20:43:29', '2023-04-02 20:43:29'),
('ca0395f8c23ba4fe4475c4775b3fc4ed55a36635f40d66ada009d16438671603d25ece31ff32f404', 1, 21, 'authToken', '[]', 0, '2022-12-27 17:33:25', '2022-12-27 17:33:25', '2023-06-27 17:33:25'),
('ca8c36bd9dfbac43b6442856af5f69b88699d2b81a947b04a12fef95f78fb05cd7935ef762e9dbce', 1, 3, 'refreshToken', '[]', 0, '2022-09-18 12:15:13', '2022-09-18 12:15:13', '2023-03-18 12:15:13'),
('cc0402c1eef8d21375796516b516495bb0c89e7e7ce4ce86686a12ed365725d0641a13ae36157c61', 1, 3, 'authToken', '[]', 0, '2022-07-21 07:17:40', '2022-07-21 07:17:40', '2023-01-21 07:17:40'),
('cc0cdfe3a597affe37cd72d7d1a208a3a8c3a083b65adee9dfa09945e68240b82da15f9ecd5a8f7d', 54, 21, 'authToken', '[]', 0, '2023-01-08 12:03:03', '2023-01-08 12:03:03', '2023-07-08 12:03:03'),
('cc1f298b556c08a9acefc509c754cad72172c7a04c7399033003c04ffa94c8b9ccd4e5e30ac2418f', 1, 21, 'authToken', '[]', 0, '2022-12-22 11:08:59', '2022-12-22 11:08:59', '2023-06-22 11:08:59'),
('cdcb26f2522191d975b342fb64c25f817d804f71597c6d4edcf02ad26ea4725d18160bb1d9d0cf96', 9, 3, 'authToken', '[]', 0, '2022-10-02 19:36:12', '2022-10-02 19:36:12', '2023-04-02 19:36:12'),
('cdf6aee2d505f15459ab6819b15ce8f29e69e5e7faf7dc3a726198d45b1295199d9420af943f4311', 60, 21, 'refreshToken', '[]', 0, '2023-01-25 07:11:14', '2023-01-25 07:11:14', '2023-07-25 07:11:14'),
('ce2311bbefe4bbc3653528cf223567c787e6af49ca80567da0466492031618847ecf5450acdf807c', 58, 21, 'authToken', '[]', 0, '2023-01-29 04:59:33', '2023-01-29 04:59:33', '2023-07-29 04:59:33'),
('ce685845432668d00605e87f9ed1835ac96a6173c59719f484bcb98e183566fad12524f62de5b8de', 1, 21, 'authToken', '[]', 0, '2023-01-12 00:54:46', '2023-01-12 00:54:46', '2023-07-12 00:54:46'),
('ce78ab55bbbd73e6fae2b2fafa7afdf33766eb8d79446bd9c173f019e27e5339f12cccd5421f944b', 1, 3, 'refreshToken', '[]', 0, '2022-07-20 09:57:41', '2022-07-20 09:57:41', '2023-01-20 09:57:41'),
('ceb90c19fb1cb9ee8c45b4dbfec8734aa3294e48167287c0790f6d978982a7810ae038befe49d956', 78, 21, 'authToken', '[]', 0, '2023-02-04 08:38:51', '2023-02-04 08:38:51', '2023-08-04 08:38:51'),
('d0070548786fab9e69bdf76fc72e2fc468f0ff080bc4d65d7c75d1e100f9244722fb1429effedd2b', 3, 3, 'refreshToken', '[]', 0, '2022-09-25 12:08:08', '2022-09-25 12:08:08', '2023-03-25 12:08:08'),
('d05569aabe932d2dbf372b114510c11566fb1a9da5ab05dfca374b6c1a6e39bf412da688a0075aa8', 54, 21, 'refreshToken', '[]', 0, '2023-01-08 12:03:03', '2023-01-08 12:03:03', '2023-07-08 12:03:03'),
('d09e3fcf107d1ad7cd37845a0f6e8de639fd13ede78b60dce67ac2d3c88f0f9f9df287f281143d3a', 1, 21, 'authToken', '[]', 0, '2023-01-29 11:50:28', '2023-01-29 11:50:28', '2023-07-29 11:50:28'),
('d17b9e44932e9c2b80d34a0718a667393264af951c6466e623019fc25d410546697c319493486e1e', 7, 3, 'refreshToken', '[]', 0, '2022-09-04 15:16:11', '2022-09-04 15:16:11', '2023-03-04 15:16:11'),
('d1c439d30057c90b0a9496e5203a98ce0fc88238ead5fedd77684d5a0b225b0f97e51e756bf9303c', 1, 3, 'refreshToken', '[]', 0, '2022-06-15 05:09:59', '2022-06-15 05:09:59', '2022-12-15 05:09:59'),
('d29747cf1f401c3238c2f18b122c8e78944414fe5dfa063608825b3426fdbb97759ca301557bfdb2', 1, 21, 'refreshToken', '[]', 0, '2023-01-02 07:55:57', '2023-01-02 07:55:57', '2023-07-02 07:55:57'),
('d29cf4f014d7eb3ec8283f1333704afae28955bf40169fd2914452452d46e73830489fdb10149e67', 1, 21, 'authToken', '[]', 0, '2023-01-21 11:50:22', '2023-01-21 11:50:22', '2023-07-21 11:50:22'),
('d2d87ad8e5aaaad8b0641e09da9fbe182c6b489d3ec34160127dc382ef415434f7416e01db8fcf9e', 1, 3, 'refreshToken', '[]', 0, '2022-07-21 07:17:40', '2022-07-21 07:17:40', '2023-01-21 07:17:40'),
('d2d8cee195ab9d3f7c5abe72bdabd120621f55a860edf86d974baccbf7bb8d1c9825d1e28e5800c6', 22, 3, 'refreshToken', '[]', 0, '2022-10-02 18:39:53', '2022-10-02 18:39:53', '2023-04-02 18:39:53'),
('d321a28cef3571d8f2ed995a7b831f5ad83e2580708f207a29aebf575afa2065a70f40e657cec793', 1, 21, 'refreshToken', '[]', 0, '2023-01-14 11:40:14', '2023-01-14 11:40:14', '2023-07-14 11:40:14'),
('d3316771459fe07f977da8b7f03ca13a5046141096cf63f2a2edc6b57cfd4be126927c98b617e58c', 60, 21, 'authToken', '[]', 0, '2023-01-10 06:29:57', '2023-01-10 06:29:57', '2023-07-10 06:29:57'),
('d38b61ca5419c56f6f3ed9fd1aa0b625d9a14a25be7797b6bf8959aa9c627c3856b2b12da888f63c', 1, 1, 'refreshToken', '[]', 0, '2022-05-07 22:38:13', '2022-05-07 22:38:13', '2022-11-08 04:38:13'),
('d3db327885b4014ccdda17a83f3472ec5147a99d85ebfd439f9efdcc30d14984110153f2c2b0c1b9', 1, 21, 'authToken', '[]', 0, '2023-01-31 09:39:28', '2023-01-31 09:39:28', '2023-07-31 09:39:28'),
('d43d9090f6b7eae6a592b584b220b9e1a346f0400a2bba17312e9ce401a5d28091ebe76fe7c12b1a', 1, 3, 'refreshToken', '[]', 0, '2022-06-17 05:55:37', '2022-06-17 05:55:37', '2022-12-17 05:55:37'),
('d4bb0da588c3c3070919685d5f573a96dd5707351eb8e041e22c6dfc2dc282a51b392b02df746a70', 20, 3, 'refreshToken', '[]', 0, '2022-08-21 14:47:57', '2022-08-21 14:47:57', '2023-02-21 14:47:57'),
('d510618059acba6033e37167a92b60b433334e778a9ad3ca04cc718a58726b8bfc92632ee6862eb3', 1, 3, 'authToken', '[]', 0, '2022-06-16 04:11:04', '2022-06-16 04:11:04', '2022-12-16 04:11:04'),
('d511fff036f67f85fc0ad00e5b05fb99d603a63a79b08679ec087c2f730fd754329c26eec1a5f73a', 68, 21, 'authToken', '[]', 0, '2023-01-29 01:20:10', '2023-01-29 01:20:10', '2023-07-29 01:20:10'),
('d5371c17d0feb3dc45af290cfadcf65f37b83cf49e872a0f4eb60c442aebcb8784e6b0d2ca5ee5e6', 1, 21, 'refreshToken', '[]', 0, '2023-01-09 09:56:20', '2023-01-09 09:56:20', '2023-07-09 09:56:20'),
('d5838801e1d53fae488d4612d68a80fcc29ef7edee5a026651f5af692e28a4f4affde073b35e2051', 3, 3, 'refreshToken', '[]', 0, '2022-10-02 11:25:35', '2022-10-02 11:25:35', '2023-04-02 11:25:35'),
('d60b9fc425dc75bf043d7a2937d612463e71a5a6dd937afa656c22a5e346c7d6e147ef41522f23c2', 1, 3, 'authToken', '[]', 0, '2022-10-02 19:25:25', '2022-10-02 19:25:25', '2023-04-02 19:25:25'),
('d61c8e0ccadd574b83d42e5e92f5a21632f99cb39b6e787df440825c616eca430867c6d77ec58960', 1, 1, 'authToken', '[]', 0, '2022-05-07 22:36:49', '2022-05-07 22:36:49', '2022-11-08 04:36:49'),
('d662a378ce981e1fd45dbc5fce6cee1869a10d80bff6ed3e14215d4bb6de602c5b8cdfc22bef9d83', 1, 3, 'refreshToken', '[]', 0, '2022-09-28 06:49:06', '2022-09-28 06:49:06', '2023-03-28 06:49:06'),
('d6809652fafd5f1e5541511bb73fc10145e42dff3a9477b88b54f62f4ddd9b131bb60db763d5001d', 1, 3, 'refreshToken', '[]', 0, '2022-06-02 08:43:18', '2022-06-02 08:43:18', '2022-12-02 08:43:18'),
('d6ae148f748715baff2ebbff07c56fb886ed1867bf9cc5a4ab6861eb06f1841a9e148153aac77afd', 1, 3, 'refreshToken', '[]', 0, '2022-08-01 05:35:14', '2022-08-01 05:35:14', '2023-02-01 05:35:14'),
('d6bc1e23b169330fe510c8735b5fdacfd27de1ec2f3f1c3447470d037423912164a46c9806ada64a', 1, 3, 'refreshToken', '[]', 0, '2022-08-24 15:39:48', '2022-08-24 15:39:48', '2023-02-24 15:39:48'),
('d701c638e281fc25b06d84944b6bcdce3276367e7f3aeb13570438473991619423bc2c0b97e7d544', 1, 21, 'authToken', '[]', 0, '2023-01-21 12:02:09', '2023-01-21 12:02:09', '2023-07-21 12:02:09'),
('d8334dcf15767959dd0367d3fdb99abc765888589a38395c47e46646fc2cbbd64c3a0cb62b0df58a', 1, 21, 'refreshToken', '[]', 0, '2022-12-22 11:08:59', '2022-12-22 11:08:59', '2023-06-22 11:08:59'),
('d8658c3bd0f7e232f5644fdc55e75577cbfe7414614a0ea5319754ebf6103a494c88d38c8dcbf118', 1, 19, 'authToken', '[]', 0, '2022-11-12 16:05:05', '2022-11-12 16:05:05', '2023-05-12 16:05:05'),
('d8a47a111b3fbb435d77ba4a0ad52ab7cc35c748a31609bf2ce422e59352c5fafd21e4bcacd37d4e', 1, 3, 'refreshToken', '[]', 0, '2022-05-26 06:33:00', '2022-05-26 06:33:00', '2022-11-26 06:33:00'),
('d8af09a148ea4353ea8273031c6348863d11815f2ab966e153c35d811f55a1261adcc2bceafa424f', 1, 21, 'refreshToken', '[]', 0, '2022-12-14 16:30:46', '2022-12-14 16:30:46', '2023-06-14 16:30:46'),
('d8c8a50a24b417f997b30408e78c66d384e3be4d345fcc56d9f26dce170d88aebcc952e2ad55ed7a', 66, 21, 'refreshToken', '[]', 0, '2023-01-21 12:36:35', '2023-01-21 12:36:35', '2023-07-21 12:36:35'),
('d8ed90b0d58f175fe93d1914dc538637d63c594adfaf8698b6e1ad6d28d8e662d12f97e3f581b857', 1, 21, 'refreshToken', '[]', 0, '2023-01-12 00:33:13', '2023-01-12 00:33:13', '2023-07-12 00:33:13'),
('d9492bc129c8b93a6e52f41c2ce27f8f8333bb909b269e9c277620aa4222d89dcdf93c9e01686b67', 67, 21, 'authToken', '[]', 0, '2023-01-31 00:41:29', '2023-01-31 00:41:29', '2023-07-31 00:41:29'),
('d97988d5f785026986bfe6a40d7184fddbbd2e3c9a035f985e16418d5a53ec10d26248fb953f5094', 1, 3, 'authToken', '[]', 0, '2022-06-02 08:43:18', '2022-06-02 08:43:18', '2022-12-02 08:43:18'),
('d98881c924a6860ae51f7e2dddd798b5b42c3813ef29b38cf1f3053c64dec7622600859fb8e8b9ac', 54, 21, 'refreshToken', '[]', 0, '2023-01-09 11:58:34', '2023-01-09 11:58:34', '2023-07-09 11:58:34'),
('da6149a1900354f68d4f562cf131b9f1d21761ad67f356fe3c507ee8fd64db1e7b07d79b4b79cb23', 1, 1, 'authToken', '[]', 0, '2022-03-29 05:08:54', '2022-03-29 05:08:54', '2022-09-29 11:08:54'),
('daf557bdac1030c2d3e8146d990b04bb155f0fc790c2cdb1625e29dd7a705e54259847eff9d0d5e8', 60, 21, 'refreshToken', '[]', 0, '2023-01-12 00:31:51', '2023-01-12 00:31:51', '2023-07-12 00:31:51'),
('db073fd97a6ff02923cbacdfc072703cf969e85f6b396f013bc35b2e0e7a11562ce0639dca81ad1c', 1, 21, 'refreshToken', '[]', 0, '2022-12-18 14:38:30', '2022-12-18 14:38:30', '2023-06-18 14:38:30'),
('db07b421376a18096d31ced8fcf5552fe5792c3ae3de8be13ffd37b0081e4664dea9e73775205c49', 58, 21, 'authToken', '[]', 0, '2023-01-21 11:56:09', '2023-01-21 11:56:09', '2023-07-21 11:56:09'),
('db0eae007a3f80a030b6708fb097c45d68c873aa46f591030598a5ca21c51339b1a65e6e9bad0950', 9, 3, 'refreshToken', '[]', 0, '2022-10-02 19:31:40', '2022-10-02 19:31:40', '2023-04-02 19:31:40'),
('db19cd292eec94a3641fcf24a518216acd8a91d96b5ba78e13b904ab9b0cd2e1cd71989066f52f51', 1, 1, 'refreshToken', '[]', 0, '2022-05-07 22:42:19', '2022-05-07 22:42:19', '2022-11-08 04:42:19'),
('db1d03c7c274f5d09306c149bb58172c1687decd4261e8234e36fe94ff17986ddc6fd0aa327596e4', 9, 19, 'authToken', '[]', 0, '2022-11-13 18:40:04', '2022-11-13 18:40:04', '2023-05-13 18:40:04'),
('dbcb858c13007056470d61bf552d4335c5ace46726e2eaaba498d4be8977fe39568014ad5e6583b6', 17, 3, 'refreshToken', '[]', 0, '2022-06-19 16:01:54', '2022-06-19 16:01:54', '2022-12-19 16:01:54'),
('dc2793496fd681d0112edcfcbf60c0014686f1673edf5c44b79d8ca7d7461f015178b6c90819afab', 9, 21, 'refreshToken', '[]', 0, '2023-01-07 18:02:31', '2023-01-07 18:02:31', '2023-07-07 18:02:31'),
('dc4a305a86c21585fa29b3001c093812046abe9483a1f482d217a162bf2470dbc36b3a6d4198bd0e', 58, 21, 'authToken', '[]', 0, '2023-01-25 04:39:14', '2023-01-25 04:39:14', '2023-07-25 04:39:14'),
('dc8954995ab40054233cc3c3cbd5bd0d00c78bc4beb0a930186fcac799f9887f75a30577aa831d50', 1, 3, 'authToken', '[]', 0, '2022-09-21 04:59:52', '2022-09-21 04:59:52', '2023-03-21 04:59:52'),
('dcc56b738cd018034311379c1b664c2f1645a8674aad96b6fc6f158cdb832e5d837a1fe5dfd455ef', 75, 21, 'refreshToken', '[]', 0, '2023-02-04 08:24:25', '2023-02-04 08:24:25', '2023-08-04 08:24:25'),
('dce997a99c0046b2bb3672aeb5a3f75ddacdffe114b3beb4b6dfcb37598566571d33293b3d10f7be', 1, 21, 'refreshToken', '[]', 0, '2022-12-18 14:45:03', '2022-12-18 14:45:03', '2023-06-18 14:45:03'),
('dd7521d6884b1ef48d689aec991cd04084a84396f9224a7a3f8e15e417e01cee0810b15456b51011', 33, 21, 'authToken', '[]', 0, '2022-12-31 07:44:05', '2022-12-31 07:44:05', '2023-07-01 07:44:05'),
('dde1d05933eb76b566eb853fc43e2f9a98699ec883fd2dcda43f823643ffe9a4310d2123b0377fa2', 1, 21, 'authToken', '[]', 0, '2022-12-17 09:53:18', '2022-12-17 09:53:18', '2023-06-17 09:53:18'),
('de38409a1814627216e0fa4279481da033d2c3408118babde717b10cc7752f285e880c0daa261e02', 1, 21, 'authToken', '[]', 0, '2023-01-29 08:14:45', '2023-01-29 08:14:45', '2023-07-29 08:14:45'),
('decd1ece8f8442a365d8afcb72763deb8938e766db36633c889a73f34e370f48ab3eebb546c36fd1', 1, 21, 'authToken', '[]', 0, '2023-01-08 17:01:16', '2023-01-08 17:01:16', '2023-07-08 17:01:16'),
('df2bb93bbeaa76ff877d084dc6406ed7b7a4c1a834e81acdae2797b936246a1bda7bdbf7c4aede28', 1, 3, 'refreshToken', '[]', 0, '2022-08-24 10:02:12', '2022-08-24 10:02:12', '2023-02-24 10:02:12'),
('df49a86e2acb8a2e0961c68f463f780af62d963a6ec4ea9c53c85482d2b516f309d66476d0f68899', 1, 21, 'refreshToken', '[]', 0, '2023-01-14 02:11:45', '2023-01-14 02:11:45', '2023-07-14 02:11:45'),
('df67235a8ca2dbc1409fd6971d1c90f23301ae8495c371c0728923c78d4499270e5f7dc83cb7fb31', 4, 3, 'authToken', '[]', 0, '2022-06-02 09:35:33', '2022-06-02 09:35:33', '2022-12-02 09:35:33'),
('df9686942102c6525c71bb68527f8f2d29d5a38f86b8e2a28961db9ddeae3b45ba591e8fc3fef350', 59, 21, 'authToken', '[]', 0, '2023-01-25 05:36:01', '2023-01-25 05:36:01', '2023-07-25 05:36:01'),
('dfbb0f4dc9acbdd8abff186fc9fa357e413bac80b5437db3f95e158b7fe50aa30f9a56c9e45c9f05', 36, 21, 'refreshToken', '[]', 0, '2023-01-04 09:31:32', '2023-01-04 09:31:32', '2023-07-04 09:31:32'),
('e036f01a28d911488517dae132d84730f1f3022f0204e2bbd68de06e88168a4b4c15a14c6383d5da', 9, 21, 'authToken', '[]', 0, '2023-01-07 18:02:31', '2023-01-07 18:02:31', '2023-07-07 18:02:31'),
('e07eec9d2e0ed1dbf64cee32df771c41f67ed8a29fb16f97136dfff77232a57835e7e450b7415193', 1, 3, 'refreshToken', '[]', 0, '2022-08-29 12:24:57', '2022-08-29 12:24:57', '2023-03-01 12:24:57'),
('e0f49bb86d3e05d194db143d2fe930b7b02dfdc665b365043a119bc1f2db86d0ea92d090dcecc86e', 7, 3, 'authToken', '[]', 0, '2022-08-21 14:50:18', '2022-08-21 14:50:18', '2023-02-21 14:50:18'),
('e166494140ca8edecdf5fb7cb4fe97d0840adc465aa19d299458bdf3a8bf44f0a4733c5ab58af72e', 1, 3, 'authToken', '[]', 0, '2022-10-02 20:10:21', '2022-10-02 20:10:21', '2023-04-02 20:10:21'),
('e1a8a138270f29d41d7d89cc7f31ba7de57958d289ddef587126d5fd3233560bf3e27c498ee90a0e', 1, 1, 'refreshToken', '[]', 0, '2022-05-07 22:28:47', '2022-05-07 22:28:47', '2022-11-08 04:28:47'),
('e1ca3c5fffdf4f1bd68a58e48346e81b045ec241d34619161b3ee89e188fb2c00044b78005e2784a', 1, 3, 'refreshToken', '[]', 0, '2022-06-13 10:46:05', '2022-06-13 10:46:05', '2022-12-13 10:46:05'),
('e1cb1c5218e2c58bcc2a7f0202673b3ab6c32520cd4ae41d04b8aef35f20cbc04443e5aa76639aa8', 1, 21, 'authToken', '[]', 0, '2023-01-07 19:54:37', '2023-01-07 19:54:37', '2023-07-07 19:54:37'),
('e1e23719f7256756d9068a24c82069060086ff05ada7aebc622ffac536582d4e9ef01cb90ff038a5', 1, 19, 'refreshToken', '[]', 0, '2022-11-10 17:32:55', '2022-11-10 17:32:55', '2023-05-10 17:32:55'),
('e1f1fc9a9aebf885b1a7611a7145692988d56483e4a1805d7a0a4a7fa6718bb22ff8ec989c02766b', 1, 21, 'refreshToken', '[]', 0, '2023-01-22 02:48:01', '2023-01-22 02:48:01', '2023-07-22 02:48:01'),
('e25ea3603397ad14362bfe6c9c15dedef743dec7c618ac4b854f00ede6fe20fa837120e23952e86c', 58, 21, 'refreshToken', '[]', 0, '2023-01-29 04:59:33', '2023-01-29 04:59:33', '2023-07-29 04:59:33'),
('e2fab3cdc47e59644b3086e6a3f355c65a791341a08c0e4dc1debccf1f9a657c09dd87b1c380aad3', 1, 3, 'authToken', '[]', 0, '2022-10-02 11:19:51', '2022-10-02 11:19:51', '2023-04-02 11:19:51'),
('e309b2e871f7af978a9d800993625930ca644be235fb43de46566ee1d681d1f060416e8b4e0f4714', 60, 21, 'refreshToken', '[]', 0, '2023-01-12 01:41:10', '2023-01-12 01:41:10', '2023-07-12 01:41:10'),
('e34099edcebbb825085a8b8dd1a65eebcc1ff6b06c51ab9f64718bc0e015f5533c9234817f563ed3', 1, 3, 'refreshToken', '[]', 0, '2022-06-14 04:59:30', '2022-06-14 04:59:30', '2022-12-14 04:59:30'),
('e3934031cadc67c0eab987f86908f9e67b7617f538f2c8728ed4c3f0fc3398501a2ba81332f20a55', 66, 21, 'refreshToken', '[]', 0, '2023-01-21 12:21:39', '2023-01-21 12:21:39', '2023-07-21 12:21:39'),
('e442f2ffa0b5850c950fe0ae15f9b711e7b10d8874b9685e780ef432e5bf62b4bb7e69e9251ad519', 1, 21, 'refreshToken', '[]', 0, '2023-01-19 09:29:50', '2023-01-19 09:29:50', '2023-07-19 09:29:50'),
('e4a461ead53bb8b395ce227f11d624d0f0908b7fc5c707316b88cc173bd61b8576317981c98f3560', 1, 3, 'authToken', '[]', 0, '2022-06-19 14:49:58', '2022-06-19 14:49:58', '2022-12-19 14:49:58'),
('e4e68a0af20426252f0cb12419e549b1ddfe3ddb4e0c5995fdae4272165dc217dfd212309e934c1a', 1, 21, 'refreshToken', '[]', 0, '2023-01-16 12:12:56', '2023-01-16 12:12:56', '2023-07-16 12:12:56'),
('e53b57a0a8a2700b4c444742ad724561faaa8201063eadacff0154b9171fe7988b9fdf1e249abaeb', 1, 21, 'refreshToken', '[]', 0, '2023-01-08 16:58:05', '2023-01-08 16:58:05', '2023-07-08 16:58:05'),
('e55d17d74e4336b832363660069ead366496807604527a43c934315d2cd9d6e8a0ecd41ba2d33099', 1, 19, 'refreshToken', '[]', 0, '2022-11-07 16:35:17', '2022-11-07 16:35:17', '2023-05-07 16:35:17'),
('e5e18cfa2c4c28098381839bbc416e592ab89bafae64c3259df1b99285562ee4fa5b4d37b00785e6', 60, 21, 'refreshToken', '[]', 0, '2023-01-25 05:35:03', '2023-01-25 05:35:03', '2023-07-25 05:35:03'),
('e5f3eef5f6a16d69d681e7a3e99856755c5453a9b3659eb8a0c9adacb5455488b78f6fa3e19c2a73', 1, 21, 'refreshToken', '[]', 0, '2022-12-26 07:57:20', '2022-12-26 07:57:20', '2023-06-26 07:57:20'),
('e658defdb0fb21f9460941d3c9c83a7e210d356640986bfbe7b0ff9f8e557b874b72dda7366519b8', 1, 3, 'authToken', '[]', 0, '2022-10-02 19:11:19', '2022-10-02 19:11:19', '2023-04-02 19:11:19'),
('e6aec38a82050fd84f65e873f078a982a3f406a4701d1e88961d6cf1157be39c005e125345a10613', 21, 3, 'authToken', '[]', 0, '2022-10-02 20:41:10', '2022-10-02 20:41:10', '2023-04-02 20:41:10'),
('e6c5e59caf2583d07d2f746b2e1b87c62f0d461d9c5ab5976e588609abd3d9b82bd038cf6b534d25', 63, 21, 'refreshToken', '[]', 0, '2023-01-16 12:19:07', '2023-01-16 12:19:07', '2023-07-16 12:19:07'),
('e737cb9475cfcf66665d795677993379b3c4d0b04201cdbc72c1f646908d7c465fa0d7eaf56bde5f', 58, 21, 'authToken', '[]', 0, '2023-01-22 02:49:05', '2023-01-22 02:49:05', '2023-07-22 02:49:05'),
('e76e722d9a60223ccb5e2a17c1ff174b2d7c041688d0eaef8a740b773fba53df6a2d1089db4ff739', 69, 21, 'authToken', '[]', 0, '2023-01-27 15:52:49', '2023-01-27 15:52:49', '2023-07-27 15:52:49'),
('e7ba58cc191d59746045b48fb4a03b5a820c5709e8f57774c861823913f8c2b01efe1f0d63ba61b4', 1, 1, 'refreshToken', '[]', 0, '2022-04-02 22:45:03', '2022-04-02 22:45:03', '2022-10-03 04:45:03'),
('e7e9ad1553f18ae5f8f3ae90776827a17247e4f935e77be614dba8950cb73f045a3ea8243480846a', 1, 21, 'authToken', '[]', 0, '2022-12-17 05:43:44', '2022-12-17 05:43:44', '2023-06-17 05:43:44'),
('e7f2d703acd5431a03baa6fd5b0c9a465c1bc2c1a0ec1b59eb37c3699b097bd0c9e0022476885caa', 1, 1, 'authToken', '[]', 0, '2022-03-29 04:59:00', '2022-03-29 04:59:00', '2022-09-29 10:59:00'),
('e82e306334e03ce8680313d05274063a2a01f156b1b46b564e3a0bc26d74a371a7dc371255363540', 1, 1, 'refreshToken', '[]', 0, '2022-03-29 04:59:00', '2022-03-29 04:59:00', '2022-09-29 10:59:00'),
('e8724049d8c46ce087244d88f2b98f7196855a0311d669f7b631e764e79e89531fcb80f4547b7ed9', 1, 21, 'authToken', '[]', 0, '2023-01-29 08:07:25', '2023-01-29 08:07:25', '2023-07-29 08:07:25'),
('e8d9416e5ed409658cb6d41fea39ef2bd0f301a976049cf15087dfdc219bbd2362191e468a006be2', 7, 3, 'refreshToken', '[]', 0, '2022-07-06 08:49:29', '2022-07-06 08:49:29', '2023-01-06 08:49:29'),
('e8e6973318e0e713e253e1b5753ae1a530da6649980602efb4af3325fbb0b6f08d6ac0be397b1b97', 65, 21, 'authToken', '[]', 0, '2023-01-14 12:48:55', '2023-01-14 12:48:55', '2023-07-14 12:48:55'),
('e9167af4fe016c0ed858efe8a9ac7d63331c6b9e755fa0c6073c3d4f003eee9901b4e76407bd1adb', 75, 21, 'authToken', '[]', 0, '2023-02-04 08:24:25', '2023-02-04 08:24:25', '2023-08-04 08:24:25'),
('e91bc531ec2b1fe8b60fea83a0de8eb422b507247f55cd5df79527990bf419909ab7bebe9e6536c1', 27, 19, 'refreshToken', '[]', 0, '2022-11-13 19:29:51', '2022-11-13 19:29:51', '2023-05-13 19:29:51'),
('e946113272a0f90a4ee00f62b8da320fc512d6ff9066af2f2fdc86af64987672eac3af98b0f70002', 33, 21, 'refreshToken', '[]', 0, '2023-01-04 14:55:08', '2023-01-04 14:55:08', '2023-07-04 14:55:08'),
('e99a34252a2c486c35ab24e7756fc5447004071fe68a5bf9c931530463eef81204e54a8b38014d0e', 1, 3, 'refreshToken', '[]', 0, '2022-05-26 11:04:33', '2022-05-26 11:04:33', '2022-11-26 11:04:33'),
('ea0b7d12c0d9233e7fb97f594a48bd739fda26b5699bd9030060da5bf5679be95a2f28ab3330d904', 16, 3, 'refreshToken', '[]', 0, '2022-06-16 14:36:22', '2022-06-16 14:36:22', '2022-12-16 14:36:22'),
('ea80c89413ed75c013edbbde31bfbac6aa02b8bf32cd10b4b799988a6c0d049d9c252662f8ddc960', 1, 21, 'authToken', '[]', 0, '2022-12-31 07:52:24', '2022-12-31 07:52:24', '2023-07-01 07:52:24'),
('eaa7e3ecabc96002f17391404432ed004cc52ccccb1b4d0ffe10130006ae7953718ef2c83dd35d3b', 1, 3, 'refreshToken', '[]', 0, '2022-06-21 13:27:40', '2022-06-21 13:27:40', '2022-12-21 13:27:40'),
('eb073b6bb711f2c695d5708468b054de629a020f53057f6efadc51ff46ff2a472070bf8ae0942087', 1, 21, 'refreshToken', '[]', 0, '2022-12-20 08:59:50', '2022-12-20 08:59:50', '2023-06-20 08:59:50'),
('eb9fb8c249930245e115d5e9f4cfed4d13f14bcbd9d634e15d5260a27f8655fc398f9232bdb23cd4', 1, 21, 'authToken', '[]', 0, '2022-12-19 19:03:10', '2022-12-19 19:03:10', '2023-06-19 19:03:10'),
('ebe712775a7081c99eda8115a2fa31e4e4b2d86bff4d9029306eee19120c229b7d815d75deeed3b9', 3, 3, 'refreshToken', '[]', 0, '2022-09-04 15:18:52', '2022-09-04 15:18:52', '2023-03-04 15:18:52'),
('ec4cd84790af0177fc856863f2cf4ee1796923453eb4d2f8dec6b96fb60f996860d4ce24760540e1', 1, 3, 'refreshToken', '[]', 0, '2022-10-16 09:22:35', '2022-10-16 09:22:35', '2023-04-16 09:22:35'),
('ec6744b8e51af65d6f85e55af37b8aed4eeba21e41e0d046422c3b91b5dc32fb939cf08bb9b59bd9', 66, 21, 'authToken', '[]', 0, '2023-01-21 12:36:35', '2023-01-21 12:36:35', '2023-07-21 12:36:35'),
('ec6dc5edba577004bb797a76ad831f6f80d12f3f4b3b293c156f2f5b807c256c542f978aaaa7bc4a', 1, 3, 'authToken', '[]', 0, '2022-06-23 03:29:20', '2022-06-23 03:29:20', '2022-12-23 03:29:20'),
('ecb19686dd2e203583fa0ba16cfc4c09022ab04d8ba8c29a3cbaa92b67ffbaccc390f9a3934063b0', 1, 21, 'authToken', '[]', 0, '2023-01-18 01:40:01', '2023-01-18 01:40:01', '2023-07-18 01:40:01'),
('ecb883ffc1675590c69161b9b4394f55b490b3ed2653176bbd0842cc69c4c57133b7ee076ab89f7d', 1, 21, 'authToken', '[]', 0, '2023-01-17 00:51:47', '2023-01-17 00:51:47', '2023-07-17 00:51:47'),
('ecdda0280663dbec7cc65a3d39faab9d0374e9bccfd116b873be3d883b78fa4205bd37fb960d7c93', 3, 3, 'authToken', '[]', 0, '2022-06-19 16:26:11', '2022-06-19 16:26:11', '2022-12-19 16:26:11'),
('ece7a0e5b354146685a762a93d5a682e7df48828814d4f4e00b18f0ddafdd63158feabef0ba9efed', 63, 21, 'refreshToken', '[]', 0, '2023-01-16 12:26:39', '2023-01-16 12:26:39', '2023-07-16 12:26:39'),
('ed3bc30b8be766ad6977d28ee9ff1fd6e4e01f19a7fb3706e7a94d095bfda5fa28f922c7c5fbb444', 1, 21, 'refreshToken', '[]', 0, '2023-01-19 00:55:03', '2023-01-19 00:55:03', '2023-07-19 00:55:03'),
('ed5e355dffde38af0e5fdd237e0d1fe10ae4d89a3e6bc67bf4f2485bcc729d9f127f26a461e37bde', 74, 21, 'authToken', '[]', 0, '2023-01-30 04:03:00', '2023-01-30 04:03:00', '2023-07-30 04:03:00'),
('ed7a0540b5097202a046e3617a0365779183f113e2611ef948cc3b8e31882f5cf095ad909f04ab83', 1, 3, 'refreshToken', '[]', 0, '2022-09-19 12:03:35', '2022-09-19 12:03:35', '2023-03-19 12:03:35'),
('edcd06f0fd76595f75f2379f7a5b21d79e73d1497c01beab3ae1832c4b06167cb53f4107fc23ad47', 60, 21, 'authToken', '[]', 0, '2023-01-19 06:12:30', '2023-01-19 06:12:30', '2023-07-19 06:12:30'),
('edd5464d809f622122a64215a6865dde7335bcc1c7583b704481d3c79cb9048f9991bccd79bbdd9e', 1, 21, 'refreshToken', '[]', 0, '2023-01-16 12:03:07', '2023-01-16 12:03:07', '2023-07-16 12:03:07'),
('ee363fe6169769cced8c753cb772b4ceed43c20d60eb3ff50f348b3cfa27acd5996337a4af50a049', 1, 3, 'refreshToken', '[]', 0, '2022-07-04 03:12:51', '2022-07-04 03:12:51', '2023-01-04 03:12:51'),
('ee5d7424d9ac19aafba6ee74d552367b127e5c82cbb3f4510c134a2e8c8f17ce720c74e1f887f286', 1, 3, 'authToken', '[]', 0, '2022-09-28 06:49:06', '2022-09-28 06:49:06', '2023-03-28 06:49:06'),
('ef50279244edf042d0fb4358f208734196c9c9660b7ff158f4478ddf24f66207fbc22c3d317c7d16', 58, 21, 'authToken', '[]', 0, '2023-01-14 11:09:44', '2023-01-14 11:09:44', '2023-07-14 11:09:44'),
('ef642e18f1a008d1aa3d5da20c8ae04826b8f4fe29b978aba766f82a6894d96dad10ffa56e88c513', 3, 19, 'refreshToken', '[]', 0, '2022-11-13 17:59:18', '2022-11-13 17:59:18', '2023-05-13 17:59:18'),
('ef6c39d9f03405a7a774644b9f81795d98a4ae65bfa9cfc172913b81d7fba808ca75d6f130642d3d', 59, 21, 'authToken', '[]', 0, '2023-01-29 11:40:33', '2023-01-29 11:40:33', '2023-07-29 11:40:33'),
('ef73073bcb49f5717013a8354ba82d80ca9da3e88075f652a9b835acb142b7eb9c13ca8ddd4d84f3', 1, 21, 'authToken', '[]', 0, '2023-01-31 00:27:11', '2023-01-31 00:27:11', '2023-07-31 00:27:11'),
('ef8676e74f3255265edea3fbb8892bb885e4666efb808ca6927e37a0ffd200a18baf2b1710aeb3ff', 32, 21, 'authToken', '[]', 0, '2022-12-20 08:52:46', '2022-12-20 08:52:46', '2023-06-20 08:52:46'),
('efaca554850b90d078ce88a50664b33116081ebf6ee8f4d278ee8c6481cc073c58faf53d0612a622', 1, 21, 'authToken', '[]', 0, '2022-12-14 16:30:46', '2022-12-14 16:30:46', '2023-06-14 16:30:46'),
('f0362e9e25a3cea342b921492b375684555683f9c9f4ca756525b8dec48b6cc4fa18d51a2b0f412e', 1, 3, 'refreshToken', '[]', 0, '2022-06-08 09:08:40', '2022-06-08 09:08:40', '2022-12-08 09:08:40'),
('f045286a43ada46ec286482b6b2ec7bfcbc6ff5736d7451389085f806fadf27fd30ed8c837e22c37', 70, 21, 'authToken', '[]', 0, '2023-01-30 01:51:49', '2023-01-30 01:51:49', '2023-07-30 01:51:49'),
('f06c20a44a3d030385e412b1627157d75d6978925f1a3bf1a089e731ef4e4e2943f837a6eaf1b849', 9, 3, 'authToken', '[]', 0, '2022-10-02 19:38:49', '2022-10-02 19:38:49', '2023-04-02 19:38:49'),
('f0c298844bd2c4e963454675e640df1253142efe57910aa5ee9a2b89c088786d399a104b04d900c1', 12, 21, 'refreshToken', '[]', 0, '2023-01-14 13:25:16', '2023-01-14 13:25:16', '2023-07-14 13:25:16'),
('f0e654ab36f36b90178e3ee9e521509999873325ddbdb8b12d1bf53ebe39db38d2edad0bb8c8f933', 1, 21, 'refreshToken', '[]', 0, '2023-01-14 11:08:38', '2023-01-14 11:08:38', '2023-07-14 11:08:38'),
('f0ffa967cba6fda9dbc390ed41fb8660029fb9575cdc663e9f9cea55da184adad60d05a6b861d7c4', 3, 3, 'refreshToken', '[]', 0, '2022-10-02 11:42:36', '2022-10-02 11:42:36', '2023-04-02 11:42:36'),
('f1497fae7f6a4289b7fa8d8b7c353a7fd325412f0b80f4567cb4ffab05ba61c61b26b846fc6c0f7a', 1, 3, 'authToken', '[]', 0, '2022-08-01 05:35:13', '2022-08-01 05:35:13', '2023-02-01 05:35:13'),
('f16c69e3824d57724df25bb5e94cb159ef53fc7720eb163218ef50ee331877260139ce213fb47232', 1, 3, 'refreshToken', '[]', 0, '2022-06-01 04:28:05', '2022-06-01 04:28:05', '2022-12-01 04:28:05'),
('f188eaa49c1274bb575e4b86a3d01d20d426a2d0eba3d854c67b84e63f3790eeaf14150e9faf9d03', 1, 3, 'authToken', '[]', 0, '2022-09-26 04:23:14', '2022-09-26 04:23:14', '2023-03-26 04:23:14'),
('f1af575b3152899f1f5b374c8606a39041b83ee0c30efe95b300b7348ea52deca11f0bfe185d048e', 1, 3, 'authToken', '[]', 0, '2022-06-19 16:23:34', '2022-06-19 16:23:34', '2022-12-19 16:23:34'),
('f23e3229b44aa9ca43ffa6e03d690fd1a4d6392971a33c2eb40e2323c8751e327877eb545e6627a5', 1, 21, 'refreshToken', '[]', 0, '2023-01-03 11:27:31', '2023-01-03 11:27:31', '2023-07-03 11:27:31'),
('f24fcb8ba6bc157dda66ce6fb5ced5f6bd889c4d4af14c434c328c7ead500d65bcab2d7734ae573d', 1, 21, 'refreshToken', '[]', 0, '2023-01-31 09:39:28', '2023-01-31 09:39:28', '2023-07-31 09:39:28'),
('f28cc302b96c59e29c49a3ccb3c25deb9ee8ce2ec7d8e9c147764e4950aeaa3176a6cbf468638783', 1, 1, 'authToken', '[]', 0, '2022-05-07 23:11:21', '2022-05-07 23:11:21', '2022-11-08 05:11:21'),
('f2dc86bf7be3f0186b30244f813bb0a4915e7414ca0af951fb4ec8b1034cd5a3de88a55c458f2e33', 54, 21, 'authToken', '[]', 0, '2023-01-08 12:29:01', '2023-01-08 12:29:01', '2023-07-08 12:29:01'),
('f2eddea0d6cb9e00a07fddd54cd4e63abc81b75eebd48ae01bbf4f5de491ae139224e9228ef977cb', 58, 21, 'refreshToken', '[]', 0, '2023-01-22 02:49:05', '2023-01-22 02:49:05', '2023-07-22 02:49:05'),
('f316753f221aa9114e6a21e2f5e4e24dffde6c2d8958ec31a9de5e8e14e58366119df4a1501d59b7', 1, 21, 'refreshToken', '[]', 0, '2022-12-31 14:05:13', '2022-12-31 14:05:13', '2023-07-01 14:05:13'),
('f32880fb04837017540979abb3d9139921ad3b566b13b701e682d852f0d843e52e921b50fb4b158b', 7, 3, 'refreshToken', '[]', 0, '2022-09-04 15:08:02', '2022-09-04 15:08:02', '2023-03-04 15:08:02'),
('f378c8e05515687b75c7cb03d8c6afb952451fdca3b68c453482b505d094edde91efec81e4d1e1bf', 1, 3, 'refreshToken', '[]', 0, '2022-09-21 04:59:52', '2022-09-21 04:59:52', '2023-03-21 04:59:52'),
('f3a7118821a1a7302d19f3bbc3a62c162b51ed3e1df792d6389155fe543dfa2067ae9efdddf3b652', 7, 3, 'refreshToken', '[]', 0, '2022-08-21 14:49:00', '2022-08-21 14:49:00', '2023-02-21 14:49:00'),
('f463a7cc9179a5736072bad77bebd545b7b582171b7f26d9f1f9b243779bbc648e4c16ff5216f97d', 1, 3, 'authToken', '[]', 0, '2022-08-04 05:20:40', '2022-08-04 05:20:40', '2023-02-04 05:20:40'),
('f47e24d3445a40b499ab1e45aee9d2a4a54519803ab42faa6382880ed87720fc40cbea6a791c1599', 1, 1, 'authToken', '[]', 0, '2022-05-07 22:28:47', '2022-05-07 22:28:47', '2022-11-08 04:28:47'),
('f4fa4d80b7fee02322c355b4795c56717c17d76d11e7b131f2c43f76e0258d338d74fbd57f055f47', 1, 21, 'authToken', '[]', 0, '2022-12-21 15:44:25', '2022-12-21 15:44:25', '2023-06-21 15:44:25'),
('f5626dd152734e84d9dfe8ac2782d8f85f4143ce6daeceeb5b678c8c72a9b2fda043c119e3f25843', 1, 21, 'authToken', '[]', 0, '2022-12-20 03:15:34', '2022-12-20 03:15:34', '2023-06-20 03:15:34'),
('f637823772fc0bdfe43ffbe16b36017fd74eddea0af9e125f3c412d5c350fb584a7de3c7b21e5c59', 63, 21, 'refreshToken', '[]', 0, '2023-01-14 12:14:23', '2023-01-14 12:14:23', '2023-07-14 12:14:23'),
('f69bf49bbfef8e5eef06cd98b37c20866debff5f4d1eddd00998e027c8fb0f6925a0ea1390656b59', 1, 21, 'refreshToken', '[]', 0, '2023-01-10 05:42:40', '2023-01-10 05:42:40', '2023-07-10 05:42:40');
INSERT INTO `oauth_access_tokens` (`id`, `user_id`, `client_id`, `name`, `scopes`, `revoked`, `created_at`, `updated_at`, `expires_at`) VALUES
('f6a6508e92e160ad18ba92eaf2189c010b537ff67d28c6b6dc45e3aac8335e54e23b8fd74ab1e57a', 1, 19, 'authToken', '[]', 0, '2022-11-13 18:13:14', '2022-11-13 18:13:14', '2023-05-13 18:13:14'),
('f6b13fdcda7ca134d72f19f3d0bb5b1014f9eaa658bd335cc5a4b2b44c39e06c293c46a84924ddc2', 1, 21, 'refreshToken', '[]', 0, '2023-01-12 00:53:16', '2023-01-12 00:53:16', '2023-07-12 00:53:16'),
('f75b087434bef62ace9b1a04b2c942fb02f56c86a3d55080318f5724d9de9cff600ad7d44af521be', 1, 21, 'authToken', '[]', 0, '2023-01-22 02:48:01', '2023-01-22 02:48:01', '2023-07-22 02:48:01'),
('f7ba637db9a4d6cfc5b002a7894f682fb929ea30405f3440e44d78f3da9219c35e62952a19cebfbe', 60, 21, 'refreshToken', '[]', 0, '2023-01-12 00:55:32', '2023-01-12 00:55:32', '2023-07-12 00:55:32'),
('f82a3c8b3c928bc426318d7a465c27308e1c67a244adc4732298d73186dea6fc0ec9c217d2c31a4d', 1, 21, 'refreshToken', '[]', 0, '2023-01-16 12:23:27', '2023-01-16 12:23:27', '2023-07-16 12:23:27'),
('f83800db0d44d08f5a4e0a7ae2c9c8f89e81607545ff3c46b03eb8c4829404e701d9ef1b10ef6f2a', 1, 21, 'authToken', '[]', 0, '2022-12-22 14:37:02', '2022-12-22 14:37:02', '2023-06-22 14:37:02'),
('f83d91a0999049bfbb8d2acfb8dd91a86641b4842e5d072d077d0365608130038a97d20eab8f0314', 1, 21, 'refreshToken', '[]', 0, '2023-01-02 15:52:16', '2023-01-02 15:52:16', '2023-07-02 15:52:16'),
('f896e0aaa7d54df73c5a0badabe7f92f42cf34890bbed08fa48766fc20592343063c595db9d6e946', 1, 3, 'refreshToken', '[]', 0, '2022-06-15 07:29:22', '2022-06-15 07:29:22', '2022-12-15 07:29:22'),
('f92fe49a429c22bdd73de28f15094d82cf3dd5631823e5acb52577f9423dab740a36dc4163c29bee', 58, 21, 'authToken', '[]', 0, '2023-01-22 11:34:23', '2023-01-22 11:34:23', '2023-07-22 11:34:23'),
('f936f6599827a4d0f51f0b21fe1f6c49def5f727131445a6e95b709b9e2505a2816b54fa144371c8', 1, 21, 'authToken', '[]', 0, '2022-12-26 07:57:20', '2022-12-26 07:57:20', '2023-06-26 07:57:20'),
('f9c09e6ec39ff87caed5acf6cd521dc8d7aef61dd4b6b702a959dac21df9709f38d490267d370d69', 22, 3, 'refreshToken', '[]', 0, '2022-10-02 20:13:36', '2022-10-02 20:13:36', '2023-04-02 20:13:36'),
('f9ea0bc167cc7522f016698dbc9a3222a55f338ec72610aa565607824cadf199913d8691991731ba', 1, 21, 'authToken', '[]', 0, '2023-01-22 01:18:20', '2023-01-22 01:18:20', '2023-07-22 01:18:20'),
('fa424303d38193e066547912cb51f5016f87cf3cc84e8ab59a8302634eaffc771f73eae16c3577e5', 1, 21, 'authToken', '[]', 0, '2022-12-22 05:35:16', '2022-12-22 05:35:16', '2023-06-22 05:35:16'),
('fa8559324291e695a4d28a468ef1b9fe62386c16132276ffd9d9ed3e7027942f2d752816a06fad16', 1, 3, 'authToken', '[]', 0, '2022-09-25 12:07:04', '2022-09-25 12:07:04', '2023-03-25 12:07:04'),
('fae476ed20ce53577c8d88118971482177b650eae103618e0523b3d226a39a9879239e16e7c96441', 58, 21, 'refreshToken', '[]', 0, '2023-01-14 05:57:48', '2023-01-14 05:57:48', '2023-07-14 05:57:48'),
('fb2bef2e08aa4ca923b1d73c71c96e52f062edb46b9fa0d350814e4bcbebfb2a4652e812d22b5449', 60, 21, 'authToken', '[]', 0, '2023-01-12 00:31:27', '2023-01-12 00:31:27', '2023-07-12 00:31:27'),
('fbb99feca8ef98fa04306748bc97a5a0db9826cb4b0820437310b7397685de79b054d8a66ecfa9bf', 59, 21, 'authToken', '[]', 0, '2023-01-14 06:18:37', '2023-01-14 06:18:37', '2023-07-14 06:18:37'),
('fbf16cdefabb371c9d7b113a2a8dd4b115bc03e64e220c61f3968c62483af23c1452135343f41ec3', 1, 21, 'authToken', '[]', 0, '2023-02-01 00:57:58', '2023-02-01 00:57:58', '2023-08-01 00:57:58'),
('fcba36e7c7cbceac5360e88fab13daa81b17dcb8a8a11326fda89bf8b4bc87e39a98271eccdb87d6', 1, 3, 'authToken', '[]', 0, '2022-06-19 14:48:39', '2022-06-19 14:48:39', '2022-12-19 14:48:39'),
('fcd3ae19badb2e0cc0011577874384eec5c8f276def6dc8ede044e0ab472f1d1e570721493cc44be', 1, 21, 'authToken', '[]', 0, '2022-12-31 14:05:13', '2022-12-31 14:05:13', '2023-07-01 14:05:13'),
('fd027525c595efee36070210274561648daeb489e599b20cad25f47022e2aed982d083dc013dc4b4', 1, 3, 'authToken', '[]', 0, '2022-08-29 12:24:30', '2022-08-29 12:24:30', '2023-03-01 12:24:30'),
('fdaab390acc2b0bab051466120a4dbda51396d673c8ed0e32f608589b282281378171bba2a6ddf46', 3, 3, 'authToken', '[]', 0, '2022-10-02 11:25:35', '2022-10-02 11:25:35', '2023-04-02 11:25:35'),
('fdb70a1bf994a0b593144b20101f5420d4d6b21618ea0723ae7c5818411a5befa6d2f4d467ef8152', 1, 3, 'refreshToken', '[]', 0, '2022-06-22 05:58:32', '2022-06-22 05:58:32', '2022-12-22 05:58:32'),
('fe0660fffff4a76a8a01d992ae916bbd657315d26e5cf2f19a71985726b93e64e3039791fe6fbed8', 12, 21, 'authToken', '[]', 0, '2023-01-14 13:25:16', '2023-01-14 13:25:16', '2023-07-14 13:25:16'),
('fe13b902698284f168d7908cdae18caf7a60676d976a7b92fbeb06af310f8524053c4b58a390a630', 60, 21, 'refreshToken', '[]', 0, '2023-01-19 06:12:30', '2023-01-19 06:12:30', '2023-07-19 06:12:30'),
('fe249f443d4b353a918d452b1b8372f7b8e4034a34c544b7787d0e3a047c00423838ac23b305f517', 1, 3, 'authToken', '[]', 0, '2022-06-16 12:21:23', '2022-06-16 12:21:23', '2022-12-16 12:21:23'),
('fe377afdc4b175c99c16b630c755fbf81544d3ef69282745ce914dd46a0b6c0c4064ae6d573118d4', 1, 21, 'refreshToken', '[]', 0, '2023-01-04 06:59:47', '2023-01-04 06:59:47', '2023-07-04 06:59:47'),
('fe8fcfc057090921b9368bcc2a9ffe507e50d31d203ba00d6463498a376a6bcfb49b2e9221589d92', 3, 21, 'refreshToken', '[]', 0, '2023-01-08 08:49:06', '2023-01-08 08:49:06', '2023-07-08 08:49:06'),
('fea1257f78d5276537c5a286ccd1dce69b79e44be47df7a4af3c092d094a604913c6f756e04184f2', 1, 1, 'authToken', '[]', 0, '2022-04-02 22:45:03', '2022-04-02 22:45:03', '2022-10-03 04:45:03'),
('ffced9ef29d57ea36a64ec6b0d26e64fab3d1c96292ca52259b5fba538586650c7e530507aa9aa5f', 19, 3, 'refreshToken', '[]', 0, '2022-07-06 09:16:50', '2022-07-06 09:16:50', '2023-01-06 09:16:50'),
('ffd45dba573be36c645c83ea497269bf2dbfe1302a873d58a4cf9a9a352ecd12bb9befcaae12dbfd', 33, 21, 'authToken', '[]', 0, '2023-01-05 09:53:48', '2023-01-05 09:53:48', '2023-07-05 09:53:48');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_auth_codes`
--

CREATE TABLE `oauth_auth_codes` (
  `id` varchar(100) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `scopes` text DEFAULT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `oauth_clients`
--

CREATE TABLE `oauth_clients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `secret` varchar(100) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `redirect` text NOT NULL,
  `personal_access_client` tinyint(1) NOT NULL,
  `password_client` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_clients`
--

INSERT INTO `oauth_clients` (`id`, `user_id`, `name`, `secret`, `provider`, `redirect`, `personal_access_client`, `password_client`, `revoked`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Laravel Personal Access Client', 'uyahdumEyui3vMFkGbZt1N3pQmKx2J3fIxUr9sYe', NULL, 'http://localhost', 1, 0, 0, '2022-03-28 00:34:05', '2022-03-28 00:34:05'),
(2, NULL, 'Laravel Password Grant Client', '0TEJLifBIupS8jRsKUI897SZ76yn6MQYwUqkMllS', 'users', 'http://localhost', 0, 1, 0, '2022-03-28 00:34:05', '2022-03-28 00:34:05'),
(3, NULL, 'Laravel Personal Access Client', 'aVKUHJNriHSWUtzdQO1KxsYjTSgjfmzMj5Wd5GOf', NULL, 'http://localhost', 1, 0, 0, '2022-05-24 10:22:55', '2022-05-24 10:22:55'),
(4, NULL, 'Laravel Password Grant Client', 'bIvKas1HoDP5iudViB5QHsvcZkOiPd0AmU42i9Lu', 'users', 'http://localhost', 0, 1, 0, '2022-05-24 10:22:55', '2022-05-24 10:22:55'),
(5, NULL, 'PrepExcellence Personal Access Client', 'K1L4jeF0xeRVctVVoQ6asLOxtFkBbvAUIGnol3eT', NULL, 'http://localhost', 1, 0, 0, '2022-11-06 16:08:07', '2022-11-06 16:08:07'),
(6, NULL, 'PrepExcellence Password Grant Client', '5RQGVYzkTq7ENz8kRxCiVY32G7bDEHtw5VYqIDxd', 'users', 'http://localhost', 0, 1, 0, '2022-11-06 16:08:11', '2022-11-06 16:08:11'),
(7, NULL, 'PrepExcellence Personal Access Client', 'UFsBh1Um8O7dilRztYds5aZe2iRcx1BuT7TDsrnr', NULL, 'http://localhost', 1, 0, 0, '2022-11-06 16:23:23', '2022-11-06 16:23:23'),
(8, NULL, 'PrepExcellence Password Grant Client', 'BbQvIg26EX94mYT6aY93L1P3VfvyCx11hhFBgBuU', 'users', 'http://localhost', 0, 1, 0, '2022-11-06 16:23:28', '2022-11-06 16:23:28'),
(9, NULL, 'PrepExcellence Personal Access Client', 'A7dbjasrZ1lmxWpPgvlmCwMHA7FPKBz7NWtSnpwH', NULL, 'http://localhost', 1, 0, 0, '2022-11-06 17:21:56', '2022-11-06 17:21:56'),
(10, NULL, 'PrepExcellence Password Grant Client', 'Sn6qskZDXKPaLsWB53YOUKwJu8i93DV6hC55STkD', 'users', 'http://localhost', 0, 1, 0, '2022-11-06 17:22:00', '2022-11-06 17:22:00'),
(11, NULL, 'PrepExcellence Personal Access Client', 'KsVJ3QBP5QNHCPWpm8moCJeqVnTLwWo49oyixI35', NULL, 'http://localhost', 1, 0, 0, '2022-11-06 18:01:10', '2022-11-06 18:01:10'),
(12, NULL, 'PrepExcellence Password Grant Client', 'HEBP3rbWInat789F7b2QPeLCJB6lGAnJOBoLQUfV', 'users', 'http://localhost', 0, 1, 0, '2022-11-06 18:01:14', '2022-11-06 18:01:14'),
(13, NULL, 'PrepExcellence Personal Access Client', 'HRzGhjK4o8uc0OfR6YGIfQpgLxncpptmwm8TXtGi', NULL, 'http://localhost', 1, 0, 0, '2022-11-06 18:46:24', '2022-11-06 18:46:24'),
(14, NULL, 'PrepExcellence Password Grant Client', '3FzH8mO7siafES78Nu0RTzoVLJuUcOlRwp4djtGM', 'users', 'http://localhost', 0, 1, 0, '2022-11-06 18:46:28', '2022-11-06 18:46:28'),
(15, NULL, 'PrepExcellence Personal Access Client', 'hJMLox3CFInrQqoOSAclr67FKZl1rOUhkUJtJZQe', NULL, 'http://localhost', 1, 0, 0, '2022-11-06 19:02:25', '2022-11-06 19:02:25'),
(16, NULL, 'PrepExcellence Password Grant Client', 'vn9iLrIbJRh3oaoJqp7q18xeP5KOiZmbNU4kJRQ0', 'users', 'http://localhost', 0, 1, 0, '2022-11-06 19:02:29', '2022-11-06 19:02:29'),
(17, NULL, 'PrepExcellence Personal Access Client', '1WtjJxU33lcLqlH4YLT2RrOP8xXoqSPkzCtfXnbM', NULL, 'http://localhost', 1, 0, 0, '2022-11-06 19:45:01', '2022-11-06 19:45:01'),
(18, NULL, 'PrepExcellence Password Grant Client', 'FNqucc8iJurqvSXtQcEMUfegudReB6o8BlpynA9k', 'users', 'http://localhost', 0, 1, 0, '2022-11-06 19:45:04', '2022-11-06 19:45:04'),
(19, NULL, 'PrepExcellence Personal Access Client', 'DK3PMqpnliOGQuMdkb5Rf3W6sVY0RDU7r8zfhiK0', NULL, 'http://localhost', 1, 0, 0, '2022-11-07 06:24:29', '2022-11-07 06:24:29'),
(20, NULL, 'PrepExcellence Password Grant Client', 'HghqWZqvghwoILKywLdVbn9AddTuycn1P7AgfNaD', 'users', 'http://localhost', 0, 1, 0, '2022-11-07 06:24:33', '2022-11-07 06:24:33'),
(21, NULL, 'PrepExcellence Personal Access Client', 'k9O4hqy1Rsh93cxiZ4i8YkVrF1TVGYVmQAEmmVxV', NULL, 'http://localhost', 1, 0, 0, '2022-12-14 16:17:49', '2022-12-14 16:17:49'),
(22, NULL, 'PrepExcellence Password Grant Client', 'aOB1H6OyF7UwoSfjaR2yGVL4DQtp7OwoRsDTFJrh', 'users', 'http://localhost', 0, 1, 0, '2022-12-14 16:17:49', '2022-12-14 16:17:49');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_personal_access_clients`
--

CREATE TABLE `oauth_personal_access_clients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_personal_access_clients`
--

INSERT INTO `oauth_personal_access_clients` (`id`, `client_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2022-03-28 00:34:05', '2022-03-28 00:34:05'),
(2, 3, '2022-05-24 10:22:55', '2022-05-24 10:22:55'),
(3, 5, '2022-11-06 16:08:11', '2022-11-06 16:08:11'),
(4, 7, '2022-11-06 16:23:27', '2022-11-06 16:23:27'),
(5, 9, '2022-11-06 17:21:59', '2022-11-06 17:21:59'),
(6, 11, '2022-11-06 18:01:14', '2022-11-06 18:01:14'),
(7, 13, '2022-11-06 18:46:27', '2022-11-06 18:46:27'),
(8, 15, '2022-11-06 19:02:28', '2022-11-06 19:02:28'),
(9, 17, '2022-11-06 19:45:04', '2022-11-06 19:45:04'),
(10, 19, '2022-11-07 06:24:32', '2022-11-07 06:24:32'),
(11, 21, '2022-12-14 16:17:49', '2022-12-14 16:17:49');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_refresh_tokens`
--

CREATE TABLE `oauth_refresh_tokens` (
  `id` varchar(100) NOT NULL,
  `access_token_id` varchar(100) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(60) DEFAULT 'Pending',
  `admin_read` tinyint(1) NOT NULL DEFAULT 0,
  `payment_status` varchar(30) DEFAULT 'Pending',
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_total` int(11) NOT NULL DEFAULT 0,
  `tax` int(11) NOT NULL DEFAULT 0,
  `tax_amount` int(11) NOT NULL DEFAULT 0,
  `other_cost` int(11) NOT NULL DEFAULT 0,
  `discount` int(11) NOT NULL DEFAULT 0,
  `discount_amount` int(11) NOT NULL DEFAULT 0,
  `payment_method` varchar(60) DEFAULT NULL,
  `payment_transaction_id` varchar(191) DEFAULT NULL,
  `refund_other_charge` int(11) NOT NULL DEFAULT 0,
  `refund_product_total` int(11) NOT NULL DEFAULT 0,
  `refund_tax_amount` int(11) NOT NULL DEFAULT 0,
  `refund_total_amount` int(11) NOT NULL DEFAULT 0,
  `coupon_id` bigint(20) UNSIGNED DEFAULT NULL,
  `coupon_code` varchar(191) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `staff_note` text DEFAULT NULL,
  `reference_no` varchar(191) DEFAULT NULL,
  `attachment` varchar(191) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `status`, `admin_read`, `payment_status`, `user_id`, `product_total`, `tax`, `tax_amount`, `other_cost`, `discount`, `discount_amount`, `payment_method`, `payment_transaction_id`, `refund_other_charge`, `refund_product_total`, `refund_tax_amount`, `refund_total_amount`, `coupon_id`, `coupon_code`, `note`, `staff_note`, `reference_no`, `attachment`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(18, 'Pending', 0, 'paid', 76, 235, 0, 0, 0, 13, 13, 'Strip', '63de5cf8e7e3b', 0, 0, 0, 0, 8, 'C1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-02-04 08:26:16', '2023-02-04 08:26:38'),
(19, 'Pending', 0, 'paid', 78, 235, 0, 0, 0, 0, 0, 'Strip', '63de603061355', 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-02-04 08:40:00', '2023-02-04 08:40:21');

-- --------------------------------------------------------

--
-- Table structure for table `order_payments`
--

CREATE TABLE `order_payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(60) DEFAULT 'Pending',
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` int(11) NOT NULL DEFAULT 0,
  `gateway_order_id` varchar(191) DEFAULT NULL,
  `refund_order_id` varchar(191) DEFAULT NULL,
  `txn_number` varchar(191) DEFAULT NULL,
  `receipt_url` varchar(191) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_payments`
--

INSERT INTO `order_payments` (`id`, `status`, `order_id`, `amount`, `gateway_order_id`, `refund_order_id`, `txn_number`, `receipt_url`, `note`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(14, 'Pending', 18, 222, 'ch_3MXllJKc5rCl9dt40klNs9JK', NULL, 'txn_3MXllJKc5rCl9dt40BQ7YLz5', 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTElCQzRLYzVyQ2w5ZHQ0KI66-Z4GMgZRZdbKde46LBYYBzrPCTy759A-OXdqyZrFaXSoNavJaTfSSHzT8QytYCGnWj6UOR7R50R6', 'Order Stripe Payment', NULL, NULL, NULL, NULL, NULL, '2023-02-04 08:26:38', '2023-02-04 08:26:38'),
(15, 'Pending', 19, 235, 'ch_3MXlyaKc5rCl9dt41Y10f8iq', NULL, 'txn_3MXlyaKc5rCl9dt41EFdHg72', 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTElCQzRLYzVyQ2w5ZHQ0KMXA-Z4GMga1GC_xgmQ6LBY2_n1qTRVg0c0ja_PaDAKBItBtRWIFUDPP5wNHJ9ZQyjHin4f5Bd1Pk0MJ', 'Order Stripe Payment', NULL, NULL, NULL, NULL, NULL, '2023-02-04 08:40:21', '2023-02-04 08:40:21');

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(191) NOT NULL,
  `slug` varchar(191) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `template` varchar(100) DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 1000,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `title`, `slug`, `short_description`, `description`, `image`, `template`, `position`, `status`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(5, 'About Us', 'about-us', NULL, '<h2><strong>We are The Leading Of Online Learning</strong></h2><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At maxime alias placeat laboriosam optio porro quis saepe atque veritatis id, nesciunt consectetur blanditiis eum sunt amet. Facere mollitia voluptatum ex quas accusantium qui rerum veniam aperiam amet doloribus, maiores nihil consequatur alias debitis beatae earum, fugit, consequuntur voluptate quo. Eligendi.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad reprehenderit illum doloremque consectetur, dolores maxime dicta molestias quod laboriosam? Minus consequatur quae quas sit excepturi, tenetur officiis possimus aut officia nobis cumque corporis distinctio esse animi recusandae repellat facere dolorem fuga, repellendus eos atque. Nemo veniam delectus quos commodi quidem!</p>', 'page/637149e24b0511668368866.png', '1', 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-15 06:05:06', '2023-01-31 09:45:23'),
(6, 'Courses', 'courses', NULL, NULL, NULL, '3', 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-15 06:05:24', '2023-01-31 09:51:09'),
(7, 'Tutoring', 'tutoring', NULL, '<p>Even the top athletes need a coach to reach their full potential. 1-on-1 tutoring is ideal for helping your child achieve great results and advance your child’s academic career by learning a subject well, improving performance, and getting great grades. In 1-on-1 tutoring sessions, the tutor can facilitate learning customized to the needs of an individual student. One-on-One tutoring is one of the quickest ways to drive results in your child’s academic career.</p><p>COVID19 is adversely affecting education.&nbsp;<a href=\"https://edworkingpapers.com/ai20-226\">One study</a>&nbsp;predicted that a typical student would start Fall 2020 with only about 63-68% of learning gains in reading relative to a typical year. It is even worse for math (only 37 – 50% relative to a typical year). As remote learning continues for much of the nation, additional learning losses are likely to happen in 2020-21.</p><p>If your child is a high school student, this could have disastrous consequences. College admission has become&nbsp;<a href=\"https://www.usnews.com/education/best-colleges/articles/2016-09-22/how-competitive-is-college-admissions\">highly competitive</a>, with the top schools accepting only 5-10% of applicants. Many public universities now accept less than 50% of applicants, with some accepting less than 20%. This is not the time for your high schooler’s grade to drop, which can adversely affect their chances of getting into the college of their choice.</p><p>Despite the current turmoil, some students will, in fact, make&nbsp;<i>more&nbsp;</i>gains relative to a typical year.&nbsp;<i>Your child</i>&nbsp;could be among them with the right help. Prep Excellence has the best coaches to help your child excel in studies and other aspects of student life. We have elite tutors for many subjects in school and college.</p><p><span style=\"background-color:rgb(248,249,250);color:rgb(63,63,63);\">• Cost: $59/hr (drops to $49/hr if you buy 4 hours or more)</span></p>', NULL, '5', 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-15 06:05:41', '2023-01-31 09:45:52'),
(8, 'College Admission', 'college-admission', NULL, '<p style=\"margin-left:0px;\"><strong>College Admission</strong></p><p style=\"margin-left:0px;\">Prep Excellence advises students and families on admission into competitive colleges and how to get scholarships. We have helped students get into top universities including University of Wisconsin, Princeton University and receive excellent financial aid.</p><p style=\"margin-left:0px;\"><strong>Getting into and Paying for College</strong></p><p style=\"margin-left:0px;\">College admission is messy and has become highly competitive. On top of that, COVID-19 has upended the admissions process all over the world. However, Prep Excellence has the experience and expertise to help you find your best-fit schools and get you admitted. We have helped students achieve their personal and academic goals during these uncertain times. Dr. Alam has developed a holistic approach for undergraduate and graduate admissions and his students received admission into the nation\'s top undergraduate and graduate programs.</p><p style=\"margin-left:0px;\">In the top schools of the nation, the acceptance rates are 10% or less (meaning that 9 out of 10 students are rejected). In some schools, the rate is around 5% (meaning around 19 of 20 mostly highly competent students are rejected). It is nearly impossible to guarantee whether a certain applicant will be accepted in a given university. However, a well-planned and executed approach can improve the probability of a student making it.</p><p style=\"margin-left:0px;\">Let us consider an example. Princeton University offers Early Action, meaning that the students who apply before the Early Action deadline are given the decision early. In 2018, Princeton’s Early Action acceptance rate was 18.5% whereas the Regular Decision acceptance rate was only 5.4%. Thus, taking advantage of the Early Action deadline might be helpful for certain students in getting admission at Princeton University. This is simply an example to provide an idea about proper planning and execution, not as a guarantee.</p><p style=\"margin-left:0px;\">Furthermore, an applicant should apply to a few colleges to improve their chances of admission into a college of their choice. A given college can be a match, reach or safety. If your GPA, SAT/ACT scores and coursework match that of an average freshman in the school, it is a match school. This by itself might not be sufficient for admission because other aspects of the application (recommendation letters, extracurricular activities, and essay) will also determine the outcome. If your academic profile is slightly lower than that of an average freshman.</p><p style=\"margin-left:0px;\">Even if your child is accepted to the college of his/her dreams, he/she still needs to pay for it. It is not only about getting admission, but also about how to pay for it. Thankfully, many financial resources are available. These include scholarships (from the college), grants, work-study jobs, loans, and tax credits. You can also appeal the college’s financial aid package and apply for private scholarships. Many colleges have offered emergency grants in response to the COVID19 emergency. We know the college financial aid landscape thoroughly and can help you get more money.</p>', NULL, '6', 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-15 06:06:26', '2023-01-31 09:54:59'),
(9, 'Blog', 'blog', NULL, NULL, NULL, '4', 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-15 06:06:37', '2023-01-31 09:46:02'),
(10, 'Contact Us', 'contact-us-540083915', NULL, NULL, NULL, '2', 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-19 17:30:15', '2022-06-19 17:30:15'),
(16, 'Upcoming Course', 'upcoming-course', NULL, '<figure class=\"table\"><table style=\"border-bottom:none;border-left:none;border-right:none;border-top:none;\"><tbody><tr><td style=\"border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-top:1.0pt solid windowtext;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">sfwaefg</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:1.0pt none windowtext;border-right:1.0pt solid windowtext;border-top:1.0pt solid windowtext;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:1.0pt none windowtext;border-right:1.0pt solid windowtext;border-top:1.0pt solid windowtext;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:1.0pt none windowtext;border-right:1.0pt solid windowtext;border-top:1.0pt solid windowtext;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:1.0pt none windowtext;border-right:1.0pt solid windowtext;border-top:1.0pt solid windowtext;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:1.0pt none windowtext;border-right:1.0pt solid windowtext;border-top:1.0pt solid windowtext;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:1.0pt none windowtext;border-right:1.0pt solid windowtext;border-top:1.0pt solid windowtext;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td></tr><tr><td style=\"border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-top:1.0pt none windowtext;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">ewfwef</td></tr><tr><td style=\"border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-top:1.0pt none windowtext;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td></tr><tr><td style=\"border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-top:1.0pt none windowtext;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">ewfwe</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">ewfwf</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">werfwefew</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td></tr><tr><td style=\"border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-top:1.0pt none windowtext;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">sfwsfwfwsefwe</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td></tr><tr><td style=\"border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-top:1.0pt none windowtext;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td></tr><tr><td style=\"border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-top:1.0pt none windowtext;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td></tr><tr><td style=\"border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-top:1.0pt none windowtext;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.75pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td><td style=\"border-bottom:1.0pt solid windowtext;border-left:none;border-right:1.0pt solid windowtext;border-top:none;padding:0in 5.4pt;vertical-align:top;width:66.8pt;\">&nbsp;</td></tr></tbody></table></figure>', NULL, NULL, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2023-01-30 04:49:39', '2023-01-31 09:52:25'),
(17, 'FAQs', 'faqs', NULL, NULL, NULL, '7', 1000, 1, NULL, NULL, NULL, NULL, NULL, '2023-01-31 09:52:37', '2023-01-31 09:52:37');

-- --------------------------------------------------------

--
-- Table structure for table `parents`
--

CREATE TABLE `parents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `father_profession` varchar(100) DEFAULT NULL,
  `father_phone_no` varchar(100) DEFAULT NULL,
  `father_nid` varchar(100) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `mother_profession` varchar(100) DEFAULT NULL,
  `mother_phone_number` varchar(100) DEFAULT NULL,
  `mother_nid` varchar(100) DEFAULT NULL,
  `present_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `parmanent_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `local_guardian_name` varchar(100) DEFAULT NULL,
  `local_guardian_phone` varchar(100) DEFAULT NULL,
  `relation` varchar(100) DEFAULT NULL,
  `address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ;

--
-- Dumping data for table `parents`
--

INSERT INTO `parents` (`id`, `father_name`, `father_profession`, `father_phone_no`, `father_nid`, `mother_name`, `mother_profession`, `mother_phone_number`, `mother_nid`, `present_address`, `parmanent_address`, `local_guardian_name`, `local_guardian_phone`, `relation`, `address`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(44, 'Momota', NULL, '123344565', NULL, NULL, NULL, NULL, NULL, '{\"city\":\"Toronto\",\"state\":\"Ontario\",\"country\":\"Canada\",\"zip\":\"M9A4X9\",\"address\":\"Toronto\"}', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-02 08:07:47', '2023-02-04 08:33:01');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_types`
--

CREATE TABLE `payment_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `updated_by` bigint(20) UNSIGNED NOT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_types`
--

INSERT INTO `payment_types` (`id`, `name`, `details`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Cash', '...', 1, 1, 1, '103.117.195.130', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', NULL, '2023-01-17 00:14:34', '2023-01-17 00:14:34');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `alias` varchar(100) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `alias`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'read', 'Read', 1, NULL, NULL, NULL, NULL, NULL, '2022-03-30 02:26:52', '2022-05-07 22:51:40'),
(2, 'create', 'create', 1, NULL, NULL, NULL, NULL, NULL, '2022-06-01 05:29:06', '2022-06-01 05:29:06'),
(3, 'edit', 'edit', 1, NULL, NULL, NULL, NULL, NULL, '2022-06-01 05:29:16', '2022-06-01 05:29:16'),
(4, 'remove', 'remove', 1, NULL, NULL, NULL, NULL, NULL, '2022-06-01 05:29:24', '2022-06-01 05:29:24'),
(5, 'status change', 'status change', 1, NULL, NULL, NULL, NULL, NULL, '2022-06-01 05:29:37', '2022-06-01 05:29:37');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pre_users`
--

CREATE TABLE `pre_users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pre_users`
--

INSERT INTO `pre_users` (`id`, `first_name`, `last_name`, `email`, `password`, `token`, `status`, `created_at`, `updated_at`) VALUES
(1, 'test', 'test', 'dev5.stylzmedia@gmail.com', '$2y$10$S6SpXuzHLlYAte4kmaZEP.lKGjfzK0XWyPu7mzODAulYmUPJaikbG', 'dea8c471fdf60caf8cd27dfb88e95b7f', 0, '2022-06-13 14:19:38', '2022-06-13 14:19:38'),
(14, 'abc', 'def', 'karim.cse007@gmail.com', '$2y$10$edSImerOPRLO3jpYDUUGoenFMLEnhe9WdLbg4msGdGYGQUsD/SL5q', '893a28b0f2b0da197872b66202e6b26c', 0, '2022-12-17 09:24:10', '2022-12-17 09:24:10'),
(15, 'abc', 'def', 'karim.cse007@gmail.com', '$2y$10$LIw7c/lPF02I3.ZO5tj4tewHF9I3YI8jy3l4pYGu/HjbZpL4xq0k6', 'e1eff5d2c72a4a01b0042ca5254b3d20', 0, '2022-12-17 09:24:34', '2022-12-17 09:24:34'),
(16, 'abc', 'def', 'karim.cse007@gmail.com', '$2y$10$se/mLj/B9qut9JotxDgrteRiuId6f2vE34CDc1t6i85P7ax23VR7u', 'eec59e5cc6bac13a26b5ea4e2f36b2e4', 0, '2022-12-17 09:29:17', '2022-12-17 09:29:17'),
(17, 'abc', 'def', 'karim.cse007@gmail.com', '$2y$10$bmjxRTe2DFSp7zGZfCSIQewfncyXY3c/GZmzo9hzaODf5E2niQrNW', 'b5bad0bf412aef40f77f74ef0cb28124', 0, '2022-12-17 09:33:27', '2022-12-17 09:33:27'),
(18, 'abc', 'def', 'karim.cse007@gmail.com', '$2y$10$cjodol1.lWLH6NaD8ulJTu2Lwv8LzQ2ii1ZZycYXFh9SACDPs5AmK', '93e89a1a641e3e6568794ff84b185a7f', 0, '2022-12-17 09:41:47', '2022-12-17 09:41:47'),
(19, 'abc', 'def', 'karim.cse007@gmail.com', '$2y$10$h9Ujh/pbK6GJ42cM5Ax0cuwcYyqQnGBgDhz1I5WVMvwyyn56QEgCC', '0a64a8586c8747d55bcc206bd19c9165', 0, '2022-12-17 09:47:02', '2022-12-17 09:47:02'),
(23, 'aaqa', 'aa', 'karim.cse007@gmail.com', '$2y$10$zBj3/nJQT5xUiW1s7hHvlOnV/6DfnKsQy5u4k/VZl22IcmIIrcScq', '44d3b6dad742e86a5180544494c7be9c', 0, '2022-12-19 18:03:42', '2022-12-19 18:03:42'),
(30, 'Same', 'Test', 'mdmeraz504622@gmail.com', '$2y$10$G9aV7ccmZYKSVvSHNhOYfuhXHq6JoXBZUKVlWfzKOIIQfnFtKdTxK', '5c54b71a20e495897cf9e2a09d70b096', 0, '2023-01-04 09:19:25', '2023-01-04 09:19:25'),
(31, 'TestJan', 'T', 'test4stylezworld@gmail.com', '$2y$10$gxWVuMaNbhmqZi2C/bbfT.Il9lEYLkQgEUUEl3NMEDvE/5eYhydfO', 'b5a918dea6127aefcc685b139fd5c054', 0, '2023-01-04 14:48:08', '2023-01-04 14:48:08'),
(32, 'TestJan', 'Tt', 'test4stylezworld@gmail.com', '$2y$10$t5GcQm26j.FH6FMN8RhiAu7uoTON2DGye9kPKAsXJcSaJi6D7Bp4m', 'c91316f6cf71b804eb9bf6bfb1f0ef6f', 0, '2023-01-04 14:53:39', '2023-01-04 14:53:39'),
(35, 'sfsa', 'afsd', 'test1stylezworld@gmail.com', '$2y$10$7s.ryRc4Bh/xXLovmDNVkeX66fpIUnbBVR2EgYr2/Gzu8G82c3jIu', 'e9d116a8c32fe916f53b2e425a5fdce7', 0, '2023-01-08 12:06:37', '2023-01-08 12:06:37'),
(38, 'Student2', 'Noname', 'std2prepexel@gmail.com', '$2y$10$MdEltXEX7faS.14MyuQXEOmkxLp3taZVIE1C9kCiORf5hG0Ab3N/i', '5da6c0528a955005e8c651e1e39b413f', 0, '2023-01-29 12:47:45', '2023-01-29 12:47:45'),
(39, 'Instructor1', 'Noname', 'instructor1prepexcel@gmail.com', '$2y$10$KSszYPXAx6KEypsbFwgQJu6QU2J/f2KJ9XFSFBkB6HzX8pV11.tMa', 'a8abd5bba28cb6eaf757d6693865c1c7', 0, '2023-01-29 12:54:23', '2023-01-29 12:54:23'),
(40, 'Sabana', 'Khatun', 'test3.prepexcellence@gmail.com', '$2y$10$HwKLm2OSX.8qkAPqgQanj.hRh1MJVEo7iBjfeHS7ahyD7xzbtAMme', '7baca3a8a24c4a520737d75c323838c7', 0, '2023-01-30 01:48:34', '2023-01-30 01:48:34');

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `title` varchar(191) DEFAULT NULL,
  `button_text` varchar(191) DEFAULT NULL,
  `button_url` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `position` int(11) NOT NULL DEFAULT 1000,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `promotions`
--

INSERT INTO `promotions` (`id`, `image`, `title`, `button_text`, `button_url`, `description`, `status`, `position`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, '/storage/promotion/62aaf9c435fe21655372228.jpg', 'Access To Education', 'Register for free', '##', 'Create an account to receive our newsletter, course recommendations and promotions.', 1, 1000, NULL, '2022-06-15 06:24:07', '2022-06-16 09:37:08'),
(2, '/storage/promotion/62aaf9cebbabe1655372238.png', 'Become An Instructor', 'Start Today', '/career', 'Top instructors from around the world teach millions of students on Prep excellence.', 1, 1000, NULL, '2022-06-15 06:27:07', '2022-10-02 16:39:33'),
(3, '/storage/promotion/639ecc8dd4f611671351437.png', 'Promo Title', 'Promo Test', 'https://prepexcellence.stylezworld.net/page/about-us-961575242', 'Write your Des...', 1, 1000, '2022-12-18 08:22:55', '2022-12-18 08:17:17', '2022-12-18 08:22:55');

-- --------------------------------------------------------

--
-- Table structure for table `push_notifications`
--

CREATE TABLE `push_notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `subject` varchar(191) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `role_id` bigint(20) UNSIGNED DEFAULT NULL,
  `message` text DEFAULT NULL,
  `link` varchar(191) DEFAULT NULL,
  `is_notify` tinyint(1) NOT NULL DEFAULT 0,
  `channel_name` varchar(100) DEFAULT NULL,
  `is_seen` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `push_notifications`
--

INSERT INTO `push_notifications` (`id`, `subject`, `user_id`, `role_id`, `message`, `link`, `is_notify`, `channel_name`, `is_seen`, `deleted_at`, `created_at`, `updated_at`) VALUES
(83, 'New Course Assigned', 75, NULL, 'You have a new course', '/employee/course', 1, 'user-channel-75', 0, NULL, '2023-02-02 08:02:21', '2023-02-02 08:02:21'),
(84, 'New Enrollment', NULL, 9, 'Student Enroll a course', '/admin/order', 1, 'admin-notify-channel-9', 0, NULL, '2023-02-04 08:26:16', '2023-02-04 08:26:16'),
(85, 'New Enrollment', NULL, 9, 'Student Enroll a course', '/admin/order', 1, 'admin-notify-channel-9', 0, NULL, '2023-02-04 08:40:00', '2023-02-04 08:40:00');

-- --------------------------------------------------------

--
-- Table structure for table `p_menus`
--

CREATE TABLE `p_menus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `position` int(11) NOT NULL DEFAULT 1000,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `p_menus`
--

INSERT INTO `p_menus` (`id`, `name`, `status`, `position`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Main Menu', 1, 1000, NULL, NULL, NULL, NULL, NULL, '2022-05-22 02:55:47', '2022-05-22 03:09:55'),
(2, 'Test Menu', 1, 1000, NULL, NULL, NULL, NULL, NULL, '2022-05-22 03:10:06', '2022-05-22 03:10:06'),
(3, 'Footer1', 1, 1000, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:05:34', '2022-12-31 14:05:34'),
(4, 'Footer 2', 1, 1000, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:05:43', '2022-12-31 14:05:43'),
(5, 'Footer 3', 1, 1000, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:05:50', '2022-12-31 14:05:50');

-- --------------------------------------------------------

--
-- Table structure for table `question_banks`
--

CREATE TABLE `question_banks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED DEFAULT NULL,
  `course_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `question_type` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1=mcq, 2=cq',
  `question` text DEFAULT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '[option1, option2, option3,...]',
  `answer` text DEFAULT NULL,
  `mark` double NOT NULL DEFAULT 0,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `religions`
--

CREATE TABLE `religions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `religions`
--

INSERT INTO `religions` (`id`, `name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Islam', 1, NULL, NULL),
(2, 'Christian', 1, '2022-06-02 09:30:36', '2022-06-02 09:30:36');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` tinyint(4) NOT NULL COMMENT '1=admin, 2=employee, 3=student, 4=parent, 5=affiliation',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `type`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2023-02-01 10:34:15'),
(2, 'Employee', 2, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Student', 3, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2023-02-04 23:41:46'),
(4, 'parent', 4, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2023-02-04 23:41:44'),
(5, 'Affiliation', 5, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2023-02-04 23:41:49'),
(6, 'Test', 1, 1, NULL, NULL, NULL, NULL, '2022-03-30 05:47:54', '2022-03-30 05:26:24', '2022-03-30 05:47:54'),
(7, 'Teacher', 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-01 05:28:05', '2022-06-01 05:28:05'),
(8, 'Tutor', 2, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-01 05:28:16', '2023-01-08 07:59:22'),
(9, 'Admin 2', 1, 1, NULL, NULL, NULL, NULL, NULL, '2022-06-05 16:43:11', '2022-06-05 16:43:11'),
(10, 'Instructor', 2, 0, NULL, NULL, NULL, NULL, NULL, '2022-06-19 16:43:33', '2023-01-08 07:59:25');

-- --------------------------------------------------------

--
-- Table structure for table `role_menu_permissions`
--

CREATE TABLE `role_menu_permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `menu_permission_id` bigint(20) UNSIGNED NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_menu_permissions`
--

INSERT INTO `role_menu_permissions` (`id`, `role_id`, `menu_permission_id`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 1, 7, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 1, 8, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 1, 3, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 1, 2, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 1, 11, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 1, 12, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 1, 13, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 1, 14, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 1, 5, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 1, 4, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 1, 9, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 1, 10, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 1, 6, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 1, 20, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 1, 15, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 1, 16, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 1, 17, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 1, 18, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 1, 19, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 1, 23, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 1, 22, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, 1, 21, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(24, 1, 24, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, 1, 25, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, 1, 26, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, 1, 27, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(28, 1, 28, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(29, 1, 35, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, 1, 31, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(31, 1, 29, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(32, 1, 30, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, 1, 32, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(34, 1, 33, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(35, 1, 34, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(36, 1, 36, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(37, 1, 37, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, 1, 38, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(39, 1, 39, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, 1, 40, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(41, 1, 41, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(42, 1, 43, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(43, 1, 42, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(44, 1, 44, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(45, 1, 45, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(46, 1, 46, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(47, 1, 57, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(48, 1, 52, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(49, 1, 47, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(50, 1, 48, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(51, 1, 49, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(52, 1, 50, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(53, 1, 51, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(54, 1, 54, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(55, 1, 53, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(56, 1, 55, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(57, 1, 56, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(58, 1, 58, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(59, 1, 59, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(60, 1, 60, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(61, 1, 61, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(62, 1, 67, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(63, 1, 68, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(64, 1, 63, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(65, 1, 62, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(66, 1, 64, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(67, 1, 65, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(68, 1, 66, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(69, 9, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(70, 9, 7, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(71, 9, 8, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(72, 9, 3, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(73, 9, 2, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(74, 9, 4, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(75, 9, 5, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(76, 9, 6, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(77, 9, 11, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(78, 9, 12, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(79, 9, 13, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(80, 9, 14, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(81, 9, 15, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(82, 9, 16, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(83, 9, 17, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(84, 9, 18, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(85, 9, 19, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(86, 9, 67, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(87, 9, 68, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(88, 9, 63, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(89, 9, 62, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(90, 9, 64, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(91, 9, 65, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(92, 9, 66, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(93, 9, 9, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(94, 9, 10, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(95, 9, 57, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(96, 9, 58, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(97, 9, 59, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(98, 9, 60, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(99, 9, 61, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(100, 1, 69, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(101, 1, 70, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(102, 1, 71, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(103, 1, 72, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(104, 1, 73, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(105, 1, 79, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(106, 1, 75, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(107, 1, 74, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(108, 1, 76, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(109, 1, 81, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(110, 1, 80, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(111, 1, 85, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(112, 1, 84, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(113, 1, 86, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(114, 1, 87, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(115, 1, 88, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(116, 1, 83, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(117, 1, 82, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(118, 1, 77, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(119, 1, 78, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(120, 1, 89, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(121, 1, 90, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(122, 1, 91, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(123, 1, 92, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(124, 1, 93, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(125, 1, 98, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(126, 1, 97, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(127, 1, 96, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(128, 1, 95, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(129, 1, 94, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(130, 1, 99, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(131, 1, 100, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(132, 1, 101, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(133, 1, 102, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(134, 1, 103, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(135, 1, 107, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(136, 1, 106, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(137, 1, 104, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(138, 1, 105, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(139, 1, 108, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(140, 1, 113, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(141, 1, 111, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(142, 1, 112, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(143, 1, 110, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(144, 1, 109, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(145, 1, 114, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(146, 1, 115, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(147, 1, 116, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(148, 1, 117, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(149, 1, 118, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(150, 1, 119, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(151, 1, 120, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(152, 1, 121, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(153, 1, 122, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(154, 1, 127, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(155, 1, 126, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(156, 1, 125, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(157, 1, 124, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(158, 1, 129, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(159, 1, 130, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(160, 1, 131, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(161, 1, 132, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(162, 1, 133, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(163, 1, 123, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(164, 1, 128, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(165, 1, 134, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(166, 1, 135, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(167, 1, 139, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(168, 1, 140, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(169, 1, 145, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(170, 1, 144, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(171, 1, 136, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(172, 1, 137, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(173, 1, 138, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(174, 1, 143, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(175, 1, 142, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(176, 1, 141, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(177, 1, 146, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(178, 1, 147, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(179, 1, 148, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(180, 1, 155, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(181, 1, 149, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(182, 1, 150, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(183, 1, 151, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(184, 1, 152, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(185, 1, 153, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(186, 1, 158, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(187, 1, 157, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(188, 1, 156, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(189, 1, 154, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(190, 1, 160, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(191, 1, 159, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(192, 1, 161, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(193, 1, 162, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(194, 1, 163, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(195, 1, 174, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(196, 1, 175, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(197, 1, 170, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(198, 1, 169, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(199, 1, 164, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(200, 1, 165, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(201, 1, 166, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(202, 1, 167, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(203, 1, 168, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(204, 1, 173, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(205, 1, 172, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(206, 1, 171, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(207, 1, 176, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(208, 1, 177, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(209, 1, 178, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(210, 1, 189, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(211, 1, 184, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(212, 1, 185, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(213, 1, 180, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(214, 1, 179, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(215, 1, 181, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(216, 1, 182, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(217, 1, 183, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(218, 1, 188, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(219, 1, 187, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(220, 1, 186, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(221, 1, 192, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(222, 1, 191, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(223, 1, 190, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(224, 1, 193, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(225, 1, 204, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(226, 1, 205, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(227, 1, 206, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(228, 1, 207, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(229, 1, 208, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(230, 1, 203, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(231, 1, 202, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(232, 1, 201, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(233, 1, 200, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(234, 1, 199, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(235, 1, 194, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(236, 1, 195, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(237, 1, 196, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(238, 1, 197, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(239, 1, 198, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(240, 1, 209, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(241, 1, 210, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(242, 1, 211, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(243, 1, 212, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(244, 1, 216, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(245, 1, 214, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(246, 1, 215, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(247, 1, 217, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(248, 1, 218, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(249, 1, 213, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(250, 1, 223, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(251, 1, 222, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(252, 1, 221, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(253, 1, 220, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(254, 1, 219, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(255, 1, 224, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(256, 1, 225, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(257, 1, 226, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(258, 1, 227, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(259, 1, 228, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(260, 1, 233, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(261, 1, 232, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(262, 1, 231, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(263, 1, 230, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(264, 1, 229, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(265, 1, 239, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(266, 1, 240, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(267, 1, 241, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(268, 1, 242, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(269, 1, 243, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(270, 1, 244, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(271, 1, 245, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(272, 1, 246, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(273, 1, 247, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(274, 1, 234, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(275, 1, 236, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(276, 1, 235, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(277, 1, 237, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(278, 1, 238, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(279, 2, 248, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(280, 2, 249, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(281, 2, 250, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(282, 2, 251, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(283, 2, 252, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(284, 2, 263, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(285, 2, 253, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(286, 2, 254, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(287, 2, 255, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(288, 2, 256, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(289, 2, 257, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(290, 2, 264, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(291, 2, 265, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(292, 2, 266, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(293, 2, 267, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(294, 2, 268, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(295, 2, 262, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(296, 2, 258, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(297, 2, 259, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(298, 2, 260, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(299, 2, 261, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(300, 2, 269, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(301, 2, 270, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(302, 2, 271, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(303, 2, 272, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(304, 2, 273, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(305, 2, 274, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(306, 2, 275, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(307, 2, 276, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(308, 2, 277, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(309, 2, 278, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(310, 2, 282, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(311, 2, 283, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(312, 2, 281, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(313, 2, 280, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(314, 2, 279, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(315, 2, 284, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(316, 2, 285, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(317, 2, 286, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(318, 2, 287, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(319, 2, 288, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(320, 2, 289, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(321, 2, 290, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(322, 2, 291, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(323, 2, 292, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(324, 2, 293, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(325, 2, 298, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(326, 2, 297, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(327, 2, 296, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(328, 2, 295, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(329, 2, 294, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(330, 2, 299, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(331, 2, 300, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(332, 2, 301, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(333, 2, 302, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(334, 2, 303, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(335, 2, 304, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(336, 7, 248, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(337, 7, 249, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(338, 7, 250, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(339, 7, 251, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(340, 7, 252, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(341, 7, 263, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(342, 7, 253, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(343, 7, 254, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(344, 7, 255, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(345, 7, 256, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(346, 7, 257, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(347, 7, 264, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(348, 7, 268, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(349, 7, 267, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(350, 7, 266, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(351, 7, 265, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(352, 7, 258, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(353, 7, 259, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(354, 7, 260, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(355, 7, 261, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(356, 7, 262, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(357, 7, 269, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(358, 7, 270, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(359, 7, 271, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(360, 7, 272, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(361, 7, 273, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(362, 7, 284, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(363, 7, 285, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(364, 7, 286, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(365, 7, 274, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(366, 7, 275, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(367, 7, 276, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(368, 7, 277, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(369, 7, 278, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(370, 7, 279, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(371, 7, 280, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(372, 7, 281, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(373, 7, 283, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(374, 7, 282, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(375, 7, 287, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(376, 7, 288, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(377, 7, 301, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(378, 7, 300, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(379, 7, 299, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(380, 7, 294, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(381, 7, 295, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(382, 7, 296, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(383, 7, 297, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(384, 7, 298, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(385, 7, 293, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(386, 7, 292, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(387, 7, 291, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(388, 7, 290, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(389, 7, 289, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(390, 7, 302, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(391, 7, 303, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(392, 7, 304, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(393, 8, 248, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(394, 8, 249, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(395, 8, 250, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(396, 8, 251, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(397, 8, 252, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(398, 8, 263, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(399, 8, 253, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(400, 8, 254, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(401, 8, 255, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(402, 8, 256, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(403, 8, 257, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(404, 8, 264, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(405, 8, 268, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(406, 8, 267, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(407, 8, 266, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(408, 8, 265, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(409, 8, 258, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(410, 8, 259, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(411, 8, 260, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(412, 8, 261, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(413, 8, 262, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(414, 8, 272, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(415, 8, 271, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(416, 8, 270, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(417, 8, 269, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(418, 8, 273, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(419, 8, 287, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(420, 8, 286, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(421, 8, 285, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(422, 8, 284, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(423, 8, 288, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(424, 8, 299, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(425, 8, 300, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(426, 8, 279, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(427, 8, 280, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(428, 8, 281, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(429, 8, 283, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(430, 8, 282, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(431, 8, 278, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(432, 8, 277, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(433, 8, 276, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(434, 8, 275, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(435, 8, 274, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(436, 8, 293, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(437, 8, 292, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(438, 8, 291, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(439, 8, 290, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(440, 8, 289, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(441, 8, 294, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(442, 8, 295, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(443, 8, 296, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(444, 8, 297, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(445, 8, 298, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(446, 8, 301, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(447, 8, 302, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(448, 8, 303, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(449, 8, 304, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sat_scores`
--

CREATE TABLE `sat_scores` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sat_section_id` bigint(20) UNSIGNED DEFAULT NULL,
  `raw_score` int(11) DEFAULT NULL,
  `reading` int(11) DEFAULT NULL,
  `writing` int(11) DEFAULT NULL,
  `math` int(11) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sat_scores`
--

INSERT INTO `sat_scores` (`id`, `sat_section_id`, `raw_score`, `reading`, `writing`, `math`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 10, 10, 200, NULL, NULL, NULL, NULL, '2022-10-02 10:05:29', NULL, '2022-10-02 10:05:29'),
(2, 1, 1, 10, 10, 200, NULL, NULL, NULL, NULL, '2022-10-02 10:05:29', NULL, '2022-10-02 10:05:29'),
(3, 1, 2, 10, 10, 210, NULL, NULL, NULL, NULL, '2022-10-02 10:05:29', NULL, '2022-10-02 10:05:29'),
(4, 1, 3, 10, 11, 220, NULL, NULL, NULL, NULL, '2022-10-02 10:05:29', NULL, '2022-10-02 10:05:29'),
(5, 1, 4, 11, 11, 230, NULL, NULL, NULL, NULL, '2022-10-02 10:05:29', NULL, '2022-10-02 10:05:29'),
(6, 1, 5, 12, 12, 250, NULL, NULL, NULL, NULL, '2022-10-02 10:05:29', NULL, '2022-10-02 10:05:29'),
(7, 1, 0, 10, 10, 200, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(8, 1, 1, 10, 10, 200, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(9, 1, 2, 10, 10, 210, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(10, 1, 3, 10, 11, 220, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(11, 1, 4, 11, 11, 230, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(12, 1, 5, 12, 12, 250, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(13, 1, 6, 13, 13, 270, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(14, 1, 7, 13, 14, 290, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(15, 1, 8, 14, 14, 300, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(16, 1, 9, 15, 15, 310, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(17, 1, 10, 16, 16, 320, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(18, 1, 11, 16, 16, 340, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(19, 1, 12, 17, 17, 350, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(20, 1, 13, 17, 17, 360, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(21, 1, 14, 18, 18, 370, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(22, 1, 15, 18, 18, 380, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(23, 1, 16, 19, 18, 390, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(24, 1, 17, 19, 19, 400, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(25, 1, 18, 20, 19, 410, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(26, 1, 19, 20, 20, 420, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(27, 1, 20, 21, 20, 430, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(28, 1, 21, 21, 21, 440, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(29, 1, 22, 22, 21, 450, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(30, 1, 23, 22, 22, 460, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(31, 1, 24, 23, 23, 470, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(32, 1, 25, 23, 23, 480, NULL, NULL, NULL, NULL, '2022-10-02 20:33:33', NULL, '2022-10-02 20:33:33'),
(33, 1, 0, 10, 10, 200, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(34, 1, 1, 10, 10, 200, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(35, 1, 2, 10, 10, 210, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(36, 1, 3, 10, 11, 220, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(37, 1, 4, 11, 11, 230, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(38, 1, 5, 12, 12, 250, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(39, 1, 6, 13, 13, 270, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(40, 1, 7, 13, 14, 290, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(41, 1, 8, 14, 14, 300, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(42, 1, 9, 15, 15, 310, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(43, 1, 10, 16, 16, 320, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(44, 1, 11, 16, 16, 340, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(45, 1, 12, 17, 17, 350, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(46, 1, 13, 17, 17, 360, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(47, 1, 14, 18, 18, 370, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(48, 1, 15, 18, 18, 380, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(49, 1, 16, 19, 18, 390, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(50, 1, 17, 19, 19, 400, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(51, 1, 18, 20, 19, 410, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(52, 1, 19, 20, 20, 420, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(53, 1, 20, 21, 20, 430, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(54, 1, 21, 21, 21, 440, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(55, 1, 22, 22, 21, 450, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(56, 1, 23, 22, 22, 460, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(57, 1, 24, 23, 23, 470, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(58, 1, 25, 23, 23, 480, NULL, NULL, NULL, NULL, '2023-01-29 01:02:51', NULL, '2023-01-29 01:02:51'),
(142, 1, 0, 10, 10, 200, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(143, 1, 1, 10, 10, 200, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(144, 1, 2, 10, 10, 210, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(145, 1, 3, 10, 11, 220, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(146, 1, 4, 11, 11, 230, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(147, 1, 5, 12, 12, 250, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(148, 1, 6, 13, 13, 270, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(149, 1, 7, 13, 14, 290, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(150, 1, 8, 14, 14, 300, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(151, 1, 9, 15, 15, 310, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(152, 1, 10, 16, 16, 320, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(153, 1, 11, 16, 16, 340, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(154, 1, 12, 17, 17, 350, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(155, 1, 13, 17, 17, 360, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(156, 1, 14, 18, 18, 370, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(157, 1, 15, 18, 18, 380, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(158, 1, 16, 19, 18, 390, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(159, 1, 17, 19, 19, 400, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(160, 1, 18, 20, 19, 410, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(161, 1, 19, 20, 20, 420, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(162, 1, 20, 21, 20, 430, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(163, 1, 21, 21, 21, 440, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(164, 1, 22, 22, 21, 450, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(165, 1, 23, 22, 22, 460, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(166, 1, 24, 23, 23, 470, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(167, 1, 25, 23, 23, 480, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sat_sections`
--

CREATE TABLE `sat_sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sat_sections`
--

INSERT INTO `sat_sections` (`id`, `title`, `description`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Valid SAT Score', NULL, 1, 1, 1, '103.117.195.133', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36', NULL, '2022-10-02 09:59:21', '2023-01-29 01:02:51');

-- --------------------------------------------------------

--
-- Table structure for table `section_design_types`
--

CREATE TABLE `section_design_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `section_design_types`
--

INSERT INTO `section_design_types` (`id`, `name`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Text Image Card', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'News', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Testimonial', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'Half Parallax', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'Full Parallax', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'Course', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 'Promotions', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 'Instructors', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 'Gallery', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 'Top Categories', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `group` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `value` longtext DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `group`, `name`, `value`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'general', 'title', 'Prep Excellence', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'general', 'slogan', 'Find the Best Course for Your Child', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'general', 'mobile_number', '+1 (214)-603-2254', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'general', 'email', 'info@prepexcellence.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'general', 'tel', '+1 (848) 448-3331', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'general', 'copyright', 'All Rights Reserved.', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 'general', 'city', 'Clifton', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 'general', 'state', 'New Jersey', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 'general', 'country', 'United State', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 'general', 'zip', '07013', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 'general', 'street', '642 Broad St', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 'social', 'facebook', 'https://www.facebook.com/prepexcellence', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 'social', 'twitter', 'https://twitter.com/prepexcellence', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 'social', 'youtube', 'https://www.youtube.com/channel/UCUzjMQj_V1LCKKLuBIe4D_A', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 'social', 'instagram', 'https://www.instagram.com/prep.excellence/', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 'social', 'linkedin', 'https://www.linkedin.com/company/prepexcellence', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 'general', 'logo', '/storage/settings/202262a9745dac5c5.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 'general', 'favicon', '/storage/settings/202262987fc6e8b3d.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 'general', 'og_image', '/storage/settings/202262a7083e309c2.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 'top_add', 'offer', '150', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 'top_add', 'text', 'Promo code WIN150', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 'general', 'map', 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12067.625228576102!2d-74.1689062!3d40.8739303!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x6d69e53a076096a0!2sPrep%20Excellence!5e0!3m2!1sen!2sbd!4v1668367338112!5m2!1sen!2sbd', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, 'social', 'snapchat', 'https://www.snapchat.com/en-GB', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `siblings`
--

CREATE TABLE `siblings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sibling_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sliders`
--

CREATE TABLE `sliders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `position` int(11) NOT NULL DEFAULT 1000,
  `text_1` varchar(100) DEFAULT NULL,
  `text_2` varchar(100) DEFAULT NULL,
  `button_1_text` varchar(100) DEFAULT NULL,
  `button_1_url` varchar(100) DEFAULT NULL,
  `button_2_text` varchar(100) DEFAULT NULL,
  `button_2_url` varchar(100) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `slider_type` tinyint(4) NOT NULL COMMENT '1=image, 2=video, 3=script',
  `image` varchar(100) DEFAULT NULL,
  `video` varchar(100) DEFAULT NULL,
  `slider_script` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sliders`
--

INSERT INTO `sliders` (`id`, `status`, `position`, `text_1`, `text_2`, `button_1_text`, `button_1_url`, `button_2_text`, `button_2_url`, `short_description`, `description`, `slider_type`, `image`, `video`, `slider_script`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'abcd', NULL, 'ddd', 'ddd', 'dddd', 'ddd', NULL, 'dsadsad dsa DSA dsa', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-05-24 02:59:16', '2022-05-19 03:20:40', '2022-05-24 02:59:16'),
(2, 1, 0, 'bbbb', NULL, 'sss', 'sss', 'sss', 'sss', NULL, 'ssss', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-05-24 02:59:12', '2022-05-19 03:22:38', '2022-05-24 02:59:12'),
(3, 1, 2, 'sss ffff', NULL, 'ddd', 'dsad', 'dsad', 'dsa', NULL, 'dsadsads', 1, '/storage/slider/2022/20226289bbbfa70fa.png', NULL, NULL, NULL, NULL, NULL, NULL, '2022-06-07 11:41:14', '2022-05-19 04:55:37', '2022-06-07 11:41:14'),
(4, 1, 4, 'dsadsa', NULL, NULL, NULL, NULL, NULL, NULL, 'dsafdsa', 1, '/storage/slider/2022/202262862595d92d4.jpeg', NULL, NULL, NULL, NULL, NULL, NULL, '2022-06-07 11:41:11', '2022-05-19 05:10:13', '2022-06-07 11:41:11'),
(5, 1, 3, 'Voluptatem Odit ani', NULL, 'Deserunt rerum conse', 'Veniam ad a culpa i', 'Et aliqua Non lauda', 'Enim officia quia ne', NULL, 'Est aliquam aut enim', 2, NULL, '/storage/slider/video/1652959946_campus 53.mp4', NULL, NULL, NULL, NULL, NULL, '2022-05-21 22:16:30', '2022-05-19 05:32:26', '2022-05-21 22:16:30'),
(6, 1, 1000, 'Extraordinary', 'Outcome', 'Read More', '/page/contact-us-540083915', 'Buy Now', '/page/contact-us-540083915', NULL, 'Our Courses, tutors, and college consultants consistently deliver amazing results.', 1, '/storage/slider/62aafb10217651655372560.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-06-07 11:41:42', '2022-11-13 19:50:17'),
(7, 1, 1000, 'Extraordinary', 'Outcome', NULL, NULL, NULL, NULL, NULL, 'Our courses, tutors, and college consultants consistently deliver amazing results.', 1, '/storage/slider/2022/202262a74f3ab6e4e.png', NULL, NULL, NULL, NULL, NULL, NULL, '2022-06-16 09:36:16', '2022-06-13 14:52:42', '2022-06-16 09:36:16'),
(8, 1, 1000, 'Test content', 'Final content', NULL, NULL, NULL, NULL, NULL, 'Our Courses, tutors, and college consultants consistently deliver amazing results.', 1, '/storage/slider/639ecdf8b23b91671351800.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-10-02 16:23:32', '2022-12-18 08:23:20'),
(9, 1, 1000, 'Test Slider', NULL, 'Test Button', 'https://prepexcellence.stylezworld.net/page/about-us-961575242', NULL, NULL, NULL, 'Write your sort des...', 1, '/storage/slider/639ecbc80ed6e1671351240.png', NULL, NULL, NULL, NULL, NULL, NULL, '2022-12-18 08:15:41', '2022-12-18 08:14:00', '2022-12-18 08:15:41');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` varchar(191) DEFAULT NULL,
  `roll_no` int(11) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `student_id`, `roll_no`, `image`, `parent_id`, `date_of_birth`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(65, '20230001', NULL, NULL, 44, '2010-06-02', 1, NULL, NULL, NULL, NULL, NULL, '2023-02-02 08:06:16', '2023-02-02 08:07:47'),
(66, '20230002', NULL, NULL, 44, '2017-05-04', 1, NULL, NULL, NULL, NULL, NULL, '2023-02-04 08:35:25', '2023-02-04 08:35:25');

-- --------------------------------------------------------

--
-- Table structure for table `student_answers`
--

CREATE TABLE `student_answers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED DEFAULT NULL,
  `exam_id` bigint(20) UNSIGNED DEFAULT NULL,
  `exam_question_id` bigint(20) UNSIGNED DEFAULT NULL,
  `student_answer` text DEFAULT NULL,
  `correct_answer` text DEFAULT NULL,
  `total_mark` double NOT NULL DEFAULT 0,
  `mark` double NOT NULL DEFAULT 0,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_courses`
--

CREATE TABLE `student_courses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED DEFAULT NULL,
  `course_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `amount` double NOT NULL DEFAULT 0,
  `payment_status` varchar(100) DEFAULT NULL,
  `payment_type` varchar(100) DEFAULT NULL,
  `transaction_no` varchar(100) DEFAULT NULL,
  `payment_details` text DEFAULT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_courses`
--

INSERT INTO `student_courses` (`id`, `student_id`, `course_id`, `order_id`, `amount`, `payment_status`, `payment_type`, `transaction_no`, `payment_details`, `is_approved`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(54, 65, 26, 18, 235, 'Paid', NULL, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-04 08:26:16', '2023-02-04 08:26:38'),
(55, 66, 26, 19, 235, 'Paid', NULL, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-04 08:40:00', '2023-02-04 08:40:21'),
(56, 65, 26, NULL, 235, 'paid', 'abc', '63de60f24d671', 'ads', 1, 0, NULL, NULL, NULL, NULL, NULL, '2023-02-04 08:43:14', '2023-02-04 08:44:08');

-- --------------------------------------------------------

--
-- Table structure for table `student_home_works`
--

CREATE TABLE `student_home_works` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `home_work_id` bigint(20) UNSIGNED DEFAULT NULL,
  `student_id` bigint(20) UNSIGNED DEFAULT NULL,
  `file` varchar(100) DEFAULT NULL,
  `submission_type` varchar(100) DEFAULT NULL COMMENT 'on time, late submission',
  `mark` double NOT NULL DEFAULT 0,
  `total_mark` double NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sub_expense_types`
--

CREATE TABLE `sub_expense_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `expense_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sub_expense_types`
--

INSERT INTO `sub_expense_types` (`id`, `name`, `expense_type_id`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'dxfg', 1, 1, 1, 1, '103.35.168.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', NULL, '2023-01-15 07:10:23', '2023-01-15 07:10:23');

-- --------------------------------------------------------

--
-- Table structure for table `s_m_s`
--

CREATE TABLE `s_m_s` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `msisdn` varchar(30) DEFAULT NULL,
  `text` text DEFAULT NULL,
  `csms_id` varchar(191) DEFAULT NULL,
  `sms_type` varchar(20) DEFAULT 'EN',
  `status` varchar(100) DEFAULT 'Pending',
  `try` tinyint(4) NOT NULL DEFAULT 0,
  `is_sent` tinyint(4) NOT NULL DEFAULT 0,
  `info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `position` int(11) NOT NULL DEFAULT 1000,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  `phone_number` varchar(60) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `message` longtext DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `position`, `first_name`, `last_name`, `email`, `phone_number`, `image`, `message`, `status`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1000, 'Md Abdul', 'karim', 'info@stylezworld.com', '+643333333333', NULL, 'Dr. Kaisar Alam is my SAT teacher. He would assess your SAT readiness to see where you are before he begins teaching you so that he may tweak his style for your benefit. Personally, I was a little slower in', 1, NULL, '2022-10-02 16:33:50', '2022-10-02 16:33:50'),
(2, 1000, 'Omar', 'H', 'sharifsarkar786@gmail.com', '+8801789862093', '/storage/testimonial/2022/202262a978d2292e2.png', 'Dr. Kaisar Alam is my SAT teacher. He would assess your SAT readiness to see where you are before he begins teaching you so that he may tweak his style for your benefit. Personally, I was a little slower in the beginning but the pace picked up as the tutoring went on. Thanks to Dr. Alam, my score went around 200 points in just under a span of 3-4 months. He is a great choice for those who need their scores to improve significantly in a short amount of time.', 1, '2022-06-16 06:07:54', '2022-06-15 06:12:15', '2022-06-16 06:07:54'),
(3, 1000, 'Omar', 'H', 'sharifsarkar786@gmail.com', '+8801789862093', NULL, 'Dr. Kaisar Alam is my SAT teacher. He would assess your SAT readiness to see where you are before he begins teaching you so that he may tweak his style for your benefit. Personally, I was a little slower in ...', 1, NULL, '2022-06-16 06:08:39', '2023-01-22 12:55:53'),
(4, 1000, 'Emane', 'H', 'sharifsarkar786@gmail.com', '+8801789862093', NULL, 'I had a couple of SAT teachers before Dr. Kaisar Alam and they had not worked out well for me. Also, before I began studying with him, I was so scared of the SAT! The math section was always my ...', 1, NULL, '2022-06-16 06:09:40', '2023-01-22 12:56:00'),
(5, 1000, 'Nuha', 'J', 'sharifsarkar786@gmail.com', '+8801789862093', NULL, 'I took Dr. Alam\'s formal SAT prep course and also took a few one-to-one lessons from him. I was lacking the motivation to study myself. The classes and individual lessons helped me to focus and gain mo...', 1, NULL, '2022-06-16 06:10:15', '2023-01-22 12:55:58'),
(6, 1000, 'Rick', 'S', 'sharifsarkar786@gmail.com', '+8801789862093', NULL, 'Comment: Dr. Alam\'s teaching was wonderful, He was patient and helped me understand the material, and gave me helpful techniques for the exam. He helped me boost my score phenomenally ...', 1, NULL, '2022-06-16 06:10:43', '2023-01-22 12:56:04'),
(7, 1000, 'Areeq', 'H', 'sharifsarkar786@gmail.com', '+8801789862093', NULL, 'Dr. Alam\'s personalized approach to teaching to fit the individual student made for a truly special learning experience that proved quite effective. He comprehensively mapped out exam strategies ...', 1, NULL, '2022-06-16 06:11:12', '2023-01-22 12:56:02'),
(8, 1000, 'Malia', 'A', 'sharifsarkar786@gmail.com', '+8801789862093', '/storage/testimonial/2022/202262aaca3d5fb2f.png', 'Comment: I am thankful to have had a teacher like Dr. Alam. Through his unique teaching style that helped students look at SAT problems in different ways, I was able to improve my score by 270 points!...', 1, NULL, '2022-06-16 06:14:21', '2023-01-22 12:56:16'),
(9, 1000, 'Nisarga', 'S', 'sharif@zaqzaq.jp', '+8801618220044', NULL, 'Dr. Alam is an excellent SAT tutor. Through his lessons, I learned many strategies and shortcuts to use on the test, which saved me a lot of time. After his classes, I felt confident in my ability...', 1, NULL, '2022-06-16 06:14:57', '2022-10-02 16:37:45'),
(10, 1000, 'Omar', 'H', 'sharif@zaqzaq.jp', '+8801618220044', NULL, 'Dr. Kaisar Alam is my SAT teacher. He would assess your SAT readiness to see where you are before he begins teaching you so that he may tweak his style for your benefit. Personally, I was a little slower ...', 1, NULL, '2022-06-16 06:15:26', '2022-10-02 16:37:43'),
(11, 1000, 'Emane', 'H', 'sharifsarkar786@gmail.com', '+8801789862093', NULL, 'I had a couple of SAT teachers before Dr. Kaisar Alam and they had not worked out well for me. Also, before I began studying with him, I was so scared of the SAT! The math section was always my ...', 1, NULL, '2022-06-16 06:15:57', '2022-10-02 16:37:44'),
(12, 1000, 'Nuha', 'J', 'sharifsarkar786@gmail.com', '+8801789862093', NULL, 'I took Dr. Alam\'s formal SAT prep course and also took a few one-to-one lessons from him. I was lacking the motivation to study myself. The classes and individual lessons helped me to focus and gain...', 1, NULL, '2022-06-16 06:16:34', '2022-10-02 16:37:41'),
(13, 1000, 'Rick', 'S', 'sharifsarkar786@gmail.com', '+8801789862093', NULL, 'Comment: Dr. Alam\'s teaching was wonderful, He was patient and helped me understand the material, and gave me helpful techniques for the exam. He helped me boost my score phenomenally with...', 1, NULL, '2022-06-16 06:17:21', '2022-10-02 16:37:40'),
(14, 1000, 'Areeq', 'H', 'sharifsarkar786@gmail.com', '+8801789862093', NULL, 'Dr. Alam\'s personalized approach to teaching to fit the individual student made for a truly special learning experience that proved quite effective. He comprehensively mapped out exam strategies ...', 1, NULL, '2022-06-16 06:17:52', '2022-10-02 16:37:38'),
(15, 1000, 'Malia', 'A', 'sharifsarkar786@gmail.com', '+8801789862093', NULL, 'Comment: I am thankful to have had a teacher like Dr. Alam. Through his unique teaching style that helped students look at SAT problems in different ways, I was able to improve my score by 270 points! ...', 1, NULL, '2022-06-16 06:18:22', '2022-10-02 16:37:38'),
(17, 1000, 'Malia', 'A', 'sharifsarkar786@gmail.com', '+8801789862093', '/storage/testimonial/2022/202262a978ba6381a.png', 'Comment: I am thankful to have had a teacher like Dr. Alam. Through his unique teaching style that helped students look at SAT problems in different ways, I was able to improve my score by 270 points', 1, '2022-06-16 06:07:48', '2022-06-15 06:10:34', '2022-06-16 06:07:48'),
(18, 1000, 'Test', 'MD', 'test1stylezworld@gmail.com', '01400020291', NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 0, '2022-12-22 16:27:12', '2022-12-22 16:22:05', '2022-12-22 16:27:12'),
(19, 1000, 'Test2', 'md', 'test2stylezworld@gmail.com', '01400020291', '/storage/testimonial/2022/202263a484c117cc8.jpg', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 1, '2022-12-22 16:27:07', '2022-12-22 16:24:33', '2022-12-22 16:27:07'),
(20, 1000, 'Mr', 'Test', 'mrtest@gmail.com', '01234567890', '/storage/testimonial/2022/202263a487ee90ee8.jpg', 'Demo Text. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 1, NULL, '2022-12-22 16:38:06', '2022-12-22 16:38:06');

-- --------------------------------------------------------

--
-- Table structure for table `tutorings`
--

CREATE TABLE `tutorings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `courses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `other` varchar(191) DEFAULT NULL,
  `student_need` text DEFAULT NULL,
  `day_time` varchar(191) DEFAULT NULL,
  `day_time_tutoring` varchar(191) DEFAULT NULL,
  `referral` varchar(191) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `total_hour` double NOT NULL DEFAULT 0,
  `hour_rate` double NOT NULL DEFAULT 0,
  `amount` double NOT NULL DEFAULT 0,
  `tax` double NOT NULL DEFAULT 0,
  `discount` double NOT NULL DEFAULT 0,
  `total_amount` double NOT NULL DEFAULT 0,
  `refund_amount` double NOT NULL DEFAULT 0,
  `payment_method` varchar(100) DEFAULT NULL,
  `tnx_no` varchar(100) DEFAULT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tutorings`
--

INSERT INTO `tutorings` (`id`, `user_id`, `courses`, `other`, `student_need`, `day_time`, `day_time_tutoring`, `referral`, `question`, `total_hour`, `hour_rate`, `amount`, `tax`, `discount`, `total_amount`, `refund_amount`, `payment_method`, `tnx_no`, `is_paid`, `status`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 16, '[{\"id\":2,\"name\":\"IELTS\",\"hour\":\"21\"}]', NULL, 'sljflshflsh', 'day 10am', 'wednessday', 'm', 'test', 21, 49, 1029, 0, 0, 1029, 0, NULL, '63a86df45190e', 1, 0, '103.183.16.69', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', '2022-12-29 09:03:35', '2022-12-25 15:36:20', '2022-12-29 09:03:35'),
(2, 16, '[{\"id\":2,\"name\":\"IELTS\",\"hour\":\"20\"},{\"id\":3,\"name\":\"SAT\",\"hour\":\"10\"},{\"id\":4,\"name\":\"PSAT\",\"hour\":\"5\"}]', NULL, 'Absfjsjf', '10am', 'Wednesday', 'm', 'no', 35, 49, 1715, 0, 0, 1715, 0, NULL, '63a950254b92f', 1, 0, '103.183.16.69', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', NULL, '2022-12-26 07:41:25', '2022-12-26 07:43:07'),
(3, 1, '[{\"id\":2,\"name\":\"IELTS\",\"hour\":\"10\"},{\"id\":3,\"name\":\"SAT\",\"hour\":\"20\"},{\"id\":4,\"name\":\"PSAT\",\"hour\":\"30\"}]', NULL, 'asd', '10 am', 'Wednessday', '01400020291', 'asdf', 60, 49, 2940, 0, 0, 2940, 0, NULL, '63a954679b1e3', 1, 0, '103.183.16.69', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', NULL, '2022-12-26 07:59:35', '2022-12-26 08:02:20'),
(4, 33, '[{\"id\":2,\"name\":\"IELTS\",\"hour\":\"11\"},{\"id\":3,\"name\":\"SAT\",\"hour\":\"22\"}]', NULL, 'dgs', '12pm', 'sf', 'sf', 'sef', 33, 49, 1617, 0, 0, 1617, 0, NULL, '63a9574da1f45', 1, 0, '103.183.16.69', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', '2022-12-27 19:06:46', '2022-12-26 08:11:57', '2022-12-27 19:06:46'),
(5, 1, '[{\"id\":2,\"name\":\"IELTS\",\"hour\":\"5\"}]', NULL, 'bjb', 'sa', 'SAs', 'SA', 'saSA', 5, 49, 245, 0, 0, 245, 0, NULL, '63a9e0236c93f', 1, 0, '103.117.195.130', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', NULL, '2022-12-26 17:55:47', '2022-12-26 17:56:39'),
(6, 1, '[{\"id\":4,\"name\":\"PSAT\",\"hour\":\"20\"},{\"id\":5,\"name\":\"ACT\",\"hour\":\"40\"}]', NULL, 'dsa', 'dsa', 'ds', 'das', 'dsa', 60, 49, 2940, 0, 0, 2940, 0, NULL, '63ab3186922a2', 0, 0, '103.117.195.130', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', NULL, '2022-12-27 17:55:18', '2022-12-27 17:55:18'),
(7, 33, '\"[{\\\"id\\\":2,\\\"name\\\":\\\"IELTS\\\",\\\"hour\\\":\\\"10\\\"},{\\\"id\\\":3,\\\"name\\\":\\\"SAT\\\",\\\"hour\\\":\\\"20\\\"}]\"', NULL, 'Write here to summarize the student\'s need in the subject.', 'day', 'Wednesday', 'Mr. X', 'Write here your questions...', 30, 49, 1470, 0, 0, 1470, 0, NULL, '63b2ff25e2a4a', 0, 0, '123.253.215.148', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', NULL, '2023-01-02 15:58:29', '2023-01-02 15:58:29'),
(8, 33, '\"[{\\\"id\\\":2,\\\"name\\\":\\\"IELTS\\\",\\\"hour\\\":\\\"10\\\"},{\\\"id\\\":3,\\\"name\\\":\\\"SAT\\\",\\\"hour\\\":\\\"20\\\"}]\"', NULL, 'Write here to summarize the student\'s need in the subject.', 'day', 'Wednesday', 'Mr. X', 'Write here your questions', 30, 49, 1470, 0, 0, 1470, 0, NULL, '63b2ff37ab8a8', 0, 0, '123.253.215.148', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', NULL, '2023-01-02 15:58:47', '2023-01-02 15:58:47'),
(9, 33, '\"[{\\\"id\\\":2,\\\"name\\\":\\\"IELTS\\\",\\\"hour\\\":\\\"10\\\"},{\\\"id\\\":3,\\\"name\\\":\\\"SAT\\\",\\\"hour\\\":\\\"20\\\"}]\"', NULL, 'Write here to summarize the student\'s need in the subject.', 'day', 'Wednesday', 'Mr X', 'Write here your questions', 30, 49, 1470, 0, 0, 1470, 0, NULL, '63b30063126d3', 0, 0, '123.253.215.148', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', NULL, '2023-01-02 16:03:47', '2023-01-02 16:03:47'),
(10, 36, '\"[{\\\"id\\\":3,\\\"name\\\":\\\"SAT\\\",\\\"hour\\\":\\\"10\\\"},{\\\"id\\\":2,\\\"name\\\":\\\"IELTS\\\",\\\"hour\\\":\\\"20\\\"}]\"', NULL, 'Write here summarize....', 'day', 'Wednesday', 'Mr X', 'Write here your questions...', 30, 49, 1470, 0, 0, 1470, 0, NULL, '63b41c30cd155', 1, 0, '103.35.168.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', NULL, '2023-01-03 12:14:40', '2023-01-03 12:15:47'),
(11, 60, '\"[{\\\"id\\\":12,\\\"name\\\":\\\"1-on-1 Tutoring\\\",\\\"hour\\\":\\\"10\\\"}]\"', NULL, 'sadfsdfsfd', 'sfsdf', 'sfsf', 'sfsdf', 'sffsdf', 10, 49, 490, 0, 0, 490, 0, NULL, '63cd6adcf091c', 0, 0, '123.253.215.148', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', NULL, '2023-01-22 11:57:00', '2023-01-22 11:57:00'),
(12, 60, '\"[{\\\"id\\\":9,\\\"name\\\":\\\"Summer Enrichment\\\",\\\"hour\\\":\\\"10\\\"}]\"', NULL, 'sfsdfs', 'sdfsdf', 'sdfsdf', 'sfsf', 'sdfsdf', 10, 49, 490, 0, 0, 490, 0, NULL, '63ce1e510a9bc', 0, 0, '103.35.168.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', NULL, '2023-01-23 00:42:41', '2023-01-23 00:42:41'),
(13, 60, '\"[{\\\"id\\\":3,\\\"name\\\":\\\"SAT\\\",\\\"hour\\\":\\\"100\\\"},{\\\"id\\\":4,\\\"name\\\":\\\"PSAT\\\",\\\"hour\\\":\\\"10\\\"},{\\\"id\\\":5,\\\"name\\\":\\\"ACT\\\",\\\"hour\\\":\\\"20\\\"},{\\\"id\\\":9,\\\"name\\\":\\\"Summer Enrichment\\\",\\\"hour\\\":\\\"5\\\"}]\"', NULL, 'rgs', 'sdf12', '12dc', '21fsd', 'sfsf', 135, 49, 6615, 0, 0, 6615, 0, NULL, '63ce1e889f3c7', 0, 0, '103.35.168.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', NULL, '2023-01-23 00:43:36', '2023-01-23 00:43:36'),
(14, 60, '\"[{\\\"id\\\":9,\\\"name\\\":\\\"Summer Enrichment\\\",\\\"hour\\\":\\\"5\\\"},{\\\"id\\\":5,\\\"name\\\":\\\"ACT\\\",\\\"hour\\\":\\\"10\\\"}]\"', NULL, 'asfs', 'sdfsf546', 'sfsf435', '34rsfs', 'wefes', 15, 49, 735, 0, 0, 735, 0, NULL, '63cf873a06ea7', 0, 0, '103.35.168.168', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', NULL, '2023-01-24 02:22:34', '2023-01-24 02:22:34'),
(15, 74, '\"[{\\\"id\\\":3,\\\"name\\\":\\\"SAT\\\",\\\"hour\\\":12},{\\\"id\\\":4,\\\"name\\\":\\\"PSAT\\\",\\\"hour\\\":20}]\"', NULL, 'fcghfd', 'dfhdfh', 'ghfsdf', 'sfdf', 'sfsdf', 32, 49, 1568, 0, 0, 1568, 0, NULL, '63d78e74a1933', 1, 0, '103.35.168.174', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', NULL, '2023-01-30 04:31:32', '2023-01-30 04:32:24');

-- --------------------------------------------------------

--
-- Table structure for table `tutoring_requests`
--

CREATE TABLE `tutoring_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `parent_name` varchar(191) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  `student_name` varchar(191) DEFAULT NULL,
  `student_school` varchar(191) DEFAULT NULL,
  `student_grade` varchar(191) DEFAULT NULL,
  `student_phone` varchar(30) DEFAULT NULL,
  `student_email` varchar(60) DEFAULT NULL,
  `course` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `other` varchar(191) DEFAULT NULL,
  `student_need` text DEFAULT NULL,
  `day_time` varchar(191) DEFAULT NULL,
  `day_time_tutoring` varchar(191) DEFAULT NULL,
  `referral` varchar(191) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED DEFAULT NULL,
  `userable_type` varchar(255) NOT NULL,
  `userable_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(191) DEFAULT NULL,
  `last_name` varchar(191) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  `phone_number` varchar(60) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `gender_id` bigint(20) UNSIGNED DEFAULT NULL,
  `blood_group_id` bigint(20) UNSIGNED DEFAULT NULL,
  `religion_id` bigint(20) UNSIGNED DEFAULT NULL,
  `password` varchar(191) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `userable_type`, `userable_id`, `first_name`, `last_name`, `email`, `phone_number`, `image`, `gender_id`, `blood_group_id`, `religion_id`, `password`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `status`, `remember_token`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'App\\Models\\Employee', 1, 'Admin', NULL, 'sw@2050.com', NULL, NULL, NULL, NULL, NULL, '$2y$10$.9r.w6kOgQsqsTDo5eBNg.CqKEpC0.jYrnecTkr19K0UzhU1pQX7e', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-03-28 00:34:05', '2022-11-12 16:05:23'),
(75, 7, 'App\\Models\\Employee', 38, 'Bablu', 'Khan', 'instructor2prepexcel@gmail.com', '01234567654', '/storage/employee/202363dbb30073047.jpg', 1, NULL, NULL, '$2y$10$gssoypebttOYOdrNGp1cJOSqzR.vVDDUSFyNNf2FxLiR/xNGUyHji', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-02-02 07:56:32', '2023-02-05 00:46:53'),
(76, 3, 'App\\Models\\Student', 65, 'Joshim', 'Khan', 'std1prepexel@gmail.com', '010394820384', '/storage/student/2023/202363dbb5a362fc4.png', 1, NULL, NULL, '$2y$10$Ra17xLQjXQu2lkDeoGs9JOMMgh5kt24smM4icTPbwx98DODyrgVV.', 1, NULL, NULL, NULL, NULL, 'verified', NULL, NULL, '2023-02-02 08:06:16', '2023-02-04 08:33:01'),
(77, 4, 'App\\Models\\Parents', 44, 'Parent', NULL, 'ttprepexcel@gmail.com', NULL, NULL, NULL, NULL, NULL, '$2y$10$IfZMke6XhWOAQt6LiOzexem5u0BOs2OausU1eA5qZWjDjEqm0D7CS', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-02-02 08:07:47', '2023-02-02 08:07:47'),
(78, 3, 'App\\Models\\Student', 66, 'Bobita', 'Khan', 'test3.prepexcellence@gmail.com', '12345678903', '/storage/student/63de5f1e358e81675517726.png', 2, NULL, NULL, '$2y$10$67rEhyI.qZSaAcYzFntIee30uCEeYlRRSny2UM7fno8/j3UFeVJK.', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-02-04 08:35:26', '2023-02-04 08:35:26');

-- --------------------------------------------------------

--
-- Table structure for table `user_menu_permissions`
--

CREATE TABLE `user_menu_permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `menu_permission_id` bigint(20) UNSIGNED NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_menu_permissions`
--

INSERT INTO `user_menu_permissions` (`id`, `user_id`, `menu_permission_id`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 75, 248, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 75, 249, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 75, 250, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 75, 263, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 75, 253, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 75, 254, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 75, 255, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 75, 279, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 75, 280, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 75, 281, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 75, 283, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 75, 282, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 75, 294, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 75, 295, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 75, 296, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 75, 297, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 75, 298, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 75, 304, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 75, 289, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 75, 290, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 75, 291, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, 75, 292, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(24, 75, 293, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, 75, 299, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, 75, 300, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, 75, 301, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(28, 75, 302, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(29, 75, 303, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, 75, 288, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(31, 75, 287, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(32, 75, 285, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, 75, 284, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(34, 75, 286, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(35, 75, 269, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(36, 75, 258, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(37, 75, 259, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, 75, 260, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(39, 75, 261, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, 75, 264, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(41, 75, 265, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(42, 75, 266, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(43, 75, 267, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(44, 75, 268, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `websockets_statistics_entries`
--

CREATE TABLE `websockets_statistics_entries` (
  `id` int(10) UNSIGNED NOT NULL,
  `app_id` varchar(255) NOT NULL,
  `peak_connection_count` int(11) NOT NULL,
  `websocket_message_count` int(11) NOT NULL,
  `api_message_count` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `widgets`
--

CREATE TABLE `widgets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `placement` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `text` longtext DEFAULT NULL,
  `p_menu_id` bigint(20) UNSIGNED DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 1000,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `widgets`
--

INSERT INTO `widgets` (`id`, `placement`, `title`, `type`, `text`, `p_menu_id`, `position`, `status`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'footer', 'fff', '1', 'dsasa', NULL, 1000, 1, NULL, NULL, NULL, NULL, '2022-12-31 14:10:20', '2022-05-16 23:59:29', '2022-12-31 14:10:20'),
(2, 'footer', 'ds fds', '1', 'fds afdsa fds', NULL, 1000, 1, NULL, NULL, NULL, NULL, '2022-12-31 14:10:08', '2022-05-17 00:31:24', '2022-12-31 14:10:08'),
(3, NULL, 'abc', '2', NULL, 3, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:10:39', '2022-12-31 14:10:39'),
(4, NULL, 'footer 2', '2', NULL, 4, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:10:55', '2022-12-31 14:10:55'),
(5, NULL, 'footer 3', '2', NULL, 5, 1000, 1, NULL, NULL, NULL, NULL, NULL, '2022-12-31 14:11:09', '2022-12-31 14:11:09');

-- --------------------------------------------------------

--
-- Table structure for table `work_experiences`
--

CREATE TABLE `work_experiences` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `institute` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `number_of_year` int(11) DEFAULT 0,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_working` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `work_experiences`
--

INSERT INTO `work_experiences` (`id`, `employee_id`, `institute`, `designation`, `number_of_year`, `start_date`, `end_date`, `is_working`, `is_active`, `created_by`, `updated_by`, `ip`, `browser`, `deleted_at`, `created_at`, `updated_at`) VALUES
(65, 38, NULL, NULL, 0, NULL, NULL, 0, 1, NULL, NULL, NULL, NULL, NULL, '2023-02-02 07:56:32', '2023-02-02 07:56:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applicants`
--
ALTER TABLE `applicants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `applicants_job_id_foreign` (`job_id`),
  ADD KEY `applicants_created_by_foreign` (`created_by`),
  ADD KEY `applicants_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `attendance_statuses`
--
ALTER TABLE `attendance_statuses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendance_students`
--
ALTER TABLE `attendance_students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendance_students_student_id_foreign` (`student_id`),
  ADD KEY `attendance_students_employee_id_foreign` (`employee_id`),
  ADD KEY `attendance_students_course_id_foreign` (`course_id`),
  ADD KEY `attendance_students_attendance_status_id_foreign` (`attendance_status_id`),
  ADD KEY `attendance_students_course_schedule_id_foreign` (`course_schedule_id`);

--
-- Indexes for table `banks`
--
ALTER TABLE `banks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `banks_created_by_foreign` (`created_by`),
  ADD KEY `banks_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bank_accounts_bank_id_foreign` (`bank_id`),
  ADD KEY `bank_accounts_created_by_foreign` (`created_by`),
  ADD KEY `bank_accounts_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `blogs_user_id_foreign` (`user_id`),
  ADD KEY `blogs_created_by_foreign` (`created_by`),
  ADD KEY `blogs_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `blood_groups`
--
ALTER TABLE `blood_groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carts_user_id_foreign` (`user_id`);

--
-- Indexes for table `cart_course`
--
ALTER TABLE `cart_course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_course_cart_id_foreign` (`cart_id`),
  ADD KEY `cart_course_course_id_foreign` (`course_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categories_created_by_foreign` (`created_by`),
  ADD KEY `categories_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chats_sender_id_foreign` (`sender_id`),
  ADD KEY `chats_receiver_id_foreign` (`receiver_id`),
  ADD KEY `chats_chat_group_id_foreign` (`chat_group_id`);

--
-- Indexes for table `chat_chat_file`
--
ALTER TABLE `chat_chat_file`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat_files`
--
ALTER TABLE `chat_files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat_groups`
--
ALTER TABLE `chat_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_groups_created_by_foreign` (`created_by`),
  ADD KEY `chat_groups_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `chat_group_user`
--
ALTER TABLE `chat_group_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat_users`
--
ALTER TABLE `chat_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_users_sender_id_foreign` (`sender_id`),
  ADD KEY `chat_users_receiver_id_foreign` (`receiver_id`);

--
-- Indexes for table `complains`
--
ALTER TABLE `complains`
  ADD PRIMARY KEY (`id`),
  ADD KEY `complains_user_id_foreign` (`user_id`),
  ADD KEY `complains_created_by_foreign` (`created_by`),
  ADD KEY `complains_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contacts_created_by_foreign` (`created_by`),
  ADD KEY `contacts_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `contact_us`
--
ALTER TABLE `contact_us`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contact_us_created_by_foreign` (`created_by`),
  ADD KEY `contact_us_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `coupons_code_unique` (`code`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courses_course_type_id_foreign` (`course_type_id`),
  ADD KEY `courses_created_by_foreign` (`created_by`),
  ADD KEY `courses_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `course_categories`
--
ALTER TABLE `course_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_categories_created_by_foreign` (`created_by`),
  ADD KEY `course_categories_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `course_course_category`
--
ALTER TABLE `course_course_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_course_category_course_id_foreign` (`course_id`),
  ADD KEY `course_course_category_course_category_id_foreign` (`course_category_id`);

--
-- Indexes for table `course_employee`
--
ALTER TABLE `course_employee`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course_materials`
--
ALTER TABLE `course_materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_materials_course_id_foreign` (`course_id`),
  ADD KEY `course_materials_employee_id_foreign` (`employee_id`),
  ADD KEY `course_materials_created_by_foreign` (`created_by`),
  ADD KEY `course_materials_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `course_ratings`
--
ALTER TABLE `course_ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_ratings_course_id_foreign` (`course_id`),
  ADD KEY `course_ratings_user_id_foreign` (`user_id`),
  ADD KEY `course_ratings_created_by_foreign` (`created_by`),
  ADD KEY `course_ratings_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `course_reviews`
--
ALTER TABLE `course_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_reviews_course_id_foreign` (`course_id`),
  ADD KEY `course_reviews_user_id_foreign` (`user_id`),
  ADD KEY `course_reviews_created_by_foreign` (`created_by`),
  ADD KEY `course_reviews_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `course_schedules`
--
ALTER TABLE `course_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_schedules_course_id_foreign` (`course_id`),
  ADD KEY `course_schedules_created_by_foreign` (`created_by`),
  ADD KEY `course_schedules_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `course_schedule_cancels`
--
ALTER TABLE `course_schedule_cancels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_schedule_cancels_course_schedule_id_foreign` (`course_schedule_id`),
  ADD KEY `course_schedule_cancels_employee_id_foreign` (`employee_id`),
  ADD KEY `course_schedule_cancels_created_by_foreign` (`created_by`),
  ADD KEY `course_schedule_cancels_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `course_types`
--
ALTER TABLE `course_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_types_created_by_foreign` (`created_by`),
  ADD KEY `course_types_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `designations_created_by_foreign` (`created_by`),
  ADD KEY `designations_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `emails`
--
ALTER TABLE `emails`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employees_nid_unique` (`nid`),
  ADD KEY `employees_designation_id_foreign` (`designation_id`),
  ADD KEY `employees_marital_status_id_foreign` (`marital_status_id`),
  ADD KEY `employees_created_by_foreign` (`created_by`),
  ADD KEY `employees_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `employee_over_times`
--
ALTER TABLE `employee_over_times`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_over_times_employee_id_foreign` (`employee_id`);

--
-- Indexes for table `employee_over_time_employee_payment`
--
ALTER TABLE `employee_over_time_employee_payment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_payments`
--
ALTER TABLE `employee_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_payments_employee_id_foreign` (`employee_id`);

--
-- Indexes for table `employee_payment_employee_working`
--
ALTER TABLE `employee_payment_employee_working`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_qualifications`
--
ALTER TABLE `employee_qualifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_qualifications_employee_id_foreign` (`employee_id`),
  ADD KEY `employee_qualifications_created_by_foreign` (`created_by`),
  ADD KEY `employee_qualifications_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `employee_workings`
--
ALTER TABLE `employee_workings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_workings_course_schedule_id_foreign` (`course_schedule_id`),
  ADD KEY `employee_workings_employee_id_foreign` (`employee_id`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exams_course_id_foreign` (`course_id`),
  ADD KEY `exams_employee_id_foreign` (`employee_id`),
  ADD KEY `exams_created_by_foreign` (`created_by`),
  ADD KEY `exams_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_questions_question_bank_id_foreign` (`question_bank_id`),
  ADD KEY `exam_questions_exam_id_foreign` (`exam_id`),
  ADD KEY `exam_questions_created_by_foreign` (`created_by`),
  ADD KEY `exam_questions_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expenses_created_by_foreign` (`created_by`),
  ADD KEY `expenses_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `expense_types`
--
ALTER TABLE `expense_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expense_types_created_by_foreign` (`created_by`),
  ADD KEY `expense_types_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `faqs_created_by_foreign` (`created_by`),
  ADD KEY `faqs_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `galleries`
--
ALTER TABLE `galleries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `galleries_category_id_foreign` (`category_id`),
  ADD KEY `galleries_created_by_foreign` (`created_by`),
  ADD KEY `galleries_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `gallery_items`
--
ALTER TABLE `gallery_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gallery_items_gallery_id_foreign` (`gallery_id`),
  ADD KEY `gallery_items_created_by_foreign` (`created_by`),
  ADD KEY `gallery_items_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `genders`
--
ALTER TABLE `genders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `home_sections`
--
ALTER TABLE `home_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `home_sections_section_design_type_id_foreign` (`section_design_type_id`),
  ADD KEY `home_sections_created_by_foreign` (`created_by`),
  ADD KEY `home_sections_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `home_works`
--
ALTER TABLE `home_works`
  ADD PRIMARY KEY (`id`),
  ADD KEY `home_works_course_id_foreign` (`course_id`),
  ADD KEY `home_works_employee_id_foreign` (`employee_id`),
  ADD KEY `home_works_created_by_foreign` (`created_by`),
  ADD KEY `home_works_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_created_by_foreign` (`created_by`),
  ADD KEY `jobs_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `marital_statuses`
--
ALTER TABLE `marital_statuses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `marital_statuses_created_by_foreign` (`created_by`),
  ADD KEY `marital_statuses_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menus_created_by_foreign` (`created_by`),
  ADD KEY `menus_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu_items_p_menu_id_foreign` (`p_menu_id`),
  ADD KEY `menu_items_created_by_foreign` (`created_by`),
  ADD KEY `menu_items_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `menu_permissions`
--
ALTER TABLE `menu_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu_permissions_created_by_foreign` (`created_by`),
  ADD KEY `menu_permissions_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oauth_access_tokens`
--
ALTER TABLE `oauth_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_access_tokens_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_auth_codes`
--
ALTER TABLE `oauth_auth_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_auth_codes_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_clients`
--
ALTER TABLE `oauth_clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_clients_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_personal_access_clients`
--
ALTER TABLE `oauth_personal_access_clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oauth_refresh_tokens`
--
ALTER TABLE `oauth_refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_user_id_foreign` (`user_id`),
  ADD KEY `orders_coupon_id_foreign` (`coupon_id`),
  ADD KEY `orders_created_by_foreign` (`created_by`),
  ADD KEY `orders_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `order_payments`
--
ALTER TABLE `order_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_payments_order_id_foreign` (`order_id`),
  ADD KEY `order_payments_created_by_foreign` (`created_by`),
  ADD KEY `order_payments_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pages_created_by_foreign` (`created_by`),
  ADD KEY `pages_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `parents`
--
ALTER TABLE `parents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `parents_father_nid_unique` (`father_nid`),
  ADD UNIQUE KEY `parents_mother_nid_unique` (`mother_nid`),
  ADD KEY `parents_created_by_foreign` (`created_by`),
  ADD KEY `parents_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `payment_types`
--
ALTER TABLE `payment_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_types_created_by_foreign` (`created_by`),
  ADD KEY `payment_types_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `permissions_created_by_foreign` (`created_by`),
  ADD KEY `permissions_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `pre_users`
--
ALTER TABLE `pre_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `push_notifications`
--
ALTER TABLE `push_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `push_notifications_user_id_foreign` (`user_id`),
  ADD KEY `push_notifications_role_id_foreign` (`role_id`);

--
-- Indexes for table `p_menus`
--
ALTER TABLE `p_menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `p_menus_created_by_foreign` (`created_by`),
  ADD KEY `p_menus_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `question_banks`
--
ALTER TABLE `question_banks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_banks_course_id_foreign` (`course_id`),
  ADD KEY `question_banks_course_type_id_foreign` (`course_type_id`),
  ADD KEY `question_banks_employee_id_foreign` (`employee_id`),
  ADD KEY `question_banks_created_by_foreign` (`created_by`),
  ADD KEY `question_banks_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `religions`
--
ALTER TABLE `religions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roles_created_by_foreign` (`created_by`),
  ADD KEY `roles_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `role_menu_permissions`
--
ALTER TABLE `role_menu_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_menu_permissions_created_by_foreign` (`created_by`),
  ADD KEY `role_menu_permissions_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `sat_scores`
--
ALTER TABLE `sat_scores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sat_scores_sat_section_id_foreign` (`sat_section_id`),
  ADD KEY `sat_scores_created_by_foreign` (`created_by`),
  ADD KEY `sat_scores_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `sat_sections`
--
ALTER TABLE `sat_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sat_sections_created_by_foreign` (`created_by`),
  ADD KEY `sat_sections_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `section_design_types`
--
ALTER TABLE `section_design_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_design_types_created_by_foreign` (`created_by`),
  ADD KEY `section_design_types_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `settings_created_by_foreign` (`created_by`),
  ADD KEY `settings_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `siblings`
--
ALTER TABLE `siblings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `siblings_student_id_foreign` (`student_id`),
  ADD KEY `siblings_sibling_id_foreign` (`sibling_id`),
  ADD KEY `siblings_created_by_foreign` (`created_by`),
  ADD KEY `siblings_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `sliders`
--
ALTER TABLE `sliders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sliders_created_by_foreign` (`created_by`),
  ADD KEY `sliders_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `students_student_id_unique` (`student_id`),
  ADD KEY `students_parent_id_foreign` (`parent_id`),
  ADD KEY `students_created_by_foreign` (`created_by`),
  ADD KEY `students_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `student_answers`
--
ALTER TABLE `student_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_answers_student_id_foreign` (`student_id`),
  ADD KEY `student_answers_exam_id_foreign` (`exam_id`),
  ADD KEY `student_answers_exam_question_id_foreign` (`exam_question_id`),
  ADD KEY `student_answers_created_by_foreign` (`created_by`),
  ADD KEY `student_answers_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `student_courses`
--
ALTER TABLE `student_courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_courses_student_id_foreign` (`student_id`),
  ADD KEY `student_courses_course_id_foreign` (`course_id`),
  ADD KEY `student_courses_created_by_foreign` (`created_by`),
  ADD KEY `student_courses_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `student_home_works`
--
ALTER TABLE `student_home_works`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_home_works_home_work_id_foreign` (`home_work_id`),
  ADD KEY `student_home_works_student_id_foreign` (`student_id`),
  ADD KEY `student_home_works_created_by_foreign` (`created_by`),
  ADD KEY `student_home_works_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `sub_expense_types`
--
ALTER TABLE `sub_expense_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sub_expense_types_created_by_foreign` (`created_by`),
  ADD KEY `sub_expense_types_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `s_m_s`
--
ALTER TABLE `s_m_s`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tutorings`
--
ALTER TABLE `tutorings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tutoring_requests`
--
ALTER TABLE `tutoring_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_role_id_foreign` (`role_id`),
  ADD KEY `users_userable_type_userable_id_index` (`userable_type`,`userable_id`),
  ADD KEY `users_gender_id_foreign` (`gender_id`),
  ADD KEY `users_blood_group_id_foreign` (`blood_group_id`),
  ADD KEY `users_religion_id_foreign` (`religion_id`),
  ADD KEY `users_created_by_foreign` (`created_by`),
  ADD KEY `users_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `user_menu_permissions`
--
ALTER TABLE `user_menu_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_menu_permissions_created_by_foreign` (`created_by`),
  ADD KEY `user_menu_permissions_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `websockets_statistics_entries`
--
ALTER TABLE `websockets_statistics_entries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `widgets`
--
ALTER TABLE `widgets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `widgets_created_by_foreign` (`created_by`),
  ADD KEY `widgets_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `work_experiences`
--
ALTER TABLE `work_experiences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `work_experiences_employee_id_foreign` (`employee_id`),
  ADD KEY `work_experiences_created_by_foreign` (`created_by`),
  ADD KEY `work_experiences_updated_by_foreign` (`updated_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applicants`
--
ALTER TABLE `applicants`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `attendance_statuses`
--
ALTER TABLE `attendance_statuses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `attendance_students`
--
ALTER TABLE `attendance_students`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `banks`
--
ALTER TABLE `banks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `blood_groups`
--
ALTER TABLE `blood_groups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart_course`
--
ALTER TABLE `cart_course`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `chat_chat_file`
--
ALTER TABLE `chat_chat_file`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_files`
--
ALTER TABLE `chat_files`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_groups`
--
ALTER TABLE `chat_groups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_group_user`
--
ALTER TABLE `chat_group_user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_users`
--
ALTER TABLE `chat_users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `complains`
--
ALTER TABLE `complains`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contact_us`
--
ALTER TABLE `contact_us`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `course_categories`
--
ALTER TABLE `course_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `course_course_category`
--
ALTER TABLE `course_course_category`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `course_employee`
--
ALTER TABLE `course_employee`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `course_materials`
--
ALTER TABLE `course_materials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `course_ratings`
--
ALTER TABLE `course_ratings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_reviews`
--
ALTER TABLE `course_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_schedules`
--
ALTER TABLE `course_schedules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=782;

--
-- AUTO_INCREMENT for table `course_schedule_cancels`
--
ALTER TABLE `course_schedule_cancels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `course_types`
--
ALTER TABLE `course_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `emails`
--
ALTER TABLE `emails`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `employee_over_times`
--
ALTER TABLE `employee_over_times`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employee_over_time_employee_payment`
--
ALTER TABLE `employee_over_time_employee_payment`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `employee_payments`
--
ALTER TABLE `employee_payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `employee_payment_employee_working`
--
ALTER TABLE `employee_payment_employee_working`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `employee_qualifications`
--
ALTER TABLE `employee_qualifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `employee_workings`
--
ALTER TABLE `employee_workings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `exam_questions`
--
ALTER TABLE `exam_questions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=175;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `expense_types`
--
ALTER TABLE `expense_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `galleries`
--
ALTER TABLE `galleries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gallery_items`
--
ALTER TABLE `gallery_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `genders`
--
ALTER TABLE `genders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `home_sections`
--
ALTER TABLE `home_sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `home_works`
--
ALTER TABLE `home_works`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `marital_statuses`
--
ALTER TABLE `marital_statuses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `menu_permissions`
--
ALTER TABLE `menu_permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=305;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `oauth_clients`
--
ALTER TABLE `oauth_clients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `oauth_personal_access_clients`
--
ALTER TABLE `oauth_personal_access_clients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `order_payments`
--
ALTER TABLE `order_payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `parents`
--
ALTER TABLE `parents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_types`
--
ALTER TABLE `payment_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pre_users`
--
ALTER TABLE `pre_users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `push_notifications`
--
ALTER TABLE `push_notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `p_menus`
--
ALTER TABLE `p_menus`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `question_banks`
--
ALTER TABLE `question_banks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `religions`
--
ALTER TABLE `religions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `role_menu_permissions`
--
ALTER TABLE `role_menu_permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=450;

--
-- AUTO_INCREMENT for table `sat_scores`
--
ALTER TABLE `sat_scores`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=168;

--
-- AUTO_INCREMENT for table `sat_sections`
--
ALTER TABLE `sat_sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `section_design_types`
--
ALTER TABLE `section_design_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `siblings`
--
ALTER TABLE `siblings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sliders`
--
ALTER TABLE `sliders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `student_answers`
--
ALTER TABLE `student_answers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `student_courses`
--
ALTER TABLE `student_courses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `student_home_works`
--
ALTER TABLE `student_home_works`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `sub_expense_types`
--
ALTER TABLE `sub_expense_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `s_m_s`
--
ALTER TABLE `s_m_s`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `tutorings`
--
ALTER TABLE `tutorings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tutoring_requests`
--
ALTER TABLE `tutoring_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `user_menu_permissions`
--
ALTER TABLE `user_menu_permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `websockets_statistics_entries`
--
ALTER TABLE `websockets_statistics_entries`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `widgets`
--
ALTER TABLE `widgets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `work_experiences`
--
ALTER TABLE `work_experiences`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applicants`
--
ALTER TABLE `applicants`
  ADD CONSTRAINT `applicants_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `applicants_job_id_foreign` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`),
  ADD CONSTRAINT `applicants_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `attendance_students`
--
ALTER TABLE `attendance_students`
  ADD CONSTRAINT `attendance_students_attendance_status_id_foreign` FOREIGN KEY (`attendance_status_id`) REFERENCES `attendance_statuses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_students_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_students_course_schedule_id_foreign` FOREIGN KEY (`course_schedule_id`) REFERENCES `course_schedules` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_students_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_students_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `banks`
--
ALTER TABLE `banks`
  ADD CONSTRAINT `banks_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `banks_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  ADD CONSTRAINT `bank_accounts_bank_id_foreign` FOREIGN KEY (`bank_id`) REFERENCES `banks` (`id`),
  ADD CONSTRAINT `bank_accounts_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bank_accounts_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `blogs_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `blogs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `cart_course`
--
ALTER TABLE `cart_course`
  ADD CONSTRAINT `cart_course_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`),
  ADD CONSTRAINT `cart_course_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `categories_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_chat_group_id_foreign` FOREIGN KEY (`chat_group_id`) REFERENCES `chat_groups` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `chats_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `chats_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `chat_groups`
--
ALTER TABLE `chat_groups`
  ADD CONSTRAINT `chat_groups_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `chat_groups_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `chat_users`
--
ALTER TABLE `chat_users`
  ADD CONSTRAINT `chat_users_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `chat_users_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `complains`
--
ALTER TABLE `complains`
  ADD CONSTRAINT `complains_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `complains_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `complains_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `contacts_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `contact_us`
--
ALTER TABLE `contact_us`
  ADD CONSTRAINT `contact_us_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `contact_us_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_course_type_id_foreign` FOREIGN KEY (`course_type_id`) REFERENCES `course_types` (`id`),
  ADD CONSTRAINT `courses_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `courses_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `course_categories`
--
ALTER TABLE `course_categories`
  ADD CONSTRAINT `course_categories_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `course_categories_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `course_course_category`
--
ALTER TABLE `course_course_category`
  ADD CONSTRAINT `course_course_category_course_category_id_foreign` FOREIGN KEY (`course_category_id`) REFERENCES `course_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_course_category_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course_materials`
--
ALTER TABLE `course_materials`
  ADD CONSTRAINT `course_materials_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `course_materials_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `course_materials_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `course_materials_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `course_ratings`
--
ALTER TABLE `course_ratings`
  ADD CONSTRAINT `course_ratings_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `course_ratings_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `course_ratings_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `course_ratings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `course_reviews`
--
ALTER TABLE `course_reviews`
  ADD CONSTRAINT `course_reviews_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `course_reviews_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `course_reviews_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `course_reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `course_schedules`
--
ALTER TABLE `course_schedules`
  ADD CONSTRAINT `course_schedules_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `course_schedules_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `course_schedules_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `course_schedule_cancels`
--
ALTER TABLE `course_schedule_cancels`
  ADD CONSTRAINT `course_schedule_cancels_course_schedule_id_foreign` FOREIGN KEY (`course_schedule_id`) REFERENCES `course_schedules` (`id`),
  ADD CONSTRAINT `course_schedule_cancels_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `course_schedule_cancels_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `course_schedule_cancels_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `course_types`
--
ALTER TABLE `course_types`
  ADD CONSTRAINT `course_types_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `course_types_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `designations`
--
ALTER TABLE `designations`
  ADD CONSTRAINT `designations_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `designations_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `employees_designation_id_foreign` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`),
  ADD CONSTRAINT `employees_marital_status_id_foreign` FOREIGN KEY (`marital_status_id`) REFERENCES `marital_statuses` (`id`),
  ADD CONSTRAINT `employees_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `employee_over_times`
--
ALTER TABLE `employee_over_times`
  ADD CONSTRAINT `employee_over_times_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `employee_payments`
--
ALTER TABLE `employee_payments`
  ADD CONSTRAINT `employee_payments_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `employee_qualifications`
--
ALTER TABLE `employee_qualifications`
  ADD CONSTRAINT `employee_qualifications_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `employee_qualifications_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `employee_qualifications_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `employee_workings`
--
ALTER TABLE `employee_workings`
  ADD CONSTRAINT `employee_workings_course_schedule_id_foreign` FOREIGN KEY (`course_schedule_id`) REFERENCES `course_schedules` (`id`),
  ADD CONSTRAINT `employee_workings_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `exams`
--
ALTER TABLE `exams`
  ADD CONSTRAINT `exams_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `exams_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `exams_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `exams_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD CONSTRAINT `exam_questions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `exam_questions_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`),
  ADD CONSTRAINT `exam_questions_question_bank_id_foreign` FOREIGN KEY (`question_bank_id`) REFERENCES `question_banks` (`id`),
  ADD CONSTRAINT `exam_questions_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `expenses_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `expense_types`
--
ALTER TABLE `expense_types`
  ADD CONSTRAINT `expense_types_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `expense_types_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `faqs`
--
ALTER TABLE `faqs`
  ADD CONSTRAINT `faqs_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `faqs_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `galleries`
--
ALTER TABLE `galleries`
  ADD CONSTRAINT `galleries_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `galleries_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `galleries_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `gallery_items`
--
ALTER TABLE `gallery_items`
  ADD CONSTRAINT `gallery_items_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `gallery_items_gallery_id_foreign` FOREIGN KEY (`gallery_id`) REFERENCES `galleries` (`id`),
  ADD CONSTRAINT `gallery_items_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `home_sections`
--
ALTER TABLE `home_sections`
  ADD CONSTRAINT `home_sections_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `home_sections_section_design_type_id_foreign` FOREIGN KEY (`section_design_type_id`) REFERENCES `section_design_types` (`id`),
  ADD CONSTRAINT `home_sections_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `home_works`
--
ALTER TABLE `home_works`
  ADD CONSTRAINT `home_works_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `home_works_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `home_works_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `home_works_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `jobs_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `marital_statuses`
--
ALTER TABLE `marital_statuses`
  ADD CONSTRAINT `marital_statuses_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `marital_statuses_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `menus_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `menus_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `menu_items_p_menu_id_foreign` FOREIGN KEY (`p_menu_id`) REFERENCES `p_menus` (`id`),
  ADD CONSTRAINT `menu_items_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `menu_permissions`
--
ALTER TABLE `menu_permissions`
  ADD CONSTRAINT `menu_permissions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `menu_permissions_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_coupon_id_foreign` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`),
  ADD CONSTRAINT `orders_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_payments`
--
ALTER TABLE `order_payments`
  ADD CONSTRAINT `order_payments_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `order_payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_payments_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `pages`
--
ALTER TABLE `pages`
  ADD CONSTRAINT `pages_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `pages_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `parents`
--
ALTER TABLE `parents`
  ADD CONSTRAINT `parents_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `parents_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `payment_types`
--
ALTER TABLE `payment_types`
  ADD CONSTRAINT `payment_types_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `payment_types_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `permissions_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `push_notifications`
--
ALTER TABLE `push_notifications`
  ADD CONSTRAINT `push_notifications_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `push_notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `p_menus`
--
ALTER TABLE `p_menus`
  ADD CONSTRAINT `p_menus_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `p_menus_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `question_banks`
--
ALTER TABLE `question_banks`
  ADD CONSTRAINT `question_banks_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `question_banks_course_type_id_foreign` FOREIGN KEY (`course_type_id`) REFERENCES `course_types` (`id`),
  ADD CONSTRAINT `question_banks_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `question_banks_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `question_banks_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `roles_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `roles_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `role_menu_permissions`
--
ALTER TABLE `role_menu_permissions`
  ADD CONSTRAINT `role_menu_permissions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `role_menu_permissions_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `sat_scores`
--
ALTER TABLE `sat_scores`
  ADD CONSTRAINT `sat_scores_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `sat_scores_sat_section_id_foreign` FOREIGN KEY (`sat_section_id`) REFERENCES `sat_sections` (`id`),
  ADD CONSTRAINT `sat_scores_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `sat_sections`
--
ALTER TABLE `sat_sections`
  ADD CONSTRAINT `sat_sections_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `sat_sections_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `section_design_types`
--
ALTER TABLE `section_design_types`
  ADD CONSTRAINT `section_design_types_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `section_design_types_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `settings_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `settings_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `siblings`
--
ALTER TABLE `siblings`
  ADD CONSTRAINT `siblings_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `siblings_sibling_id_foreign` FOREIGN KEY (`sibling_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `siblings_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `siblings_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `sliders`
--
ALTER TABLE `sliders`
  ADD CONSTRAINT `sliders_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `sliders_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `students_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`),
  ADD CONSTRAINT `students_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `student_answers`
--
ALTER TABLE `student_answers`
  ADD CONSTRAINT `student_answers_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `student_answers_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`),
  ADD CONSTRAINT `student_answers_exam_question_id_foreign` FOREIGN KEY (`exam_question_id`) REFERENCES `exam_questions` (`id`),
  ADD CONSTRAINT `student_answers_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `student_answers_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `student_courses`
--
ALTER TABLE `student_courses`
  ADD CONSTRAINT `student_courses_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `student_courses_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `student_courses_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `student_courses_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `student_home_works`
--
ALTER TABLE `student_home_works`
  ADD CONSTRAINT `student_home_works_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `student_home_works_home_work_id_foreign` FOREIGN KEY (`home_work_id`) REFERENCES `home_works` (`id`),
  ADD CONSTRAINT `student_home_works_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `student_home_works_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `sub_expense_types`
--
ALTER TABLE `sub_expense_types`
  ADD CONSTRAINT `sub_expense_types_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `sub_expense_types_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_blood_group_id_foreign` FOREIGN KEY (`blood_group_id`) REFERENCES `blood_groups` (`id`),
  ADD CONSTRAINT `users_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `users_gender_id_foreign` FOREIGN KEY (`gender_id`) REFERENCES `genders` (`id`),
  ADD CONSTRAINT `users_religion_id_foreign` FOREIGN KEY (`religion_id`) REFERENCES `religions` (`id`),
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `users_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_menu_permissions`
--
ALTER TABLE `user_menu_permissions`
  ADD CONSTRAINT `user_menu_permissions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_menu_permissions_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `widgets`
--
ALTER TABLE `widgets`
  ADD CONSTRAINT `widgets_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `widgets_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `work_experiences`
--
ALTER TABLE `work_experiences`
  ADD CONSTRAINT `work_experiences_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `work_experiences_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `work_experiences_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
