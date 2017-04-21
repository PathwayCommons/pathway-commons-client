"use strict";

module.exports = {
  pcAddress: "http://www.pathwaycommons.org/pc2/",

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaXZhdGUvY29uc3RhbnRzLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJwY0FkZHJlc3MiLCJpZFByZWZpeCIsImRzSWRWYWxpZGF0aW9uIiwidW5pcHJvdCIsInRlc3QiLCJpZCIsImNoZWJpIiwibGVuZ3RoIiwiaGduYyIsInJlZnNlcSIsImtlZ2dwYXRod2F5Iiwia2VnZ2RydWciLCJzbXBkYiIsImRydWdiYW5rIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLGFBQVcsb0NBREk7O0FBR2ZDLFlBQVUsd0JBSEs7O0FBS2ZDLGtCQUFnQjtBQUNkQyxhQUFTO0FBQUEsYUFBTSxxSEFBb0hDLElBQXBILENBQXlIQyxFQUF6SDtBQUFOO0FBQUEsS0FESztBQUVkQyxXQUFPO0FBQUEsYUFBTSxlQUFjRixJQUFkLENBQW1CQyxFQUFuQixLQUEyQkEsR0FBR0UsTUFBSCxJQUFjLFNBQVNBLE1BQVQsR0FBa0I7QUFBakU7QUFBQSxLQUZPO0FBR2RDLFVBQU07QUFBQSxhQUFNLHlCQUF3QkosSUFBeEIsQ0FBNkJDLEVBQTdCO0FBQU47QUFBQSxLQUhRO0FBSWRJLFlBQVE7QUFBQSxhQUFNLGlGQUFnRkwsSUFBaEYsQ0FBcUZDLEVBQXJGO0FBQU47QUFBQSxLQUpNO0FBS2RLLGlCQUFhO0FBQUEsYUFBTSxrQkFBaUJOLElBQWpCLENBQXNCQyxFQUF0QjtBQUFOO0FBQUEsS0FMQztBQU1kTSxjQUFVO0FBQUEsYUFBTSxVQUFTUCxJQUFULENBQWNDLEVBQWQ7QUFBTjtBQUFBLEtBTkk7QUFPZE8sV0FBTztBQUFBLGFBQU0sY0FBYVIsSUFBYixDQUFrQkMsRUFBbEI7QUFBTjtBQUFBLEtBUE87QUFRZFEsY0FBVTtBQUFBLGFBQU0sYUFBWVQsSUFBWixDQUFpQkMsRUFBakI7QUFBTjtBQUFBO0FBUkk7QUFMRCxDQUFqQiIsImZpbGUiOiJwcml2YXRlL2NvbnN0YW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuICBwY0FkZHJlc3M6IFwiaHR0cDovL3d3dy5wYXRod2F5Y29tbW9ucy5vcmcvcGMyL1wiLFxuXG4gIGlkUHJlZml4OiBcInBhdGh3YXljb21tb25zLWpzLWxpYjpcIixcblxuICBkc0lkVmFsaWRhdGlvbjoge1xuICAgIHVuaXByb3Q6IGlkID0+IC9eKFtBLU4sUi1aXVswLTldKFtBLVpdW0EtWiwgMC05XVtBLVosIDAtOV1bMC05XSl7MSwyfSl8KFtPLFAsUV1bMC05XVtBLVosIDAtOV1bQS1aLCAwLTldW0EtWiwgMC05XVswLTldKShcXC5cXGQrKT8kLy50ZXN0KGlkKSxcbiAgICBjaGViaTogaWQgPT4gL15DSEVCSTpcXGQrJC8udGVzdChpZCkgJiYgKGlkLmxlbmd0aCA8PSAoXCJDSEVCSTpcIi5sZW5ndGggKyA2KSksXG4gICAgaGduYzogaWQgPT4gL15bQS1aYS16LTAtOV9dKyhcXEApPyQvLnRlc3QoaWQpLFxuICAgIHJlZnNlcTogaWQgPT4gL14oKEFDfEFQfE5DfE5HfE5NfE5QfE5SfE5UfE5XfFhNfFhQfFhSfFlQfFpQKV9cXGQrfChOWlxcX1tBLVpdezR9XFxkKykpKFxcLlxcZCspPyQvLnRlc3QoaWQpLFxuICAgIGtlZ2dwYXRod2F5OiBpZCA9PiAvXlxcd3syLDR9XFxkezV9JC8udGVzdChpZCksXG4gICAga2VnZ2RydWc6IGlkID0+IC9eRFxcZCskLy50ZXN0KGlkKSxcbiAgICBzbXBkYjogaWQgPT4gL15TTVBcXGR7NX0kLy50ZXN0KGlkKSxcbiAgICBkcnVnYmFuazogaWQgPT4gL15EQlxcZHs1fSQvLnRlc3QoaWQpXG4gIH1cbn07XG4iXX0=