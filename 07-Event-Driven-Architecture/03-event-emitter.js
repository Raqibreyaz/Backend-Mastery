import EventEmitter from "events";

const emitter = new EventEmitter();

/*
- on emitting event to listener(s), the event then get deleted, only for once()
- that's why here .once() event only handled once and then get deleted
- emitter._events to see current undeleted events
*/

emitter.on("abc", () => console.log("first abc ran"));

emitter.on("abc", () => console.log("second abc ran"));

emitter.on("xyz", () => console.log("xyz ran"));

console.log(emitter._events);
emitter.emit("abc");
console.log(emitter._events);

emitter.emit("xyz");
console.log(emitter._events);
