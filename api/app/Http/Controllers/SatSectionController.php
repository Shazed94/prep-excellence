<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSatSectionRequest;
use App\Http\Requests\UpdateSatSectionRequest;
use App\Http\Resources\SatSectionCollection;
use App\Http\Resources\SatSectionResource;
use App\Models\SatSection;
use App\Traits\CommonTrait;
use http\Env\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use mysql_xdevapi\Exception;

class SatSectionController extends Controller
{
    use CommonTrait;
    /**
     * Display a listing of the resource.
     *
     * @return SatSectionCollection
     */
    public function index()
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $sections = SatSection::query();
        if ($search) {
            $sections->whereLike(['title','description'], $search);
        }
        $sections= $sections->with(['satScores'])->paginate($itemsPerPage);

        return new SatSectionCollection($sections);
    }


    public function index2()
    {
        return response()->json(['data'=>SatSection::all(['id','title'])],200);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreSatSectionRequest  $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function store(StoreSatSectionRequest $request)
    {
        $data = $request->validated();
        $data += $this->storeMetadata($request);
        DB::beginTransaction();
        try {
            $satSection = SatSection::create($data);
            $data2 =[];
            foreach (json_decode($request->scores,true) as $score){
                $score['sat_section_id']= $satSection->id;
                $data2[] = $score;
            }
            $satSection->satScores()->insert($data2);
            DB::commit();
            $satSection->load('satScores');
            return (new SatSectionResource($satSection))->response();
        }catch (ValidationException $e) {
            DB::rollback();
            return response()->json(['data' => $e]);
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SatSection  $satSection
     * @return \Illuminate\Http\Response
     */
    public function show(SatSection $satSection)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateSatSectionRequest  $request
     * @param  \App\Models\SatSection  $satSection
     * @return JsonResponse
     * @throws \Exception
     */
    public function update(UpdateSatSectionRequest $request, $id)
    {
        //return response()->json($id);
        $satSection = SatSection::find($id);
        $data = $request->validated();
        $data += $this->updateMetadata($request);
        DB::beginTransaction();
        try {
            $satSection->update($data);
            $data2 =[];
            foreach (json_decode($request->scores,true) as $score){
                unset($score['id']);
                unset($score['sat_section_id']);
                $score['sat_section_id']= $satSection->id;
                $data2[] = $score;
            }
            $satSection->satScores()->delete();
            $satSection->satScores()->insert($data2);
            DB::commit();
            $satSection->load('satScores');
            return (new SatSectionResource($satSection))->response();
        }catch (ValidationException $e) {
            DB::rollback();
            return response()->json(['data' => $e]);
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SatSection  $satSection
     * @return \Illuminate\Http\Response
     */
    public function destroy(SatSection $satSection)
    {
        //
    }

    public function toggle(SatSection $satSection): JsonResponse
    {
        try {
            $satSection->update(['is_active' => !$satSection->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
}
