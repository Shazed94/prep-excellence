<?php

namespace App\Http\Controllers;

use App\Http\Requests\SettingStoreRequest;
use App\Http\Requests\SettingUpdateRequest;
use App\Http\Resources\SettingCollection;
use App\Http\Resources\SettingResource;
use App\Models\Setting;
use App\Traits\CommonTrait;
use App\Traits\FileUploadTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    use CommonTrait, FileUploadTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\SettingCollection
     */
    public function index(Request $request)
    {
        $settings = Setting::all();

        return new SettingCollection($settings);
    }

    /**
     * @param \App\Http\Requests\SettingStoreRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(SettingStoreRequest $request)
    {
        //return response()->json('working');
        $where = array();
        if ($request->group == 'general'){
            $where['group'] = 'general';
            if ($request->input('title')){
                $where['name'] = 'title';
                $insert['value'] = $request->title;
                Setting::updateOrInsert($where, $insert);

            }

            if ($request->input('slogan')){
                $where['name'] = 'slogan';
                $insert['value'] = $request->slogan;
                Setting::updateOrInsert($where, $insert);
            }

            if ($request->input('mobile_number')){
                $where['name'] = 'mobile_number';
                $insert['value'] = $request->mobile_number;
                Setting::updateOrInsert($where, $insert);

            }

            if ($request->input('email')){
                $where['name'] = 'email';
                $insert['value'] = $request->email;
                Setting::updateOrInsert($where, $insert);
            }

            if ($request->input('tel')){
                $where['name'] = 'tel';
                $insert['value'] = $request->tel;
                Setting::updateOrInsert($where, $insert);
            }

            if ($request->input('copyright')){
                $where['name'] = 'copyright';
                $insert['value'] = $request->copyright;
                Setting::updateOrInsert($where, $insert);
            }

            if ($request->input('city')){
                $where['name'] = 'city';
                $insert['value'] = $request->city;
                Setting::updateOrInsert($where, $insert);
            }

            if ($request->input('state')){
                $where['name'] = 'state';
                $insert['value'] = $request->state;
                Setting::updateOrInsert($where, $insert);
            }

            if ($request->input('country')){
                $where['name'] = 'country';
                $insert['value'] = $request->country;
                Setting::updateOrInsert($where, $insert);
            }

            if ($request->input('zip')){
                $where['name'] = 'zip';
                $insert['value'] = $request->zip;
                Setting::updateOrInsert($where, $insert);
            }

            if ($request->input('street')){
                $where['name'] = 'street';
                $insert['value'] = $request->street;
                Setting::updateOrInsert($where, $insert);
            }
            if ($request->input('map')){
                $where['name'] = 'map';
                $insert['value'] = $request->map;
                Setting::updateOrInsert($where, $insert);
            }

            // Update Logo
            if($request->file('logo')){

                $path="settings";

                $destination = $this->imageUpload($request->file('logo'),'settings','799','351');

                // Store logo
                $where['name'] = 'logo';
                $insert['value'] = $destination;
                Setting::updateOrInsert($where, $insert);
            }

            // Update Favicon
            if($request->file('favicon')){
                // Delete Old
                $destination = $this->imageUpload($request->file('favicon'),'settings','200','200');
                // Store favicon
                $where['name'] = 'favicon';
                $insert['value'] = $destination;
                Setting::updateOrInsert($where, $insert);
            }

            // Update OG
            if($request->file('og_image')){
                $destination = $this->imageUpload($request->file('og_image'),'settings','200','200');
                // Store og_image
                $where['name'] = 'og_image';
                $insert['value'] = $destination;
                Setting::updateOrInsert($where, $insert);
            }
        }else if($request->group == 'social'){
            // Social Links
            $where['group'] = 'social';
            if ($request->input('facebook')){
                $where['name'] = 'facebook';
                $insert['value'] = $request->facebook;
                Setting::updateOrInsert($where, $insert);
            }

            if ($request->input('twitter')){
                $where['name'] = 'twitter';
                $insert['value'] = $request->twitter;
                Setting::updateOrInsert($where, $insert);
            }

            if ($request->input('youtube')){
                $where['name'] = 'youtube';
                $insert['value'] = $request->youtube;
                Setting::updateOrInsert($where, $insert);
            }

            if ($request->input('instagram')){
                $where['name'] = 'instagram';
                $insert['value'] = $request->instagram;
                Setting::updateOrInsert($where, $insert);

            }

            if ($request->input('linkedin')){
                $where['name'] = 'linkedin';
                $insert['value'] = $request->linkedin;
                Setting::updateOrInsert($where, $insert);
            }
            if ($request->input('snapchat')){
                $where['name'] = 'snapchat';
                $insert['value'] = $request->snapchat;
                Setting::updateOrInsert($where, $insert);
            }

        }
        else if($request->group == 'top_add'){
            // Social Links
            $where['group'] = 'top_add';
            if ($request->input('offer')){
                $where['name'] = 'offer';
                $insert['value'] = $request->offer;
                Setting::updateOrInsert($where, $insert);
            }

            if ($request->input('text')){
                $where['name'] = 'text';
                $insert['value'] = $request->text;
                Setting::updateOrInsert($where, $insert);
            }

        }
        return response()->json(['status'=>'success','message'=>'Successfully updated','data'=>Setting::all()],200);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Setting $setting
     * @return \App\Http\Resources\SettingResource
     */
    public function show(Request $request, Setting $setting)
    {
        return new SettingResource($setting);
    }

    /**
     * @param \App\Http\Requests\SettingUpdateRequest $request
     * @param \App\Models\Setting $setting
     * @return \App\Http\Resources\SettingResource
     */
    public function update(SettingUpdateRequest $request, Setting $setting)
    {
        $setting->update($request->validated());

        return new SettingResource($setting);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Setting $setting
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, Setting $setting)
    {
        $setting->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }
}
