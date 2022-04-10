const { createService } = require("./");

const countService = createService({
  count() {
    console.log(this.count);

    return 0;
  },
});

setInterval(() => {
  countService.count++;
}, 1000);
