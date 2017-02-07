/**
 * @private
 * @param {string} jsonString
 * @return {object|string} jsonObject - If valid JSON parse as JSON otherwise return original string
 */
export const _parseUnknownString = (string) => {
	try {
		return JSON.parse(string);
	} catch (e) {
		return string;
	}
}

/**
 * @private
 * @param {string} uniprotId
 * @return {string} uniprotUri
 */
export const _buildUniprotUri = (uniprodId) => {
	return "http://identifiers.org/uniprot/" + uniprodId;
}
