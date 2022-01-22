function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset();
       
    dataset.addColumn("CODIGO");
    dataset.addColumn("DESCRICAO");
    
       
 
    var filtro = getConstraints(constraints, "DESCRICAO");
   
    var dados = [
                 	  {CODIGO:  '01',DESCRICAO: 'Escritorio de Belo Horizonte'},
                 	  {CODIGO:  '02',DESCRICAO: 'Escritorio de Recife'},   
                 	  {CODIGO:  '03',DESCRICAO: 'Cluster Fortaleza'},
                 	  {CODIGO:  '04',DESCRICAO: 'Cluster Salvador'},
                 	  {CODIGO:  '06',DESCRICAO: 'Cluster Rio de Janeiro'},              	  
                 	  {CODIGO:  '09',DESCRICAO: 'Cluster Alagoas'},
                 	  {CODIGO:  '10',DESCRICAO: 'Escritorio de Sao Paulo'},
                 	  {CODIGO:  '11',DESCRICAO: 'Cluster Mossoro'},
                 	  {CODIGO:  '12',DESCRICAO: 'Manaus'},
                 	  {CODIGO:  '21',DESCRICAO: 'Escritório de Brasilia'} ,
                 	  {CODIGO:  '22',DESCRICAO: 'Escritório de Roraima'} 
                 ];

     
   
   
    if(dados != null){
              for(var i in dados){
                     
                     if(filtro != null && (dados[i].DESCRICAO.toUpperCase().indexOf(filtro.toUpperCase())  > -1 )){
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