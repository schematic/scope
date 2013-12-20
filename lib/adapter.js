exports.get = 
function get(scope, name) {
 return scope[name];
}

exports.set =
function set(scope, name, value) {
  scope[name] = value;
}
exports.has =
function has(scope, name) {
  return name in scope;
}
