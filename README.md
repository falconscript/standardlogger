# standardlogger

> ES6 JS class for specifying log output verbosity, log colors, and timestamps

## Installation

```sh
npm install standardlogger --save
```

## Simple usage
ES6 JS class for specifying log output verbosity, log colors, and timestamps.  
All content is always just logged to console.log (stdout)
```js
let logger = require('standardlogger');

logger.INFO("[+] a message!");
logger.DEBUG("[+] a less important message!");
logger.WARN("[+] a threatening message");
```

## Make functions global
Make INFO/WARN/DEBUG/vDEBUG/DIE globally accessible functions across program
```js
logger.exportLoggerFunctionsToGlobal();
INFO("[+] a message!"); // No longer need to call with logger.INFO
WARN("[!] a threatening message again!");
```

## Change Verbosity
Lower the verbosity to disable some functions from printing when they're called.  
Verbosity priorities are: `{ vDEBUG: 2, DEBUG: 1, INFO: 0, WARN: -1 }`  
```js
logger.setLoggerVerbosity(0); // DEFAULT. only INFO/WARN calls will be printed
logger.setLoggerVerbosity(1); // only DEBUG/INFO/WARN calls will be printed
logger.setLoggerVerbosity(-1); // only WARN calls will be printed
```

## Colors
ALL log functions will color messages if you put certain strings in your message.  
Put `[D]` in your message to ensure it becomes light gray (like a debug message)  
Put `[!]` in your message to ensure it becomes bright yellow (like a warning)  
Put `[*]` in your message to ensure it becomes green (conveying success)  
```js
DEBUG("[D] Started request..."); // Will be light gray
INFO("[*] Successfully completed the request"); // Will be green
WARN("[-] Request gave us 404");

// Colors can be globally toggled on or off:
logger.turnOnColors(); // On by default
logger.turnOffColors();
```

## Timestamps
Timestamps are AUTOMATICALLY prefixed to all log calls in format of HH:MM:SS
```js
WARN("[!] DISK I/O error");
DEBUG("[D] User registered.");
// will output:
```
22:48:03 [!] DISK I/O error  
22:48:04 [D] User registered.
```js
// Timestamps can be turned ON or OFF for all functions:
logger.turnOnTimestamps(); // On by default
logger.turnOffTimestamps();
```

## DIE
DIE is a logger function that kills the program after printing. Useful for big errors  
```js
// This is a special function. This EXITS the program after logging your message
DIE("[!] Fatal error of some sort happened! Messages for DIE are ALWAYS printed.");
```

## Custom color triggers
You can add your own triggers to change message colors.  
i.e. if you want messages containing the word "cat" to always be "cyan"  
```js
// To add your own global color trigger:
logger.setColorTrigger("cat", "\x1b[36m"); // 1st arg is trigger, 2nd arg is color for cyan
INFO("the cat is in the tree"); // <-- will be printed cyan in terminal

// To remove a color trigger globally:
logger.removeColorTrigger("cat");
INFO("the cat is in the tree"); // <-- will be printed normally in terminal

// This is the full default color hash. You can use or remove these triggers always
{
  // '[+] ' will be just standard unaltered color by default (like any other message)
  '[*]': "\x1b[32m", // green for success (used to look for 'Successfully')
  '[D]': "\x1b[37m", // light gray for less important
  '[DDDD]': "\x1b[1;37m", // bold gray for medium importance
  '[!]': "\x1b[93m", // brighter yellow for warning
  '[!!!!]': "\x1b[1;31m", // dark red for BIG ERROR
  '[-]': "\x1B[33m", // darker yellow for milder warning
  '[%]': "\x1b[34m", // darker blue for... blue messages
}
```

## Credits
http://x64projects.tk/
