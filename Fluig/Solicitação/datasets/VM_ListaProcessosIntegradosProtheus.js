function createDataset(fields, constraints, sortFields) {
       var dataset = DatasetBuilder.newDataset();
       
    dataset.addColumn("CODIGO");
    dataset.addColumn("DESCRICAO");

 
    var filtro = getConstraints(constraints, "CODIGO");
   
    var dados = [
                 	  {CODIGO:  '1' ,DESCRICAO: 'SOLICITACAO DE VIAGEM'},
                 	  {CODIGO:  '2' ,DESCRICAO: 'SOLICITACAO DE COMPRA'},
                 	  {CODIGO:  '3' ,DESCRICAO: 'REEMBOLSO AUXILIO CRECHE'},
                 	  {CODIGO:  '4' ,DESCRICAO: 'REEMBOLSO DE DESPESAS'},  
                 	  {CODIGO:  '5' ,DESCRICAO: 'SOLICITACAO DE DIARIAS'}, 
                 	  {CODIGO:  '6' ,DESCRICAO: 'LOCACAO DE VEICULO'}, 
                 	  {CODIGO:  '7' ,DESCRICAO: 'SOLICITACAO DE EVENTO'}, 
                 	  {CODIGO:  '8' ,DESCRICAO: 'ADIANTAMENTO DE VIAGEM INTERNACIONAL'}, 
                 	  {CODIGO:  '9' ,DESCRICAO: 'ADIANTAMENTO AO FORNECEDOR'}, 
                      {CODIGO:  '10',DESCRICAO: 'CADASTRO DE PRODUTO'},
                      {CODIGO:  '11',DESCRICAO: 'CONTRATACAO DE SERVICO'},
                      {CODIGO:  '12',DESCRICAO: 'SOLICITACAO DE TRANSFER'}
                 ];
   
    if(dados != null){
              for(var i in dados){
                     
                     if(filtro != null && (dados[i].CODIGO.toUpperCase().indexOf(filtro.toUpperCase())  > -1 || dados[i].DESCRICAO.toUpperCase().indexOf(filtro.toUpperCase())  > -1)){
                           dataset.addRow([dados[i].CODIGO, dados[i].DESCRICAO]);
                     }
                     if(filtro == null){
                    	 dataset.addRow([dados[i].CODIGO, dados[i].DESCRICAO]);
                     }
              }
       }
   
    return dataset;
   
   
}
function getConstraints(constraints, field){
       if(constraints == null)
              return null;
       
       for(var i=0;i<constraints.length;i++){
              if(constraints[i].fieldName == field ){
                     return constraints[i].initialValue;
              }
       }
       
       return null;
}