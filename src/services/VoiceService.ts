import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';

type VoiceCallback = (text: string, isFinal: boolean) => void;
type ErrorCallback = (error: any) => void;

class VoiceService {
    private onSpeech: VoiceCallback | null = null;
    private onError: ErrorCallback | null = null;

    constructor() {
        Voice.onSpeechResults = this.handleSpeechResults.bind(this);
        Voice.onSpeechError = this.handleSpeechError.bind(this);
        Voice.onSpeechPartialResults = this.handleSpeechPartialResults.bind(this);
    }

    private handleSpeechResults(e: SpeechResultsEvent) {
        if (this.onSpeech && e.value && e.value.length > 0) {
            this.onSpeech(e.value[0], true);
        }
    }

    private handleSpeechPartialResults(e: SpeechResultsEvent) {
        if (this.onSpeech && e.value && e.value.length > 0) {
            this.onSpeech(e.value[0], false);
        }
    }

    private handleSpeechError(e: SpeechErrorEvent) {
        console.error('Voice Error:', e);
        if (this.onError) {
            this.onError(e);
        }
    }

    async startListening(onSpeech: VoiceCallback, onError?: ErrorCallback) {
        this.onSpeech = onSpeech;
        this.onError = onError || null;
        try {
            await Voice.start('hi-IN'); // Hindi (India) locale
        } catch (e) {
            console.error(e);
        }
    }

    async stopListening() {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    }

    async cancelListening() {
        try {
            await Voice.cancel();
        } catch (e) {
            console.error(e);
        }
    }

    async destroy() {
        try {
            await Voice.destroy();
            Voice.removeAllListeners();
        } catch (e) {
            console.error(e);
        }
    }
}

export const voiceService = new VoiceService();
