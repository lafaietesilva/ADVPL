function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("ID_FLUIG");
	dataset.addColumn("SOLICITACAO");
	dataset.addColumn("SOLICITANTE");
	dataset.addColumn("EMAIL_SOLICITANTE");
	dataset.addColumn("DATA_SOLICITACAO");
	
	

	var constraintsActive = new Array();
	constraintsActive.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
    var aRetornoDataSet = DatasetFactory.getDataset("VM_SolicitacaoContratacoesServico", null, constraintsActive, null);
    
    //log.dir(constraints);
    var nNumeroSolicitacao;
    var dDataSolicitacao;
    
    for(var a=0;a < aRetornoDataSet.rowsCount;a++){
		 
		 var nEmpresa = aRetornoDataSet.getValue(a, "companyid");
		 var nCarddocumentid =  aRetornoDataSet.getValue(a, "metadata#id");
		 var nCardindexdocumentid = aRetornoDataSet.getValue(a, "metadata#card_index_id")
	
		 var historicoFormulario = getHistoricoSolicitacao(nCardindexdocumentid,nCarddocumentid,nEmpresa);
        
        if (historicoFormulario.rowsCount > 0){
        	nNumeroSolicitacao = historicoFormulario.getValue(0,"workflowProcessPK.processInstanceId");
  	        dDataSolicitacao = historicoFormulario.getValue(0,"startDateProcess");
        }
		 
        			dataset.addRow([
 		                aRetornoDataSet.getValue(a,"metadata#id"),
 		                nNumeroSolicitacao,
 		                aRetornoDataSet.getValue(a,"solicitante"),
 		                aRetornoDataSet.getValue(a,"emailSolicitante"),
     		            dDataSolicitacao
 		                ]);
	
	
}
 
	return dataset;
	
}
//recebe como parametro:metadata#card_index_id, metadate#id, companyid
function getHistoricoSolicitacao(cardindexdocumentid,carddocumentid,empresa){
	  var constraintsHistorico  = new Array();	    	 
		 constraintsHistorico.push(DatasetFactory.createConstraint("cardIndexDocumentId", cardindexdocumentid , cardindexdocumentid, ConstraintType.MUST));
		 constraintsHistorico.push(DatasetFactory.createConstraint("cardDocumentId", carddocumentid , carddocumentid, ConstraintType.MUST));	    	
		 constraintsHistorico.push(DatasetFactory.createConstraint("workflowProcessPK.companyId", empresa , empresa, ConstraintType.MUST));	    	
		     		 

     return DatasetFactory.getDataset("workflowProcess", null, constraintsHistorico, null);
} 