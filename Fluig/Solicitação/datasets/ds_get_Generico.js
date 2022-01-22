function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	  
	var constrant =  getConstraints(constraints, 'IDENTIFICADOR');
	//var constrant ="ETNIA";
	
	var codigo = DatasetFactory.createConstraint("IDENTIFICADOR",constrant,constrant, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("VM_Generico",null,new Array(codigo),null);
	
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