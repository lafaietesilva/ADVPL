function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	  
	var getServico =  getConstraints(constraints, 'FLUIG');
	
	//var getServico = "1";
	var produto = DatasetFactory.createConstraint("FLUIG",getServico,getServico, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("VM_Produtos",null,new Array(produto),null);
	
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