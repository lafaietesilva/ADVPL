function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	  
	var getFuncionario =  getConstraints(constraints, 'EMAIL_F');
	
	//var getFuncionario = "wasley_santos@wvi.org";
	var funcionario = DatasetFactory.createConstraint("EMAIL_F",getFuncionario,getFuncionario, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("VM_Funcionario",null,new Array(funcionario),null);
	
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