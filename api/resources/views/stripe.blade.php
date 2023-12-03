<!doctype html>
<html class="no-js" lang="en">
<head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
</head>
<body>
    <div class="page_wrap">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card mt-5 shadow mb-4">
                        <div class="card-header">
                            <h5>Order ID: <b>#1</b></h5>
                        </div>
                        <div class="card-body">
                            <p>Payment Amount: <b>500</b></p>

                            <form role="form" action="{{ route('front.strip.payment') }}" method="post" class="stripe-payment"
                                  data-cc-on-file="false" data-stripe-publishable-key="{{ env('STRIPE_KEY') }}"
                                  id="stripe-payment">
                                @csrf

                                <div class="form-group">
                                    <label class='control-label'>Name on Card</label>
                                    <input class='form-control'  size='4' type='text'>
                                </div>

                                <div class="form-group">
                                    <label class='control-label'>Card Number</label>
                                    <input autocomplete='off' class='form-control card-num limitthis' size='20' maxlength="16" type='number'>
                                </div>

                                <div class='form-row row'>
                                    <div class='col-xs-12 col-md-4 form-group cvc required'>
                                        <label class='control-label'>CVC</label>
                                        <input autocomplete='off' class='form-control card-cvc limitthis' maxlength="3" placeholder='e.g 595' size='4' type='number'>
                                    </div>

                                    <div class='col-xs-12 col-md-4 form-group expiration required'>
                                        <label class='control-label'>Expiration Month</label>
                                        <input class='form-control card-expiry-month limitthis' placeholder='MM' size='2' maxlength="2" type='number'>
                                    </div>
                                    <div class='col-xs-12 col-md-4 form-group expiration required'>
                                        <label class='control-label'>Expiration Year</label>
                                        <input class='form-control card-expiry-year limitthis' placeholder='YYYY' maxlength="4" size='4' type='number'>
                                    </div>
                                </div>

                                {{-- <div class='form-row row'>
                                    <div class='col-md-12 hide error form-group'>
                                        <div class='alert-danger alert'>Fix the errors before you begin.</div>
                                    </div>
                                </div> --}}

                                <div class="row">
                                    <div class="col-md-12">
                                        <button class="btn btn-success btn-lg btn-block" type="submit">Pay</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-1.9.1.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
    <script type="text/javascript" src="https://js.stripe.com/v2/"></script>
    <script type="text/javascript">
        $(function () {
            var $form = $(".stripe-payment");
            $('form.stripe-payment').bind('submit', function (e) {
                var $form = $(".stripe-payment"),
                    inputVal = ['input[type=email]', 'input[type=password]',
                        'input[type=text]', 'input[type=file]',
                        'textarea'
                    ].join(', '),
                    $inputs = $form.find('.required').find(inputVal),
                    $errorStatus = $form.find('div.error'),
                    valid = true;
                $errorStatus.addClass('hide');

                $('.has-error').removeClass('has-error');
                $inputs.each(function (i, el) {
                    var $input = $(el);
                    if ($input.val() === '') {
                        $input.parent().addClass('has-error');
                        $errorStatus.removeClass('hide');
                        e.preventDefault();
                    }
                });

                if (!$form.data('cc-on-file')) {
                    e.preventDefault();
                    Stripe.setPublishableKey($form.data('stripe-publishable-key'));
                    Stripe.createToken({
                        number: $('.card-num').val(),
                        cvc: $('.card-cvc').val(),
                        exp_month: $('.card-expiry-month').val(),
                        exp_year: $('.card-expiry-year').val()
                    }, stripeRes);
                }

            });

            function stripeRes(status, response) {
                console.log(response);

                if (response.error) {
                    Swal.fire(
                        'Failed!',
                        response.error.message,
                        'error'
                    )
                    // $('.error')
                    //     .removeClass('hide')
                    //     .find('.alert')
                    //     .text(response.error.message);
                } else {
                    var token = response['id'];
                    $form.find('input[type=text]').empty();
                    $form.append("<input type='hidden' name='stripeToken' value='" + token + "'/>");
                    $form.get(0).submit();
                }
            }
        });

        // Number length limit
        $(".limitthis").on('keypress',function(e) {
            var $that = $(this);
            var maxlength = $that.attr('maxlength');
            if($.isNumeric(maxlength)){
                if($that.val().length == maxlength) { e.preventDefault(); return; }
                $that.val($that.val().substr(0, maxlength));
            };
        });
    </script>
</body>
</html>

