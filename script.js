console.log("OK!");

document.getElementById('audiowav').addEventListener('change', lerArquivoWav);


function lerArquivoWav() {
    console.log(this.files); // will contain information about the file that was selected.

    if (this.files.length === 0) {
        console.log('No file selected.');
        return;
    }

    // const reader = new FileReader();
    // reader.onload = function fileReadCompleted() {
    //     // when the reader is done, the content is in reader.result.
    //     console.log(reader.result);
    // };
    // reader.readAsText(this.files[0]);

    var reader = new FileReader();
    reader.onload = function(e) {
        var audioBytes = new Uint8Array(e.target.result);
        
        const SOUND_NAME = "sounddata";
        const FRAMERATE = (audioBytes[27] << 24) | (audioBytes[26] << 16) | (audioBytes[25] << 8) | audioBytes[24]
        const AUDIO_SAMPLES = audioBytes.length - 44

        // console.log(audioBytes)
        
        console.log("INFO: sampleRate: %s , length: %d", FRAMERATE, AUDIO_SAMPLES)


        let divOut = document.getElementById('div-c-out');
        let divStatus = document.getElementById('div-status');
        let txt = "";

        txt += "// Wav2c recriado em Javascript por Guilherme Rodrigues: https://github.com/guilhermerodrigues680/py-wav2c\n"
        txt += "// Baseado no wav2c em C de Olle Jonsson: https://github.com/olleolleolle/wav2c\n\n"
        txt += `// const int ${SOUND_NAME}_sampleRate = ${FRAMERATE}; \n`
        txt += `const int ${SOUND_NAME}_length = ${AUDIO_SAMPLES}; \n\n`
        txt += `const unsigned char ${SOUND_NAME}_data[] PROGMEM ={`

        divStatus.innerHTML = "Iniciando a conversão"

        audioBytes.slice(44).forEach((sample, idx, arr) => {

            switch (String(sample).length) {
                case 1:
                    txt += '  '
                    break;
                case 2:
                    txt += ' '
                    break;
            }

            // txt += sample + ', ';
            txt += sample

            if ((idx + 1) != arr.length) {
                
                if (idx % 20 == 0) {
                    txt += ',\n';
                } else {
                    txt += ', ';
                }

            } else {
                txt += " };\n"
            }
            
        });

        divOut.innerText = txt;
        divStatus.innerHTML = "Conversão finalizada"

        generateDownloadHFile('teste.h', txt)


    }
    reader.readAsArrayBuffer(this.files[0]);
}


function generateDownloadHFile(filename, text) {
    let element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}