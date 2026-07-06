# Changelog

## [1.8.1](https://github.com/trodad-intl/prepexcellence/compare/v1.8.0...v1.8.1) (2026-07-06)


### Bug Fixes

* update Dockerfile to copy built application from .dist directory ([881a7c8](https://github.com/trodad-intl/prepexcellence/commit/881a7c8a970781c7ccebc4b87f1ae6ca27329ac7))

## [1.8.0](https://github.com/trodad-intl/prepexcellence/compare/v1.7.2...v1.8.0) (2026-07-06)


### Features

* add getPublishedCourses endpoint and update course-related schemas ([b4bc043](https://github.com/trodad-intl/prepexcellence/commit/b4bc043dc7c7ee6f8a6eff43f48c82520985264a))
* add lesson attachment management with upload and update functionality ([ac00992](https://github.com/trodad-intl/prepexcellence/commit/ac00992cf77d04b795b59e15956fba397cd7ca45))
* add timezone constants and validation for availability dates and times ([66b55ee](https://github.com/trodad-intl/prepexcellence/commit/66b55ee90b97b7c4e0da364a1b33dff43aae7ac8))
* add upcoming bookings and week view components ([8ee34b9](https://github.com/trodad-intl/prepexcellence/commit/8ee34b93d15e1bf5b1e5632b2509b6429f6cbbf5))


### Bug Fixes

* Add parseMultipartBody middleware to course creation route and extend JSON parsing in validation ([a8b18e7](https://github.com/trodad-intl/prepexcellence/commit/a8b18e7e43a5fec16e3859876ac8ff18acc53891))
* clean up code formatting and improve readability across multiple files ([0d3f8f2](https://github.com/trodad-intl/prepexcellence/commit/0d3f8f2e3b8de002836940079acb40e8e2f8c759))
* Correct formatting in select statement for course progress record creation ([30e3608](https://github.com/trodad-intl/prepexcellence/commit/30e360818b5a8881b48992c298b75a86364e2e5c))
* Implement course progress record creation in order processing and add GitHub Copilot entry point instructions ([236cf3e](https://github.com/trodad-intl/prepexcellence/commit/236cf3e9068c6901de7d790f058783932fc73bd0))
* improve code formatting for moduleLessons filtering in create and edit components ([35f1aeb](https://github.com/trodad-intl/prepexcellence/commit/35f1aeb6412a092f831c2778f9a7062c7d495136))
* improve formatting and indentation in ContactUsBanner component ([a0f3f60](https://github.com/trodad-intl/prepexcellence/commit/a0f3f60ad66a50cb625e82fd6ef82d8f345a04eb))
* Refactor getMyCourses to improve course data retrieval and include enrollment details ([cadf424](https://github.com/trodad-intl/prepexcellence/commit/cadf424ceab3bb4896c88eef78bfe3620cc85a0f))
* Remove courseType filter from getMyCourses query in course controller ([9dbf984](https://github.com/trodad-intl/prepexcellence/commit/9dbf984d7b021e4514e86f927541d53c72afd2ce))
* Remove unnecessary blank lines in course.controller.ts ([4b24eb8](https://github.com/trodad-intl/prepexcellence/commit/4b24eb85270ce3d5b1aa55da0d80ff3b90c27615))
* reorder import statements and simplify lesson attachment validation schema ([73c519c](https://github.com/trodad-intl/prepexcellence/commit/73c519ca79d78a2394bbf72ecbd3915b78848008))
* standardize indentation and formatting in ContactUsBanner component ([de6cb4a](https://github.com/trodad-intl/prepexcellence/commit/de6cb4a7b0d7791fa0d3e11fe7be50395c668ba6))
* Standardize spacing in courseType queries across course controller methods ([2ce5f53](https://github.com/trodad-intl/prepexcellence/commit/2ce5f538ddfe3dad19b2664ab500b03d30dae71d))
* Update course handling to enforce courseType "LMS" in CRUD operations and adjust middleware for course uploads ([848e255](https://github.com/trodad-intl/prepexcellence/commit/848e255666a95bb672efb2202023f4625832b3c5))
* update lesson and module handling to use courseModuleId consistently ([3d4d604](https://github.com/trodad-intl/prepexcellence/commit/3d4d60498e15abc7502fec21c34a148edea7924b))

## [1.7.2](https://github.com/trodad-intl/prepexcellence/compare/v1.7.1...v1.7.2) (2026-07-02)


### Bug Fixes

* Refactor lesson, assignment, course, exam, review, and order controllers to update student and instructor references, change passingPoints to passingScore, and improve data selection structure for better clarity and consistency. ([8fd77cb](https://github.com/trodad-intl/prepexcellence/commit/8fd77cb114a197d35b220edcf9f216994f8df5f6))
* Refactor student selection structure in assignment, exam, review, and order controllers for improved clarity and consistency ([39b4828](https://github.com/trodad-intl/prepexcellence/commit/39b48283fe890e934ac10cbf614eb31594700b58))

## [1.7.1](https://github.com/trodad-intl/prepexcellence/compare/v1.7.0...v1.7.1) (2026-07-02)


### Bug Fixes

* Improve code formatting for consistency across multiple files ([aea9aaf](https://github.com/trodad-intl/prepexcellence/commit/aea9aafa073a8d3fba238cdecfbcec37c663b5ab))
* Refactor validation schemas and controllers for improved consistency and clarity ([833fee7](https://github.com/trodad-intl/prepexcellence/commit/833fee706d47a1bcb21b7766932abccd64e68f2d))

## [1.7.0](https://github.com/trodad-intl/prepexcellence/compare/v1.6.22...v1.7.0) (2026-07-01)


### Features

* add migration to drop endTime and startTime columns from teacher_availabilities table ([245e738](https://github.com/trodad-intl/prepexcellence/commit/245e7385aa2fdb7468caa8c455e00c2b70464fcc))
* add TeacherProfileDialog component for managing teacher profiles and remove bio column from teacher_profiles table ([427f5f7](https://github.com/trodad-intl/prepexcellence/commit/427f5f7df9169d836d87747dab9c4cec57bfb9f0))
* implement edit and delete functionality for availability slots ([c0685ef](https://github.com/trodad-intl/prepexcellence/commit/c0685ef6a3eb8e5539a9eed16f3379b996772154))
* Implement Exam Question and Option CRUD operations ([a7ed51d](https://github.com/trodad-intl/prepexcellence/commit/a7ed51de22cc29ef29f74645851dff78a792054e))
* implement video management functionality in LMS ([689cc03](https://github.com/trodad-intl/prepexcellence/commit/689cc0370a8717e1695cd699219723bfba5584f5))
* implement video management functionality in LMS ([e53ec46](https://github.com/trodad-intl/prepexcellence/commit/e53ec466aaaaed4c2c1e15e29ab8b70c71e35ad3))
* Refactor schedule components to integrate API data for availability and blocked times ([5e58195](https://github.com/trodad-intl/prepexcellence/commit/5e58195cec79febad04a1549f9c70ddcea703bac))
* update availability controller to handle timezones and refactor availability modal for better state management ([2e19e01](https://github.com/trodad-intl/prepexcellence/commit/2e19e01cd49543a435ac57217c12ccf284be5b50))
* update teacher profile handling and validation schema ([58d0c6f](https://github.com/trodad-intl/prepexcellence/commit/58d0c6fdbf36b943e5bf7a79d41dc68ed4c75bbd))

## [1.6.22](https://github.com/trodad-intl/prepexcellence/compare/v1.6.21...v1.6.22) (2026-06-24)


### Bug Fixes

* RouteComponent in $courseId.tsx to pass courseId to CourseBanner ([5f01ecc](https://github.com/trodad-intl/prepexcellence/commit/5f01eccd7f6ad9a64b70cf3f2cab07504fc1cc23))

## [1.6.21](https://github.com/trodad-intl/prepexcellence/compare/v1.6.20...v1.6.21) (2026-06-24)


### Bug Fixes

* code structure for improved readability and maintainability ([0d57d57](https://github.com/trodad-intl/prepexcellence/commit/0d57d5713caf170183165693fb061b149481af8c))
* code structure for improved readability and maintainability ([04da7e5](https://github.com/trodad-intl/prepexcellence/commit/04da7e5c38f2452fd72df0de48d357f3466a5224))

## [1.6.20](https://github.com/trodad-intl/prepexcellence/compare/v1.6.19...v1.6.20) (2026-06-24)


### Bug Fixes

* add course category management with CRUD operations and validation ([5bbb720](https://github.com/trodad-intl/prepexcellence/commit/5bbb7201658d0be09e5acf4ebc81b4d9a396513a))

## [1.6.19](https://github.com/trodad-intl/prepexcellence/compare/v1.6.18...v1.6.19) (2026-06-23)


### Bug Fixes

* free seminar enrolement with email ([9570328](https://github.com/trodad-intl/prepexcellence/commit/95703282d2e9578b009eb1e7e47dac0b56f654b2))
* free seminar enrolement with email ([5fa2bf0](https://github.com/trodad-intl/prepexcellence/commit/5fa2bf0fc93f569f630210d632d335f8f0c3dc94))

## [1.6.18](https://github.com/trodad-intl/prepexcellence/compare/v1.6.17...v1.6.18) (2026-06-23)


### Bug Fixes

* free seminar enrolement with email ([d1b74c8](https://github.com/trodad-intl/prepexcellence/commit/d1b74c851f4956ce3b7d07b6e7a9ca4de78f3b84))

## [1.6.17](https://github.com/trodad-intl/prepexcellence/compare/v1.6.16...v1.6.17) (2026-06-23)


### Bug Fixes

* free seminar enrolement with email ([5735d1b](https://github.com/trodad-intl/prepexcellence/commit/5735d1b9c238c6eb27e758a29cb2f33597f47276))
* free seminar enrolement with email ([d84d39c](https://github.com/trodad-intl/prepexcellence/commit/d84d39c1bdeb937b8e5c108e3c4287b0ef6d660e))

## [1.6.16](https://github.com/trodad-intl/prepexcellence/compare/v1.6.15...v1.6.16) (2026-06-23)


### Bug Fixes

* updated ([c616bac](https://github.com/trodad-intl/prepexcellence/commit/c616bac7a3885a8855e9cb52bb16a04e332b73cb))
* updated ([284f15c](https://github.com/trodad-intl/prepexcellence/commit/284f15cfad467808b4350eec79033552495d13fe))

## [1.6.15](https://github.com/trodad-intl/prepexcellence/compare/v1.6.14...v1.6.15) (2026-06-23)


### Bug Fixes

* updated router.ts ([8691042](https://github.com/trodad-intl/prepexcellence/commit/86910428084b7f29f6075c56810985648db3b580))

## [1.6.14](https://github.com/trodad-intl/prepexcellence/compare/v1.6.13...v1.6.14) (2026-06-23)


### Bug Fixes

* updated router.ts ([28e807d](https://github.com/trodad-intl/prepexcellence/commit/28e807d9f69bdd85576df60bd4f60270d27389a1))

## [1.6.13](https://github.com/trodad-intl/prepexcellence/compare/v1.6.12...v1.6.13) (2026-06-23)


### Bug Fixes

* update contact us ([805a813](https://github.com/trodad-intl/prepexcellence/commit/805a8135a32a9fa62e9fa657f60140027e2ba9f5))
* update contact us ([da75414](https://github.com/trodad-intl/prepexcellence/commit/da75414e44b91d1a8c361d841cd242380c55c283))

## [1.6.12](https://github.com/trodad-intl/prepexcellence/compare/v1.6.11...v1.6.12) (2026-06-23)


### Bug Fixes

* Refactor code structure for improved readability and maintainability ([4737e04](https://github.com/trodad-intl/prepexcellence/commit/4737e04602226000528a9d750a303dd5da98cca0))

## [1.6.11](https://github.com/trodad-intl/prepexcellence/compare/v1.6.10...v1.6.11) (2026-06-23)


### Bug Fixes

* update contact us ([a479e70](https://github.com/trodad-intl/prepexcellence/commit/a479e70d7c1ab67e3b24af2ce1d775448a98a4e4))

## [1.6.10](https://github.com/trodad-intl/prepexcellence/compare/v1.6.9...v1.6.10) (2026-06-23)


### Bug Fixes

* fixed api error ([ef56951](https://github.com/trodad-intl/prepexcellence/commit/ef56951aebd4e825f20cff9ae73488ad5db12ea6))
* fixed api error ([2c07729](https://github.com/trodad-intl/prepexcellence/commit/2c077290cfefaef0cb555e6f7343acf7abe6988a))

## [1.6.9](https://github.com/trodad-intl/prepexcellence/compare/v1.6.8...v1.6.9) (2026-06-22)


### Bug Fixes

* update docker  page ([f472c72](https://github.com/trodad-intl/prepexcellence/commit/f472c72cb8060c52e135164907d2a8b8794521a5))
* updated ([e2d08fc](https://github.com/trodad-intl/prepexcellence/commit/e2d08fccd24ed14be2418362dd1991f320d820c9))

## [1.6.8](https://github.com/trodad-intl/prepexcellence/compare/v1.6.7...v1.6.8) (2026-06-22)


### Bug Fixes

* udpate docker file ([1622544](https://github.com/trodad-intl/prepexcellence/commit/16225448808c11d5645410de80b6d317a054953b))
* update docker file ([0897b7f](https://github.com/trodad-intl/prepexcellence/commit/0897b7fa6ad5e3c99ffd22f48b278f9786c239db))

## [1.6.7](https://github.com/trodad-intl/prepexcellence/compare/v1.6.6...v1.6.7) (2026-06-22)


### Bug Fixes

* update contact us ([f1f536b](https://github.com/trodad-intl/prepexcellence/commit/f1f536bd998b61a2257c62fed48ecfb686237abf))
* update nitro ([099c3b8](https://github.com/trodad-intl/prepexcellence/commit/099c3b86ff6f4057cc4248a95c85b290cb2ed1d9))

## [1.6.6](https://github.com/trodad-intl/prepexcellence/compare/v1.6.5...v1.6.6) (2026-06-22)


### Bug Fixes

* remove nitro ([da8919b](https://github.com/trodad-intl/prepexcellence/commit/da8919b7e75f0d957c230668031537280391c498))
* update docker file ([3a50b4e](https://github.com/trodad-intl/prepexcellence/commit/3a50b4e4b9d3ee3c7b13f3afbfb15a955e646044))

## [1.6.5](https://github.com/trodad-intl/prepexcellence/compare/v1.6.4...v1.6.5) (2026-06-22)


### Bug Fixes

* docker file update ([9696f2d](https://github.com/trodad-intl/prepexcellence/commit/9696f2d54236253531ca5dc400c1a8a95095b197))

## [1.6.4](https://github.com/trodad-intl/prepexcellence/compare/v1.6.3...v1.6.4) (2026-06-22)


### Bug Fixes

* update user and group for Dockerfile to use 'app' instead of 'nitrojs' ([9239334](https://github.com/trodad-intl/prepexcellence/commit/9239334d51b6025030d16ec06e36973fea9c7748))

## [1.6.3](https://github.com/trodad-intl/prepexcellence/compare/v1.6.2...v1.6.3) (2026-06-22)


### Bug Fixes

* comment out nitro import and configuration in vite.config.ts ([5b6ba5e](https://github.com/trodad-intl/prepexcellence/commit/5b6ba5e845ff401e11ea36ba66666619fb9f41e5))

## [1.6.2](https://github.com/trodad-intl/prepexcellence/compare/v1.6.1...v1.6.2) (2026-06-21)


### Bug Fixes

* updated dynamic course ([3de161b](https://github.com/trodad-intl/prepexcellence/commit/3de161bd1dbd694a3f2493a7250a391247a98a4e))
* updated dynamic course ([0c6d054](https://github.com/trodad-intl/prepexcellence/commit/0c6d0545da9005559bbf9e8491b203a46bfd7805))
* updated dynamic course ([892f436](https://github.com/trodad-intl/prepexcellence/commit/892f436059508f31f7a8bdcf45b5dd26bf595856))

## [1.6.1](https://github.com/trodad-intl/prepexcellence/compare/v1.6.0...v1.6.1) (2026-06-20)


### Bug Fixes

* coaching validators for improved readability and consistency in formatting ([7ecff08](https://github.com/trodad-intl/prepexcellence/commit/7ecff08037d71baa5ecc6143b8382fce10d60ca5))
* Refactor teacher controller and update coaching course validators ([2b67c1d](https://github.com/trodad-intl/prepexcellence/commit/2b67c1db6f53e5123f40404c770a12047f2613d3))
* remove unused imports from FreeSeminarRegistrationForm and route component ([4fe52e9](https://github.com/trodad-intl/prepexcellence/commit/4fe52e9671a8271e95300abfe91484f1a56d6440))

## [1.6.0](https://github.com/trodad-intl/prepexcellence/compare/v1.5.1...v1.6.0) (2026-06-20)


### Features

* add signup page with form validation and Google login integration ([a537ef1](https://github.com/trodad-intl/prepexcellence/commit/a537ef192343224e58b2beb2f7c6c254f479dde7))

## [1.5.1](https://github.com/trodad-intl/prepexcellence/compare/v1.5.0...v1.5.1) (2026-06-18)


### Bug Fixes

* improve code formatting and readability in enrollment and refund controllers ([75217e6](https://github.com/trodad-intl/prepexcellence/commit/75217e6fb5f2b8136ef8aa949eca4e669e7b850d))
* improve code formatting and readability in enrollment and refund controllers, and routes ([8d8e6fc](https://github.com/trodad-intl/prepexcellence/commit/8d8e6fc8efc1fec1ddc16c644565f417006a94bb))

## [1.5.0](https://github.com/trodad-intl/prepexcellence/compare/v1.4.0...v1.5.0) (2026-06-18)


### Features

* coaching and LMS validators for improved readability and consistency ([06e8f64](https://github.com/trodad-intl/prepexcellence/commit/06e8f648782ec17d86ccf608ed61c7e606a123c9))


### Bug Fixes

* course creation and validation schemas for improved readability and maintainability ([28c0965](https://github.com/trodad-intl/prepexcellence/commit/28c0965756f7b9b713dccf5ccb75207c47296419))

## [1.4.0](https://github.com/trodad-intl/prepexcellence/compare/v1.3.0...v1.4.0) (2026-06-18)


### Features

* add order process with coupon ([b1a54ff](https://github.com/trodad-intl/prepexcellence/commit/b1a54ff3cc96b35999ac65607a1a5ea6f7b982e2))
* add order process with coupon ([1af3bb0](https://github.com/trodad-intl/prepexcellence/commit/1af3bb07126a317c8343704fb898401237aa71f6))
* checkout feature schema implement ([f4b81ef](https://github.com/trodad-intl/prepexcellence/commit/f4b81ef32ed7e6574f1d57d17c4039952e44b087))
* coaching module topic impelement ([ea65c1f](https://github.com/trodad-intl/prepexcellence/commit/ea65c1fbff11f8c05f1155cf9d98f939ef9d3d28))
* **coaching:** implement topic management with CRUD operations and validation ([233f840](https://github.com/trodad-intl/prepexcellence/commit/233f8405f58e16f152af875a6716241df953cece))
* coupon feature implement ([476b222](https://github.com/trodad-intl/prepexcellence/commit/476b2224adba667768be565ed04954bb9b5c7360))
* coupon feature implement ([3131d54](https://github.com/trodad-intl/prepexcellence/commit/3131d54907415c4c124c4c48dc674ab440bf9bea))


### Bug Fixes

* add payableAmount field to createOrderSchema for validation ([bac29bc](https://github.com/trodad-intl/prepexcellence/commit/bac29bc32bd9acfec64c279424f0bfafbd935a18))
* cart, order payment controller implement ([6fa6192](https://github.com/trodad-intl/prepexcellence/commit/6fa619256e3b559c2d7fb82cae207402d1d88156))
* cart, order payment controller implement ([39470cc](https://github.com/trodad-intl/prepexcellence/commit/39470cc6c7b6a88b9ec4c0255d0fc3db20e69200))
* change controller for modify schema ([5860c8a](https://github.com/trodad-intl/prepexcellence/commit/5860c8a5384af72b241db7b37f013eea6658527d))
* clean up getPublishedCourses function by removing unnecessary module inclusion ([4759421](https://github.com/trodad-intl/prepexcellence/commit/475942194a27ce61eb9d33c067614515f333c8ff))
* clean up imports and formatting in order.controller.ts ([97407b5](https://github.com/trodad-intl/prepexcellence/commit/97407b5458b41c02078f5c6b810be4b959f6bfb4))
* import issue ([ae7e0aa](https://github.com/trodad-intl/prepexcellence/commit/ae7e0aa258248e0bf1d4e68fbaf4edfb24394315))
* remove unnecessary blank lines in course controller ([199f6b6](https://github.com/trodad-intl/prepexcellence/commit/199f6b65fa74f0e82508a51cfef1aaab18fb28ca))

## [1.3.0](https://github.com/trodad-intl/prepexcellence/compare/v1.2.13...v1.3.0) (2026-06-16)


### Features

* Add ChooseSATCourses component and integrate it into SATSection ([52fe830](https://github.com/trodad-intl/prepexcellence/commit/52fe83069c625b91f505a6e75a6068ec803d90ec))
* Add home-two route and implement main layout with sections ([d33552f](https://github.com/trodad-intl/prepexcellence/commit/d33552f5327d75ead83075352888f591e6b0bc6f))
* Add SATCoursePage component to course details route ([fc9b1c0](https://github.com/trodad-intl/prepexcellence/commit/fc9b1c0f2a206716118a90588c997fcca34f13a6))
* enhance CourseCard component with animations and improve search functionality ([36e1ada](https://github.com/trodad-intl/prepexcellence/commit/36e1ada85fb1187fe4fb020899a8a4dd584ea41d))
* enhance HeaderTwo and Details components with animations and improved layout ([a806a81](https://github.com/trodad-intl/prepexcellence/commit/a806a81b989f8a41c4e372e74400d7f6267550ab))
* Refactor SATSection component and add Breadcrumb component ([808ba8a](https://github.com/trodad-intl/prepexcellence/commit/808ba8a56480bbe05cdf0d82c8e92cb67dbc3fdd))


### Bug Fixes

* added /home-two route for homepage v2 ([c6e248c](https://github.com/trodad-intl/prepexcellence/commit/c6e248cc5d44d4959941c3ae386497e0b3b5eda7))
* added /home-two route for homepage v2 ([54b7d6f](https://github.com/trodad-intl/prepexcellence/commit/54b7d6fcc07365a300c4a55f84c91b7805ef3263))
* correct import order for motion components in sat_courses.tsx ([affc8eb](https://github.com/trodad-intl/prepexcellence/commit/affc8eb31a1e955fd87df4928edddecffd26cd0b))
* dynamic sat courses ([5a47ffa](https://github.com/trodad-intl/prepexcellence/commit/5a47ffae3004e708f66572cd908010466cc5fef0))
* dynamic sat courses ([b1a95d9](https://github.com/trodad-intl/prepexcellence/commit/b1a95d972ddb84343c329189c0089d3537745393))
* modify app sidebar and coaching ts ([c900bda](https://github.com/trodad-intl/prepexcellence/commit/c900bda7bfece72243ea9f9e8bd4f4d22ad42139))
* modify caching table and contact us table ([da21cd6](https://github.com/trodad-intl/prepexcellence/commit/da21cd68742cfe1dfb9b899dcce6686183356463))
* quote convert to title ([f1204a7](https://github.com/trodad-intl/prepexcellence/commit/f1204a7adee3874ada8b080f974b1ebb604d54f3))
* type issue ([56a521a](https://github.com/trodad-intl/prepexcellence/commit/56a521a6323ee490044654c42a4c0f1d47f70523))

## [1.2.13](https://github.com/trodad-intl/prepexcellence/compare/v1.2.12...v1.2.13) (2026-01-14)


### Bug Fixes

* sats-builder-form update ([e7f4187](https://github.com/trodad-intl/prepexcellence/commit/e7f4187d889dff47d1ee2f3741d6069df5932600))

## [1.2.12](https://github.com/trodad-intl/prepexcellence/compare/v1.2.11...v1.2.12) (2026-01-13)


### Bug Fixes

* True false answer calculate issue fix ([2247296](https://github.com/trodad-intl/prepexcellence/commit/22472964122442a94b274c47a5fb8568aa1219b3))
* True false answer calculate issue fix ([5ca083c](https://github.com/trodad-intl/prepexcellence/commit/5ca083c1da570840fcbe21a8bf4f3de0460d1c3c))

## [1.2.11](https://github.com/trodad-intl/prepexcellence/compare/v1.2.10...v1.2.11) (2026-01-13)


### Bug Fixes

* all issue fix ([6cc4056](https://github.com/trodad-intl/prepexcellence/commit/6cc4056640a3b29c441caa5477699f2aa3d17ae5))

## [1.2.10](https://github.com/trodad-intl/prepexcellence/compare/v1.2.9...v1.2.10) (2026-01-10)


### Bug Fixes

* missing route change ([8cee664](https://github.com/trodad-intl/prepexcellence/commit/8cee664d675125adaf8e0681be37cc64e57b46db))

## [1.2.9](https://github.com/trodad-intl/prepexcellence/compare/v1.2.8...v1.2.9) (2026-01-10)


### Bug Fixes

* footer link updated and some backend logic update for question bank ([5523ec6](https://github.com/trodad-intl/prepexcellence/commit/5523ec68b5de4ace5ba667f6d9848c877d61914a))

## [1.2.8](https://github.com/trodad-intl/prepexcellence/compare/v1.2.7...v1.2.8) (2026-01-07)


### Bug Fixes

* style update ([60f61b3](https://github.com/trodad-intl/prepexcellence/commit/60f61b3f61da96969865637aff2d75135006a432))

## [1.2.7](https://github.com/trodad-intl/prepexcellence/compare/v1.2.6...v1.2.7) (2026-01-07)


### Bug Fixes

* resolve FOUC by updating stylesheet import and adjuct Vite config for Css handaling ([4b06567](https://github.com/trodad-intl/prepexcellence/commit/4b06567bc1c444cc6598e99a94f5d96b996aea43))
* resolve FOUC by updating stylesheet import and adjuct Vite config for Css handaling ([4aa9c2c](https://github.com/trodad-intl/prepexcellence/commit/4aa9c2c10400da7b806d8f0868eff24f3126fd85))

## [1.2.6](https://github.com/trodad-intl/prepexcellence/compare/v1.2.5...v1.2.6) (2026-01-07)


### Bug Fixes

* css issue ([914c7b6](https://github.com/trodad-intl/prepexcellence/commit/914c7b640406bd780cbb732b3ea0c190f913155c))
* updated teachers carousel ([f036f9e](https://github.com/trodad-intl/prepexcellence/commit/f036f9e5c806893110e8a6c59badddf40d18e1be))

## [1.2.5](https://github.com/trodad-intl/prepexcellence/compare/v1.2.4...v1.2.5) (2026-01-06)


### Bug Fixes

* updated dummy content ([ff9503d](https://github.com/trodad-intl/prepexcellence/commit/ff9503d063e8364c7f850da0324bd47a93d83980))
* updated ui ([04886bb](https://github.com/trodad-intl/prepexcellence/commit/04886bb591f673040343819affb1f81491d0098c))

## [1.2.4](https://github.com/trodad-intl/prepexcellence/compare/v1.2.3...v1.2.4) (2026-01-06)


### Bug Fixes

* config issue ([ff2d0ab](https://github.com/trodad-intl/prepexcellence/commit/ff2d0ab2635c6c667443a42d9c6b86b918eb0abe))
* server crashed issue ([85d8dfb](https://github.com/trodad-intl/prepexcellence/commit/85d8dfbac01084411361851e7a7b0291b77499de))

## [1.2.3](https://github.com/trodad-intl/prepexcellence/compare/v1.2.2...v1.2.3) (2026-01-06)


### Bug Fixes

* remove duplicate Minio import and clean up connection parameters ([fceced7](https://github.com/trodad-intl/prepexcellence/commit/fceced76b289619577d5f5bf9506f80c83cfd031))
* reorder Minio import for consistency ([3f305eb](https://github.com/trodad-intl/prepexcellence/commit/3f305eb1a126ff7e52579a1c76efcf128ec692c8))

## [1.2.2](https://github.com/trodad-intl/prepexcellence/compare/v1.2.1...v1.2.2) (2026-01-06)


### Bug Fixes

* minio issue ([8ad782e](https://github.com/trodad-intl/prepexcellence/commit/8ad782ea3d9c548420e6b4d8857c133fb37a8ad7))

## [1.2.1](https://github.com/trodad-intl/prepexcellence/compare/v1.2.0...v1.2.1) (2026-01-06)


### Bug Fixes

* import issue ([327432d](https://github.com/trodad-intl/prepexcellence/commit/327432d67247a03cf53949863ced46e4d04191e5))

## [1.2.0](https://github.com/trodad-intl/prepexcellence/compare/v1.1.26...v1.2.0) (2026-01-05)


### Features

* sat practice ([7607f60](https://github.com/trodad-intl/prepexcellence/commit/7607f609b0df713ef5b6cd17f9231bb64647fbdb))

## [1.1.26](https://github.com/trodad-intl/prepexcellence/compare/v1.1.25...v1.1.26) (2025-12-23)


### Bug Fixes

* responsive ([4d2596a](https://github.com/trodad-intl/prepexcellence/commit/4d2596aafc2527bd81aa243cf4a4177588e2bbbd))

## [1.1.25](https://github.com/trodad-intl/prepexcellence/compare/v1.1.24...v1.1.25) (2025-12-23)


### Bug Fixes

* responsive ([7eb55d7](https://github.com/trodad-intl/prepexcellence/commit/7eb55d72844da2994fc1b7ad536f8c2ac7290561))

## [1.1.24](https://github.com/trodad-intl/prepexcellence/compare/v1.1.23...v1.1.24) (2025-12-22)


### Bug Fixes

* responsive ([e1981e9](https://github.com/trodad-intl/prepexcellence/commit/e1981e900fac5fdeed769f6b22869fa4083d3d2c))

## [1.1.23](https://github.com/trodad-intl/prepexcellence/compare/v1.1.22...v1.1.23) (2025-12-22)


### Bug Fixes

* responsive ([e4fb189](https://github.com/trodad-intl/prepexcellence/commit/e4fb18980348386e962cce763751afe3bb778644))

## [1.1.22](https://github.com/trodad-intl/prepexcellence/compare/v1.1.21...v1.1.22) (2025-12-21)


### Bug Fixes

* backend url update ([02ca8c3](https://github.com/trodad-intl/prepexcellence/commit/02ca8c302a912fb0548890a6a1dd4024a584fe0a))
* backend url update ([13ae9d4](https://github.com/trodad-intl/prepexcellence/commit/13ae9d48db63127ae9887430ee140dab1ad34df5))

## [1.1.21](https://github.com/trodad-intl/prepexcellence/compare/v1.1.20...v1.1.21) (2025-12-21)


### Bug Fixes

* responsive ([f3221ab](https://github.com/trodad-intl/prepexcellence/commit/f3221ab04e7fe2631a36cb0ce9f2966d5cc8128a))

## [1.1.20](https://github.com/trodad-intl/prepexcellence/compare/v1.1.19...v1.1.20) (2025-12-21)


### Bug Fixes

* responsive ([6bff830](https://github.com/trodad-intl/prepexcellence/commit/6bff83091e23c70d69f9fc4f06ac170b7190a181))

## [1.1.19](https://github.com/trodad-intl/prepexcellence/compare/v1.1.18...v1.1.19) (2025-12-21)


### Bug Fixes

* add all types questions ([099b161](https://github.com/trodad-intl/prepexcellence/commit/099b16184bacbbf9826e748088a79376ea9b962c))

## [1.1.18](https://github.com/trodad-intl/prepexcellence/compare/v1.1.17...v1.1.18) (2025-12-21)


### Bug Fixes

* responsive ([187eb2d](https://github.com/trodad-intl/prepexcellence/commit/187eb2dbd6326dc4158b29dd9d9c2308e0fa40bb))
* responsive ([58ba93b](https://github.com/trodad-intl/prepexcellence/commit/58ba93b3d6c3af0d8c2c7037fd117b4ee0100141))

## [1.1.17](https://github.com/trodad-intl/prepexcellence/compare/v1.1.16...v1.1.17) (2025-12-21)


### Bug Fixes

* responsive ([da4faa7](https://github.com/trodad-intl/prepexcellence/commit/da4faa75fa1c3747d4c1659a7f887169cc6da761))
* resposnsive ([0622920](https://github.com/trodad-intl/prepexcellence/commit/0622920517c53d2ef43388ac9f5d0c971af68850))

## [1.1.16](https://github.com/trodad-intl/prepexcellence/compare/v1.1.15...v1.1.16) (2025-12-21)


### Bug Fixes

* update backend url ([5cf5837](https://github.com/trodad-intl/prepexcellence/commit/5cf5837a6fefbdc38b8d15c5e9eb5f5d711b1c41))

## [1.1.15](https://github.com/trodad-intl/prepexcellence/compare/v1.1.14...v1.1.15) (2025-12-21)


### Bug Fixes

* add SSR configuration to prevent externalizing xlsx ([bb1809f](https://github.com/trodad-intl/prepexcellence/commit/bb1809f40e37af1d5b9473286213388c56459a40))

## [1.1.14](https://github.com/trodad-intl/prepexcellence/compare/v1.1.13...v1.1.14) (2025-12-20)


### Bug Fixes

* ui fix ([961de37](https://github.com/trodad-intl/prepexcellence/commit/961de37fd819763e71550dccf5452165ed858420))
* ui fix ([e3d5423](https://github.com/trodad-intl/prepexcellence/commit/e3d5423a8b92cebc36c4836bf5e086b80a15051b))
* ui fix ([f62dde1](https://github.com/trodad-intl/prepexcellence/commit/f62dde12114d38f28267a1a62a31b13433883fd2))

## [1.1.13](https://github.com/trodad-intl/prepexcellence/compare/v1.1.12...v1.1.13) (2025-12-20)


### Bug Fixes

* remove trailing newline in package.json and clean up index.ts exports ([84f70b9](https://github.com/trodad-intl/prepexcellence/commit/84f70b9dd5cae0646471bfea7c4a0fc81f40aef8))
* update environment variables and improve shared validators package structure ([1f2b80a](https://github.com/trodad-intl/prepexcellence/commit/1f2b80a815682959c92dbce9502b8ba656edf591))

## [1.1.12](https://github.com/trodad-intl/prepexcellence/compare/v1.1.11...v1.1.12) (2025-12-20)


### Bug Fixes

* remove backend url ([60e6cab](https://github.com/trodad-intl/prepexcellence/commit/60e6cab7c43e18ed9cc2244672391abf26757361))

## [1.1.11](https://github.com/trodad-intl/prepexcellence/compare/v1.1.10...v1.1.11) (2025-12-20)


### Bug Fixes

* builld issue ([b9380f5](https://github.com/trodad-intl/prepexcellence/commit/b9380f5f075a28128cd13149469290a0575ef918))

## [1.1.10](https://github.com/trodad-intl/prepexcellence/compare/v1.1.9...v1.1.10) (2025-12-20)


### Bug Fixes

* updated ([cf04780](https://github.com/trodad-intl/prepexcellence/commit/cf047806a553ea99d458b329f2b89df008374362))
* updated ([5b9c6c7](https://github.com/trodad-intl/prepexcellence/commit/5b9c6c748c344c073d461b008acc2a46a5b8f435))
* updated ([c5e2927](https://github.com/trodad-intl/prepexcellence/commit/c5e29271b29d4a7b2eede16b83dbe2639a9e4520))
* updated ([63c1404](https://github.com/trodad-intl/prepexcellence/commit/63c1404bd05ee7993396576bb118ff77d95f509a))

## [1.1.9](https://github.com/trodad-intl/prepexcellence/compare/v1.1.8...v1.1.9) (2025-12-20)


### Bug Fixes

* update packageManager version to pnpm@10.25.0 ([09c69d2](https://github.com/trodad-intl/prepexcellence/commit/09c69d20243f1cd82f38fd465c4ad8f5e236a8e3))
* update packageManager version to pnpm@10.25.0 ([c1344aa](https://github.com/trodad-intl/prepexcellence/commit/c1344aad7856ecb47d9c73a05b9fd031fcde3322))

## [1.1.8](https://github.com/trodad-intl/prepexcellence/compare/v1.1.7...v1.1.8) (2025-12-20)


### Bug Fixes

* "build issue solved" ([c6a2bf3](https://github.com/trodad-intl/prepexcellence/commit/c6a2bf3d8fb3549fe29c0fd730a134e20d729d5a))
* remove unnecessary whitespace in QuestionBankController ([6b3094c](https://github.com/trodad-intl/prepexcellence/commit/6b3094cbb8ea4a670d87db4e75162eb0c75e2713))
* reorder import statements in sat-practice.controller.ts ([d5a7b80](https://github.com/trodad-intl/prepexcellence/commit/d5a7b80a9623009f5a4c28448f4df52397c40aad))

## [1.1.7](https://github.com/trodad-intl/prepexcellence/compare/v1.1.6...v1.1.7) (2025-12-20)


### Bug Fixes

* update PNPM version to 10.2511.0 in deploy workflow ([46515d1](https://github.com/trodad-intl/prepexcellence/commit/46515d1cbfdd93b9dbc81707eb928a454cdcfee7))

## [1.1.6](https://github.com/trodad-intl/prepexcellence/compare/v1.1.5...v1.1.6) (2025-12-18)


### Bug Fixes

* updated blog ([9353a8b](https://github.com/trodad-intl/prepexcellence/commit/9353a8b624e463494ebbaddc01608533d2f69122))
* updated blog ([dd29684](https://github.com/trodad-intl/prepexcellence/commit/dd296849470a6317d83e982c3719a57130014734))

## [1.1.5](https://github.com/trodad-intl/prepexcellence/compare/v1.1.4...v1.1.5) (2025-12-18)


### Bug Fixes

* added phase 1 ([2d99616](https://github.com/trodad-intl/prepexcellence/commit/2d99616a6d5b4183eb75b054121fb55c737140ed))
* added phase 1 ([638ebbb](https://github.com/trodad-intl/prepexcellence/commit/638ebbbd30fabf0b92b9414a5658349c1b83a54b))

## [1.1.4](https://github.com/trodad-intl/prepexcellence/compare/v1.1.3...v1.1.4) (2025-12-14)


### Bug Fixes

* add workflows for video processor and Go project checks ([55049fc](https://github.com/trodad-intl/prepexcellence/commit/55049fc6a5d9985550c1ad4e0c703443fdce3c79))
* update manifest file path in release-please workflow ([6bf6288](https://github.com/trodad-intl/prepexcellence/commit/6bf62885c7ffb01b8926d8f59a7b48d7b125606b))

## [1.1.3](https://github.com/trodad-intl/prepexcellence/compare/v1.1.2...v1.1.3) (2025-12-05)


### Bug Fixes

* add newline at end of package.json ([0b40d75](https://github.com/trodad-intl/prepexcellence/commit/0b40d75c154fdf062c55576a50c82cd2036baabd))
* add test database configuration and setup for Vitest ([6df4bc6](https://github.com/trodad-intl/prepexcellence/commit/6df4bc651abd14f78bd51d03362c68eb57b9a85d))
* update vitest to version 4.0.15 in package.json and pnpm-lock.yaml ([d063274](https://github.com/trodad-intl/prepexcellence/commit/d06327491fa3aa197a7baf28e586ca254a538964))

## [1.1.2](https://github.com/trodad-intl/prepexcellence/compare/v1.1.1...v1.1.2) (2025-12-04)


### Bug Fixes

* update Docker image names for API and Web in deploy workflow ([11e5150](https://github.com/trodad-intl/prepexcellence/commit/11e5150e6ff74cce7581c527fb0abd1f7ba24513))

## [1.1.1](https://github.com/trodad-intl/prepexcellence/compare/v1.1.0...v1.1.1) (2025-12-04)


### Bug Fixes

* add DATABASE_URL environment variable to build job in PR checks workflow ([b933f11](https://github.com/trodad-intl/prepexcellence/commit/b933f111860ecc719f2f9b81166d21baa7064f2e))
* add step to generate Prisma client in PR checks workflow ([551a060](https://github.com/trodad-intl/prepexcellence/commit/551a060c4fafee004c913da579ef385bf9fff8d0))
* add web build step to generate routes and remove Codecov uploads from test job ([10c6301](https://github.com/trodad-intl/prepexcellence/commit/10c630162d144f88ff09515fe74045c397e36041))
* enhance PR checks by adding PostgreSQL service and database migration step ([fd6890e](https://github.com/trodad-intl/prepexcellence/commit/fd6890eb4575e0df3d0cc4f0a786cd9f06e80d5f))
* enhance testing setup with Vitest, add coverage reporting, and implement Prisma client generation ([9156c9e](https://github.com/trodad-intl/prepexcellence/commit/9156c9e14918a3f99d8dcdcdd1b0c9696ec67e86))
* ensure proper formatting in package.json files for API and web applications ([3a31f63](https://github.com/trodad-intl/prepexcellence/commit/3a31f636f192c9316dc9f3bd40ecc994970677c6))
* streamline Docker caching in workflows, enhance linting scripts, and improve test coverage for user authentication ([3945a25](https://github.com/trodad-intl/prepexcellence/commit/3945a2541d0a207aad83d354077251419701739d))
* update PR checks and improve coverage reporting; add error handling for channel creation ([fc643da](https://github.com/trodad-intl/prepexcellence/commit/fc643da163aa32f203bc3a9d7b6b32cf5155b2c8))
* update workflows to ensure proper handling of affected projects in Docker builds and PR checks ([eef7034](https://github.com/trodad-intl/prepexcellence/commit/eef70348c0f75de4e603276da100654ecc0bd52c))

## [1.1.0](https://github.com/trodad-intl/prepexcellence/compare/v1.0.0...v1.1.0) (2025-12-04)


### Features

* add pr-checks and deploy workflows with branch protection ([d10b1e8](https://github.com/trodad-intl/prepexcellence/commit/d10b1e8601d3ba422cc4ddee4255b7a5d9f6eb2f))

## 1.0.0 (2025-12-04)


### Features

* init ([c958b0e](https://github.com/trodad-intl/prepexcellence/commit/c958b0e05fc487ee027b8806bf0bbd62cd9620ab))


### Bug Fixes

* var in action to password ([dbec640](https://github.com/trodad-intl/prepexcellence/commit/dbec640a5b715bc2b69344c6ea8e56a4c776d741))
