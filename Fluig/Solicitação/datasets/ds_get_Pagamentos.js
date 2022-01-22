function createDataset(fields, constraints, sortFields) {
	var getSolicitacao =  getConstraints(constraints, 'documentid');
	//var getSolicitacao = "1891";
	
	     
    var c1 = DatasetFactory.createConstraint("documentid", getSolicitacao, getSolicitacao, ConstraintType.MUST);        
    var dataset = DatasetFactory.getDataset("VM_Pagamentos", null, new Array(c1), null);
    
    
    
    
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