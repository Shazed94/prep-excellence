<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
/**
 * @OA\Info(
 *    title="APIs For prepexcellence",
 *    version="1.0.0",
 * ),
 *   @OA\SecurityScheme(
 *       securityScheme="bearerAuth",
 *       in="header",
 *       name="bearerAuth",
 *       type="http",
 *       scheme="bearer",
 *       bearerFormat="JWT",
 *    ),
 */
class Controller extends BaseController
{
    public function uploadPhoto($file, $path_name = 'photo/', $resize = null): string
    {
        $image = Image::make($file)->encode();
        if ($resize) {
            $image = Image::make($file)->resize($resize['w'], $resize['h'], function ($constraint) {
                $constraint->aspectRatio();
            })->encode();
        }
        $extension = $file->extension();
        $name = $path_name . uniqid() . time() . ".$extension";
        Storage::disk('local')->put('public/' . $name, $image);
        return '/storage/'.$name;
        /*Storage::disk('s3')->put($name, $image);
        Storage::disk('s3')->setVisibility($name,'public');
        return $name;*/
    }
    public function uploadPhoto2($file, $path_name = 'photo/', $resize = null): string
    {
        $image = Image::make($file)->encode();
        if ($resize) {
            $image = Image::make($file)->resize($resize['w'], $resize['h'])->encode('webp');
        }
        $name = $path_name . uniqid() . time() . ".webp";
        Storage::disk('local')->put('public/' . $name, $image);
        return '/storage/'.$name;
    }
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
