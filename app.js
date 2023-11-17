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
        const binaryData = atob(data);
        const byteArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            byteArray[i] = binaryData.charCodeAt(i);
        }

        const blob = new Blob([byteArray], { type: 'application/octet-stream' });
        const objectURL = URL.createObjectURL(blob);

        // Display the file using an anchor element
        const downloadLink = document.createElement('a');
        downloadLink.href = objectURL;
        downloadLink.download = 'downloaded_file';
        downloadLink.textContent = 'Download File';
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Clean up
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(objectURL);
    }
});
