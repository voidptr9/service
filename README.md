# Service

Service is a tiny library (<50 SLOC) that exposes opinionated reactivity to plain ES object interfaces. By dynamically applying getters and setters, the overhead of proxy-based systems can be avoided.

Service is composed of, well, **services**. A service only runs its logic once (initially) and when it is mutated for subsequent updates. It never runs due to a change in `__proto__` or some other field that does not relate to the specific key.

A service itself represents the data entry to be manipulated. The API works in a way that brings the initial data upfront but hides the implementation.

> **Warning:** If you're not fond of `new Function` and language-semantics-breaking designs, then Service is not what you should be using.

## Usage

To ensure brevity, some behaviors have been intentionally morphed to fit the API usage hence a set of rules ought to be followed. A simple counter example would look like this:

```js
const { createService } = require("@voidptr9/service");

const countService = createService({
  count() {
    console.log(this.count);

    return 0;
  },
});

setInterval(() => {
  countService.count++;
}, 1000);
```

### Rules for defining services

- A service can be defined as a method with a static or dynamic identifier (i.e. `count` or `["count" + 2]`) but **never** a non-function.
- Accessing fields is the same as accessing the name of the service.
- `this` is bound to an object of the form `{ serviceName: serviceValue }`, e.g. `this.count` in the example above.
- Under the hood, the last `return` is extracted and executed separately. Therefore, it must be a primitive data type.
- Only the **last** `return` is extracted. Early returns are truncated via string manipulation. Don't define sub-functions. Keep your logic separate.
- There is no asynchronicity, obviously.

## Missing feature(s)

- [ ] **_Drivers_** for controlling update behavior. This is useful for extending the current behavior.

## Installation

```shell
$ npm install @voidptr9/service
```

## License

MIT License © Abdullahi Moalim.
