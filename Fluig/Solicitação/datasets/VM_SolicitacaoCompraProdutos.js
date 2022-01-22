function createDataset(fields, constraints, sortFields) {
//ITENS DA SOLICITAÇÃO DE COMPRA DE PRODUTOS     
    //Cria as colunas
    var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("metadata#id");
    dataset.addColumn("DESC_PRODUTO");    
    dataset.addColumn("UM");
    dataset.addColumn("QUANTIDADE");
    dataset.addColumn("VALOR_EMPENHADO");
    dataset.addColumn("DT_NECESSIDADE");
    dataset.addColumn("COD_PRODUTO");
    dataset.addColumn("SOLICITACAO");
   
    
    
    //dataset interno
    var constraintsActive = new Array();
    constraintsActive.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));   
    constraintsActive.push(DatasetFactory.createConstraint("metadata#id", constraints[0].initialValue, constraints[0].initialValue, ConstraintType.MUST));
    var datasetPrincipal = DatasetFactory.getDataset("VM_SolicitacoesCompra", null, constraintsActive, null);
    
    if(constraints!==null && constraints.length){ //se tiver constraint filtra
        if(constraints[0].constraintType==ConstraintType.MUST) { // implementação somente para o MUST
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
                 
            	
          
            	
            	//log.info("-----RETORNO CONTRAINT 20:45------");
            	//log.dir(constraints);
            	if(constraints[0].initialValue==datasetPrincipal.getValue(a,constraints[0].fieldName)){ 
            		//log.info("-----RETORNO CONTRAINT 21:08------");
            		
            		//Cria as constraints para buscar os campos filhos, passando o tablename, número da formulário e versão
                    var c1 = DatasetFactory.createConstraint("tablename", "tableCompras" , "tableCompras", ConstraintType.MUST);
                    var c2 = DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST);
                    var c3 = DatasetFactory.createConstraint("metadata#version", documentVersion, documentVersion, ConstraintType.MUST);
                    var constraintsFilhos = new Array(c1, c2, c3);

                    //Busca o dataset
                    var datasetFilhos = DatasetFactory.getDataset("VM_SolicitacoesCompra", null, constraintsFilhos, null);
                    for (var j = 0; j < datasetFilhos.rowsCount; j++) {
                	//	log.info("-------RETORNO FILHO----- 21:08");
                   	 	
                     	//Adiciona os valores nas colunas respectivamente.
                        dataset.addRow(new Array(
                                documentId,
                                datasetFilhos.getValue(j, "txtproduto"),
                                datasetFilhos.getValue(j, "idum"),
                                datasetFilhos.getValue(j, "idquantidade"),
                                datasetFilhos.getValue(j, "vrUltima"),
                                datasetFilhos.getValue(j, "dtNecessidade"),
                                datasetFilhos.getValue(j, "codigoProduto"),
                                solicitacao
                        ));
                    }
                
            	}
          
            	
            }
        }
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
//recebe como parametro:metadata#card_index_id, metadate#id, companyid
function retornaSolicitacao(cardindexdocumentid,carddocumentid,empresa){
	  var constraintsHistorico  = new Array();	    	 
		 constraintsHistorico.push(DatasetFactory.createConstraint("cardIndexDocumentId", cardindexdocumentid , cardindexdocumentid, ConstraintType.MUST));
		 constraintsHistorico.push(DatasetFactory.createConstraint("cardDocumentId", carddocumentid , carddocumentid, ConstraintType.MUST));	    	
		 constraintsHistorico.push(DatasetFactory.createConstraint("workflowProcessPK.companyId", empresa , empresa, ConstraintType.MUST));	    	
		 
   var historicoFormulario = DatasetFactory.getDataset("workflowProcess", null, constraintsHistorico, null);	       		 

   return historicoFormulario;
} 