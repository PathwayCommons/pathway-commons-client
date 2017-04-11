"use strict";

module.exports = {
  pcAddress: "http://www.pathwaycommons.org/pc2/",

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaXZhdGUvY29uc3RhbnRzLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJwY0FkZHJlc3MiLCJkc0lkVmFsaWRhdGlvbiIsInVuaXByb3QiLCJ0ZXN0IiwiaWQiLCJjaGViaSIsImxlbmd0aCIsImhnbmMiLCJyZWZzZXEiLCJrZWdncGF0aHdheSIsImtlZ2dkcnVnIiwic21wZGIiLCJkcnVnYmFuayJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxhQUFXLG9DQURJOztBQUdmQyxrQkFBZ0I7QUFDZEMsYUFBUztBQUFBLGFBQU0scUhBQW9IQyxJQUFwSCxDQUF5SEMsRUFBekg7QUFBTjtBQUFBLEtBREs7QUFFZEMsV0FBTztBQUFBLGFBQU0sZUFBY0YsSUFBZCxDQUFtQkMsRUFBbkIsS0FBMkJBLEdBQUdFLE1BQUgsSUFBYyxTQUFTQSxNQUFULEdBQWtCO0FBQWpFO0FBQUEsS0FGTztBQUdkQyxVQUFNO0FBQUEsYUFBTSx5QkFBd0JKLElBQXhCLENBQTZCQyxFQUE3QjtBQUFOO0FBQUEsS0FIUTtBQUlkSSxZQUFRO0FBQUEsYUFBTSxpRkFBZ0ZMLElBQWhGLENBQXFGQyxFQUFyRjtBQUFOO0FBQUEsS0FKTTtBQUtkSyxpQkFBYTtBQUFBLGFBQU0sa0JBQWlCTixJQUFqQixDQUFzQkMsRUFBdEI7QUFBTjtBQUFBLEtBTEM7QUFNZE0sY0FBVTtBQUFBLGFBQU0sVUFBU1AsSUFBVCxDQUFjQyxFQUFkO0FBQU47QUFBQSxLQU5JO0FBT2RPLFdBQU87QUFBQSxhQUFNLGNBQWFSLElBQWIsQ0FBa0JDLEVBQWxCO0FBQU47QUFBQSxLQVBPO0FBUWRRLGNBQVU7QUFBQSxhQUFNLGFBQVlULElBQVosQ0FBaUJDLEVBQWpCO0FBQU47QUFBQTtBQVJJO0FBSEQsQ0FBakIiLCJmaWxlIjoicHJpdmF0ZS9jb25zdGFudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgcGNBZGRyZXNzOiBcImh0dHA6Ly93d3cucGF0aHdheWNvbW1vbnMub3JnL3BjMi9cIixcblxuICBkc0lkVmFsaWRhdGlvbjoge1xuICAgIHVuaXByb3Q6IGlkID0+IC9eKFtBLU4sUi1aXVswLTldKFtBLVpdW0EtWiwgMC05XVtBLVosIDAtOV1bMC05XSl7MSwyfSl8KFtPLFAsUV1bMC05XVtBLVosIDAtOV1bQS1aLCAwLTldW0EtWiwgMC05XVswLTldKShcXC5cXGQrKT8kLy50ZXN0KGlkKSxcbiAgICBjaGViaTogaWQgPT4gL15DSEVCSTpcXGQrJC8udGVzdChpZCkgJiYgKGlkLmxlbmd0aCA8PSAoXCJDSEVCSTpcIi5sZW5ndGggKyA2KSksXG4gICAgaGduYzogaWQgPT4gL15bQS1aYS16LTAtOV9dKyhcXEApPyQvLnRlc3QoaWQpLFxuICAgIHJlZnNlcTogaWQgPT4gL14oKEFDfEFQfE5DfE5HfE5NfE5QfE5SfE5UfE5XfFhNfFhQfFhSfFlQfFpQKV9cXGQrfChOWlxcX1tBLVpdezR9XFxkKykpKFxcLlxcZCspPyQvLnRlc3QoaWQpLFxuICAgIGtlZ2dwYXRod2F5OiBpZCA9PiAvXlxcd3syLDR9XFxkezV9JC8udGVzdChpZCksXG4gICAga2VnZ2RydWc6IGlkID0+IC9eRFxcZCskLy50ZXN0KGlkKSxcbiAgICBzbXBkYjogaWQgPT4gL15TTVBcXGR7NX0kLy50ZXN0KGlkKSxcbiAgICBkcnVnYmFuazogaWQgPT4gL15EQlxcZHs1fSQvLnRlc3QoaWQpXG4gIH1cbn07XG4iXX0=