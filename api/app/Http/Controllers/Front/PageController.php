<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdvisorCollection;
use App\Http\Resources\BlogCollection;
use App\Http\Resources\BlogResource;
use App\Http\Resources\CourseCategoryCollection;
use App\Http\Resources\CourseCategoryResource;
use App\Http\Resources\CourseCollection;
use App\Http\Resources\CourseResource;
use App\Http\Resources\EmployeeCollection;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\FaqCollection;
use App\Http\Resources\FaqResource;
use App\Http\Resources\HomeSectionCollection;
use App\Http\Resources\PageResource;
use App\Http\Resources\PromotionCollection;
use App\Http\Resources\SettingCollection;
use App\Http\Resources\SliderCollection;
use App\Http\Resources\WidgetCollection;
use App\Models\Advisor;
use App\Models\Blog;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\Employee;
use App\Models\Faq;
use App\Models\HomeSection;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\PMenu;
use App\Models\Promotion;
use App\Models\Setting;
use App\Models\Slider;
use App\Models\Widget;
use App\Traits\CommonTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Ramsey\Collection\GenericArray;
use Stripe;
class PageController extends Controller
{
    use CommonTrait;

    public function courseSearch(Request $request)
    {
        //$new_courses = Cache::remember('course', 600, function() {
            $courses = Course::where(['course_type'=>1,'is_active'=>1])->get();
            //return new CourseCollection($courses);
            $courses = new CourseCollection($courses);
        //});
        return response()->json($courses,200);
    }
    public function settings()
    {
        $settings = Setting::all();
        return new SettingCollection($settings);
    }
    public function menus(PMenu $PMenu)
    {
        //$menus = Cache::remember('menus'.$PMenu->id, 600, function() use ($PMenu) {
            $menus = MenuItem::where(['status'=>1,'p_menu_id'=>$PMenu->id])->orderBy('position', 'ASC')->get()->toArray();
            $mm=[];
            foreach ($menus as $key=>$menu){
                if ($menu['relation_with']=='page'){
                    $menu['page']=Page::find($menu['relation_id'])??null;
                }
                $mm[] = $menu;
            }
            $menus =  $this->prepareMenu($mm);
            //return $this->prepareMenu($mm);
        //});
        //return response()->json($menus,200);
        return response()->json($menus,200);
    }

    public function slider()
    {
        $sliders = Cache::remember('sliders', 600, function() {
            return Slider::where(['status' => 1])->orderBy('position', 'ASC')->get();
        });
        return new SliderCollection($sliders);
    }

    public function categories()
    {
        $cats = Cache::remember('course_categories', 600, function() {
            return CourseCategory::has('courses', '>', 0)->where(['is_active' => 1])->orderBy('position', 'ASC')->get();
        });
        return new CourseCategoryCollection($cats);
    }

    public function homeSections()
    {
        $new_sections = Cache::remember('homeSections', 600, function() {
            $home_sections = HomeSection::where(['status' => 1])->orderBy('position', 'ASC')->get();
            return new HomeSectionCollection($home_sections);
        });
        return response()->json($new_sections,200);
    }

    public function news(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 4;
        $search = request('search');
        $blogs = Blog::query();
        if ($search) {
            $blogs->whereLike(['title','description'], $search);
        }
        $blogs = $blogs->with(['user','category'])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new BlogCollection($blogs);
    }

    public function singleNews(Request $request, Blog $blog)
    {
        $b_comments = $blog->blogComments()->where('status','approved')->orderBy('id','ASC')->get();
        $comments =  $this->prepareComment($b_comments->toArray());
        $total_comment =count($b_comments);
        $blog = $blog->with(['user:id,first_name,last_name,userable_id,userable_type','category:id,title','user.userable:id'])->where('id',$blog->id)->first()->toArray();
        $blog['blogComments'] = $this->prepareComment($comments);
        $blog['comment_count'] = $total_comment;
        return response()->json(['data'=>$blog],200);
    }

    public function singlePage($slug)
    {
        $page = Page::where(['slug'=>$slug])->first();
        return new PageResource($page);
    }

    public function courses(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $category = request('category');
        $course = Course::query();
        if ($category){
            $category =CourseCategory::find($category);
            if (isset($category->id)) $course_ids = $category->courses()->pluck('courses.id');
            if (isset($course_ids)) $course->whereIn('id', $course_ids);
        }
        if ($search) {
            $course->whereLike(['name','batch'], $search);
        }
        $course->where('is_active',1);
        //$course->whereDate('end_date','>=',Carbon::today());
        $course=$course->with(['employees.userable','studentCourses'])
            ->withCount('studentCourses')
            ->where(['is_active'=>1,'course_type'=>1])
            ->orderBy('student_courses_count','DESC')
            ->paginate($itemsPerPage);
        return new CourseCollection($course);
    }

    public function singleCourse(Request $request, Course $course)
    {
        return new CourseResource($course->load(['employees.userable','courseCategories','courseType',
            'courseSchedules'=>function($q){
                $q->orderBy('date','ASC')->get();
            },
            'updatedBy'])->loadCount(['studentCourses']));
    }

    public function instructor(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $employees = Employee::query();
        $employees->where('id','!=',1);
        $employees->where('is_active',1);
        if ($search) {
            $employees->whereLike(['employee_id','userable.name','userable.email'], $search);
        }
        $employees = $employees->with(['userable','userable.role',
            'designation','employeeQualifications','workExperiences'])->paginate($itemsPerPage);
        return new EmployeeCollection($employees);
    }
    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Employee $employee
     * @return \App\Http\Resources\EmployeeResource
     */
    public function singleInstructor(Request $request, Employee $employee)
    {
        return new EmployeeResource($employee->load(['userable', 'userable.role',
            'designation','employeeQualifications','workExperiences']));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\PromotionCollection
     */
    public function promotion(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $promotions = Promotion::query();
        if ($search) {
            $promotions->whereLike(['first_name','last_name','email'], $search);
        }
        $promotions = $promotions->orderBy('position','ASC')->paginate($itemsPerPage);

        return new PromotionCollection($promotions);
    }

    public function widgets()
    {
        $widgets = Cache::remember('widgets', 600, function() {
            $widgets = []; //with(['pMenu.menuItems'])->
            $c_widgets = Widget::where(['status' => 1])->orderBy('position', 'ASC')->get(['id', 'placement',
                'title',
                'type',
                'text',
                'p_menu_id'])->toArray();
            foreach ($c_widgets as $wd) {
                if ($wd['type'] == 1) $widgets[] = $wd;
                else {
                    $menus = MenuItem::where(['status' => 1, 'p_menu_id' => $wd['p_menu_id']])->orderBy('position', 'ASC')->get(['id', 'p_menu_id',
                        'name',
                        'url',
                        'relation_id',
                        'relation_with',
                        'menu_item_id'])->toArray();
                    $mm = [];
                    foreach ($menus as $menu) {
                        if ($menu['relation_with'] == 'page') {
                            $page = Page::find($menu['relation_id']);
                            $menu['name'] = isset($page->id) ? $page->title : null;
                            $menu['url'] = isset($page->id) ? '/page/' . $page->slug : null;
                        }
                        $mm[] = $menu;
                    }
                    $wd['items'] = $mm;
                    $widgets[] = $wd;
                }
            }
            return $widgets;
        });

        return response()->json(['data'=>$widgets],200);
    }

    public function faqs(Request $request)
    {
        $faqs = Faq::where('status',1)->get();
        return new FaqCollection($faqs);
    }

    public function CollegeAdvisor(Request $request)
    {
        $advs = Advisor::where('is_active',1)->get();
        return new AdvisorCollection($advs);
    }
}
