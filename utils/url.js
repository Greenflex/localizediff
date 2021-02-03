module.exports = (function () {
  function generateURIParameters(options) {
    let parametersUri = "?";
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (!value) return;
      switch (key) {
        case "localisebiz":
        case "key":
        case "pathToReactMessages":
        case "messagesFileName":
        case "pathToTranslations":
        case "languages":
        case "commandAfterSync":
          return;
        case "noComments":
          parametersUri += `no-comments=${options[key]}&`;
          break;
        case "noFolding":
          parametersUri += `no-folding=${options[key]}&`;
          break;
        case "ignoreNew":
          parametersUri += `ignore-new=${options[key]}&`;
          break;
        case "ignoreExisting":
          parametersUri += `ignore-existing=${options[key]}&`;
          break;
        case "tagNew":
          parametersUri += `tag-new=${options[key]}&`;
          break;
        case "tagAll":
          parametersUri += `tag-all=${options[key]}&`;
          break;
        case "unTagAll":
          parametersUri += `untag-all=${options[key]}&`;
          break;
        case "tagUpdated":
          parametersUri += `tag-updated=${options[key]}&`;
          break;
        case "tagAbsent":
          parametersUri += `tag-absent=${options[key]}&`;
          break;
        case "unTagAbsent":
          parametersUri += `untag-absent=${options[key]}&`;
          break;
        case "deleteAbsent":
          parametersUri += `delete-absent=${options[key]}&`;
          break;

        default:
          parametersUri += `${key}=${options[key]}&`;
          break;
      }
    });

    parametersUri = parametersUri.slice(0, -1);
    return parametersUri;
  }

  return {
    generateURIParameters,
  };
})();
