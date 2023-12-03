<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

trait PermissionTrait
{
    protected function permissionCheck($action = '', $subject='')
    {
        if (auth()->check()) {
            $user = auth()->user();
            $abality = Cache::remember('permission'.$user->id, 300, function() use ($user) {
                $permissions = $user->role->menuPermissions()->with(['menu', 'permission'])->get();
                $permissions2 = $user->menuPermissions()->with(['menu', 'permission'])->get();
                foreach ($permissions as $permission) {
                    $abality[] = [
                        'action' => $permission->permission ? $permission->permission->name : '',
                        'subject' => $permission->menu ? $permission->menu->name : '',
                    ];
                }
                foreach ($permissions2 as $permission) {
                    $abality[] = [
                        'action' => $permission->permission ? $permission->permission->name : '',
                        'subject' => $permission->menu ? $permission->menu->name : '',
                    ];
                }
                $abality[] = [
                    'action' => 'full',
                    'subject' => 'Auth',
                ];
                $abality[] = [
                    'action' => 'read',
                    'subject' => 'Dashboard',
                ];
                return $abality;
            });

        if ($abality && count($abality)) {
            return collect($abality)->contains(function ($item) use ($subject, $action) {
                return ($item['action'] == $action && $item['subject'] == $subject);
            });
        } else {
            return false;
        }
      }
        return false;
    }
}
