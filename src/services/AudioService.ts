import { Audio } from 'expo-av';

export const AudioService = {
    recording: null as Audio.Recording | null,

    async startRecording(): Promise<Audio.Recording | null> {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });

                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );
                this.recording = recording;
                return recording;
            } else {
                console.warn('Audio permission not granted');
                return null;
            }
        } catch (err) {
            console.error('Failed to start recording', err);
            return null;
        }
    },

    async stopRecording(): Promise<string | null> {
        if (!this.recording) return null;

        try {
            await this.recording.stopAndUnloadAsync();
            const uri = this.recording.getURI();
            this.recording = null;
            return uri;
        } catch (err) {
            console.error('Failed to stop recording', err);
            return null;
        }
    }
};
