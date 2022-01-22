function createDataset(fields, constraints, sortFields) {
	var processo = new Array();
	var constraint = new Array();
	var acao=3;	 	
	var documento;// = 19984;
	//var tipoContrato ="006-PRESTACAO DE SERVICO C/ LIMITE"
	
	
	processo.push(DatasetFactory.createConstraint("solicitacao", "21547", "21547", ConstraintType.MUST));     
	var dataset = DatasetFactory.getDataset("VM_SolicitacaoContrato", null, processo, null);
	
	documento = dataset.getValue(0,"documentid");
	//documento = 18419;

	 constraint.push(DatasetFactory.createConstraint("documentid", documento, documento, ConstraintType.MUST)); 
	// constraint.push(DatasetFactory.createConstraint("acao", acao, acao, ConstraintType.MUST));
	// constraint.push(DatasetFactory.createConstraint("tipo", tipoContrato, tipoContrato, ConstraintType.MUST));
	 var dataset = DatasetFactory.getDataset("VM_CNTA300_SOLICITACAO_CONTRATO", null, constraint, null);
	 
	 
    return dataset;
	
	
}

