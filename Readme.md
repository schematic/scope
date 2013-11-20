
# scope

  Simple scope container, useful for template engines

## Installation

  Install with [component(1)](http://component.io):

    $ component install ilsken/scope

## API

### Scope(scopes...)
```javascript
var scope = new Scope({cat: 'mittens', dog: 'rover'}, {fish: 'bubbles', dog: 'rex', random: Math.random})
```

### .lookup(property)
Finds the first scope object that contains the property

```javascript
scope.lookup('cat') // {cat: 'mittens', dog: 'rover'}
```

### .get(property)
Returns the value of a property (same as `scope.lookup(property)[property]`)
```javascript
scope.get('dog') // 'rover'
```

### .value(property)
Returns the value of a property, if the value is a function it will call it with no arguments and return the result

```javascript
scope.value('dog') // 'rover'
scope.value('random') // returns scope.get('random')()
```

### .regenerate()
Regenerates the lookup function, you shouldn't need to call this unless you've messed with the internal scopes array


## License

  MIT
