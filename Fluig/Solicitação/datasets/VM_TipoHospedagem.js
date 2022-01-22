function createDataset(fields, constraints, sortFields) {
	 var dataset = DatasetBuilder.newDataset();
	
	 dataset.addColumn("TIPO");
	
	  var dados = [
	              {TIPO:  'NAO INFORMADO'},
              	  {TIPO:  'GUEST HOUSE'},
              	  {TIPO:  'BALCÃO'},
              	  {TIPO:  'OUTROS'}
              	  ];
	  
	  
	    if(dados != null){
            for(var i in dados){
            	 dataset.addRow([dados[i].TIPO]);
            }
     }
	  
	    
	  
	  return dataset;

}