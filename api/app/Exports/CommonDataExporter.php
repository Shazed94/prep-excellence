<?php

namespace App\Exports;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Excel;

class CommonDataExporter implements FromCollection, WithHeadings
{
    use Exportable;

    private $ids;
    private $model;
    private $columns;
    private $head;
    private $total;
    private $start_date;
    private $end_date;
    private $wheres;

    private $writerType = Excel::XLSX;

    public function __construct($ids = null, $model = null, $columns = [], $head = [], $total=[], $start_date=null, $end_date=null,$where=[])
    {
        $this->ids = $ids;
        $this->model = $model;
        $this->columns = $columns;
        $this->head = $head;
        $this->total = $total;
        $this->start_date = $start_date;
        $this->end_date = $end_date;
        $this->wheres = $where;
    }

    public function collection(): \Illuminate\Support\Collection
    {
        $model = '\App\Models\\' . $this->model;
        if ($this->ids) {
            $modelDatas = $model::whereIn('id', $this->ids)->get();
        } else {
            $modelDatas = $model::query();
            if (isset($this->start_date)){
                $modelDatas->whereDate('created_at', '>=', $this->start_date);
            }
            if (isset($this->end_date)){
                $modelDatas->whereDate('created_at', '<=', $this->end_date);
            }
            if (count($this->wheres)) {
                foreach ($this->wheres as $w) $modelDatas->where($w['name'],$w['value']);
            }
            $modelDatas =$modelDatas->get();
        }
        $data = array();
        $cols = $this->columns;
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
        if (count($this->total)){
            $info = array();
            if (count($cols)) {
                foreach ($cols as $col) {
                    if (in_array($col, $this->total)){
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

    public function headings(): array
    {
        return $this->head;
    }
}
