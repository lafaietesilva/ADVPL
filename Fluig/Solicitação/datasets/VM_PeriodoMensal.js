
function createDataset(fields, constraints, sortFields) {

	 var dataset = DatasetBuilder.newDataset();
		
	 dataset.addColumn("MES");
	
	  var dados = [
              	  {MES:  'OUTUBRO'},
              	  {MES:  'NOVEMBRO'},
              	  {MES:  'DEZEMBRO'},
              	  {MES:  'JANEIRO'},
              	  {MES:  'FEVEREIRO'},
              	  {MES:  'MARÇO'},
              	  {MES:  'ABRIL'},
              	  {MES:  'MAIO'},
              	  {MES:  'JUNHO'},
              	  {MES:  'JULHO'},
              	  {MES:  'AGOSTO'},              	  
              	  {MES:  'SETEMBRO'}
              	  ];
	  
	  
	    if(dados != null){
            for(var i in dados){
            	 dataset.addRow([dados[i].MES]);
            }
     }
	  
	    
	  
	  return dataset;
}