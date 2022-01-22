function createDataset(fields, constraints, sortFields) {
	var constraint = new Array();
	
	
	constraint.push(DatasetFactory.createConstraint("documentid", "35235", "35235", ConstraintType.MUST));     
	constraint.push(DatasetFactory.createConstraint("acao", "3", "3", ConstraintType.MUST)); 
	var dataset = DatasetFactory.getDataset("VM_CNTA300_SOLICITACAO_CONTRATO", null, constraint, null);
    
    return dataset;
	
	
}

