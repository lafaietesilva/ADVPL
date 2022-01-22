function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	  
	var getFuncionario =  getConstraints(constraints, 'EMAIL_G');
	
	//var getFuncionario = "wasley_santos@wvi.org";
	var funcionario = DatasetFactory.createConstraint("EMAIL_G",getFuncionario,getFuncionario, ConstraintType.MUST);
	dataset = DatasetFactory.getDataset("VM_Funcionario",null,new Array(funcionario),null);
	
	if (dataset.rowsCount > 0){
		return dataset;
	}
	else {
		 dataset = DatasetFactory.getDataset("VM_GestorFuncionariosAcordoDesempenho",null,new Array(funcionario),null);
		
	}
	
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


