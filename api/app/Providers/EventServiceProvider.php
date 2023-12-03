<?php

namespace App\Providers;

use App\Models\AttendanceStudent;
use App\Models\Chat;
use App\Models\Exam;
use App\Models\Order;
use App\Models\PushNotification;
use App\Models\StudentCourse;
use App\Models\User;
use App\Observers\AttendanceStudentObserver;
use App\Observers\ChatObserver;
use App\Observers\ExamObserver;
use App\Observers\OrderObserver;
use App\Observers\PushNotificationObserver;
use App\Observers\StudentCourseObserver;
use App\Observers\UserObserver;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];
    /**
     * The model observers for your application.
     *
     * @var array
     */
    protected $observers = [
        Chat::class => [ChatObserver::class],
        User::class => [UserObserver::class],
        StudentCourse::class => [StudentCourseObserver::class],
        Order::class => [OrderObserver::class],
        Exam::class => [ExamObserver::class],
        AttendanceStudent::class => [AttendanceStudentObserver::class],
        PushNotification::class => [PushNotificationObserver::class],
    ];
    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents()
    {
        return false;
    }
}
