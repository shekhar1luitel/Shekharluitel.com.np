var ResponsiveVoice = function () {
    var self = this;
  
    // Our own collection of voices
    var responsivevoices = [
      { name: 'UK English Female', voiceIDs: [3, 5, 1, 6, 7, 8] },
      { name: 'UK English Male', voiceIDs: [0, 4, 2, 6, 7, 8] },
      { name: 'US English Female', voiceIDs: [39, 40, 41, 42, 43, 44] },
      { name: 'Spanish Female', voiceIDs: [19, 16, 17, 18, 20, 15] },
      { name: 'French Female', voiceIDs: [21, 22, 23, 26] },
      { name: 'Deutsch Female', voiceIDs: [27, 28, 29, 30, 31, 32] },
      { name: 'Italian Female', voiceIDs: [33, 34, 35, 36, 37, 38] },
      { name: 'Hungarian Female', voiceIDs: [9, 10, 11] },
      { name: 'Serbian Male', voiceIDs: [12] },
      { name: 'Croatian Male', voiceIDs: [13] },
      { name: 'Bosnian Male', voiceIDs: [14] },
      { name: 'Fallback UK Female', voiceIDs: [8] }
    ];
  
    // All voices available on every system and device
    var voicecollection = [
      { name: 'Google UK English Male' },
      { name: 'Agnes' },
      { name: 'Daniel Compact' },
      { name: 'Google UK English Female' },
      { name: 'en-GB', rate: 0.5, pitch: 1 },
      { name: 'en-AU', rate: 0.5, pitch: 1 },
      { name: 'inglés Reino Unido' },
      { name: 'English United Kingdom' },
      { name: 'Fallback en-GB Female', lang: 'en-GB', fallbackvoice: true },
      { name: 'Eszter Compact' },
      { name: 'hu-HU', rate: 0.4 },
      { name: 'Fallback Hungarian', lang: 'hu', fallbackvoice: true },
      { name: 'Fallback Serbian', lang: 'sr', fallbackvoice: true },
      { name: 'Fallback Croatian', lang: 'hr', fallbackvoice: true },
      { name: 'Fallback Bosnian', lang: 'bs', fallbackvoice: true },
      { name: 'Fallback Spanish', lang: 'es', fallbackvoice: true },
      { name: 'Spanish Spain' },
      { name: 'español España' },
      { name: 'Diego Compact', rate: 0.3 },
      { name: 'Google Español' },
      { name: 'es-ES', rate: 0.3 },
      { name: 'Google Français' },
      { name: 'French France' },
      { name: 'francés Francia' },
      { name: 'Virginie Compact', rate: 0.5 },
      { name: 'fr-FR', rate: 0.5 },
      { name: 'Fallback French', lang: 'fr', fallbackvoice: true },
      { name: 'Google Deutsch' },
      { name: 'German Germany' },
      { name: 'alemán Alemania' },
      { name: 'Yannick Compact' },
      { name: 'de-DE', rate: 0.5 },
      { name: 'Fallback Deutsch', lang: 'de', fallbackvoice: true },
      { name: 'Google Italiano' },
      { name: 'Italian Italy' },
      { name: 'italiano Italia' },
      { name: 'Giorgio Compact' },
      { name: 'it-IT', rate: 0.4 },
      { name: 'Fallback Italian', lang: 'it', fallbackvoice: true },
      { name: 'Fallback UK English Female', lang: 'en-GB', fallbackvoice: true }
    ];
  
    var voice = {};
  
    self.OnVoiceReady = null;
    self.speaking = false;
    self.pending_callback = false;
  
    self.addVoice = function (voice) {
      responsivevoices.push(voice);
    };
  
    self.getResponsiveVoice = function () {
      return responsivevoices;
    };
  
    self.setVoice = function (voiceindex) {
      var selectedvoice = voicecollection[voiceindex];
      if (selectedvoice) {
        voice = selectedvoice;
      } else {
        console.warn("Invalid voice index: " + voiceindex);
      }
    };
  
    self.getVoice = function () {
      return voice;
    };
  
    self.setDefaultVoice = function () {
      voice = {};
    };
  
    self.getVoices = function () {
      return voicecollection;
    };
  
    self.isSupported = function () {
      return true;
    };
  
    self.init = function () {
      if (self.OnVoiceReady) {
        self.OnVoiceReady();
      }
    };
  
    self.speak = function (text, voicename, callback) {
      if (self.pending_callback) {
        self.pending_callback();
        self.pending_callback = false;
      }
  
      self.pending_callback = callback;
  
      if (self.speaking) {
        self.cancel();
      }
  
      var onend = function () {
        self.speaking = false;
        if (self.pending_callback) {
          self.pending_callback();
          self.pending_callback = false;
        }
      };
  
      self.speaking = true;
  
      var utterance = new SpeechSynthesisUtterance();
      utterance.text = text;
  
      if (voicename) {
        utterance.voice = self.getVoiceByName(voicename);
      } else {
        utterance.voice = self.getDefaultVoice();
      }
  
      utterance.onend = onend;
      speechSynthesis.speak(utterance);
    };
  
    self.cancel = function () {
      if (self.speaking) {
        speechSynthesis.cancel();
        self.speaking = false;
      }
    };
  
    self.pause = function () {
      if (self.speaking) {
        speechSynthesis.pause();
      }
    };
  
    self.resume = function () {
      if (self.speaking) {
        speechSynthesis.resume();
      }
    };
  
    self.getDefaultVoice = function () {
      if (voicecollection.length > 0) {
        return voicecollection[0];
      } else {
        return null;
      }
    };
  
    self.getVoiceByName = function (name) {
      for (var i = 0; i < voicecollection.length; i++) {
        if (voicecollection[i].name === name) {
          return voicecollection[i];
        }
      }
      return null;
    };
  };
  
  // Example usage
  var rv = new ResponsiveVoice();
  rv.init();
  
  // Speak a text
  rv.speak("Hello, world!");
  
  // Speak with a specific voice
  rv.setVoice(2);
  rv.speak("Hello, world!", "Daniel Compact");
  