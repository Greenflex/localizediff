module.exports = (function () {
  function log(info) {
    console.log(info);
  }

  function error(info) {
    console.error(info);
  }

  return {
    log,
    error,
  };
})();
