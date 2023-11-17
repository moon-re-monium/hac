document.addEventListener('DOMContentLoaded', function () {
    const interactive = document.getElementById('interactive');

    // Check for camera access permission
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            // If permission is granted, proceed with Quagga initialization
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: interactive,
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: "environment" // or "user" for front camera
                    }
                },
                decoder: {
                    readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader", "2of5_reader", "code_93_reader"]
                }
            }, function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
                Quagga.start();
            });

            Quagga.onDetected(function (result) {
                const code = result.codeResult.code;
                displayFilePreview(code);
                Quagga.stop();
            });
        })
        .catch(function (err) {
            console.error("Error accessing camera: ", err);
        });

    function displayFilePreview(data) {
        // Assuming the data is a base64-encoded string
        interactive.innerHTML = `<h2>File Preview</h2><pre>${data}</pre>`;
    }
});
