function createDataset(fields, constraints, sortFields) {
     
    //Cria as colunas
    var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("CPF");
    dataset.addColumn("NOME");
    dataset.addColumn("VALOR");
   
   
   
    var constraintsActive = new Array();
    constraintsActive.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
     var datasetPrincipal = DatasetFactory.getDataset("VM_SolicitacaoPagamentoCashTransfer", null, constraintsActive, null);
    
    
    for(var a=0;a < datasetPrincipal.rowsCount;a++){
    	var documentId = datasetPrincipal.getValue(a, "metadata#id");
        var documentVersion = datasetPrincipal.getValue(a, "metadata#version");            	
    	var empresa = datasetPrincipal.getValue(a, "companyid");            	
    		    		
    		//Cria as constraints para buscar os campos filhos, passando o tablename, número da formulário e versão
            var c1 = DatasetFactory.createConstraint("tablename", "tableBenefic" , "tableBenefic", ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST);
            var c3 = DatasetFactory.createConstraint("metadata#version", documentVersion, documentVersion, ConstraintType.MUST);
            var constraintsFilhos = new Array(c1, c2, c3);

            //Busca o dataset
            var datasetFilhos = DatasetFactory.getDataset("VM_SolicitacaoPagamentoCashTransfer", null, constraintsFilhos, null);
            for (var j = 0; j < datasetFilhos.rowsCount; j++) {
            	 	
             	//Adiciona os valores nas colunas respectivamente.
                dataset.addRow(new Array(
                        datasetFilhos.getValue(j, "cpfbeneficiario"),
                        datasetFilhos.getValue(j, "nomebeneficiario"),
                        datasetFilhos.getValue(j, "valorbeneficiario")
                ));
            }
    	
    }  
    
    return dataset;
}

