var assert = require('assert')
var Scope = require('../')

describe('Scope', function () {
  var model = {first_name: 'Chris', last_name: 'Tarq'};
  var view = {
    full_name: function (){
      return model.first_name + model.last_name;
    }
  };

  var scope = new Scope([model, view]);
  it('should lookup the proper scope', function (){
    assert(model === scope.lookup('first_name'), 'should get model scope');
    assert(view === scope.lookup('full_name'), 'should get view scope');
  })
  it('should allow embedded scopes', function (){
    scope.scopes.push(new Scope([{foo: 'bar'}]));
    scope.refresh();
    assert(scope.get('foo') === 'bar', 'should get foo from scope')
  })
})
