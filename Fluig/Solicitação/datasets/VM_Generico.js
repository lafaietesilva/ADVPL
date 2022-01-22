function defineStructure() {
	addColumn("IDENTIFICADOR");
	addColumn("DESCRICAO");
		
	setKey(["IDENTIFICADOR"],["DESCRICAO"]);
	addIndex(["DESCRICAO"]);
}


function createDataset(fields, constraints, sortFields) {
	 var dataset = DatasetBuilder.newDataset();
     
	    dataset.addColumn("IDENTIFICADOR");
	    dataset.addColumn("DESCRICAO");	
	  
	    var filtro = getConstraints(constraints, "DESCRICAO");
	    
	    var dados = [
                	  {IDENTIFICADOR:  'ESTADO_CIVIL',DESCRICAO:  'SOLTEIRO (A)'},
                	  {IDENTIFICADOR:  'ESTADO_CIVIL',DESCRICAO:  'CASADO (A)'},
                	  {IDENTIFICADOR:  'ESTADO_CIVIL',DESCRICAO:  'DIVORCIADO (A)'},
                	  {IDENTIFICADOR:  'ESTADO_CIVIL',DESCRICAO:  'MARITAL'},
                	  {IDENTIFICADOR:  'ESTADO_CIVIL',DESCRICAO:  'DESQUITADO (A)'},
                	  {IDENTIFICADOR:  'ESTADO_CIVIL',DESCRICAO:  'VIUVO (A)'},
               	  
                	  {IDENTIFICADOR:  'ETNIA',DESCRICAO:  'INDIGENA'},
                	  {IDENTIFICADOR:  'ETNIA',DESCRICAO:  'BRANCA'},
                	  {IDENTIFICADOR:  'ETNIA',DESCRICAO:  'NEGRA'},
                	  {IDENTIFICADOR:  'ETNIA',DESCRICAO:  'AMARELA'},
                	  {IDENTIFICADOR:  'ETNIA',DESCRICAO:  'PARDA'},
                	  
                	  {IDENTIFICADOR:  'TIPO_SANGUINEO',DESCRICAO:  'A+'},
                	  {IDENTIFICADOR:  'TIPO_SANGUINEO',DESCRICAO:  'B+'},
                	  {IDENTIFICADOR:  'TIPO_SANGUINEO',DESCRICAO:  'AB+'},
                	  {IDENTIFICADOR:  'TIPO_SANGUINEO',DESCRICAO:  'O+'},
                	  {IDENTIFICADOR:  'TIPO_SANGUINEO',DESCRICAO:  'A-'},
                	  {IDENTIFICADOR:  'TIPO_SANGUINEO',DESCRICAO:  'B-'},
                	  {IDENTIFICADOR:  'TIPO_SANGUINEO',DESCRICAO:  'AB-'},
                	  {IDENTIFICADOR:  'TIPO_SANGUINEO',DESCRICAO:  'O-'},
                	  
                	  {IDENTIFICADOR:  'PNE',DESCRICAO:  'NAO E PORTADOR DE NECESSIDADE ESPECIAL'},
                	  {IDENTIFICADOR:  'PNE',DESCRICAO:  'FISICA'},
                	  {IDENTIFICADOR:  'PNE',DESCRICAO:  'AUDITIVA'},
                	  {IDENTIFICADOR:  'PNE',DESCRICAO:  'VISUAL'},
                	  {IDENTIFICADOR:  'PNE',DESCRICAO:  'MENTAL'},
                	  {IDENTIFICADOR:  'PNE',DESCRICAO:  'INTELECTUAL'},
                	  {IDENTIFICADOR:  'PNE',DESCRICAO:  'REABILITADO'},
                	  
                	  {IDENTIFICADOR:  'PARENTESCO',DESCRICAO:  'CONJUGE/COMPANHEIRO (A)'},
                	  {IDENTIFICADOR:  'PARENTESCO',DESCRICAO:  'FILHO'},
                	  {IDENTIFICADOR:  'PARENTESCO',DESCRICAO:  'FILHA'},
                	  {IDENTIFICADOR:  'PARENTESCO',DESCRICAO:  'MAE'},
                	  {IDENTIFICADOR:  'PARENTESCO',DESCRICAO:  'PAI'},
                	  {IDENTIFICADOR:  'PARENTESCO',DESCRICAO:  'IRMAO'},
                	  {IDENTIFICADOR:  'PARENTESCO',DESCRICAO:  'IRMA'},
                	  {IDENTIFICADOR:  'PARENTESCO',DESCRICAO:  'IRMAO'},
                	  {IDENTIFICADOR:  'PARENTESCO',DESCRICAO:  'AVO'},
                	  {IDENTIFICADOR:  'PARENTESCO',DESCRICAO:  'AVO'},
                	  {IDENTIFICADOR:  'PARENTESCO',DESCRICAO:  'GUARDIAO'},
                	  
                	  {IDENTIFICADOR:  'TAMANHO_CAMISA',DESCRICAO:  'P'},
                	  {IDENTIFICADOR:  'TAMANHO_CAMISA',DESCRICAO:  'M'},
                	  {IDENTIFICADOR:  'TAMANHO_CAMISA',DESCRICAO:  'G'},
                	  {IDENTIFICADOR:  'TAMANHO_CAMISA',DESCRICAO:  'GG'},
                	  {IDENTIFICADOR:  'TAMANHO_CAMISA',DESCRICAO:  'XGG'},
                	  
                	  {IDENTIFICADOR:  'TIPO_REVISAO',DESCRICAO:  '1-ADITIVO DE PRAZO'},
                	  {IDENTIFICADOR:  'TIPO_REVISAO',DESCRICAO:  '3-ADITIVO DE VALOR'},
                	  {IDENTIFICADOR:  'TIPO_REVISAO',DESCRICAO:  'C-RENOVACAO DE CONTRATO'},
                	  {IDENTIFICADOR:  'TIPO_REVISAO',DESCRICAO:  '7-ALTERACAO DE CLAUSULAS'}
                	 
                	  
                ];
	 
	    if(dados != null){
            for(var i in dados){
            	
             if(filtro != null && (dados[i].DESCRICAO.toUpperCase().indexOf(filtro.toUpperCase())  > -1)){
            		dataset.addRow([dados[i].IDENTIFICADOR, dados[i].DESCRICAO]);
              }
              if(filtro == null){
            	  dataset.addRow([dados[i].IDENTIFICADOR, dados[i].DESCRICAO]);
              }
            	
            	
            	
            }
     }
 
  return dataset;
	    
  function getConstraints(constraints, field){
		
		if(constraints == null)
			return null;
		
		for(var i=0;i<constraints.length;i++){
			if(constraints[i].fieldName == field  ){		
				return constraints[i].initialValue;
			}
		}
		
		return null;
	}
  
}

