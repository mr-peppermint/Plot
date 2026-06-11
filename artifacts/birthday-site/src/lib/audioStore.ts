let _audio: HTMLAudioElement | null = null;

export const audioStore = {
  get: () => _audio,
  set: (a: HTMLAudioElement) => { _audio = a; },
};
