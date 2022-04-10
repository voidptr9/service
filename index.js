// Copyright (c) 2022 Abdullahi Moalim. All rights reserved.

// TODO: Implement drivers. Drivers can manipulate the state chain thus allowing
// features like nested services. A generic compose function can be used to
// create such a functionality.
const createService = (repr, ...drivers) => {
  const layer = Object.create(null);

  for (const key of Object.keys(repr)) {
    // Rules:
    //    1. Early returns are not allowed since all returns are truncated.
    //    2. We won't parse services so only non-complex entities are accepted.
    //    3. Pushing 'risky' logic to services mean that consequential security
    //       issues are entirely up to the user.
    if (typeof repr[key] == "function") {
      const _serviceFn = repr[key].toString();
      const _lastCallToReturn = (_serviceFn.match(/return\s?.+/gi) || []).pop();
      const _updateLogic = _serviceFn.replace(/return\s?.+/gi, "");
      // All early returns are ignored. Please don't tell TC39.
      const _rawInitialValue = new Function(_lastCallToReturn).call();
      // Recollect service logic for control.
      const _parsedUpdateLogic = new Function(
        `return {${_updateLogic}};`
      ).call()[key];

      layer[`0x_${key}`] = _rawInitialValue;

      // Execute the service on the first return.
      _parsedUpdateLogic.bind({ [key]: _rawInitialValue }).call();

      Object.defineProperty(layer, key, {
        get() {
          return layer[`0x_${key}`];
        },
        set: nextState => {
          _parsedUpdateLogic.bind({ [key]: nextState }).call();
          layer[`0x_${key}`] = nextState;
        },
      });
    } else {
      throw Error(
        "A service must be a function with either a static or dynamic identifier."
      );
    }
  }

  return layer;
};

module.exports = { createService };
