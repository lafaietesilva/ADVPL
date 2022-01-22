function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	  
	var constrant =  getConstraints(constraints, 'EMAIL_F');
	//var constrant ="wasley_santos@wvi.org";
	
	var codigo = DatasetFactory.createConstraint("EMAIL_F",constrant,constrant, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("VM_Funcionario",null,new Array(codigo),null);
	
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