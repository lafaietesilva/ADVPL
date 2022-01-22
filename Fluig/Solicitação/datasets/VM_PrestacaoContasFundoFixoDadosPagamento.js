function createDataset(fields, constraints, sortFields) {
     
    //Cria as colunas
    var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("metadata#id");
    dataset.addColumn("CENTRO_CUSTO");
    dataset.addColumn("PROJETO");
    dataset.addColumn("CATEGORIA");
    dataset.addColumn("FONTE");
    dataset.addColumn("ATIVIDADE");
    dataset.addColumn("AREA");
    dataset.addColumn("ALOCACAO");
    dataset.addColumn("LOCALIZACAO");
    dataset.addColumn("CONTA_CONTABIL");
    dataset.addColumn("PERCENTUAL");
    dataset.addColumn("ITEM");
    dataset.addColumn("SOLICITACAO");
   
    
 	
   
    
    if((constraints!==null && constraints.length) && constraints[0].fieldName != 'sqlLimit'){ //se tiver constraint filtra
//        if(constraints[0].constraintType==ConstraintType.MUST  && constraints[0].fieldName == "documentid") { // implementação somente para o MUST
    	 if(constraints[0].constraintType==ConstraintType.MUST  ) { // implementação somente para o MUST
        	
    		   //dataset interno
    		    var constraintsActive = new Array();
    		    constraintsActive.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
    		    constraintsActive.push(DatasetFactory.createConstraint("metadata#id", constraints[0].initialValue, constraints[0].initialValue, ConstraintType.MUST));
    		    var datasetPrincipal = DatasetFactory.getDataset("VM_PrestacaoContasFundoFixo", null, constraintsActive, null);
    			
    		       	
        	
            for(var a=0;a < datasetPrincipal.rowsCount;a++){
            	var documentId = datasetPrincipal.getValue(a, "metadata#id");
                var documentVersion = datasetPrincipal.getValue(a, "metadata#version");            	
            	var empresa = datasetPrincipal.getValue(a, "companyid");            	
            	var cardindexdocumentid = datasetPrincipal.getValue(a, "metadata#card_index_id");
            	
            	 var historicoFormulario = retornaSolicitacao(cardindexdocumentid,documentId,empresa);
             	
            	 var solicitacao;
                    
            	 if (historicoFormulario.rowsCount > 0){
                	 solicitacao = historicoFormulario.getValue(0,"workflowProcessPK.processInstanceId");
                 }
            	

            	if(constraints[0].initialValue==datasetPrincipal.getValue(a,constraints[0].fieldName)){ 
            		//log.info("-----RETORNO CONTRAINT 21:08------");
            		
            		var constraintsFilhos = new Array();
            		//Cria as constraints para buscar os campos filhos, passando o tablename, número da formulário e versão
            		constraintsFilhos.push(DatasetFactory.createConstraint("tablename", "tableItens" , "tableItens", ConstraintType.MUST));
            		//constraintsActive.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
            		constraintsFilhos.push(DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST));
            		constraintsFilhos.push(DatasetFactory.createConstraint("metadata#version", documentVersion, documentVersion, ConstraintType.MUST));
            		 
           	     
            		for (var a=0; a<constraints.length; a++){
            			if (constraints[a].fieldName == "ITEM"){
            				item = constraints[a].initialValue; 
            			}
            		}
            		       				
            		//constraintsFilhos.push(DatasetFactory.createConstraint("itemproduto", item, item, ConstraintType.MUST));
    				//constraintsFilhos.push(DatasetFactory.createConstraint("rateiaproduto", "sim", "sim", ConstraintType.MUST));
                         
    			     //Busca o dataset
                    var datasetFilhos = DatasetFactory.getDataset("VM_PrestacaoContasFundoFixo", null, constraintsFilhos, null);
                    for (var j = 0; j < datasetFilhos.rowsCount; j++) {
                	//	log.info("-------RETORNO FILHO----- 21:08");
                   	 	
                    	if (item == datasetFilhos.getValue(j, "itemproduto")){
                    		//Adiciona os valores nas colunas respectivamente.
                            dataset.addRow(new Array(
                                    documentId,
                                    datasetFilhos.getValue(j, "txtcentrocusto"),
                                    datasetFilhos.getValue(j, "txtprojeto"),
                                    datasetFilhos.getValue(j, "txtcategoria"),
                                    datasetFilhos.getValue(j, "txtfontefinanciamento"),
                                    datasetFilhos.getValue(j, "txtatividade"),
                                    datasetFilhos.getValue(j, "txtareaestrategica"),
                                    datasetFilhos.getValue(j, "alocacao"),
                                    datasetFilhos.getValue(j, "localizacao"),
                                    datasetFilhos.getValue(j, "contacontabil"),
                                    datasetFilhos.getValue(j, "percentual"),
                                    datasetFilhos.getValue(j, "itemproduto"),
                                    solicitacao
                            ));
                    	}
                     	
                    }
                            
            			
            			
            		}
            			
            		    return dataset;
            	}
            }
        
    } 
 
    return dataset;
}
//recebe como parametro:metadata#card_index_id, metadate#id, companyid
function retornaSolicitacao(cardindexdocumentid,carddocumentid,empresa){
	  var constraintsHistorico  = new Array();	    	 
		 constraintsHistorico.push(DatasetFactory.createConstraint("cardIndexDocumentId", cardindexdocumentid , cardindexdocumentid, ConstraintType.MUST));
		 constraintsHistorico.push(DatasetFactory.createConstraint("cardDocumentId", carddocumentid , carddocumentid, ConstraintType.MUST));	    	
		 constraintsHistorico.push(DatasetFactory.createConstraint("workflowProcessPK.companyId", empresa , empresa, ConstraintType.MUST));	    	
		 
   var historicoFormulario = DatasetFactory.getDataset("workflowProcess", null, constraintsHistorico, null);	       		 

   return historicoFormulario;
} 
