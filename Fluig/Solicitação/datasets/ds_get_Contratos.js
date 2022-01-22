function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	  
	var getServico =  getConstraints(constraints, 'CGC');
	
	//var getServico = "00011835000147";
	var filtro = DatasetFactory.createConstraint("CGC",getServico,getServico, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("VM_Contratos",null,new Array(filtro),null);
	
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