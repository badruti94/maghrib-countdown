// script.js

const countdownElement = document.getElementById("countdown");
const now = new Date()
const startCountdown = async () => {
    const url = 'https://equran.id/api/v2/imsakiyah'
    const params = {
        "provinsi": "D.K.I Jakarta",
        "kabkota": "Kota Jakarta"
    }
    const urlTglHijriah = `https://service.unisayogya.ac.id/kalender/api/masehi2hijriah/muhammadiyah/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`

    const optionTglHijriah = {
        method: 'GET',
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(params)
    };
    const [data, dataTglHijriah] = await Promise.all([
        fetch(url, options),
        fetch(urlTglHijriah, optionTglHijriah)
    ])

    const [response, responseTgl] = await Promise.all([data.json(), dataTglHijriah.json()])
    const dataHijriah = response.data
    const tahunIni = dataHijriah.find((v => v.hijriah == responseTgl.tahun))
    const tanggalSekarang = tahunIni.imsakiyah.find(v => v.tanggal == responseTgl.tanggal)
    const magribHariIni = tanggalSekarang.maghrib.split(':')
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(tanggalSekarang.tanggal).padStart(2, '0');
    const hours = String(magribHariIni[0]).padStart(2, '0');
    const minutes = String(magribHariIni[1]).padStart(2, '0');

    const date = `${now.getFullYear()}-${month}-${day}T${hours}:${minutes}:00`;
    const dateHijriyah = new Date(date);

    const jamMagrib = dateHijriyah.getTime()

    setInterval(() => {
        const waktuSekarang = new Date().getTime()
        let selisihDetik = (jamMagrib - waktuSekarang) / 1000;
        if (selisihDetik < 0) selisihDetik += 86400
        countdownElement.innerHTML = konversiDetikKeJam(selisihDetik)
    }, 500)
}


const konversiDetikKeJam = (detik) => {
    const jam = Math.floor(detik / 3600);
    const sisaDetik = detik % 3600;
    const menit = Math.floor(sisaDetik / 60);
    const detikSisa = Math.floor(sisaDetik % 60);

    const jamStr = String(jam).padStart(2, '0');
    const menitStr = String(menit).padStart(2, '0');
    const detikStr = String(detikSisa).padStart(2, '0');

    return `${jamStr} jam, ${menitStr} menit, ${detikStr} detik`;

}


document.addEventListener("DOMContentLoaded", async function () {
    await startCountdown();

    // butterfly animation
    const butterflyImages = [
        "butterfly.gif",
        "butterfly-2.gif",
        "butterfly-3.gif",
        "butterfly-4.gif",
        "butterfly-5.gif",
    ];
    const totalButterflies = 15;

    function createButterfly() {
        let butterfly = document.createElement("div");
        butterfly.className = "butterfly";
        butterfly.style.backgroundImage = `url(butterfly/${butterflyImages[Math.floor(Math.random() * butterflyImages.length)]})`;
        document.body.appendChild(butterfly);

        function setRandomPosition() {
            butterfly.style.left = Math.random() * 100 + "vw";
            butterfly.style.top = Math.random() * 100 + "vh";
        }

        setRandomPosition();
        setInterval(setRandomPosition, Math.random() * 5000 + 3000);
    }

    for (let i = 0; i < totalButterflies; i++) {
        createButterfly();
    }

    // change background
    function changeBackgroundImage(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.body.style.backgroundImage = `url(${e.target.result})`;
            };
            reader.readAsDataURL(file);
        }
    }

    const fileInput = document.getElementById("backgroundInput");
    fileInput.addEventListener("change", changeBackgroundImage);
    document.body.appendChild(fileInput);
    fileInput.style.position = "fixed";
    fileInput.style.bottom = "20px";
    fileInput.style.left = "50%";
    fileInput.style.transform = "translateX(-50%)";
});
