
# scope

  Simple scope container, useful for template engines

## Installation

  Install with [component(1)](http://component.io):

    $ component install schematic/scope

## Usage

### Creating a Scope
```javascript
var model = { 
  first_name: 'Chris',
  last_name: 'Tarq'
};
var view = { 
  full_name: function() { 
    return model.first_name + ' ' + model.last_name 
  },
  date: (new Date()).toString()
};

var scope = new Scope([model, view]);
```

### Scope Lookup
```javascript
model === scope.lookup('first_name') // true
view === scope.lookup('full_name') // true
```

### Getting Values
```javascript
scope.get('first_name'); // "Chris"
scope.get('date');       // "Thu Dec 19 2013 19:03:19 GMT-0500 (EST)"
scope.get('full_name');  // returns the full_name function
scope.get('foo');        // undefined
```

### Setting Values
```javascript
scope.set('first_name', 'Mike'); // view.first_name is now `Mike` (sets value on the highest precedence)
delete view.first_name;
scope.set('first_name', 'Chris', true); // model.first_name is now `Chris` (using the replace flag)
```

### Checking Values
```javascript
if (scope.has('first_name')) {
  // one of the scopes in the chain has the property "first_name"
}
```

### Custom Adapters
You can change how your `Scope` object gets/sets values by passing a function to the `get`, `set`, or `has` functions

```javascript
// automatically call functions
scope.get(function(object, name) {
  if ('function' === typeof object[name]) return object[name]();
  else return object[name];
})

var first_name = scope.get('first_name'); // returns "Chris Tarq"

scope.set(function (object, name, value) { /* set adapter */ });
scope.has(function (object, name){ /* has adapter */ })
```

### Embedded Scopes
The default get/set/has adapter will automatically resolve values if you include a scope object in your chain.

This is helpful because you can have each scope use a different adapter, for example perhaps only the view scope executes functions automatically and the model scope uses a backbone-compatiable adapter.

```javascript
var modelViewScope = new Scope([model, view])
var execScope = new Scope([modelViewScope, {event: someEvent}])

execScope.get('first_name') // "Chris"
execScope.get('full_name') // "Chris Tarq" 
execScope.get('event') // `someEvent` object
```
### Manipulation Scopes
You can directly manipulate the scope chain via the `scopes` property. Just make sure you call `refresh` afterwards to reset the cache

```javascript
scope.scopes.push(some_scope);
scope.refresh(); // `some_scope` is now the top level scope
```
### Named Contexts / Views
I'm not entirely sure how useful this is but it allows you to create "views" of a `Scope` object without cloning/slicing the array. The `context` function will return a `Scope` container that will skip a specified number of scopes in the chain. 

May be removed in future versions.
```javascript
var scope = new Scope([model, view, {event: someEvent}]);
var context = scope.context('model', 2); // returns a Scope object that skips 2 scopes
// context will skip the event/view scopes
console.log(context.get('event')) // `undefined`
console.log(context.get('full_name')) // `undefined`
console.log(context.get('first_name')) // "Chris"
```


## License

  MIT
