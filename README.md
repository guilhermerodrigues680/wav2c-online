# wav2c-online
Acesse o conversor em: [guilhermerodrigues680.github.io/wav2c-online](https://guilhermerodrigues680.github.io/wav2c-online)  
Video onde explico Como converter e reproduzir áudio usando o Arduino sem módulo mp3:  
https://www.youtube.com/watch?v=LHUzp2lcPNU

## Descrição
Conversor escrito em Javascript que lê um WAV Unsigned 8-bit PCM e converte em um array C/C++ para uso em microcontroladores  
Útil para tocar sons em um microcontrolador , não sendo necessário um modulo MP3. Porém fica restrito ao tamanho de 
memoria disponivel no microcontrolador.  


## Exemplo de uso
Para converter um áudio, ex: um .MP3, ultilize o software [Audacity](https://www.audacityteam.org/) para converter ele 
em **Mono** em seguida reduza a taxa de amostragem para **8000** e exporte como **WAV Unsigned 8-bit PCM** . 
Após gerado o arquivo carregue ele no conversor que gerará o código C/C++ .  

Para o Arduino, o código de Michael Smith pode ser ultilizado para reproduzir o som.
https://playground.arduino.cc/Code/PCMAudio/


### Capturas de tela
![SCREENSHOT-01.png](docs/SCREENSHOT-01.png)
![SCREENSHOT-02.png](docs/SCREENSHOT-02.png)

### Links
- https://www.reddit.com/r/javascript/comments/nuizh/reading_raw_wave_data_in_jshtml5/
- https://wiki.fileformat.com/audio/wav/