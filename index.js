"use strict";

/**
 * StandardLogger
 * 
 * A logger with colors, timestamps, and function DIE that will log something then kill the process
 */
class StandardLogger {
  constructor () {
    this.defaultColorHash = {
      // '[+]' will be just standard unaltered color
      '[*]': "\x1b[32m", // green for success (used to look for 'Successfully')
      '[D]': "\x1b[37m", // light gray for less important
      '[DDDD]': "\x1b[1;37m", // bold gray for medium importance
      '[!]': "\x1b[93m", // brighter yellow for warning
      '[!!!!]': "\x1b[1;31m", // dark red for BIG ERROR
      '[-]': "\x1B[33m", // darker yellow for milder warning
      '[%]': "\x1b[34m", // darker blue for... blue messages
    };

    // Modifiable through _setConfig
    this.logConfig = {
      withColors: true,
      withTimestamps: true,
      colorHash: this.defaultColorHash,
      __verbose_level: 0,
    };

    this.resetColor = "\x1b[0m";
  }

  // private function that performs the actual message modification and piping to console.log
  _LOGFUNCTION () {
    let colorToAdd = false;

    if (this.logConfig.withColors) {
      // Check all string arguments for our triggers to find what color we should add
      for (let i in arguments) {
        if (typeof arguments[i] == "string") {
          for (let needle in this.logConfig.colorHash) {
            if (arguments[i].indexOf(needle) != -1) {
              colorToAdd = this.logConfig.colorHash[needle]; // match found, add color
              break;
            }
          }
        }
      }
    }
    
    // output the content now. using process.stdout.write instead to AVOID outputting newlines
    colorToAdd && process.stdout.write(colorToAdd); // output char to change color to green
    
    // output timestamp
    this.logConfig.withTimestamps && process.stdout.write(new Date().toISOString().substr(11, 8) + ' ');

    // log actual arguments passed
    console.log.apply(console, arguments);
    
    // output color normalizer (reset color)
    colorToAdd && process.stdout.write(this.resetColor);
  }

  DIE () {
    //let red = "\x1B[0;31m"; let boldRed="\x1B[1;31m";
    this._LOGFUNCTION.apply(this, arguments);
    this.INFO("[+] Exiting.");

    setTimeout(() => {
      this._LOGFUNCTION(`[!] ${this.constructor.name} - Process still alive 10s after calling DIE. Hard killing.`);
      process.exit(1);
    }, 10000);

    throw Array.prototype.join.apply(arguments, [' ']); // Throw in order to clear event loop queue (and send email)
  }

  WARN () { this.logConfig.__verbose_level >= -1 && this._LOGFUNCTION.apply(this, arguments); }
  INFO () { this.logConfig.__verbose_level >= 0 && this._LOGFUNCTION.apply(this, arguments); }
  DEBUG () { this.logConfig.__verbose_level >= 1 && this._LOGFUNCTION.apply(this, arguments); }
  vDEBUG () { this.logConfig.__verbose_level >= 2 && this._LOGFUNCTION.apply(this, arguments); }

  setLoggerVerbosity (v) { this._setConfig('__verbose_level', parseInt(v)); }

  exportLoggerFunctionsToGlobal () {
    // export all to global namespace
    ['INFO', 'DIE', 'DEBUG', 'vDEBUG', 'setLoggerVerbosity'].forEach((name, index) => {
      global[name] = this[name].bind(this);
    });
  }

  _setConfig (key, value=false) { this.logConfig[key] = value; }

  turnOnColors () { this._setConfig('withColors', true); }
  turnOffColors () { this._setConfig('withColors', false); }

  turnOnTimestamps () { this._setConfig('withTimestamps', true); }
  turnOffTimestamps () { this._setConfig('withTimestamps', false); }

  setColorTrigger (trigger, colorValue) { this.logConfig.defaultColorHash[trigger] = colorValue; }
  removeColorTrigger (trigger) { delete this.logConfig.defaultColorHash[trigger]; }
};


module.exports = new StandardLogger();
