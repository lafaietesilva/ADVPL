function defineStructure() {
	addColumn("NOME_GERENTE");
	addColumn("EMAIL_G");
	addColumn("NOME");
	addColumn("EMAIL_F");
	addColumn("DT_ADMISSAO");
	addColumn("FUNCAO");
	addColumn("GESTOR_MATRICIAL");
	addColumn("EMAIL_MATRICIAL");
	
	setKey(["EMAIL_F"]);
	
	
	
}

function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	
	dataset.addColumn("NOME_GERENTE");
	dataset.addColumn("EMAIL_G");
	dataset.addColumn("NOME");
	dataset.addColumn("EMAIL_F");
	dataset.addColumn("DT_ADMISSAO");
	dataset.addColumn("FUNCAO");
	dataset.addColumn("GESTOR_MATRICIAL");
	dataset.addColumn("EMAIL_MATRICIAL");
	

    var datasetPrincipal = DatasetFactory.getDataset("DSGestorFuncionariosAcordoDesempenho", null, null, null);
    
    for(var a=0;a < datasetPrincipal.rowsCount;a++){
    	var documentId = datasetPrincipal.getValue(a, "metadata#id");
    	var documentVersion = datasetPrincipal.getValue(a, "metadata#version");    
    	
    	//Cria as constraints para buscar os campos filhos, passando o tablename, número da formulário e versão
        var c1 = DatasetFactory.createConstraint("tablename", "tableItens" , "tableItens", ConstraintType.MUST);
        var c2 = DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST);
        var c3 = DatasetFactory.createConstraint("metadata#version", documentVersion, documentVersion, ConstraintType.MUST);
        var constraintsFilhos = new Array(c1, c2, c3);

        //Busca o dataset
        var datasetFilhos = DatasetFactory.getDataset("DSGestorFuncionariosAcordoDesempenho", null, constraintsFilhos, null);
        for (var j = 0; j < datasetFilhos.rowsCount; j++) {
           	//Adiciona os valores nas colunas respectivamente.
            dataset.addRow(new Array(
                    datasetPrincipal.getValue(a, "nomelider"),
                    datasetPrincipal.getValue(a, "emaillider"),
                    datasetFilhos.getValue(j, "funcionario"),
                    datasetFilhos.getValue(j, "emailfuncionario"),
                    datasetFilhos.getValue(j, "dtadmissao"),
                    datasetFilhos.getValue(j, "funcao"),
                    datasetFilhos.getValue(j, "gestormatricial"),
                    datasetFilhos.getValue(j, "emailmatricial")
            ));
        }
    }
	
    
	return dataset;

}


