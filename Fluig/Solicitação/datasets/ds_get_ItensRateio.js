function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
		  
	var Codigorateio =  getConstraints(constraints, 'RATEIO');
	
	var codigo = DatasetFactory.createConstraint("RATEIO",Codigorateio,Codigorateio, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("VM_ItensRateio",null,new Array(codigo),null);
	
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