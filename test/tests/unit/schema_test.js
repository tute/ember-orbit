import Orbit from 'orbit';
import Schema from 'ember_orbit/schema';
import attr from 'ember_orbit/attr';
import hasOne from 'ember_orbit/relationships/has_one';
import hasMany from 'ember_orbit/relationships/has_many';
import Model from 'ember_orbit/model';

var get = Ember.get,
    set = Ember.set;

var schema;

module("Unit - Schema", {
  setup: function() {
    schema = Schema.create();
  },

  teardown: function() {
    schema = null;
  }
});

test("it exists", function() {
  ok(schema);
});

test("it has an `idField` of `clientid` by default", function() {
  equal(get(schema, 'idField'), 'clientid');
});

test("its `idField` can be customized", function() {
  schema = Schema.create({idField: 'cid'});
  equal(get(schema, 'idField'), 'cid');
});

test("#defineModel defines models on the underlying Orbit schema", function() {
  var Star,
      Moon,
      Planet;

  Star = Model.extend({
    name: attr('string'),
    planets: hasMany('planet')
  });

  Moon = Model.extend({
    name: attr('string'),
    planet: hasOne('planet')
  });

  Planet = Model.extend({
    name: attr('string'),
    classification: attr('string'),
    sun: hasOne('star'),
    moons: hasMany('moon')
  });         

  schema.defineModel('star', Star);
  schema.defineModel('moon', Moon);
  schema.defineModel('planet', Planet);

  deepEqual(schema.models(), ['star', 'moon', 'planet']);

  deepEqual(schema.attributes('star'), ['name']);
  deepEqual(schema.links('star'), ['planets']);
  deepEqual(schema.attributeProperties('star', 'name'), {
    isAttribute: true,
    name: "name",
    options: {},
    type: "string"
  });
  deepEqual(schema.linkProperties('star', 'planets'), {
    isLink: true,
    name: "planets",
    options: {
      hasOne: false
    },
    type: "planet"
  });

  deepEqual(schema.attributes('moon'), ['name']);
  deepEqual(schema.links('moon'), ['planet']);
  deepEqual(schema.attributeProperties('moon', 'name'), {
    isAttribute: true,
    name: "name",
    options: {},
    type: "string"
  });
  deepEqual(schema.linkProperties('moon', 'planet'), {
    isLink: true,
    name: "planet",
    options: {
      hasOne: true
    },
    type: "planet"
  });

  deepEqual(schema.attributes('planet'), ['name', 'classification']);
  deepEqual(schema.links('planet'), ['sun', 'moons']);
  deepEqual(schema.attributeProperties('planet', 'name'), {
    isAttribute: true,
    name: "name",
    options: {},
    type: "string"
  });
  deepEqual(schema.attributeProperties('planet', 'classification'), {
    isAttribute: true,
    name: "classification",
    options: {},
    type: "string"
  });
  deepEqual(schema.linkProperties('planet', 'sun'), {
    isLink: true,
    name: "sun",
    options: {
      hasOne: true
    },
    type: "star"
  });
  deepEqual(schema.linkProperties('planet', 'moons'), {
    isLink: true,
    name: "moons",
    options: {
      hasOne: false
    },
    type: "moon"
  });
});
