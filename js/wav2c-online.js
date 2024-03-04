//
// WAV2C Online - Por: Guilherme Rodrigues
//

let audioBytesArray;

$( document ).ready(function(){
    $( "#div-acoes" ).hide();
    $( "#div-c-out" ).hide();

    $( "#input-audiowav" ).on( "change", lerArquivoWav);
    $( "#button-copy-clipboard" ).on( "click", copyToClipboard);
    $( "#button-download-h-file" ).on( "click", generateDownloadHFile);
    $( "#button-download-bin-file" ).on( "click", generateDownloadBinFile);
});


/** Função responsavel por ler e converte o arquivo wav em texto */
function lerArquivoWav() {
    // console.debug(this.files);
    $( "#label-audio-upload" ).text(`${this.files[0].name} - ${this.files[0].size} bytes`);

    if (this.files.length === 0) {
        console.log("Nenhum arquivo selecionado.");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        // No WAV, os 44 bytes iniciais são de cabeçalho: https://wiki.fileformat.com/audio/wav/
        const audioBytes = new Uint8Array(e.target.result);
        const SOUND_NAME = "sounddata";
        const FRAMERATE = (audioBytes[27] << 24) | (audioBytes[26] << 16) | (audioBytes[25] << 8) | audioBytes[24];
        const AUDIO_SAMPLES = audioBytes.length - 44;
        // console.debug(audioBytes)

        audioBytesArray = audioBytes.slice(44);

        $( "#p-file-info" ).html(`<strong>Taxa de amostragem:</strong> ${FRAMERATE} , <strong>amostras:</strong> ${AUDIO_SAMPLES}`);
        $( "#p-status" ).text( "Iniciando a conversão" );

        let txt = "";
        txt += "// Wav2c recriado em Javascript por Guilherme Rodrigues: https://github.com/guilhermerodrigues680/wav2c-online\n";
        txt += "// Baseado no wav2c em C de Olle Jonsson: https://github.com/olleolleolle/wav2c\n\n";
        txt += `// const int ${SOUND_NAME}_sampleRate = ${FRAMERATE}; \n`;
        txt += `const int ${SOUND_NAME}_length = ${AUDIO_SAMPLES}; \n\n`;
        txt += `const unsigned char ${SOUND_NAME}_data[] PROGMEM ={`;

        audioBytesArray.forEach((sample, idx, arr) => {

            switch (String(sample).length) {
                case 1:
                    txt += "  ";
                    break;
                case 2:
                    txt += " ";
                    break;
            }

            txt += sample;

            if ((idx + 1) != arr.length) {
                
                if (idx % 20 == 0) {
                    txt += ",\n";
                } else {
                    txt += ", ";
                }

            } else {
                txt += " };\n"
            }
            
        });

        $( "#code-c-out" ).html( txt );
        $( "#p-status" ).text( "Conversão finalizada" );
        $( "#div-acoes" ).show();
        $( "#div-c-out" ).show();
        Prism.highlightAll();
    }
    reader.readAsArrayBuffer(this.files[0]);
}


/** Função responsavel por gerar um arquivo para download */
function generateDownloadHFile() {
    const filename = "sounddata.h";
    const text = $( "#code-c-out" ).text();
    let element = document.createElement('a');
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


/** Função responsavel por copiar o codigo para area de trasnferencia */
function copyToClipboard() {
    let containerid = "code-c-out";
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

/** Função responsável por gerar um arquivo binário para download */
function generateDownloadBinFile() {
    if (!audioBytesArray) {
        alert("Primeiro selecione um arquivo WAV.");
        return;
    }

    const blob = new Blob([audioBytesArray], {type: "octet/stream"});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "sounddata.dat";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
