"use strict";

module.exports = {
  pcAddress: "https://www.pathwaycommons.org/pc2/",

  idPrefix: "pathwaycommons-js-lib:",

  dsIdValidation: {
    uniprot: function uniprot(id) {
      return (/^([A-N,R-Z][0-9]([A-Z][A-Z, 0-9][A-Z, 0-9][0-9]){1,2})|([O,P,Q][0-9][A-Z, 0-9][A-Z, 0-9][A-Z, 0-9][0-9])(\.\d+)?$/.test(id)
      );
    },
    chebi: function chebi(id) {
      return (/^CHEBI:\d+$/.test(id) && id.length <= "CHEBI:".length + 6
      );
    },
    hgnc: function hgnc(id) {
      return (/^[A-Za-z-0-9_]+(\@)?$/.test(id)
      );
    },
    refseq: function refseq(id) {
      return (/^((AC|AP|NC|NG|NM|NP|NR|NT|NW|XM|XP|XR|YP|ZP)_\d+|(NZ\_[A-Z]{4}\d+))(\.\d+)?$/.test(id)
      );
    },
    keggpathway: function keggpathway(id) {
      return (/^\w{2,4}\d{5}$/.test(id)
      );
    },
    keggdrug: function keggdrug(id) {
      return (/^D\d+$/.test(id)
      );
    },
    smpdb: function smpdb(id) {
      return (/^SMP\d{5}$/.test(id)
      );
    },
    drugbank: function drugbank(id) {
      return (/^DB\d{5}$/.test(id)
      );
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaXZhdGUvY29uc3RhbnRzLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJwY0FkZHJlc3MiLCJpZFByZWZpeCIsImRzSWRWYWxpZGF0aW9uIiwidW5pcHJvdCIsInRlc3QiLCJpZCIsImNoZWJpIiwibGVuZ3RoIiwiaGduYyIsInJlZnNlcSIsImtlZ2dwYXRod2F5Iiwia2VnZ2RydWciLCJzbXBkYiIsImRydWdiYW5rIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLGFBQVcscUNBREk7O0FBR2ZDLFlBQVUsd0JBSEs7O0FBS2ZDLGtCQUFnQjtBQUNkQyxhQUFTO0FBQUEsYUFBTSxxSEFBb0hDLElBQXBILENBQXlIQyxFQUF6SDtBQUFOO0FBQUEsS0FESztBQUVkQyxXQUFPO0FBQUEsYUFBTSxlQUFjRixJQUFkLENBQW1CQyxFQUFuQixLQUEyQkEsR0FBR0UsTUFBSCxJQUFjLFNBQVNBLE1BQVQsR0FBa0I7QUFBakU7QUFBQSxLQUZPO0FBR2RDLFVBQU07QUFBQSxhQUFNLHlCQUF3QkosSUFBeEIsQ0FBNkJDLEVBQTdCO0FBQU47QUFBQSxLQUhRO0FBSWRJLFlBQVE7QUFBQSxhQUFNLGlGQUFnRkwsSUFBaEYsQ0FBcUZDLEVBQXJGO0FBQU47QUFBQSxLQUpNO0FBS2RLLGlCQUFhO0FBQUEsYUFBTSxrQkFBaUJOLElBQWpCLENBQXNCQyxFQUF0QjtBQUFOO0FBQUEsS0FMQztBQU1kTSxjQUFVO0FBQUEsYUFBTSxVQUFTUCxJQUFULENBQWNDLEVBQWQ7QUFBTjtBQUFBLEtBTkk7QUFPZE8sV0FBTztBQUFBLGFBQU0sY0FBYVIsSUFBYixDQUFrQkMsRUFBbEI7QUFBTjtBQUFBLEtBUE87QUFRZFEsY0FBVTtBQUFBLGFBQU0sYUFBWVQsSUFBWixDQUFpQkMsRUFBakI7QUFBTjtBQUFBO0FBUkk7QUFMRCxDQUFqQiIsImZpbGUiOiJwcml2YXRlL2NvbnN0YW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuICBwY0FkZHJlc3M6IFwiaHR0cHM6Ly93d3cucGF0aHdheWNvbW1vbnMub3JnL3BjMi9cIixcblxuICBpZFByZWZpeDogXCJwYXRod2F5Y29tbW9ucy1qcy1saWI6XCIsXG5cbiAgZHNJZFZhbGlkYXRpb246IHtcbiAgICB1bmlwcm90OiBpZCA9PiAvXihbQS1OLFItWl1bMC05XShbQS1aXVtBLVosIDAtOV1bQS1aLCAwLTldWzAtOV0pezEsMn0pfChbTyxQLFFdWzAtOV1bQS1aLCAwLTldW0EtWiwgMC05XVtBLVosIDAtOV1bMC05XSkoXFwuXFxkKyk/JC8udGVzdChpZCksXG4gICAgY2hlYmk6IGlkID0+IC9eQ0hFQkk6XFxkKyQvLnRlc3QoaWQpICYmIChpZC5sZW5ndGggPD0gKFwiQ0hFQkk6XCIubGVuZ3RoICsgNikpLFxuICAgIGhnbmM6IGlkID0+IC9eW0EtWmEtei0wLTlfXSsoXFxAKT8kLy50ZXN0KGlkKSxcbiAgICByZWZzZXE6IGlkID0+IC9eKChBQ3xBUHxOQ3xOR3xOTXxOUHxOUnxOVHxOV3xYTXxYUHxYUnxZUHxaUClfXFxkK3woTlpcXF9bQS1aXXs0fVxcZCspKShcXC5cXGQrKT8kLy50ZXN0KGlkKSxcbiAgICBrZWdncGF0aHdheTogaWQgPT4gL15cXHd7Miw0fVxcZHs1fSQvLnRlc3QoaWQpLFxuICAgIGtlZ2dkcnVnOiBpZCA9PiAvXkRcXGQrJC8udGVzdChpZCksXG4gICAgc21wZGI6IGlkID0+IC9eU01QXFxkezV9JC8udGVzdChpZCksXG4gICAgZHJ1Z2Jhbms6IGlkID0+IC9eREJcXGR7NX0kLy50ZXN0KGlkKVxuICB9XG59O1xuIl19