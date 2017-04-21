'use strict';

/**
 * @fileOverview Pathway Commons Access Library Index
 * @author Manfred Cheung
 * @version: 0.1
 */

module.exports = {
  utilities: require('./utilities.js'),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJ1dGlsaXRpZXMiLCJyZXF1aXJlIiwiZGF0YXNvdXJjZXMiLCJnZXQiLCJzZWFyY2giLCJ0cmF2ZXJzZSIsImdyYXBoIiwidG9wX3BhdGh3YXlzIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7Ozs7O0FBTUFBLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsYUFBV0MsUUFBUSxnQkFBUixDQURJO0FBRWZDLGVBQWEsS0FBSUQsUUFBUSxrQkFBUixDQUFKLEdBRkU7QUFHZkUsT0FBTTtBQUFBLFdBQU0sS0FBSUYsUUFBUSxVQUFSLENBQUosR0FBTjtBQUFBLEdBSFM7QUFJZkcsVUFBUztBQUFBLFdBQU0sS0FBSUgsUUFBUSxhQUFSLENBQUosR0FBTjtBQUFBLEdBSk07QUFLZkksWUFBVztBQUFBLFdBQU0sS0FBSUosUUFBUSxlQUFSLENBQUosR0FBTjtBQUFBLEdBTEk7QUFNZkssU0FBUTtBQUFBLFdBQU0sS0FBSUwsUUFBUSxZQUFSLENBQUosR0FBTjtBQUFBLEdBTk87QUFPZk0sZ0JBQWU7QUFBQSxXQUFNLEtBQUlOLFFBQVEsbUJBQVIsQ0FBSixHQUFOO0FBQUE7QUFQQSxDQUFqQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IFBhdGh3YXkgQ29tbW9ucyBBY2Nlc3MgTGlicmFyeSBJbmRleFxuICogQGF1dGhvciBNYW5mcmVkIENoZXVuZ1xuICogQHZlcnNpb246IDAuMVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB1dGlsaXRpZXM6IHJlcXVpcmUoJy4vdXRpbGl0aWVzLmpzJyksXG4gIGRhdGFzb3VyY2VzOiBuZXcocmVxdWlyZSgnLi9kYXRhc291cmNlcy5qcycpKSgpLFxuICBnZXQ6ICgoKSA9PiBuZXcocmVxdWlyZSgnLi9nZXQuanMnKSkoKSksXG4gIHNlYXJjaDogKCgpID0+IG5ldyhyZXF1aXJlKCcuL3NlYXJjaC5qcycpKSgpKSxcbiAgdHJhdmVyc2U6ICgoKSA9PiBuZXcocmVxdWlyZSgnLi90cmF2ZXJzZS5qcycpKSgpKSxcbiAgZ3JhcGg6ICgoKSA9PiBuZXcocmVxdWlyZSgnLi9ncmFwaC5qcycpKSgpKSxcbiAgdG9wX3BhdGh3YXlzOiAoKCkgPT4gbmV3KHJlcXVpcmUoJy4vdG9wX3BhdGh3YXlzLmpzJykpKCkpXG59O1xuIl19