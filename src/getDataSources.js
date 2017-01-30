import {_httpGetAsync, _parseJson} from './private/helpers.js';

/**
 * Fetches data source object from Pathway Commons
 * @module getDataSources
 * @param {requestCallback} callback - dataSourcesArray
 */
const getDataSources = (callback) => {
	//copy data sources to the global array: kepp just some fields and only pathway data sources (not e.g., ChEBI)
	_httpGetAsync(PCUrl + 'metadata/datasources?user=pc2pathways', (data) => {
		var output = {};
		data = _parseJson(data).filter(source => source.notPathwayData == false);
		data.map((ds) => {
			let name = (ds.name.length > 1) ? ds.name[1] : ds.name[0];
			output[ds.uri] = {
				id: ds.identifier,
				uri: ds.uri,
				name: name,
				description: ds.description,
				type: ds.type
			};
		});
		dataSources = output;
		callback(dataSources);
	});
}

export default getDataSources;
