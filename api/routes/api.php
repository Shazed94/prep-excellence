<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BankAccountController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ExpenseTypeController;
use App\Http\Controllers\Front\CartController;
use App\Http\Controllers\MenuPermissionController;
use App\Http\Controllers\PaymentTypeController;
use App\Http\Controllers\SubExpenseTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Karim007\LaravelCaptcha\Facades\Captcha;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/clear',function (){
    Artisan::call('cache:clear');
    Artisan::call('route:clear');
    Artisan::call('config:clear');
    Artisan::call('view:clear');
    Artisan::call('optimize:clear');
    //Artisan::call('passport:install');
    return "clear";
});

Route::get('/common/blood-group', [Karim007\LaravelCaptcha\Facades\Captcha::class,'index']);


Route::get('/common/blood-group', [App\Http\Controllers\BloodGroupController::class,'index']);
Route::get('/common/religion', [App\Http\Controllers\ReligionController::class,'index']);
Route::get('/common/gender', [App\Http\Controllers\GenderController::class,'index']);
Route::post('/login', [LoginController::class, 'authentication']);
Route::post('/frontend/login', [LoginController::class, 'authentication2']);
Route::post('/register', [LoginController::class, 'register']);
//Route::post('/submit-all-data/{id}', [LoginController::class, 'submitAllData']);

//Route::post('/broadcasting/auth', [LoginController::class, 'broadcast']);

Route::get('/email-verify/{id}', [LoginController::class, 'emailVerify'])->name('emailVerify');
Route::get('/resend-email-verify/{id}', [LoginController::class, 'resendVerifyLink'])->name('resendVerifyLink');
Route::get('/email-verify-check/{id}/{token}', [LoginController::class, 'emailVerifyCheck'])->name('emailVerifyCheck');

//forget password related route
Route::get('/forgot-password/{email}', [ForgotPasswordController::class, 'sendVerifyLink'])->name('sendVerifyLink');
Route::post('/forgot-password/verify/token', [ForgotPasswordController::class, 'verifyToken']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword'])->name('resetPassword');


/*Admin related routes*/

Route::group(['middleware' => ['history', 'auth:api']], function () {

    Route::get('/dashboard/report', [\App\Http\Controllers\DashboardController::class, 'report']);

    Route::get('/order/export', [App\Http\Controllers\OrderController::class,'export']);
    Route::apiResource('order', App\Http\Controllers\OrderController::class);

    Route::apiResource('role', App\Http\Controllers\RoleController::class);
    Route::put('/role/toggle/{role}', [App\Http\Controllers\RoleController::class, 'toggle']);

    Route::apiResource('menu', App\Http\Controllers\MenuController::class);
    Route::put('/menu/toggle/{menu}', [App\Http\Controllers\MenuController::class, 'toggle']);

    Route::apiResource('permission', App\Http\Controllers\PermissionController::class);
    Route::put('/permission/toggle/{permission}', [App\Http\Controllers\PermissionController::class, 'toggle']);

    Route::apiResource('role-menu-permission', App\Http\Controllers\RoleMenuPermissionController::class);

    Route::apiResource('gender', App\Http\Controllers\GenderController::class);
    Route::put('/gender/toggle/{gender}', [App\Http\Controllers\GenderController::class, 'toggle']);

    Route::apiResource('blood-group', App\Http\Controllers\BloodGroupController::class);
    #Route::put('blood-group/{blood_group}', [App\Http\Controllers\BloodGroupController::class, 'update'])->name('blood-group.update');
    Route::put('/blood-group/toggle/{blood_group}', [App\Http\Controllers\BloodGroupController::class, 'toggle'])->name('blood-group.toggle');

    Route::apiResource('religion', App\Http\Controllers\ReligionController::class);
    Route::put('/religion/toggle/{religion}', [App\Http\Controllers\ReligionController::class, 'toggle']);

    Route::apiResource('users', App\Http\Controllers\UserController::class);
    Route::put('/users/toggle/{user}', [App\Http\Controllers\UserController::class, 'toggle']);

    Route::get('menu-permission', [MenuPermissionController::class, 'index']);
    Route::post('menu-permission{role}', [MenuPermissionController::class, 'update']);
    Route::post('/menu-permission/user{user}', [MenuPermissionController::class, 'userPermissionUpdate']);

    Route::apiResource('menu-permission', App\Http\Controllers\MenuPermissionController::class);

    Route::apiResource('contact', App\Http\Controllers\ContactController::class);
    Route::get('/contact-us/export', [App\Http\Controllers\ContactUsController::class,'export']);
    Route::delete('/contact-us/{contact_us}', [App\Http\Controllers\ContactUsController::class,'destroy']);
    Route::apiResource('contact-us', App\Http\Controllers\ContactUsController::class);

    Route::apiResource('slider', App\Http\Controllers\SliderController::class);
    Route::post('/slider/position/update', [App\Http\Controllers\SliderController::class, 'positionUpdate']);
    Route::put('/slider/toggle/{slider}', [App\Http\Controllers\SliderController::class, 'toggle']);

    Route::apiResource('section-design-type', App\Http\Controllers\SectionDesignTypeController::class);
    Route::put('/section-design-type/toggle/{section_design_type}', [App\Http\Controllers\SectionDesignTypeController::class, 'toggle']);

    Route::apiResource('home-section', App\Http\Controllers\HomeSectionController::class);
    Route::post('/home/section/position/update', [App\Http\Controllers\HomeSectionController::class, 'positionUpdate']);
    Route::put('/home-section/toggle/{home_section}', [App\Http\Controllers\HomeSectionController::class, 'toggle']);

    Route::get('/promotion/export', [App\Http\Controllers\PromotionController::class,'export']);
    Route::apiResource('promotion', App\Http\Controllers\PromotionController::class);
    Route::put('/promotion/toggle/{promotion}', [App\Http\Controllers\PromotionController::class, 'toggle']);


    Route::apiResource('setting', App\Http\Controllers\SettingController::class);

    Route::get('/category/export', [App\Http\Controllers\CategoryController::class,'export']);
    Route::apiResource('category', App\Http\Controllers\CategoryController::class);
    Route::put('/category/toggle/{category}', [App\Http\Controllers\CategoryController::class, 'toggle']);

    Route::apiResource('gallery', App\Http\Controllers\GalleryController::class);
    Route::put('/gallery/toggle/{gallery}', [App\Http\Controllers\GalleryController::class, 'toggle']);

    Route::apiResource('gallery-item', App\Http\Controllers\GalleryItemController::class);
    Route::put('/gallery-item/toggle/{gallery_item}', [App\Http\Controllers\GalleryItemController::class, 'toggle']);

    Route::apiResource('p-menu', App\Http\Controllers\PMenuController::class);
    Route::put('/p-menu/toggle/{p_menu}', [App\Http\Controllers\PMenuController::class, 'toggle']);

    Route::apiResource('menu-item', App\Http\Controllers\MenuItemController::class);
    Route::get('/menu-item/find/by/menu/{p_menu}', [App\Http\Controllers\MenuItemController::class, 'findMenuList']);
    Route::post('/menu-item/rearrange', [App\Http\Controllers\MenuItemController::class, 'menuItemRearrange']);
    Route::put('/menu-item/toggle/{menu_item}', [App\Http\Controllers\MenuItemController::class, 'toggle']);

    Route::get('/widget/export', [App\Http\Controllers\WidgetController::class,'export']);
    Route::apiResource('widget', App\Http\Controllers\WidgetController::class);
    Route::put('/widget/toggle/{widget}', [App\Http\Controllers\WidgetController::class, 'toggle']);

    Route::get('/blog/export', [App\Http\Controllers\BlogController::class,'export']);
    Route::apiResource('blog', App\Http\Controllers\BlogController::class);
    Route::put('/blog/toggle/{blog}', [App\Http\Controllers\BlogController::class, 'toggle']);

    Route::get('/page/export', [App\Http\Controllers\PageController::class,'export']);
    Route::apiResource('page', App\Http\Controllers\PageController::class);
    Route::put('/page/toggle/{page}', [App\Http\Controllers\PageController::class, 'toggle']);

    Route::get('/testimonial/export', [App\Http\Controllers\TestimonialController::class,'export']);
    Route::apiResource('testimonial', App\Http\Controllers\TestimonialController::class);
    Route::put('/testimonial/toggle/{testimonial}', [App\Http\Controllers\TestimonialController::class, 'toggle']);


    Route::get('/faq/export', [App\Http\Controllers\FaqController::class,'export']);
    Route::apiResource('faq', App\Http\Controllers\FaqController::class);
    Route::put('/faq/toggle/{faq}', [App\Http\Controllers\FaqController::class, 'toggle']);

    Route::apiResource('designation', App\Http\Controllers\DesignationController::class);
    Route::put('/designation/toggle/{designation}', [App\Http\Controllers\DesignationController::class, 'toggle']);

    Route::apiResource('marital-status', App\Http\Controllers\MaritalStatusController::class);
    Route::put('/marital-status/toggle/{marital_status}', [App\Http\Controllers\MaritalStatusController::class, 'toggle']);

    Route::get('/employee/export', [App\Http\Controllers\EmployeeController::class,'export']);
    Route::apiResource('employee', App\Http\Controllers\EmployeeController::class);
    Route::put('/employee/toggle/{employee}', [App\Http\Controllers\EmployeeController::class, 'toggle']);
    Route::get('/employee/all/active', [App\Http\Controllers\EmployeeController::class, 'allEmployeeActive']);

    Route::get('/parent/export', [App\Http\Controllers\ParentController::class,'export']);
    Route::apiResource('parent', App\Http\Controllers\ParentController::class);
    Route::put('/parent/toggle/{parent}', [App\Http\Controllers\ParentController::class, 'toggle']);
    Route::get('/parent/find/by/{email}', [App\Http\Controllers\ParentController::class, 'findByEmail']);

    Route::get('/student/export', [App\Http\Controllers\StudentController::class,'export']);
    Route::apiResource('student', App\Http\Controllers\StudentController::class);
    Route::put('/student/toggle/{student}', [App\Http\Controllers\StudentController::class, 'toggle']);
    Route::get('/student/courses/by/{student}', [App\Http\Controllers\StudentController::class, 'studentCourses']);

    Route::apiResource('sibling', App\Http\Controllers\SiblingController::class);

    Route::apiResource('work-experience', App\Http\Controllers\WorkExperienceController::class);

    Route::apiResource('employee-qualification', App\Http\Controllers\EmployeeQualificationController::class);

    Route::get('/course-type/export', [App\Http\Controllers\CourseTypeController::class,'export']);
    Route::apiResource('course-type', App\Http\Controllers\CourseTypeController::class);
    Route::put('/course-type/toggle/{course_type}', [App\Http\Controllers\CourseTypeController::class, 'toggle']);

    Route::get('/course/export', [App\Http\Controllers\CourseController::class,'export']);
    Route::apiResource('course', App\Http\Controllers\CourseController::class);
    Route::get('/only/course', [App\Http\Controllers\CourseController::class, 'onlyCourse']);
    Route::put('/course/toggle/{course}', [App\Http\Controllers\CourseController::class, 'toggle']);
    Route::get('/admin/course/schedule', [App\Http\Controllers\CourseController::class, 'schedules']);
    Route::post('/additional/course/schedule/store{course}', [App\Http\Controllers\CourseController::class, 'additionalScheduleStore']);

    Route::get('/coupon/export', [App\Http\Controllers\CouponController::class,'export']);
    Route::apiResource('coupon', App\Http\Controllers\CouponController::class);
    Route::put('/coupon/toggle/{coupon}', [App\Http\Controllers\CouponController::class, 'toggle']);


    Route::get('/course-category/export', [App\Http\Controllers\CourseCategoryController::class,'export']);
    Route::apiResource('course-category', App\Http\Controllers\CourseCategoryController::class);
    Route::put('/course-category/toggle/{course_category}', [App\Http\Controllers\CourseCategoryController::class, 'toggle']);

    Route::apiResource('course-schedule', App\Http\Controllers\CourseScheduleController::class);
    Route::post('/course-schedule/classlink/update{course_schedule}', [App\Http\Controllers\CourseScheduleController::class,'addClassLink']);
    Route::get('/course-schedule/cancel/request', [App\Http\Controllers\CourseScheduleController::class,'scheduleCancelRequest']);
    Route::post('/course-schedule/cancel/request/{course_schedule_cancel}', [App\Http\Controllers\CourseScheduleController::class,'scheduleCancelOrApprove']);
    Route::post('/course-schedule/get/by/date/and/employee', [App\Http\Controllers\CourseScheduleController::class,'courseSchedules']);

    Route::get('/student-course/export', [App\Http\Controllers\StudentCourseController::class,'export']);
    Route::apiResource('student-course', App\Http\Controllers\StudentCourseController::class);
    Route::put('/student-course/toggle/{student_course}', [App\Http\Controllers\StudentCourseController::class, 'toggle']);
    Route::put('/student-course/approved/decline/{student_course}', [App\Http\Controllers\StudentCourseController::class, 'approveOrDecline']);

    Route::apiResource('course-material', App\Http\Controllers\CourseMaterialController::class);

    Route::apiResource('home-work', App\Http\Controllers\HomeWorkController::class);

    Route::apiResource('student-home-work', App\Http\Controllers\StudentHomeWorkController::class);

    Route::apiResource('course-review', App\Http\Controllers\CourseReviewController::class);

    Route::apiResource('course-rating', App\Http\Controllers\CourseRatingController::class);

    Route::get('/p-menu/menu/arrange', [App\Http\Controllers\PMenuController::class, 'menuArrange']);

    Route::apiResource('/bbb-employee/exams', \App\Http\Controllers\ExamController::class);
    Route::post('/bbb-employee/exams/clone/{exam}', [\App\Http\Controllers\ExamController::class, 'examClone']);
    Route::put('/bbb-employee/exams/toggle/{exam}', [\App\Http\Controllers\ExamController::class, 'toggle']);
    Route::get('/exams/result', [\App\Http\Controllers\ExamController::class, 'results']);


    Route::apiResource('exam-question', \App\Http\Controllers\ExamQuestionController::class);
    Route::post('/exam-question/single/store', [\App\Http\Controllers\ExamQuestionController::class,'singleStore']);
    Route::get('/exam-question/by/exam/{exam}', [\App\Http\Controllers\ExamQuestionController::class,'questionByExamId']);

    Route::apiResource('/sat-exam/test/score', \App\Http\Controllers\SatSectionController::class);
    Route::get('/sat-exam/score/section', [\App\Http\Controllers\SatSectionController::class,'index2']);
    Route::put('/sat-exam/test/score/{sat_section}', [\App\Http\Controllers\SatSectionController::class,'update']);
    Route::put('/sat-exam/test/score/toggle/{sat_section}', [\App\Http\Controllers\SatSectionController::class,'toggle']);

    Route::post('/ckeditor/upload/file', [\App\Http\Controllers\CommonController::class,'ckImageUpload']);

    Route::get('/s-m-s/export', [App\Http\Controllers\SMSController::class,'export']);
    Route::apiResource('/s-m-s', App\Http\Controllers\SMSController::class);

    Route::get('/email/export', [App\Http\Controllers\EmailController::class,'export']);
    Route::apiResource('/email', App\Http\Controllers\EmailController::class);

    Route::get('/push-notification/export', [App\Http\Controllers\PushNotificationController::class,'export']);
    Route::apiResource('/push-notification', App\Http\Controllers\PushNotificationController::class);

    Route::apiResource('/employee-working', App\Http\Controllers\EmployeeWorkingController::class);
    Route::get('/export/employee-working', [App\Http\Controllers\EmployeeWorkingController::class,'export']);
    Route::get('/employee-working/by/{employee}', [App\Http\Controllers\EmployeeWorkingController::class,'employeeWorks']);
    Route::get('/employee-working/employee/wise', [App\Http\Controllers\EmployeeWorkingController::class,'index2']);

    Route::apiResource('/employee-over-time', App\Http\Controllers\EmployeeOverTimeController::class);
    Route::get('/export/employee-over-time', [App\Http\Controllers\EmployeeOverTimeController::class,'export']);
    Route::get('/employee-over-time/by/{employee}', [App\Http\Controllers\EmployeeOverTimeController::class,'employeeOverTime']);

    Route::apiResource('/employee-payment', \App\Http\Controllers\EmployeePaymentController::class);
    Route::get('/export/employee-payment', [App\Http\Controllers\EmployeePaymentController::class, 'export']);
    Route::put('/employee-payment/toggle/{employee_payment}', [App\Http\Controllers\EmployeePaymentController::class, 'toggle']);
    Route::post('/employee-payment/prepare/bill', [App\Http\Controllers\EmployeePaymentController::class,'prepareBill']);
    Route::post('/employee-payment/prepare/bill2', [App\Http\Controllers\EmployeePaymentController::class,'prepareBill2']);

    Route::get('/complain/export', [App\Http\Controllers\ComplainController::class,'export']);
    Route::apiResource('/complain', App\Http\Controllers\ComplainController::class);
    Route::get('/tutoring/export', [App\Http\Controllers\TutoringController::class,'export']);
    Route::apiResource('/tutoring', App\Http\Controllers\TutoringController::class);
    Route::post('/tutoring/fee/store/update', [App\Http\Controllers\TutoringController::class,'tutoringFeeStoreOrUpdate']);
    Route::get('/get/tutoring/fee/hourly', [App\Http\Controllers\TutoringController::class,'tutoringHourlyRate']);

    Route::get('/job/export', [App\Http\Controllers\JobController::class,'export']);
    Route::apiResource('/job', App\Http\Controllers\JobController::class);
    Route::put('/job/toggle/{job}', [\App\Http\Controllers\JobController::class, 'toggle']);

    Route::get('/applicant/export', [App\Http\Controllers\ApplicantController::class,'export']);
    Route::apiResource('/applicant', App\Http\Controllers\ApplicantController::class);
    Route::get('/only/job/list', [App\Http\Controllers\ApplicantController::class,'getOnlyJobs']);
    Route::put('/applicant/status/change/{applicant}/{status}', [App\Http\Controllers\ApplicantController::class,'statusChange']);

    /*
     * expense related routes
     * */
    Route::get('/bank/export', [BankController::class, 'export']);
    Route::get('/bank/toggle/{bank}', [BankController::class, 'toggle']);
    Route::apiResource('bank', BankController::class);

    Route::get('/bank-account/export', [BankAccountController::class, 'export']);
    Route::get('/bank-account/toggle/{bankAccount}', [BankAccountController::class, 'toggle']);
    Route::apiResource('bank-account', BankAccountController::class);

    Route::get('/payment-type/export', [PaymentTypeController::class, 'export']);
    Route::get('/payment-type/toggle/{paymentType}', [PaymentTypeController::class, 'toggle']);
    Route::apiResource('payment-type', PaymentTypeController::class);

    Route::get('/expense-type/export', [ExpenseTypeController::class, 'export']);
    Route::get('/expense-type/toggle/{expenseType}', [ExpenseTypeController::class, 'toggle']);
    Route::apiResource('expense-type', ExpenseTypeController::class);

    Route::get('/sub-expense-type/export', [SubExpenseTypeController::class, 'export']);
    Route::get('/sub-expense-type/toggle/{subExpenseType}', [SubExpenseTypeController::class, 'toggle']);
    Route::apiResource('sub-expense-type', SubExpenseTypeController::class);

    Route::get('/expense/export', [ExpenseController::class, 'export']);
    //Route::get('expense/reports', [ExpenseController::class, 'report']);
    Route::get('/expense/toggle/{expense}', [ExpenseController::class, 'toggle']);
    Route::apiResource('expense', ExpenseController::class);

    Route::apiResource('blog-comment', App\Http\Controllers\BlogCommentController::class);
    Route::put('/blog-comment/status/change/{blog_comment}/{status}', [App\Http\Controllers\BlogCommentController::class,'statusChange']);

    Route::apiResource('advisor', App\Http\Controllers\AdvisorController::class);
    Route::put('/advisor/toggle/{advisor}', [App\Http\Controllers\AdvisorController::class,'toggle']);

    Route::apiResource('tutorial-category', App\Http\Controllers\TutorialCategoryController::class);
    Route::put('/tutorial-category/toggle/{tutorial_category}', [App\Http\Controllers\TutorialCategoryController::class,'toggle']);
    Route::get('/tutorial-category/arranged/list', [App\Http\Controllers\TutorialCategoryController::class,'index2']);
    Route::post('/tutorial-category/rearrange', [App\Http\Controllers\TutorialCategoryController::class,'itemRearrange']);
    Route::get('/tutorial-category/with/tutorials', [App\Http\Controllers\TutorialCategoryController::class,'categoryWithTutorials']);

    Route::apiResource('tutorial', App\Http\Controllers\TutorialController::class);
    Route::put('/tutorial/toggle/{tutorial}', [App\Http\Controllers\TutorialController::class,'toggle']);

});

/*
 * this is basic auth route for all user access
 * */
Route::group(['middleware' => ['history', 'auth:api']], function () {
    Route::controller(AuthController::class)->group(function () {
        Route::get('/user', 'user');
        Route::get('/user-details', 'userDetails');
        Route::put('/user/update', 'update');
        Route::post('/password/reset', 'updatePassword');
    });

    Route::post('/submit-all-data', [LoginController::class, 'submitAllData']);

    Route::get('/sat/question/qualities', [App\Http\Controllers\CommonController::class, 'question_Qualities']);
    Route::get('/sat/all/keys', [App\Http\Controllers\CommonController::class, 'allKeys']);
    Route::get('/sat/keys', [App\Http\Controllers\CommonController::class, 'satKey']);
    Route::get('/sat/sub/score', [App\Http\Controllers\CommonController::class, 'sub_scores']);
    Route::get('/sat/cross/test/score', [App\Http\Controllers\CommonController::class, 'cross_testScore']);
    Route::get('/sat/exams', [App\Http\Controllers\CommonController::class, 'sat_exams']);
    Route::get('/all/employee/basic/info', [App\Http\Controllers\CommonController::class, 'getAllEmployees']);
    Route::get('/all/authors', [App\Http\Controllers\CommonController::class, 'getAllAuthors']);
    Route::get('/user/notification', [App\Http\Controllers\AuthCommonController::class,'notifications']);
    Route::get('/common/course/types', [App\Http\Controllers\CommonController::class,'courseTypes']);

    Route::get('/user/complain/export', [App\Http\Controllers\AuthCommon\ComplainController::class,'export']);
    Route::apiResource('/user/complain', App\Http\Controllers\AuthCommon\ComplainController::class);

    Route::apiResource('chat-group', App\Http\Controllers\ChatGroupController::class);
    Route::apiResource('chat-file', App\Http\Controllers\ChatFileController::class);
    Route::apiResource('chat', App\Http\Controllers\ChatController::class);
    Route::get('/chat/by/{user}', [App\Http\Controllers\ChatController::class,'index2']);
    Route::post('/user/seen/message/sender/{sender_id}', [App\Http\Controllers\ChatController::class,'makeSeenMessage']);
    Route::apiResource('chat-user', App\Http\Controllers\ChatUserController::class);

    Route::post('/password/update', [App\Http\Controllers\Auth\ChangePasswordController::class, 'changePassword']);
    Route::post('/update/push/notification/{push_notification}', [App\Http\Controllers\PushNotificationController::class, 'notificationSeen']);

});

/*student access related route*/
Route::group(['prefix'=>'/student/','middleware' => ['history', 'auth:api']], function () {
    Route::get('all/course', [App\Http\Controllers\Student\StudentCourseController::class, 'index']);
    Route::get('course/schedule', [App\Http\Controllers\Student\StudentCourseController::class, 'studentSchedules']);
    Route::get('home/works', [App\Http\Controllers\Student\StudentCourseController::class, 'homeWorks']);
    Route::post('home/work/submit{home_work}', [App\Http\Controllers\Student\StudentCourseController::class, 'homeWorkSubmit']);
    Route::get('course/materials', [App\Http\Controllers\Student\StudentCourseController::class, 'courseMaterials']);
    Route::get('course/attendance', [App\Http\Controllers\Student\StudentCourseController::class, 'attendances']);
    Route::get('course/exam', [App\Http\Controllers\Student\StudentCourseController::class, 'exams']);
    Route::get('dashboard/info', [App\Http\Controllers\Student\StudentCourseController::class, 'dashbaord']);

    Route::get('all/orders', [App\Http\Controllers\Student\StudentCourseController::class, 'orders']);

    Route::get('exam/question/{exam}', [App\Http\Controllers\Student\StudentExamController::class, 'studentExamQuestions']);
    Route::get('exam/question/with/answer/{exam}', [App\Http\Controllers\Student\StudentExamController::class, 'studentExamQuestionWithAnswer']);
    Route::get('exam/{exam}', [App\Http\Controllers\Student\StudentExamController::class, 'studentExam']);
    Route::post('exam/answer/submit', [App\Http\Controllers\Student\StudentExamController::class, 'studentAnswerSubmit']);
    Route::post('exam/answer/by{exam}', [App\Http\Controllers\Student\StudentExamController::class, 'storeUpdateAnswer']);

    Route::get('tutoring-form', [\App\Http\Controllers\Student\StudentTutoringController::class, 'index']);
    Route::post('tutoring-form/submit', [\App\Http\Controllers\Student\StudentTutoringController::class, 'store']);
    Route::post('tutoring/student/payment/{tutoring}', [\App\Http\Controllers\Student\StudentTutoringController::class, 'payment']);

    Route::post('place-order', [\App\Http\Controllers\Front\CartController::class, 'placeOrder']);
    Route::post('coupon/check/{coupon}', [\App\Http\Controllers\Front\CartController::class, 'checkCoupon']);
});

//order validate and student order payment
Route::post('/student/order/payment/validate/{order_id}', [\App\Http\Controllers\Front\CartController::class, 'orderValidate']);
Route::post('/student/order/payment/strip/{order}', [\App\Http\Controllers\Front\CartController::class, 'stripePayment']);


/*student access related route*/
Route::group(['prefix'=>'/parent/','middleware' => ['history', 'auth:api']], function () {
    /*parent routes*/
    Route::get('course/result', [App\Http\Controllers\Student\StudentParentController::class, 'exam']);
    Route::get('parent/child/info', [App\Http\Controllers\Student\StudentParentController::class, 'childInfos']);
    Route::get('result/{exam}', [App\Http\Controllers\Student\StudentParentController::class, 'studentExam']);

});

/*
 * stripe payment for tutoring callback success
 * */
Route::get('/tutoring/student/payment/{tnx}', [\App\Http\Controllers\Student\StudentTutoringController::class, 'paymentSuccess']);

/*employee/tutor access related route*/
Route::group(['prefix'=>'/employee/','middleware' => ['history', 'auth:api']], function () {
    Route::get('all/course', [App\Http\Controllers\Employee\EmployeeCourseController::class, 'index']);
    Route::get('only/course', [App\Http\Controllers\Employee\EmployeeCourseController::class, 'getEmployeeCourses']);
    Route::post('course/schedule/statusChange/{course_schedule}/{status}', [App\Http\Controllers\Employee\EmployeeCourseController::class, 'statusChange']);
    Route::get('course/schedule', [App\Http\Controllers\Employee\EmployeeCourseController::class, 'employeeSchedules']);
    Route::post('course/schedule/add{course}', [App\Http\Controllers\Employee\EmployeeCourseController::class, 'employeeScheduleAdd']);

    Route::get('course/material', [App\Http\Controllers\Employee\EmployeeCourseMaterialController::class, 'index']);
    Route::post('course/material', [App\Http\Controllers\Employee\EmployeeCourseMaterialController::class, 'store']);
    Route::put('course/material/{course_material}', [App\Http\Controllers\Employee\EmployeeCourseMaterialController::class, 'update']);
    Route::put('course/material/toggle/{course_material}', [App\Http\Controllers\Employee\EmployeeCourseMaterialController::class, 'toggle']);
    Route::delete('course/material/{course_material}', [App\Http\Controllers\Employee\EmployeeCourseMaterialController::class, 'destroy']);

    Route::get('home/work', [\App\Http\Controllers\Employee\EmployeeHomeWorkController::class, 'index']);
    Route::post('home/work', [\App\Http\Controllers\Employee\EmployeeHomeWorkController::class, 'store']);
    Route::put('home/work/{home_work}', [\App\Http\Controllers\Employee\EmployeeHomeWorkController::class, 'update']);
    Route::put('home/work/toggle/{home_work}', [\App\Http\Controllers\Employee\EmployeeHomeWorkController::class, 'toggle']);
    Route::delete('home/work/{home_work}', [\App\Http\Controllers\Employee\EmployeeHomeWorkController::class, 'destroy']);
    Route::put('home/work/mark/upload/{student_home_work}', [\App\Http\Controllers\Employee\EmployeeHomeWorkController::class, 'uploadMark']);

    Route::get('attendance/statuses', [\App\Http\Controllers\Employee\StudentAttendanceController::class, 'getAtStatus']);
    Route::get('get/students{course}', [\App\Http\Controllers\Employee\StudentAttendanceController::class, 'students']);
    Route::post('attendance/store', [\App\Http\Controllers\Employee\StudentAttendanceController::class, 'store']);
    Route::get('attendance/find{course}/{course_schedule}', [App\Http\Controllers\Employee\StudentAttendanceController::class, 'findAttendances']);

    Route::apiResource('bbb-employee/exams', \App\Http\Controllers\Employee\ExamController::class);
    Route::post('bbb-employee/exams/clone/{exam}', [\App\Http\Controllers\Employee\ExamController::class, 'examClone']);
    Route::put('bbb-employee/exams/toggle/{exam}', [\App\Http\Controllers\Employee\ExamController::class, 'toggle']);
    Route::get('exams/result', [\App\Http\Controllers\Employee\ExamController::class, 'results']);

    Route::apiResource('question-bank', \App\Http\Controllers\QuestionBankController::class);
    Route::apiResource('exam-question', \App\Http\Controllers\Employee\ExamQuestionController::class);
    Route::post('exam-question/single/store', [\App\Http\Controllers\Employee\ExamQuestionController::class,'singleStore']);
    Route::post('ckeditor/upload/file', [\App\Http\Controllers\Employee\ExamQuestionController::class,'uploadFileCkeditor']);
    Route::get('exam-question/by/exam/{exam}', [\App\Http\Controllers\Employee\ExamQuestionController::class,'questionByExamId']);
    Route::apiResource('student-answer', \App\Http\Controllers\StudentAnswerController::class);

    Route::apiResource('billing/employee-over-time', \App\Http\Controllers\Employee\EmployeeOverTimeController::class);
    Route::get('billing/working-hour', [\App\Http\Controllers\Employee\EmployeeWorkingController::class,'index']);
    Route::get('billing/working-hour/export', [\App\Http\Controllers\Employee\EmployeeWorkingController::class,'export']);
    Route::get('billing/payment', [\App\Http\Controllers\Employee\EmployeePaymentController::class,'index']);

});

/*public site related route*/

Route::group(['middleware' => ['history']], function () {

    Route::get('/get/student/all/course', [\App\Http\Controllers\Front\PageController::class, 'courseSearch']);
    Route::get('/get/all/settings', [\App\Http\Controllers\Front\PageController::class, 'settings']);
    Route::get('/get/menu/by{p_menu}', [\App\Http\Controllers\Front\PageController::class, 'menus']);
    Route::get('/get/sliders', [\App\Http\Controllers\Front\PageController::class, 'slider']);
    Route::get('/get/course/categories', [\App\Http\Controllers\Front\PageController::class, 'categories']);

    Route::get('/get/home/sections', [\App\Http\Controllers\Front\PageController::class, 'homeSections']);

    Route::get('/get/all/news', [\App\Http\Controllers\Front\PageController::class, 'news']);
    Route::get('/get/single/new/{blog}', [\App\Http\Controllers\Front\PageController::class, 'singleNews']);

    Route::get('/get/single/page/{slug}', [\App\Http\Controllers\Front\PageController::class, 'singlePage']);

    Route::get('/get/all/course', [\App\Http\Controllers\Front\PageController::class, 'courses']);
    Route::get('/get/single/course/{course}', [\App\Http\Controllers\Front\PageController::class, 'singleCourse']);

    Route::get('/get/all/instructor', [\App\Http\Controllers\Front\PageController::class, 'instructor']);
    Route::get('/get/single/instructor/{employee}', [\App\Http\Controllers\Front\PageController::class, 'singleInstructor']);

    Route::get('/get/all/promotion', [\App\Http\Controllers\Front\PageController::class, 'promotion']);

    Route::get('/get/all/widgets', [\App\Http\Controllers\Front\PageController::class, 'widgets']);
    Route::get('/get/all/faqs', [\App\Http\Controllers\Front\PageController::class, 'faqs']);
    Route::get('/get/all/college/advisors', [\App\Http\Controllers\Front\PageController::class, 'CollegeAdvisor']);

    Route::get('/get/all/testimonial', [\App\Http\Controllers\Front\FrontTestimonialController::class, 'index']);
    Route::post('/front/testimonial/store', [\App\Http\Controllers\Front\FrontTestimonialController::class, 'store']);
    Route::get('/get/single/{testimonial}', [\App\Http\Controllers\Front\FrontTestimonialController::class, 'show']);

    Route::get('/get/all/jobs', [\App\Http\Controllers\Front\ApplicantController::class, 'jobs']);
    Route::get('/get/single/job/{job}', [\App\Http\Controllers\Front\ApplicantController::class, 'singleJob']);
    Route::post('/public/job/application', [\App\Http\Controllers\Front\ApplicantController::class, 'store']);

    Route::get('get-cart-courses', [\App\Http\Controllers\Front\CartController::class, 'getCartCourses']);
    Route::get('/public/course/categories', [\App\Http\Controllers\Front\CommonController::class, 'courseCategories']);

    Route::get('/captcha',function (){
        return Captcha::getView();
    });
    Route::post('/contact-form/submit', [\App\Http\Controllers\Front\ContactUsController::class, 'store']);
    Route::post('/contact-form2/submit', [\App\Http\Controllers\Front\ContactUsController::class, 'store2']);

    Route::post('/blog/comment/submit', [\App\Http\Controllers\Front\BlogCommentController::class, 'store']);

    Route::get('/common/tutoring/fee', [App\Http\Controllers\Front\CommonController::class,'tutoringHourlyRate']);

});
