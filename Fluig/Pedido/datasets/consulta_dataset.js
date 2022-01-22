function createDataset(fields, constraints, sortFields) {
	var empresa ='01';
	var constraint = new Array();
	constraint.push(DatasetFactory.createConstraint("empresa", empresa, empresa, ConstraintType.MUST)); 
	var dataset = DatasetFactory.getDataset("ds_buscafilial", null, constraint, null);
    
    return dataset;
	
	
}
