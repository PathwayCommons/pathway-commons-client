module.exports = {
  pcAddress: process.env.PC_URL || "https://www.pathwaycommons.org/pc2/",

  idPrefix: "pathwaycommons-js-lib:",

  dsIdValidation: {
    uniprot: id => /^([A-N,R-Z][0-9]([A-Z][A-Z, 0-9][A-Z, 0-9][0-9]){1,2})|([O,P,Q][0-9][A-Z, 0-9][A-Z, 0-9][A-Z, 0-9][0-9])(\.\d+)?$/.test(id),
    chebi: id => /^CHEBI:\d+$/.test(id) && (id.length <= ("CHEBI:".length + 6)),
    hgnc: id => /^[A-Za-z-0-9_]+(\@)?$/.test(id),
    refseq: id => /^((AC|AP|NC|NG|NM|NP|NR|NT|NW|XM|XP|XR|YP|ZP)_\d+|(NZ\_[A-Z]{4}\d+))(\.\d+)?$/.test(id),
    keggpathway: id => /^\w{2,4}\d{5}$/.test(id),
    keggdrug: id => /^D\d+$/.test(id),
    smpdb: id => /^SMP\d{5}$/.test(id),
    drugbank: id => /^DB\d{5}$/.test(id)
  }
};
