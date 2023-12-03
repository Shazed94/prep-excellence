<?php

namespace App\Traits;

use App\Exports\CommonDataExporter;
use Illuminate\Support\Carbon;
use PDF;
trait ReportTrait
{
    private function getPdfReport($ids = null, $model = null, $columns = [], $total=[], $start_date=null, $end_date=null,$where=[]){
        $model = '\App\Models\\' . $model;
        if ($ids) {
            $modelDatas = $model::whereIn('id', $ids)->get();
        } else {
            $modelDatas = $model::query();
            if (isset($start_date)){
                $modelDatas->whereDate('created_at', '>=', $start_date);
            }
            if (isset($end_date)){
                $modelDatas->whereDate('created_at', '<=', $end_date);
            }
            if (count($where)) {
                foreach ($where as $w) $modelDatas->where($w['name'],$w['value']);
            }
            $modelDatas =$modelDatas->get();
        }
        $data = array();
        $cols = $columns;
        foreach ($modelDatas as $modelData) {
            $info = array();
            if (count($cols)) {
                foreach ($cols as $col) {
                    //$output = str_replace(['_', '.'], ' ', $col);
                    $output = $col;
                    $relations = explode('.', $col);
                    if (count($relations) > 1) {
                        $r = $modelData;
                        foreach ($relations as $relation) {
                            if (!empty($r) && $r->exists()) {
                                $r = $r->$relation;
                            }
                        }
                        $info[$output] = $r ?? '';
                    } else {
                        if ($col == 'created_at') $info[$output] = Carbon::parse($modelData[$col])->format('m-d-Y');
                        else $info[$output] = $modelData[$col];
                    }
                }
            }
            $data[] = $info;
        }
        //total calculation
        if (count($total)){
            $info = array();
            if (count($cols)) {
                foreach ($cols as $col) {
                    if (in_array($col, $total)){
                        $info[$col] = $modelDatas->sum($col);
                    }else{
                        $info[$col] = null;
                    }
                }
            }
            $data[] = $info;
        }
        //Log::info($data);
        return collect($data);
    }

    public function commonDataExporter($model, $columns, $head, $total=[],$where=[],$template=null)
    {
        if (\request('ids')) {
            $ids = explode(',', \request('ids'));
        } else {
            $ids = null;
        }
        $start_date =null;
        $end_date =null;
        if (\request('start_date')) $start_date = \request('start_date');
        if (\request('end_date')) $end_date = \request('end_date');

        if (\request('format') === 'excel') {
            return (new CommonDataExporter($ids, $model, $columns, $head, $total, 'is_active'))
                ->download($model.'.xlsx', \Maatwebsite\Excel\Excel::XLSX);
        }
        if (\request('format') === 'csv') {
            return (new CommonDataExporter($ids, $model, $columns, $head, $total, 'is_active'))
                ->download($model.'.csv', \Maatwebsite\Excel\Excel::CSV, ['Content-Type' => 'text/csv',]);
        }
        $title = 'Reports';
        $title2 = '';
        $data = $this->getPdfReport($ids, $model, $columns, $total, $start_date, $end_date,$where);
        $pdf = PDF::loadView($template ?? 'exporter.commonTablePdf',compact('title','title2','head','columns','data'));
        return $pdf->download($model.'.pdf');

        //return (new BookingDataExporter($ids, $model, $columns, $head, $total, 'is_active'))
        //   ->download($model.'.pdf', \Maatwebsite\Excel\Excel::DOMPDF);
    }

}
