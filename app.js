const Quagga = require('quagga');


document.addEventListener('DOMContentLoaded', function () {
    const interactive = document.getElementById('interactive');

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: interactive
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

    function displayFilePreview(data) {
        // Assuming the data is a base64-encoded string
        interactive.innerHTML = `<h2>File Preview</h2><pre>${data}</pre>`;
    }
});
