function defineStructure() {
	addColumn("COD_TIPO_PRODUTO");
    addColumn("DESC_TIPO_PRODUTO");
    addColumn("COD_GRUPO_PRODUTO");
    addColumn("DESC_GRUPO_PRODUTO");
    addColumn("COD_PRODUTO");
    addColumn("DESC_PRODUTO");
    
	
	setKey(["COD_PRODUTO"])
	
}


function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("COD_TIPO_PRODUTO");
	dataset.addColumn("DESC_TIPO_PRODUTO");
	dataset.addColumn("COD_GRUPO_PRODUTO");
	dataset.addColumn("DESC_GRUPO_PRODUTO");
	dataset.addColumn("COD_PRODUTO");
	dataset.addColumn("DESC_PRODUTO");
	     			
//	log.info("---INICIANDO EXTRAÇÃO DO POWERBI----");
	var listaProdutos = DatasetFactory.getDataset("VM_Produtos", null, null, null);
	var tipoAnterior;
	var grupoAnterior;
	var tipoProduto;
	var grupoProduto;

	
	for(var i= 0; i < listaProdutos.rowsCount; i++){ 
		var codProduto = listaProdutos.getValue(i,"CODIGO");
		var tipo = codProduto.substr(0,2);
		var grupo = codProduto.substr(2,3);
		
		if (tipo != tipoAnterior){
			var constraint2  = new Array(); 
			constraint2.push(DatasetFactory.createConstraint("CODIGO", tipo,tipo,ConstraintType.MUST));      			
			tipoProduto = DatasetFactory.getDataset("VM_TipoProduto", null, constraint2, null)    ;    		           
			tipoAnterior = tipoProduto.getValue(0,"CODIGO");
		}
		//log.info("--TIPO DE PRODUTO-");
		//log.dir(tipoProduto);
	
		
		if (grupo != grupoAnterior){
			var constraint3  = new Array(); 
			constraint3.push(DatasetFactory.createConstraint("CODIGO", grupo,grupo,ConstraintType.MUST));      			
			grupoProduto = DatasetFactory.getDataset("VM_GrupoProduto", null, constraint3, null) ;    		           
			grupoAnterior = grupoProduto.getValue(0,"CODIGO");
		}
		
		//log.info("--TIPO DE GRUPO-");
		//log.dir(grupoProduto);
	
		
		dataset.addRow([
						tipoProduto.getValue(0,"CODIGO"),
						tipoProduto.getValue(0,"DESCRICAO"),
						grupoProduto.getValue(0,"CODIGO"),
						grupoProduto.getValue(0,"DESCRICAO"),
						listaProdutos.getValue(i,"CODIGO"),
						listaProdutos.getValue(i,"DESCRICAO")
						
				]);
		
	}
	
	return dataset;
}
