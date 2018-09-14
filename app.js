let isTrue = true;
const synth = window.speechSynthesis;


const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceList = document.querySelector('#voice-list');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');


let voices = [];

const getVoices = () => {

    console.log('get voices');
    voices = synth.getVoices();


    voices.forEach(voice => {

        const option = document.createElement('option');

        option.textContent = voice.name + '(' + voice.lang + ')';

        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceList.appendChild(option);
    });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

const speak = () => {
    console.log('Speak fn');
    if (synth.speaking) {
        console.error('Already speaking...');
        if(isTrue) {
            isTrue = false;
            Toaster('#status', 'Already speaking...', 'warning', 3 )
                .then((bool) => {
                    isTrue = bool;
                })
        }

        return;
    }
    if (textInput.value) {

        const speakText = new SpeechSynthesisUtterance(textInput.value);

        speakText.onend = e => {
            if(isTrue) {
                isTrue = false;
                Toaster('#status', 'Done!...', 'success', 3 )
                    .then((bool) => {
                        isTrue = bool;
                    })
            }
        };

        speakText.onerror = e => {

            if(isTrue) {
                isTrue = false;
                Toaster('#status', 'Something went wrong...', 'danger', 3 )
                    .then((bool) => {
                        isTrue = bool;
                    })
            }
        };

        const selectedVoice = voiceList.selectedOptions[0]
            .getAttribute('data-name');

        voices.forEach(voice => {
            if(voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });

        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        synth.speak(speakText);
    } else {
        if(isTrue) {
            isTrue = false;
            Toaster('#status', 'Type Something!...', 'info', 3 )
                .then((bool) => {
                    isTrue = bool;
                })
        }
    }
};

textForm.addEventListener('submit', e => {
    speak();
    textInput.blur();

    e.preventDefault();
});

rate.addEventListener('change', e => rateValue.textContent = rate.value);
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);
voiceList.addEventListener('change', e => speak());




function Toaster(appendableParent, message, type, time) {
    const validTypes = ['success', 'info', 'warning', 'danger', 'primary', 'secondary', 'dark', 'light'];
    const parent = document.querySelector(appendableParent);
    const alertDiv = document.createElement('div');
    const alertMessageP = document.createElement('p');
    const dismissLink = document.createElement('button');

    if (!(validTypes.indexOf(type) > -1)) {
        throw new Error('İnvalid Type');
    }


    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');

    alertMessageP.innerText = message;


    dismissLink.setAttribute('type', 'button');
    dismissLink.setAttribute('data-dismiss', 'alert');
    dismissLink.setAttribute('aria-label', 'close');
    dismissLink.setAttribute('title', 'close');
    dismissLink.className = 'close';
    dismissLink.innerHTML = `<span aria-hidden="true">&times;</span>`;
    alertDiv.appendChild(dismissLink);


    alertDiv.appendChild(alertMessageP);


    parent.appendChild(alertDiv);


    return new Promise((resolve, reject) => {
        setTimeout(function () {
            while (parent.firstChild) {
                parent.firstChild.remove();
            }
            resolve(true);
        }, time * 1000);
    })

}