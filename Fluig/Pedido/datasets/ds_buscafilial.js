function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	var datasetFilial = DatasetFactory.getDataset("ds_filial",null,null,null);
	
	console.log("buscando filial");
	console.dir(datasetFilial);
	for (var i = 0; i < datasetFilial.rowsCount; i++){
		
			/*
			if (datasetFilial.values[i]["EnterpriseGroup"] == constraints[0].initialValue){
				 dataset.addRow(row);
			}
			*/
	}
	
	return dataset;
}
