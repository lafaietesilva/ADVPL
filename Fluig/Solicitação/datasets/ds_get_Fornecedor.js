function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	
	var getServico =  getConstraints(constraints, 'TIPO');
	
	//var getServico = "FUNCIONARIO";
	
	if (getServico != null && getServico != ""){
		var produto = DatasetFactory.createConstraint("TIPO",getServico,getServico, ConstraintType.MUST);
		
		var dataset = DatasetFactory.getDataset("VM_Fornecedores",null,new Array(produto),null);
	}
	else {
		
		
		var dataset = DatasetFactory.getDataset("VM_Fornecedores",null,null,null);
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