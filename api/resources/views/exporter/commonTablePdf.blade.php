<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ env('APP_NAME') }}</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <style>

        th,td{
            font-size: 7px;
        }
        tr{
            padding: 0;
        }
        .custom_img_size{
            width: 50px;
            height: 50px;
        }
    </style>
</head>
<body>
<div class="mt-0">
    <div class="d-flex justify-content-center text-center mb-1">
        <img src="{{public_path('/images/logo.png')}}" width="115px" height="40px" alt="logo"/>
    </div>
    <h4 class="text-center mb-3">{{ env('APP_NAME') }}</h4>
    <table class="table table-borderless table-striped mb-1">
        <thead>
        <tr>
            <th>SL</th>
            @foreach($head as $key=>$cl)
                <th>{{$cl??''}}</th>
            @endforeach
        </tr>
        </thead>
        <tbody>
        @foreach($data as $key=>$dt)
            <tr>
                <td>{{$key+1}}</td>
                @foreach($columns as $key2=>$cl)
                    @if($cl =='image')
                        <td>
                            <img src="{{ $dt[$cl] ? public_path($dt[$cl]) : '' }}" class="thumbnail custom_img_size" alt=""/>
                        </td>
                    @elseif($cl == 'courses')
                        <td>
                            @if($dt[$cl])
                                @foreach($dt[$cl] as $nn)
                                    {{ $nn['name'] }}
                                @endforeach
                            @endif
                        </td>
                    @else
                        <td>{!! $dt[$cl] ??'' !!}</td>
                    @endif
                @endforeach
            </tr>
        @endforeach
        </tbody>
    </table>

</div>
</body>
</html>
