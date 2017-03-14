'use strict';

/**
 * @fileOverview Pathway Commons Access Library Index
 * @author Manfred Cheung
 * @version: 0.1
 */

module.exports = {
  user: require('./user.js'),
  datasources: new (require('./datasources.js'))(),
  get: function get() {
    return new (require('./get.js'))();
  },
  search: function search() {
    return new (require('./search.js'))();
  },
  traverse: function traverse() {
    return new (require('./traverse.js'))();
  },
  graph: function graph() {
    return new (require('./graph.js'))();
  },
  top_pathways: function top_pathways() {
    return new (require('./top_pathways.js'))();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJ1c2VyIiwicmVxdWlyZSIsImRhdGFzb3VyY2VzIiwiZ2V0Iiwic2VhcmNoIiwidHJhdmVyc2UiLCJncmFwaCIsInRvcF9wYXRod2F5cyJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7Ozs7OztBQU1BQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU1DLFFBQVEsV0FBUixDQURTO0FBRWZDLGVBQWEsS0FBSUQsUUFBUSxrQkFBUixDQUFKLEdBRkU7QUFHZkUsT0FBTTtBQUFBLFdBQU0sS0FBSUYsUUFBUSxVQUFSLENBQUosR0FBTjtBQUFBLEdBSFM7QUFJZkcsVUFBUztBQUFBLFdBQU0sS0FBSUgsUUFBUSxhQUFSLENBQUosR0FBTjtBQUFBLEdBSk07QUFLZkksWUFBVztBQUFBLFdBQU0sS0FBSUosUUFBUSxlQUFSLENBQUosR0FBTjtBQUFBLEdBTEk7QUFNZkssU0FBUTtBQUFBLFdBQU0sS0FBSUwsUUFBUSxZQUFSLENBQUosR0FBTjtBQUFBLEdBTk87QUFPZk0sZ0JBQWU7QUFBQSxXQUFNLEtBQUlOLFFBQVEsbUJBQVIsQ0FBSixHQUFOO0FBQUE7QUFQQSxDQUFqQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IFBhdGh3YXkgQ29tbW9ucyBBY2Nlc3MgTGlicmFyeSBJbmRleFxuICogQGF1dGhvciBNYW5mcmVkIENoZXVuZ1xuICogQHZlcnNpb246IDAuMVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB1c2VyOiByZXF1aXJlKCcuL3VzZXIuanMnKSxcbiAgZGF0YXNvdXJjZXM6IG5ldyhyZXF1aXJlKCcuL2RhdGFzb3VyY2VzLmpzJykpKCksXG4gIGdldDogKCgpID0+IG5ldyhyZXF1aXJlKCcuL2dldC5qcycpKSgpKSxcbiAgc2VhcmNoOiAoKCkgPT4gbmV3KHJlcXVpcmUoJy4vc2VhcmNoLmpzJykpKCkpLFxuICB0cmF2ZXJzZTogKCgpID0+IG5ldyhyZXF1aXJlKCcuL3RyYXZlcnNlLmpzJykpKCkpLFxuICBncmFwaDogKCgpID0+IG5ldyhyZXF1aXJlKCcuL2dyYXBoLmpzJykpKCkpLFxuICB0b3BfcGF0aHdheXM6ICgoKSA9PiBuZXcocmVxdWlyZSgnLi90b3BfcGF0aHdheXMuanMnKSkoKSlcbn07XG4iXX0=