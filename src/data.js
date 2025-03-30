<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Redirecting to Payment</title>
        </head>
        <body>
            <form id="paymentForm" action="https://emd.bidabhadohi.com/propertyMartPayment/payment" method="POST">
                <input type="text" name="order_id" placeholder="Order ID" >
                <input type="text" name="amount" placeholder="Amount" >
                <input type="text" name="customer_name" placeholder="Customer Name" >
                <input type="email" name="customer_email" placeholder="Customer Email" >
                <input type="tel" name="customer_mobile" placeholder="Customer Mobile" >
                <input type="text" name="customer_address" placeholder="Customer Address" >
                <input type="text" name="property_id" placeholder="Property ID" >
                <input type="submit" value="Submit">
            </form>
        </body>
        </html>



this  opens the payment gateway of bill desk 


{
    "merchantLogo": "",
    "flowConfig": {
        "merchantId": "BIDAPMS2V2",
        "authToken": "OToken 0b79f81f18c9bb973f3e62a9776a3d09988ac1fceb4f53ca782691ffc7b7173aa25a387c7b4885dc9bcd2904bc411b14949f64b98fc74e0873205c47b6be1b23a809bc6a4dfdba76a50251be98b64b22d2268beecf81fc887dcd7860c5795c67901625c758e03c4f78d014e6cb28e6ef1737cffd3a1a3cc93b6cb2375cbbe1d35af7f0228f4ce004f1c88dcfbbc4c282c48ca20a9512a089685ba284e1ef1c115708d696ba7784.70675f706172616d5f656e6333;aHR0cHM6Ly9hcGkuYmlsbGRlc2suY29t",
        "childWindow": "",
        "retryCount": 0,
        "returnUrl": "https://emd.bidabhadohi.com/propertyMartPayment/paymentStatus",
        "showConvenienceFeeDetails": "",
        "bdOrderId": "OA7YK6571FKP83T",
        "mandateTokenId": ""
    },
    "flowType": "payments",
    "showSingleColumnSdk": "",
    "target": {}
}


and this is returned in the console



so when the payment is succeded

then it get redirected to https://emd.bidabhadohi.com/propertyMartPayment/paymentStatus and this data is returned

{"success":true,"ResponseData":{"mercid":"BIDAPMS2V2","transaction_date":"2025-03-28T15:36:24+05:30","surcharge":"0.00","payment_method_type":"upi","amount":"2.00","ru":"https://emd.bidabhadohi.com/propertyMartPayment/paymentStatus","orderid":"3123213123131231221","transaction_error_type":"success","discount":"0.00","payment_category":"10","bank_ref_no":"545304008669","transactionid":"BIC51V40GVGO7F","txn_process_type":"qr","bankid":"IC5","additional_info":{"additional_info1":"arabhaya","additional_info3":"arabhaya@gmail.com","additional_info2":"9453269956","additional_info5":"PID: wewffwe2332423","additional_info4":"D59/212k, Nirala Nagar,"},"itemcode":"DIRECT","transaction_error_code":"TRS0000","currency":"356","auth_status":"0300","transaction_error_desc":"Transaction Successful","objectid":"transaction","charge_amount":"2.00"}}



integrate this in vite react component, tailwind