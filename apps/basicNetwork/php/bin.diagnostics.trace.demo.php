<?php 


$fakeFile = <<<EOF
{
    "traceResults": [
        {
            "Hop": "1",
            "Address": "192.168.22.1",
            "Time (ms)": "0.402",
            "Address2": "192.168.22.1",
            "Time2 (ms)": "0.907",
            "Address3": "192.168.22.1",
            "Time3 (ms)": "0.900"
        },
        {
            "Hop": "2",
            "Address": "192.168.222.1",
            "Time (ms)": "2.085",
            "Address2": "192.168.222.1",
            "Time2 (ms)": "2.092",
            "Address3": "192.168.222.1",
            "Time3 (ms)": "2.596"
        },
        {
            "Hop": "3",
            "Address": "24.240.173.193",
            "Time (ms)": "2.958",
            "Address2": "24.240.173.193",
            "Time2 (ms)": "3.355",
            "Address3": "24.240.173.193",
            "Time3 (ms)": "3.358"
        },
        {
            "Hop": "4",
            "Address": "10.188.43.1",
            "Time (ms)": "10.428",
            "Address2": "10.188.43.1",
            "Time2 (ms)": "14.417",
            "Address3": "10.188.43.1",
            "Time3 (ms)": "15.405"
        },
        {
            "Hop": "5",
            "Address": "96.34.92.138",
            "Time (ms)": "15.690",
            "Address2": "96.34.92.138",
            "Time2 (ms)": "16.167",
            "Address3": "96.34.92.138",
            "Time3 (ms)": "16.727"
        }
    ]
}

EOF
;

echo $fakeFile;

?>