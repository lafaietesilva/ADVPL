function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	  
	var getArea =  getConstraints(constraints, 'PROJETO');
	
	//var getCentroCusto = "20201";
	var projeto = DatasetFactory.createConstraint("PROJETO",getArea,getArea, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("VM_AreaProjeto",null,new Array(projeto),null);
	
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