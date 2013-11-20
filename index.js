var slice = Array.prototype.slice
/**
 * Creates a new Scope chain
 * @params {...} Objects to use as the lookup chain, first objects have higher precedence
 */
function Scope(){
	var self = this instanceof Scope 
		? this 
		: Object.create(Scope.prototype)

	self.scopes = slice.call(arguments)
	self.regenerate()
	// factory method
	if(self !== this) return self
}

/**
 * Returns the value of a property, passed to views
 * @param  {String} prop Property name
 * @return {Mixed}      
 */
Scope.prototype.value = function(prop){
	var scope = this.$lookup(prop)
	if(typeof scope[prop] == 'function'){
		return scope[prop]();
	} else{
		return scope[prop]
	}
}

/**
 * Finds the scope that contains the specified property
 * @param  {String} prop Property name
 * @return {Object}      Scope that contains the property
 */	
Scope.prototype.lookup = function(prop){
	return this.$lookup(prop)
}

/**
 * Returns the value of a property, same as doing `scope.lookup(prop)[prop]`
 * @param  {[type]} prop [description]
 * @return {[type]}      [description]
 */
Scope.prototype.get = function(prop){
	return this.$lookup(prop)[prop]
}

/**
 * [ description]
 * @return {[type]} [description]
 */
Scope.prototype.regenerate = function(){
	this.$lookup = _lookup(this.scopes)
}

/*!
 * interal function that generates a lookup function given a specified scope array
 * @private
 */
function _lookup(scopes){
	scopes = Array.isArray(scopes) ? scopes : [undefined]

	var body = scopes.map(function(scope, i){
		scope = '$scope[' + i + ']';
		return 'if(' + scope +'.hasOwnProperty(prop)) return ' + scope;
	}).join(';\n')
	return new Function('$scope', 'return function(prop){  ' + body + ' }')(scopes)
}