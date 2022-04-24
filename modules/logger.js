export class Logger {
   constructor(name) {
      this.module = name;
   }

   #parseType(type) {
      switch (type) {
         case 'info':
         case 'warn':
         case 'error':
         case 'debug':
            return type;
         default:
            return 'log';
      }
   }

   #getColor(type) {
      switch (type) {
         case 'info':
         case 'log':
         default:
            return '#7289da';
         case 'warn':
            return '#faa81a';
         case 'error':
            return '#ed4245';
         case 'debug':
            return '#686868';
      }
   }

   #log(type, ...message) {
      console[this.#parseType(type)](`%c[Discord Utilities${this.module ? `:${this.module}` : ''}]%c`, `color: ${this.#getColor(type)}; font-weight: 700;`, '', ...message);
   }

   log(...message) {
      this.#log('log', ...message);
   }

   info(...message) {
      this.#log('info', ...message);
   }

   warn(...message) {
      this.#log('warn', ...message);
   }

   error(...message) {
      this.#log('error', ...message);
   }

   debug(...message) {
      this.#log('debug', ...message);
   }

   static create(name) {
      return new Logger(name);
   }
}

export default Logger;