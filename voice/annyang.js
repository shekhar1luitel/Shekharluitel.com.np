(function (undefined) {
    "use strict";
  
    /**
     * # Quick Tutorial, Intro and Demos
     *
     * The quickest way to get started is to visit the [annyang homepage](https://www.talater.com/annyang/).
     *
     * For a more in-depth look at annyang, read on.
     *
     * # API Reference
     */
  
    // Save a reference to the global object (window in the browser)
    const root = this;
  
    // Get the SpeechRecognition object, while handling browser prefixes
    const SpeechRecognition = root.SpeechRecognition ||
                              root.webkitSpeechRecognition ||
                              root.mozSpeechRecognition ||
                              root.msSpeechRecognition ||
                              root.oSpeechRecognition;
  
    // Check browser support
    // This is done as early as possible, to make it as fast as possible for unsupported browsers
    if (!SpeechRecognition) {
      root.annyang = null;
      return undefined;
    }
  
    let commandsList = [];
    let recognition;
    const callbacks = { start: [], error: [], end: [], result: [], resultMatch: [], resultNoMatch: [], errorNetwork: [], errorPermissionBlocked: [], errorPermissionDenied: [] };
    let autoRestart;
    let lastStartedAt = 0;
    let debugState = false;
    const debugStyle = 'font-weight: bold; color: #00f;';
  
    // The command matching code is a modified version of Backbone.Router by Jeremy Ashkenas, under the MIT license.
    const optionalParam = /\s*\((.*?)\)\s*/g;
    const optionalRegex = /(\(\?:[^)]+\))\?/g;
    const namedParam    = /(\(\?)?:\w+/g;
    const splatParam    = /\*\w+/g;
    const escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#]/g;
    const commandToRegExp = function(command) {
      command = command.replace(escapeRegExp, '\\$&')
                    .replace(optionalParam, '(?:$1)?')
                    .replace(namedParam, function(match, optional) {
                      return optional ? match : '([^\\s]+)';
                    })
                    .replace(splatParam, '(.*?)')
                    .replace(optionalRegex, '\\s*$1?\\s*');
      return new RegExp('^' + command + '$', 'i');
    };
  
    // This method receives an array of callbacks to iterate over, and invokes each of them
    const invokeCallbacks = function(callbacks) {
      callbacks.forEach(function(callback) {
        callback.callback.apply(callback.context);
      });
    };
  
    const initIfNeeded = function() {
      if (!isInitialized()) {
        root.annyang.init({}, false);
      }
    };
  
    const isInitialized = function() {
      return recognition !== undefined;
    };
  
    root.annyang = {
  
      /**
       * Initialize annyang with a list of commands to recognize.
       *
       * ### Examples:
       *
       *     var commands = {'hello :name': helloFunction};
       *     var commands2 = {'hi': helloFunction};
       *
       *     // initialize annyang, overwriting any previously added commands
       *     annyang.init(commands, true);
       *     // adds an additional command without removing the previous commands
       *     annyang.init(commands2, false);
       *
       * As of v1.1.0 it is no longer required to call init(). Just start() listening whenever you want, and addCommands() whenever, and as often as you like.
       *
       * @param {Object} commands - Commands that annyang should listen to
       * @param {boolean} [resetCommands=true] - Remove all existing commands before initializing?
       */
      init: function(commands, resetCommands = true) {
        // Abort previous instances of recognition already running
        if (recognition && recognition.abort) {
          recognition.abort();
        }
  
        // initiate SpeechRecognition
        recognition = new SpeechRecognition();
  
        recognition.continuous = true;
        recognition.interimResults = false;
  
        recognition.onstart = function() {
          invokeCallbacks(callbacks.start);
        };
  
        recognition.onerror = function(event) {
          invokeCallbacks(callbacks.error);
          switch (event.error) {
            case 'network':
              invokeCallbacks(callbacks.errorNetwork);
              break;
            case 'not-allowed':
            case 'service-not-allowed':
              // if permission to use the mic is denied, turn off auto-restart
              autoRestart = false;
              // determine if permission was denied by user or automatically.
              if (new Date().getTime() - lastStartedAt < 200) {
                invokeCallbacks(callbacks.errorPermissionBlocked);
              } else {
                invokeCallbacks(callbacks.errorPermissionDenied);
              }
              break;
          }
        };
  
        recognition.onend = function() {
          invokeCallbacks(callbacks.end);
          // Auto-restart
          if (autoRestart) {
            if (new Date().getTime() - lastStartedAt < 200) {
              invokeCallbacks(callbacks.errorPermissionBlocked);
            } else {
              root.annyang.start();
            }
          }
        };
  
        recognition.onresult = function(event) {
          // Map the results to an array
          const speechResults = [];
          for (let i = event.resultIndex; i < event.results.length; i++) {
            speechResults.push(event.results[i][0].transcript);
          }
  
          let commandText;
          for (let j = 0; j < speechResults.length; j++) {
            commandText = speechResults[j].trim();
            if (debugState) {
              console.log('%cSpeech recognized: ' + commandText, debugStyle);
            }
            for (let i = 0, l = commandsList.length; i < l; i++) {
              const currentCommand = commandsList[i];
              const result = currentCommand.command.exec(commandText);
              if (result) {
                const parameters = result.slice(1);
                if (debugState) {
                  console.log('command matched: ' + currentCommand.originalPhrase);
                  if (parameters.length) {
                    console.log('with parameters', parameters);
                  }
                }
                currentCommand.callback.apply(this, parameters);
                invokeCallbacks(callbacks.resultMatch);
                return true;
              }
            }
          }
          invokeCallbacks(callbacks.resultNoMatch);
          return false;
        };
  
        if (resetCommands) {
          commandsList = [];
        }
  
        if (commands) {
          this.addCommands(commands);
        }
      },
  
      /**
       * Start listening.
       *
       * It's a good idea to call this after adding some commands first, but not mandatory.
       *
       * Receives an optional options object:
       *
       * #### Examples:
       *
       * ```javascript
       * // start listening, don't restart automatically
       * annyang.start({ autoRestart: false });
       * ```
       *
       * @param {Object} [options] - Optional options.
       * @param {boolean} [options.autoRestart=true] - If true, annyang will attempt to restart itself if the user stops talking while annyang is listening. (default: true)
       */
      start: function(options) {
        initIfNeeded();
        options = options || {};
        autoRestart = options.autoRestart !== undefined ? options.autoRestart : true;
        lastStartedAt = new Date().getTime();
        try {
          recognition.start();
        } catch (e) {
          if (debugState) {
            console.log(e.message);
          }
        }
      },
  
      /**
       * Stop listening, and turn off mic.
       *
       * Alternatively, to only temporarily pause annyang responding to commands without stopping the SpeechRecognition engine or closing the mic, use pause() instead.
       *
       * @see [pause()](#pause)
       */
      abort: function() {
        autoRestart = false;
        if (isInitialized()) {
          recognition.abort();
        }
      },
  
      /**
       * Turn off annyang's mic, stop listening to commands.
       *
       * Alternatively, to pause annyang responding to commands without stopping the SpeechRecognition engine or closing the mic, use pause() instead.
       *
       * @see [pause()](#pause)
       */
      pause: function() {
        if (isInitialized()) {
          recognition.stop();
        }
      },
  
      /**
       * Resumes listening and restores command callback execution when a command is recognized.
       * If SpeechRecognition was aborted (stopped), start it.
       *
       * Alternatively, to start the SpeechRecognition engine and mic without resuming annyang's command callback execution, use start() instead.
       *
       * @see [start()](#start)
       */
      resume: function() {
        if (isInitialized()) {
          recognition.start();
        }
      },
  
      /**
       * Remove all existing commands, or a specific command
       *
       * ### Examples:
       *
       * ```javascript
       * // Remove all existing commands
       * annyang.removeCommands();
       *
       * // Remove a specific command
       * annyang.removeCommands('hello');
       * ```
       *
       * @param {string} [commandName] - Optional name of the command to remove
       */
      removeCommands: function(commandName) {
        if (commandName) {
          for (let i = commandsList.length - 1; i >= 0; i--) {
            if (commandsList[i].commandName === commandName) {
              commandsList.splice(i, 1);
            }
          }
        } else {
          commandsList = [];
        }
      },
  
      /**
       * Returns true if speech recognition is currently on.
       *
       * @return {boolean} speech recognition is on
       */
      isListening: function() {
        return recognition && recognition.listening;
      },
  
      /**
       * Returns the instance of the browser's SpeechRecognition object used by annyang.
       * Useful in case you want direct access to the browser's Speech Recognition engine.
       *
       * @return {SpeechRecognition|undefined} The browser's Speech Recognizer
       */
      getSpeechRecognizer: function() {
        return recognition;
      },
  
      /**
       * Simulate speech being recognized. This will trigger the same events and behavior as when the Speech Recognition
       * detects speech.
       *
       * Can accept either a string containing a single sentence, or an array containing multiple sentences to be recognized
       * sequentially.
       *
       * #### Examples:
       *
       * ```javascript
       * annyang.trigger('Time for some thrilling heroics');
       * annyang.trigger(
       *   ['Time for some thrilling heroics', 'Time for some thrilling', 'Time for some thrilling heroics']
       * );
       * ```
       *
       * @param {string|array} sentences - A sentence as a string or an array of sentences to be recognized sequentially.
       */
      trigger: function(sentences) {
        if (!Array.isArray(sentences)) {
          sentences = [sentences];
        }
        root.setTimeout(function() {
          annyang.abort();
          for (let i = 0; i < sentences.length; i++) {
            invokeCallbacks(callbacks.result, [{ transcript: sentences[i] }]);
          }
          root.setTimeout(function() {
            annyang.resume();
          }, 1);
        }, 1);
      },
  
      /**
       * Add commands that annyang will respond to. Similar in syntax to init(), but doesn't remove existing commands.
       *
       * #### Examples:
       *
       * ```javascript
       * var commands = {'hello :name': helloFunction, 'goodbye': goodbyeFunction};
       * annyang.addCommands(commands);
       * ```
       *
       * You can also pass a single command string.
       *
       * ```javascript
       * annyang.addCommands('hello :name', helloFunction);
       * ```
       *
       * Or multiple command strings.
       *
       * ```javascript
       * annyang.addCommands('hello :name', 'goodbye', helloOrGoodbyeFunction);
       * ```
       *
       * @param {Object|string} commands - Commands that annyang should listen to, in the format {'commandName': functionToCall}.
       */
      addCommands: function(commands) {
        let cb;
        let commandName;
        let phrase;
        const regex = [];
        const commandObj = {};
  
        if (typeof commands === 'object' && !(commands instanceof Array)) {
          for (commandName in commands) {
            // convert command to regex
            if (commands.hasOwnProperty(commandName)) {
              cb = root.annyang.commands[commandName] || commands[commandName];
              if (typeof cb === 'function') {
                commandObj[commandName] = {
                  command: commandToRegExp(commandName),
                  callback: cb,
                  originalPhrase: commandName
                };
                commandsList.push(commandObj[commandName]);
                regex.push(commandObj[commandName].command);
              }
            }
          }
        } else {
          throw new Error('The first argument must be either an object or a string.');
        }
      },
  
      /**
       * Set the language the user will speak in. If this method is not called, defaults to 'en-US'.
       *
       * @param {string} language - The language (locale) string to use. Must be a valid BCP 47 language tag.
       */
      setLanguage: function(language) {
        initIfNeeded();
        recognition.lang = language;
      },
  
      /**
       * Start the continuous speech recognition service and send it to the background.
       * It stops automatically when the browser stops speech recognition.
       *
       * You can also pass optional parameters in the options object:
       * - `autoRestart`: If true, it will attempt to restart itself if the user stops talking while annyang is listening. (default: true)
       *
       * @param {Object} [options] - Optional options.
       * @param {boolean} [options.autoRestart=true] - If true, annyang will attempt to restart itself if the user stops talking while annyang is listening. (default: true)
       */
      startContinuous: function(options) {
        options = options || {};
        options.autoRestart = options.autoRestart !== undefined ? options.autoRestart : true;
        autoRestart = options.autoRestart;
        this.start(options);
      },
  
      /**
       * Add a callback function to be called in case one of the following events happens:
       * - `start`: Fired as soon as the browser's Speech Recognition engine starts listening.
       * - `error`: Fired when the browser's Speech Recognition engine returns an error, or if something goes wrong during recognition.
       * - `end`: Fired when the browser's Speech Recognition engine stops.
       * - `result`: Fired when the browser's Speech Recognition engine returns a result.
       * - `resultMatch`: Fired when the speech recognized matches a command.
       * - `resultNoMatch`: Fired when the speech recognized doesn't match any of the registered commands.
       * - `errorNetwork`: Fired when Speech Recognition fails because of a network error.
       * - `errorPermissionBlocked`: Fired when the browser blocks the permission to use Speech Recognition.
       * - `errorPermissionDenied`: Fired when the user blocks the permission to use Speech Recognition.
       *
       * #### Examples:
       *
       * ```javascript
       * // When annyang starts to listen, run this callback function
       * annyang.addCallback('start', function() {
       *   console.log('Speech Recognition engine started');
       * });
       *
       * // When a command is recognized by annyang, run this callback with the recognized command as its parameter
       * annyang.addCallback('result', function(userSaid) {
       *   console.log(userSaid);
       * });
       * ```
       *
       * @param {string} type - Name of the event that will trigger the callback.
       * @param {Function} callback - The function to call when event is triggered.
       */
      addCallback: function(type, callback) {
        if (callbacks.hasOwnProperty(type)) {
          callbacks[type].push(callback);
        } else {
          throw new Error('Callback type not supported: ' + type);
        }
      },
  
      /**
       * Remove callbacks from events.
       *
       * - `start`: Fired as soon as the browser's Speech Recognition engine starts listening.
       * - `error`: Fired when the browser's Speech Recognition engine returns an error, or if something goes wrong during recognition.
       * - `end`: Fired when the browser's Speech Recognition engine stops.
       * - `result`: Fired when the browser's Speech Recognition engine returns a result.
       * - `resultMatch`: Fired when the speech recognized matches a command.
       * - `resultNoMatch`: Fired when the speech recognized doesn't match any of the registered commands.
       * - `errorNetwork`: Fired when Speech Recognition fails because of a network error.
       * - `errorPermissionBlocked`: Fired when the browser blocks the permission to use Speech Recognition.
       * - `errorPermissionDenied`: Fired when the user blocks the permission to use Speech Recognition.
       *
       * If called without parameters, removes all callbacks for all events.
       * If called with a parameter, removes all callbacks for that event.
       * If called with two parameters, removes the specific callback function from the event.
       *
       * #### Examples:
       *
       * ```javascript
       * // Remove all callbacks from all events
       * annyang.removeCallback();
       *
       * // Remove all callbacks attached to end event
       * annyang.removeCallback('end');
       *
       * // Remove specific callback from end event
       * var callback = function() {
       *   console.log('This will never be called');
       * };
       * annyang.addCallback('end', callback);
       * annyang.removeCallback('end', callback);
       * ```
       *
       * @param {string} [type] - Name of event to remove callbacks from.
       * @param {Function} [callback] - The specific callback to remove.
       */
      removeCallback: function(type, callback) {
        if (!type) {
          callbacks = {};
          return;
        }
  
        if (callbacks.hasOwnProperty(type)) {
          if (callback) {
            for (let i = callbacks[type].length - 1; i >= 0; i--) {
              if (callbacks[type][i] === callback) {
                callbacks[type].splice(i, 1);
              }
            }
          } else {
            callbacks[type] = [];
          }
        } else {
          throw new Error('Callback type not supported: ' + type);
        }
      }
    };
  
    root.annyang = annyang;
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return annyang;
      });
    } else if (typeof module === 'object' && module.exports) {
      module.exports = annyang;
    } else {
      root.exports = root.annyang;
    }
  
    if (typeof root.initAnnyang === 'function') {
      root.initAnnyang(annyang);
    }
  })(window, document);
  (function (undefined) {
    "use strict";
  
    /**
     * # Quick Tutorial, Intro and Demos
     *
     * The quickest way to get started is to visit the [annyang homepage](https://www.talater.com/annyang/).
     *
     * For a more in-depth look at annyang, read on.
     *
     * # API Reference
     */
  
    // Save a reference to the global object (window in the browser)
    const root = this;
  
    // Get the SpeechRecognition object, while handling browser prefixes
    const SpeechRecognition = root.SpeechRecognition ||
                              root.webkitSpeechRecognition ||
                              root.mozSpeechRecognition ||
                              root.msSpeechRecognition ||
                              root.oSpeechRecognition;
  
    // Check browser support
    // This is done as early as possible, to make it as fast as possible for unsupported browsers
    if (!SpeechRecognition) {
      root.annyang = null;
      return undefined;
    }
  
    let commandsList = [];
    let recognition;
    const callbacks = { start: [], error: [], end: [], result: [], resultMatch: [], resultNoMatch: [], errorNetwork: [], errorPermissionBlocked: [], errorPermissionDenied: [] };
    let autoRestart;
    let lastStartedAt = 0;
    let debugState = false;
    const debugStyle = 'font-weight: bold; color: #00f;';
  
    // The command matching code is a modified version of Backbone.Router by Jeremy Ashkenas, under the MIT license.
    const optionalParam = /\s*\((.*?)\)\s*/g;
    const optionalRegex = /(\(\?:[^)]+\))\?/g;
    const namedParam    = /(\(\?)?:\w+/g;
    const splatParam    = /\*\w+/g;
    const escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#]/g;
    const commandToRegExp = function(command) {
      command = command.replace(escapeRegExp, '\\$&')
                    .replace(optionalParam, '(?:$1)?')
                    .replace(namedParam, function(match, optional) {
                      return optional ? match : '([^\\s]+)';
                    })
                    .replace(splatParam, '(.*?)')
                    .replace(optionalRegex, '\\s*$1?\\s*');
      return new RegExp('^' + command + '$', 'i');
    };
  
    // This method receives an array of callbacks to iterate over, and invokes each of them
    const invokeCallbacks = function(callbacks) {
      callbacks.forEach(function(callback) {
        callback.callback.apply(callback.context);
      });
    };
  
    const initIfNeeded = function() {
      if (!isInitialized()) {
        root.annyang.init({}, false);
      }
    };
  
    const isInitialized = function() {
      return recognition !== undefined;
    };
  
    root.annyang = {
  
      /**
       * Initialize annyang with a list of commands to recognize.
       *
       * ### Examples:
       *
       *     var commands = {'hello :name': helloFunction};
       *     var commands2 = {'hi': helloFunction};
       *
       *     // initialize annyang, overwriting any previously added commands
       *     annyang.init(commands, true);
       *     // adds an additional command without removing the previous commands
       *     annyang.init(commands2, false);
       *
       * As of v1.1.0 it is no longer required to call init(). Just start() listening whenever you want, and addCommands() whenever, and as often as you like.
       *
       * @param {Object} commands - Commands that annyang should listen to
       * @param {boolean} [resetCommands=true] - Remove all existing commands before initializing?
       */
      init: function(commands, resetCommands = true) {
        // Abort previous instances of recognition already running
        if (recognition && recognition.abort) {
          recognition.abort();
        }
  
        // initiate SpeechRecognition
        recognition = new SpeechRecognition();
  
        recognition.continuous = true;
        recognition.interimResults = false;
  
        recognition.onstart = function() {
          invokeCallbacks(callbacks.start);
        };
  
        recognition.onerror = function(event) {
          invokeCallbacks(callbacks.error);
          switch (event.error) {
            case 'network':
              invokeCallbacks(callbacks.errorNetwork);
              break;
            case 'not-allowed':
            case 'service-not-allowed':
              // if permission to use the mic is denied, turn off auto-restart
              autoRestart = false;
              // determine if permission was denied by user or automatically.
              if (new Date().getTime() - lastStartedAt < 200) {
                invokeCallbacks(callbacks.errorPermissionBlocked);
              } else {
                invokeCallbacks(callbacks.errorPermissionDenied);
              }
              break;
          }
        };
  
        recognition.onend = function() {
          invokeCallbacks(callbacks.end);
          // Auto-restart
          if (autoRestart) {
            if (new Date().getTime() - lastStartedAt < 200) {
              invokeCallbacks(callbacks.errorPermissionBlocked);
            } else {
              root.annyang.start();
            }
          }
        };
  
        recognition.onresult = function(event) {
          // Map the results to an array
          const speechResults = [];
          for (let i = event.resultIndex; i < event.results.length; i++) {
            speechResults.push(event.results[i][0].transcript);
          }
  
          let commandText;
          for (let j = 0; j < speechResults.length; j++) {
            commandText = speechResults[j].trim();
            if (debugState) {
              console.log('%cSpeech recognized: ' + commandText, debugStyle);
            }
            for (let i = 0, l = commandsList.length; i < l; i++) {
              const currentCommand = commandsList[i];
              const result = currentCommand.command.exec(commandText);
              if (result) {
                const parameters = result.slice(1);
                if (debugState) {
                  console.log('command matched: ' + currentCommand.originalPhrase);
                  if (parameters.length) {
                    console.log('with parameters', parameters);
                  }
                }
                currentCommand.callback.apply(this, parameters);
                invokeCallbacks(callbacks.resultMatch);
                return true;
              }
            }
          }
          invokeCallbacks(callbacks.resultNoMatch);
          return false;
        };
  
        if (resetCommands) {
          commandsList = [];
        }
  
        if (commands) {
          this.addCommands(commands);
        }
      },
  
      /**
       * Start listening.
       *
       * It's a good idea to call this after adding some commands first, but not mandatory.
       *
       * Receives an optional options object:
       *
       * #### Examples:
       *
       * ```javascript
       * // start listening, don't restart automatically
       * annyang.start({ autoRestart: false });
       * ```
       *
       * @param {Object} [options] - Optional options.
       * @param {boolean} [options.autoRestart=true] - If true, annyang will attempt to restart itself if the user stops talking while annyang is listening. (default: true)
       */
      start: function(options) {
        initIfNeeded();
        options = options || {};
        autoRestart = options.autoRestart !== undefined ? options.autoRestart : true;
        lastStartedAt = new Date().getTime();
        try {
          recognition.start();
        } catch (e) {
          if (debugState) {
            console.log(e.message);
          }
        }
      },
  
      /**
       * Stop listening, and turn off mic.
       *
       * Alternatively, to only temporarily pause annyang responding to commands without stopping the SpeechRecognition engine or closing the mic, use pause() instead.
       *
       * @see [pause()](#pause)
       */
      abort: function() {
        autoRestart = false;
        if (isInitialized()) {
          recognition.abort();
        }
      },
  
      /**
       * Turn off annyang's mic, stop listening to commands.
       *
       * Alternatively, to pause annyang responding to commands without stopping the SpeechRecognition engine or closing the mic, use pause() instead.
       *
       * @see [pause()](#pause)
       */
      pause: function() {
        if (isInitialized()) {
          recognition.stop();
        }
      },
  
      /**
       * Resumes listening and restores command callback execution when a command is recognized.
       * If SpeechRecognition was aborted (stopped), start it.
       *
       * Alternatively, to start the SpeechRecognition engine and mic without resuming annyang's command callback execution, use start() instead.
       *
       * @see [start()](#start)
       */
      resume: function() {
        if (isInitialized()) {
          recognition.start();
        }
      },
  
      /**
       * Remove all existing commands, or a specific command
       *
       * ### Examples:
       *
       * ```javascript
       * // Remove all existing commands
       * annyang.removeCommands();
       *
       * // Remove a specific command
       * annyang.removeCommands('hello');
       * ```
       *
       * @param {string} [commandName] - Optional name of the command to remove
       */
      removeCommands: function(commandName) {
        if (commandName) {
          for (let i = commandsList.length - 1; i >= 0; i--) {
            if (commandsList[i].commandName === commandName) {
              commandsList.splice(i, 1);
            }
          }
        } else {
          commandsList = [];
        }
      },
  
      /**
       * Returns true if speech recognition is currently on.
       *
       * @return {boolean} speech recognition is on
       */
      isListening: function() {
        return recognition && recognition.listening;
      },
  
      /**
       * Returns the instance of the browser's SpeechRecognition object used by annyang.
       * Useful in case you want direct access to the browser's Speech Recognition engine.
       *
       * @return {SpeechRecognition|undefined} The browser's Speech Recognizer
       */
      getSpeechRecognizer: function() {
        return recognition;
      },
  
      /**
       * Simulate speech being recognized. This will trigger the same events and behavior as when the Speech Recognition
       * detects speech.
       *
       * Can accept either a string containing a single sentence, or an array containing multiple sentences to be recognized
       * sequentially.
       *
       * #### Examples:
       *
       * ```javascript
       * annyang.trigger('Time for some thrilling heroics');
       * annyang.trigger(
       *   ['Time for some thrilling heroics', 'Time for some thrilling', 'Time for some thrilling heroics']
       * );
       * ```
       *
       * @param {string|array} sentences - A sentence as a string or an array of sentences to be recognized sequentially.
       */
      trigger: function(sentences) {
        if (!Array.isArray(sentences)) {
          sentences = [sentences];
        }
        root.setTimeout(function() {
          annyang.abort();
          for (let i = 0; i < sentences.length; i++) {
            invokeCallbacks(callbacks.result, [{ transcript: sentences[i] }]);
          }
          root.setTimeout(function() {
            annyang.resume();
          }, 1);
        }, 1);
      },
  
      /**
       * Add commands that annyang will respond to. Similar in syntax to init(), but doesn't remove existing commands.
       *
       * #### Examples:
       *
       * ```javascript
       * var commands = {'hello :name': helloFunction, 'goodbye': goodbyeFunction};
       * annyang.addCommands(commands);
       * ```
       *
       * You can also pass a single command string.
       *
       * ```javascript
       * annyang.addCommands('hello :name', helloFunction);
       * ```
       *
       * Or multiple command strings.
       *
       * ```javascript
       * annyang.addCommands('hello :name', 'goodbye', helloOrGoodbyeFunction);
       * ```
       *
       * @param {Object|string} commands - Commands that annyang should listen to, in the format {'commandName': functionToCall}.
       */
      addCommands: function(commands) {
        let cb;
        let commandName;
        let phrase;
        const regex = [];
        const commandObj = {};
  
        if (typeof commands === 'object' && !(commands instanceof Array)) {
          for (commandName in commands) {
            // convert command to regex
            if (commands.hasOwnProperty(commandName)) {
              cb = root.annyang.commands[commandName] || commands[commandName];
              if (typeof cb === 'function') {
                commandObj[commandName] = {
                  command: commandToRegExp(commandName),
                  callback: cb,
                  originalPhrase: commandName
                };
                commandsList.push(commandObj[commandName]);
                regex.push(commandObj[commandName].command);
              }
            }
          }
        } else {
          throw new Error('The first argument must be either an object or a string.');
        }
      },
  
      /**
       * Set the language the user will speak in. If this method is not called, defaults to 'en-US'.
       *
       * @param {string} language - The language (locale) string to use. Must be a valid BCP 47 language tag.
       */
      setLanguage: function(language) {
        initIfNeeded();
        recognition.lang = language;
      },
  
      /**
       * Start the continuous speech recognition service and send it to the background.
       * It stops automatically when the browser stops speech recognition.
       *
       * You can also pass optional parameters in the options object:
       * - `autoRestart`: If true, it will attempt to restart itself if the user stops talking while annyang is listening. (default: true)
       *
       * @param {Object} [options] - Optional options.
       * @param {boolean} [options.autoRestart=true] - If true, annyang will attempt to restart itself if the user stops talking while annyang is listening. (default: true)
       */
      startContinuous: function(options) {
        options = options || {};
        options.autoRestart = options.autoRestart !== undefined ? options.autoRestart : true;
        autoRestart = options.autoRestart;
        this.start(options);
      },
  
      /**
       * Add a callback function to be called in case one of the following events happens:
       * - `start`: Fired as soon as the browser's Speech Recognition engine starts listening.
       * - `error`: Fired when the browser's Speech Recognition engine returns an error, or if something goes wrong during recognition.
       * - `end`: Fired when the browser's Speech Recognition engine stops.
       * - `result`: Fired when the browser's Speech Recognition engine returns a result.
       * - `resultMatch`: Fired when the speech recognized matches a command.
       * - `resultNoMatch`: Fired when the speech recognized doesn't match any of the registered commands.
       * - `errorNetwork`: Fired when Speech Recognition fails because of a network error.
       * - `errorPermissionBlocked`: Fired when the browser blocks the permission to use Speech Recognition.
       * - `errorPermissionDenied`: Fired when the user blocks the permission to use Speech Recognition.
       *
       * #### Examples:
       *
       * ```javascript
       * // When annyang starts to listen, run this callback function
       * annyang.addCallback('start', function() {
       *   console.log('Speech Recognition engine started');
       * });
       *
       * // When a command is recognized by annyang, run this callback with the recognized command as its parameter
       * annyang.addCallback('result', function(userSaid) {
       *   console.log(userSaid);
       * });
       * ```
       *
       * @param {string} type - Name of the event that will trigger the callback.
       * @param {Function} callback - The function to call when event is triggered.
       */
      addCallback: function(type, callback) {
        if (callbacks.hasOwnProperty(type)) {
          callbacks[type].push(callback);
        } else {
          throw new Error('Callback type not supported: ' + type);
        }
      },
  
      /**
       * Remove callbacks from events.
       *
       * - `start`: Fired as soon as the browser's Speech Recognition engine starts listening.
       * - `error`: Fired when the browser's Speech Recognition engine returns an error, or if something goes wrong during recognition.
       * - `end`: Fired when the browser's Speech Recognition engine stops.
       * - `result`: Fired when the browser's Speech Recognition engine returns a result.
       * - `resultMatch`: Fired when the speech recognized matches a command.
       * - `resultNoMatch`: Fired when the speech recognized doesn't match any of the registered commands.
       * - `errorNetwork`: Fired when Speech Recognition fails because of a network error.
       * - `errorPermissionBlocked`: Fired when the browser blocks the permission to use Speech Recognition.
       * - `errorPermissionDenied`: Fired when the user blocks the permission to use Speech Recognition.
       *
       * If called without parameters, removes all callbacks for all events.
       * If called with a parameter, removes all callbacks for that event.
       * If called with two parameters, removes the specific callback function from the event.
       *
       * #### Examples:
       *
       * ```javascript
       * // Remove all callbacks from all events
       * annyang.removeCallback();
       *
       * // Remove all callbacks attached to end event
       * annyang.removeCallback('end');
       *
       * // Remove specific callback from end event
       * var callback = function() {
       *   console.log('This will never be called');
       * };
       * annyang.addCallback('end', callback);
       * annyang.removeCallback('end', callback);
       * ```
       *
       * @param {string} [type] - Name of event to remove callbacks from.
       * @param {Function} [callback] - The specific callback to remove.
       */
      removeCallback: function(type, callback) {
        if (!type) {
          callbacks = {};
          return;
        }
  
        if (callbacks.hasOwnProperty(type)) {
          if (callback) {
            for (let i = callbacks[type].length - 1; i >= 0; i--) {
              if (callbacks[type][i] === callback) {
                callbacks[type].splice(i, 1);
              }
            }
          } else {
            callbacks[type] = [];
          }
        } else {
          throw new Error('Callback type not supported: ' + type);
        }
      }
    };
  
    root.annyang = annyang;
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return annyang;
      });
    } else if (typeof module === 'object' && module.exports) {
      module.exports = annyang;
    } else {
      root.exports = root.annyang;
    }
  
    if (typeof root.initAnnyang === 'function') {
      root.initAnnyang(annyang);
    }
  })(window, document);
    