function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	  
	var getConstraint =  getConstraints(constraints, 'CPF_F');
	
	//var getConstraint = "03590586630";
	var filtro = DatasetFactory.createConstraint("CPF_F",getConstraint,getConstraint, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("VM_Dependentes",null,new Array(filtro),null);
	
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