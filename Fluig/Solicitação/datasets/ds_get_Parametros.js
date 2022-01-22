function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	  
	var getParametro =  getConstraints(constraints, 'CODIGO');
	
	//var getParametro = "VM_PRVIAGN";
	var parametro = DatasetFactory.createConstraint("CODIGO",getParametro,getParametro, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("VM_Parametros",null,new Array(parametro),null);
	
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