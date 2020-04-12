document.getElementById('audiowav').addEventListener('change', lerArquivoWav);
document.getElementById('button-copy-clipboard').addEventListener('click', CopyToClipboard);
document.getElementById('button-download-h-file').addEventListener('click', generateDownloadHFile);

$( document ).ready(function() {
    $('#div-acoes').hide();
    $('#div-c-out').hide();
});

function lerArquivoWav() {
    // console.log(this.files);

    document.getElementById('label-audio-upload').innerText = `${this.files[0].name} - ${this.files[0].size} bytes`;

    if (this.files.length === 0) {
        console.log('No file selected.');
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        var audioBytes = new Uint8Array(e.target.result);
        
        const SOUND_NAME = "sounddata";
        const FRAMERATE = (audioBytes[27] << 24) | (audioBytes[26] << 16) | (audioBytes[25] << 8) | audioBytes[24]
        const AUDIO_SAMPLES = audioBytes.length - 44
        // console.log(audioBytes)
        // console.log("INFO: sampleRate: %s , length: %d", FRAMERATE, AUDIO_SAMPLES)

        document.getElementById('p-file-info').innerHTML = `<strong>Taxa de amostragem:</strong> ${FRAMERATE} , <strong>amostras:</strong> ${AUDIO_SAMPLES}`
        let divOut = document.getElementById('code-c-out');
        let divStatus = document.getElementById('div-status');
        let txt = "";

        txt += "// Wav2c recriado em Javascript por Guilherme Rodrigues: https://github.com/guilhermerodrigues680/wav2c-online\n"
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

        divOut.innerHTML = txt;
        divStatus.innerHTML = "Conversão finalizada"
        $('#div-acoes').show();
        $('#div-c-out').show();
        Prism.highlightAll();
    }
    reader.readAsArrayBuffer(this.files[0]);
}


function generateDownloadHFile() {
    let filename = 'sounddata.h';
    let text = document.getElementById('code-c-out').innerText;
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


function CopyToClipboard() {

    let containerid = 'code-c-out';

    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select().createTextRange();
        document.execCommand("copy");

    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
        document.execCommand("copy");
        // alert("O código gerado foi copiado! Pressione Ctrl+V para colá-lo")
    }
}