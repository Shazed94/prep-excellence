<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains over 2000 video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the Laravel [Patreon page](https://patreon.com/taylorotwell).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Cubet Techno Labs](https://cubettech.com)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[Many](https://www.many.co.uk)**
- **[Webdock, Fast VPS Hosting](https://www.webdock.io/en)**
- **[DevSquad](https://devsquad.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[OP.GG](https://op.gg)**
- **[WebReinvent](https://webreinvent.com/?utm_source=laravel&utm_medium=github&utm_campaign=patreon-sponsors)**
- **[Lendio](https://lendio.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

#DB Change
ALTER TABLE `coupons` ADD `expiry_date` TIMESTAMP NULL DEFAULT NULL AFTER `discount`, ADD `minimum_spend` DOUBLE(8,2) NULL DEFAULT '0' AFTER `expiry_date`, ADD `maximum_spend` DOUBLE(8,2) NOT NULL DEFAULT '0' AFTER `minimum_spend`, ADD `user_id` BIGINT(20) NULL DEFAULT NULL AFTER `maximum_spend`;
ALTER TABLE `coupons` ADD `deleted_at` TIMESTAMP NULL DEFAULT NULL AFTER `status`;

TABLE `carts` DROP `coupon_id`;
ALTER TABLE `carts` ADD `admin_read` TINYINT NOT NULL DEFAULT '0' AFTER `id`, ADD `course_id` BIGINT(20) NOT NULL AFTER `admin_read`, ADD `quantity` INT NOT NULL DEFAULT '1' AFTER `course_id`, ADD `note` TEXT NULL DEFAULT NULL AFTER `quantity`, ADD `session_id` VARCHAR(191) NULL DEFAULT NULL AFTER `note`;
ALTER TABLE `carts` CHANGE `user_id` `user_id` BIGINT(20) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE `student_courses` ADD `order_id` BIGINT(20) NULL DEFAULT NULL AFTER `course_id`;

ALTER TABLE `employees` ADD `biography` TEXT NULL DEFAULT NULL AFTER `salary_monthly`;

ALTER TABLE `contact_us` ADD `subject` VARCHAR(191) NULL DEFAULT NULL AFTER `phone_number`;

ALTER TABLE `pages` ADD `bread_crumb_image` VARCHAR(100) NULL DEFAULT NULL AFTER `image`;

ALTER TABLE `pages` ADD `service_title` VARCHAR(191) NULL DEFAULT NULL AFTER `template`, ADD `service_sub_title` VARCHAR(191) NULL DEFAULT NULL AFTER `service_title`, ADD `services` LONGTEXT NULL DEFAULT NULL AFTER `service_sub_title`;


ALTER TABLE `employees` ADD `short_biography` TEXT NULL DEFAULT NULL AFTER `salary_monthly`;

ALTER TABLE `employee_over_times` ADD `course_id` BIGINT UNSIGNED NULL DEFAULT NULL AFTER `employee_id`;
ALTER TABLE `course_materials` ADD `expire_date` DATE NULL DEFAULT NULL AFTER `course_id`;
