/*!
 * Expose `Scope`
 */

exports = module.exports = Scope;

/*!
 * Default adapter
 */
var adapter = require('./lib/adapter');

/**
 * Creates a new Scope chain
 * @param {Array} scopes Array of scope objects, last objects have higher precedence
 * @param {Number} index Index from the end of the array to use for lookups (default: 0)
 */
function Scope(scopes, index) {
  if (!(this instanceof Scope)) return new Scope(scopes, index);
  this.scopes = scopes || [];
  this.adapter = adapter;
  this.index = index === undefined ? 0 : index;
  this.contexts = {};
}

/**
 * Gets the scope that contains the specified property
 * @param  {String} name Property name
 * @return {Object}      Scope that contains the property
 */ 
Scope.prototype.lookup = function(name) {
  return this.cache(name);
};

/**
 * Gets the value of a property, same as doing `scope.lookup(name)[name]`
 * You may pass a function to set the function used to retrieve values from the scope
 * @param  {String|Function} name or getter function
 * @return {Mixed}
 */
Scope.prototype.get = function(name) {
  if ('function' === typeof name) {
    this.adapter.get = name;
    return;
  }
  var scope = this.cache(name);
  if (scope instanceof Scope)
    return scope.get(name);
  else
    return this.adapter.get(scope, name);
};


/**
 * Sets the value of a property in the current scope
 * You may pass a function to set the function used to set values in the scope 
 * @param {String|Function} name
 * @param {Mixed} value
 * @param {Boolean} replace When set to true, the value will be set in the scope that contains this property instead of the highest precedence scope
 * @return
 */
Scope.prototype.set = function(name, value, replace) {
  if ('function' === typeof name) {
    this.adapter.set = name;
    return;
  }
  var scope = replace ? this.cache(name) || this.scopes[0] : this.scopes[0];
  if (scope instanceof Scope)
    return scope.set(name, value);
  else
    return this.adapter.set(scope, name, value);
};

Scope.prototype.has = function(name) {
  if ('function' === typeof name) {
    this.adapter.has = name;
    return;
  }
  return this.cache(name) !== undefined;
};

Scope.prototype.context = function(name, index) {
  if (arguments.length === 1)
    return this.contexts[name];
  else
    return this.contexts[name] = new Scope(this.scopes, index);
}

/**
 * Refreshes the lookup function cache.
 * You should only call this if you have manipulated the `scopes` array after construction
 *
 * @return
 */
Scope.prototype.refresh = function() {
  this.cache = compile(this.scopes, this.adapter, this.index);
};

/**
 * Cached lookup function for the current scope chain.
 * Should not be called directly.
 * @param {String} name
 * @return {Object} Scope containing `name`
 * @api private
 */
Scope.prototype.cache = function(name) {
  this.refresh();
  return this.cache(name);
};




/**
 * Compile a cached lookup function for a given array of scopes
 *
 * @param {Array} scopes
 * @return {Function}
 * @api private
 */
function compile(scopes, adapter, index) {
  var body = [];
  for (var i = scopes.length - index - 1; i >= 0; i--) {
    var scope = 'scopes[' + i + ']';
    body.push(
      'if ((', scope ,' instanceof Scope && '
      , scope,'.has(name)) || adapter.has(', scope ,', name)) return ', scope ,';\n');
  }
  return new Function(
      'scopes'
    , 'adapter'
    , 'Scope'
    , 'return function(name){  ' + body.join('') + ' }')(scopes, adapter, Scope);
}
