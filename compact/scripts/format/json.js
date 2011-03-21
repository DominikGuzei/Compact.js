
if(!JSON) {
  define(['compact/format/json-org'], function(JSON) {
    return JSON;
  });
} else {
  define(function() {
    return JSON;
  });
}
