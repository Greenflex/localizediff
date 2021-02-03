module.exports = (function () {
  function log(info) {
    console.log(info);
  }

  function error(info) {
    console.error(info);
  }

  function warn(info) {
    console.warn(info);
  }

  function clear() {
    console.clear();
  }

  return {
    log,
    error,
    clear,
    warn,
  };
})();
