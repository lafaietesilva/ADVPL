function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	  
	var getFonte =  getConstraints(constraints, 'PROJETO');
	

	var fonte = DatasetFactory.createConstraint("PROJETO",getFonte,getFonte, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("VM_FonteFinanciamento",null,new Array(fonte),null);
	
	return dataset;
	
}

function getConstraints(constraints, field){
	if(constraints == null)
		return null;
	
	for(var i=0;i<constraints.length;i++){
		if(constraints[i].fieldName == field){
			return constraints[i].initialValue;
		}
	}
	
	return null;
}