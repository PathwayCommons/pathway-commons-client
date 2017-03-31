'use strict';

/**
 * @fileOverview Pathway Commons Access Library Index
 * @author Manfred Cheung
 * @version: 0.1
 */

module.exports = {
  user: require('./user.js'),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJ1c2VyIiwicmVxdWlyZSIsInV0aWxpdGllcyIsImRhdGFzb3VyY2VzIiwiZ2V0Iiwic2VhcmNoIiwidHJhdmVyc2UiLCJncmFwaCIsInRvcF9wYXRod2F5cyJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7Ozs7OztBQU1BQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU1DLFFBQVEsV0FBUixDQURTO0FBRWZDLGFBQVdELFFBQVEsZ0JBQVIsQ0FGSTtBQUdmRSxlQUFhLEtBQUlGLFFBQVEsa0JBQVIsQ0FBSixHQUhFO0FBSWZHLE9BQU07QUFBQSxXQUFNLEtBQUlILFFBQVEsVUFBUixDQUFKLEdBQU47QUFBQSxHQUpTO0FBS2ZJLFVBQVM7QUFBQSxXQUFNLEtBQUlKLFFBQVEsYUFBUixDQUFKLEdBQU47QUFBQSxHQUxNO0FBTWZLLFlBQVc7QUFBQSxXQUFNLEtBQUlMLFFBQVEsZUFBUixDQUFKLEdBQU47QUFBQSxHQU5JO0FBT2ZNLFNBQVE7QUFBQSxXQUFNLEtBQUlOLFFBQVEsWUFBUixDQUFKLEdBQU47QUFBQSxHQVBPO0FBUWZPLGdCQUFlO0FBQUEsV0FBTSxLQUFJUCxRQUFRLG1CQUFSLENBQUosR0FBTjtBQUFBO0FBUkEsQ0FBakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQGZpbGVPdmVydmlldyBQYXRod2F5IENvbW1vbnMgQWNjZXNzIExpYnJhcnkgSW5kZXhcbiAqIEBhdXRob3IgTWFuZnJlZCBDaGV1bmdcbiAqIEB2ZXJzaW9uOiAwLjFcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdXNlcjogcmVxdWlyZSgnLi91c2VyLmpzJyksXG4gIHV0aWxpdGllczogcmVxdWlyZSgnLi91dGlsaXRpZXMuanMnKSxcbiAgZGF0YXNvdXJjZXM6IG5ldyhyZXF1aXJlKCcuL2RhdGFzb3VyY2VzLmpzJykpKCksXG4gIGdldDogKCgpID0+IG5ldyhyZXF1aXJlKCcuL2dldC5qcycpKSgpKSxcbiAgc2VhcmNoOiAoKCkgPT4gbmV3KHJlcXVpcmUoJy4vc2VhcmNoLmpzJykpKCkpLFxuICB0cmF2ZXJzZTogKCgpID0+IG5ldyhyZXF1aXJlKCcuL3RyYXZlcnNlLmpzJykpKCkpLFxuICBncmFwaDogKCgpID0+IG5ldyhyZXF1aXJlKCcuL2dyYXBoLmpzJykpKCkpLFxuICB0b3BfcGF0aHdheXM6ICgoKSA9PiBuZXcocmVxdWlyZSgnLi90b3BfcGF0aHdheXMuanMnKSkoKSlcbn07XG4iXX0=