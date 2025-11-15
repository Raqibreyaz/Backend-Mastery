/*

- class CustomEventEmitter
- object of events which are registered, value will be the event handler or list of event handlers
{
  [event_name]:{
    once: [boolean],
    handlers:[fn()]
  }
}

*/

class CustomEventEmitter {
  constructor() {
    this._events = {};
  }

  on(event_name, handler) {
    if (!this._events[event_name])
      this._events[event_name] = { once: false, handlers: [] };
    this._events[event_name].handlers.push(handler);
  }

  once(event_name, handler) {
    if (!this._events[event_name])
      this._events[event_name] = { once: true, handlers: [] };
    this._events[event_name].handlers.push(handler);
  }

  emit(event_name) {
    if (!this._events[event_name]) return;
    this._events[event_name].handlers.forEach((handler) => handler());

    // if this was to be run only once then remove it now
    if (this._events[event_name].once) delete this._events[event_name];
  }
}

const emitter = new CustomEventEmitter();

emitter.once("abc", () => console.log("abc handler ran"));

emitter.emit("abc");
emitter.emit("abc");
