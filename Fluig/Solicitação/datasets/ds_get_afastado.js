function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	  
	var constrant =  getConstraints(constraints, 'EMAIL');
	//var constrant ="aline_silva@wvi.org";
	
	var codigo = DatasetFactory.createConstraint("EMAIL",constrant,constrant, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("VM_Afastados",null,new Array(codigo),null);
	
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