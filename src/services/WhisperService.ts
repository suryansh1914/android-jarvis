import { Config } from '../constants/Config';

export const WhisperService = {
    async transcribeAudio(uri: string): Promise<string | null> {
        if (!Config.OPENAI_API_KEY || Config.OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY') {
            console.warn('OpenAI API Key is missing');
            return "Error: Message system offline. API Key Missing.";
        }

        const formData = new FormData();
        formData.append('file', {
            uri,
            name: 'audio.m4a',
            type: 'audio/m4a',
        } as any);
        formData.append('model', 'whisper-1');

        try {
            const response = await fetch(`${Config.OPENAI_API_URL}/audio/transcriptions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Config.OPENAI_API_KEY}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await response.json();
            if (data.text) {
                return data.text;
            } else {
                console.error('Whisper API Error:', data);
                return null;
            }
        } catch (error) {
            console.error('Transcription failed:', error);
            return null;
        }
    }
};
