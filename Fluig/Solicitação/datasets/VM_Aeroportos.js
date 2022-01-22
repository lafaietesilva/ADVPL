function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset();
       
    dataset.addColumn("AEROPORTO");
    dataset.addColumn("CIDADE");
    dataset.addColumn("ESTADO");
       
 
    var filtro = getConstraints(constraints, "CIDADE");
   
    var dados = [
                 	  {AEROPORTO:  'AEROPORTO DE SANTA MARIA',CIDADE: 'AEROPORTO DE SANTA MARIA - ARACAJU',ESTADO:  'SE'},
                 	  {AEROPORTO:  'AEROPORTO DE VAL DE CAES',CIDADE:  'AEROPORTO DE VAL DE CAES - BELEM',ESTADO:  'PA'},
                 	  {AEROPORTO:  'AEROPORTO DE BAGE',CIDADE:  'RS',ESTADO:  'RS'},
                 	  {AEROPORTO:  'AEROPORTO DE CAMPO GRANDE',CIDADE:  'CAMPO GRANDE',ESTADO:  'MS'},
                 	  {AEROPORTO:  'AEROPORTO DE BLUMENAU',CIDADE:  'SC',ESTADO:  'SC'},
                 	  {AEROPORTO:  'AEROPORTO DE SANTA MARIA',CIDADE: 'ARACAJU',ESTADO: 'SE'},   
                 	  {AEROPORTO:  'AEROPORTO DE VAL DE CAES',CIDADE: 'BELEM',ESTADO: 'PA'},                                                               
                 	  {AEROPORTO:  'AEROPORTO DE BAGE',CIDADE: 'BAGE',ESTADO: 'RS'},
                 	  {AEROPORTO:  'AEROPORTO DE BLUMENAU', CIDADE:  'BLUMENAU',ESTADO: 'SC'},
                 	  {AEROPORTO:  'AEROPORTO DE PORTO SEGURO', CIDADE: 'PORTO SEGURO',ESTADO: 'BA'},
                      {AEROPORTO:  'AEROPORTO JUSCELINO KUBITSCHEK', CIDADE: 'BRASILIA',ESTADO: 'DF'},
                      {AEROPORTO:  'AEROPORTO DE BOA VISTA',CIDADE: 'BOA VISTA',ESTADO: 'RO'},
                      {AEROPORTO:  'AEROPORTO DE CASCAVEL',CIDADE: 'CASCAVEL',ESTADO: 'PR'},
                      {AEROPORTO:  'AEROPORTO DE CABO FRIO',CIDADE: 'CABO FRIO',ESTADO: 'RJ'},
                      {AEROPORTO:  'AEROPORTO DE CUIABA',CIDADE: 'CUIABA',ESTADO: 'MT'},
                      {AEROPORTO:  'AEROPORTO DE CONGONHAS',CIDADE: 'CONGONHAS-SAO PAULO',ESTADO: 'SP'},
                      {AEROPORTO:  'AEROPORTO DE GUARULHOS',CIDADE: 'GUARULHOS-SAO PAULO',ESTADO: 'SP'},
                      {AEROPORTO:  'AEROPORTO DE CONFINS',CIDADE: 'CONFINS-BELO HORIZONTE',ESTADO: 'MG'},
                      {AEROPORTO:  'AEROPORTO JOAO SUASSUNA',CIDADE: 'CAMPINA GRANDE',ESTADO: 'PB'},
                      {AEROPORTO:  'AEROPORTO AFONSO PENA',CIDADE: 'CURITIBA',ESTADO: 'PR'},
                      {AEROPORTO:  'AEROPORTO DE CAXIAS DO SUL',CIDADE: 'CAXIAS DO SUL',ESTADO: 'RS'},
                      {AEROPORTO:  'AEROPORTO DE FLORIANOPOLIS',CIDADE: 'FLORIANOPOLIS',ESTADO: 'SC'},
                      {AEROPORTO:  'AEROPORTO PINTO MARTINS',CIDADE: 'FORTALEZA',ESTADO: 'CE'},
                      {AEROPORTO:  'AEROPORTO DO GALEAO',CIDADE: 'GALEÃO - RIO DE JANEIRO',ESTADO: 'RJ'},
                      {AEROPORTO:  'AEROPORTO DE GUARAPUAVA',CIDADE: 'GUARAPUAVA',ESTADO: 'PR'},
                      {AEROPORTO:  'AEROPORTO DE RIO BRANCO',CIDADE: 'RIO BRANCO',ESTADO: 'AC'},
                      {AEROPORTO:  'AEROPORTO DE MACAPA',CIDADE: 'MACAPA',ESTADO: 'AP'},
                      {AEROPORTO:  'AEROPORTO FRANCO MONTORO',CIDADE: 'GUARULHOS',ESTADO: 'SP'},
                      {AEROPORTO:  'AEROPORTO DE GOIANIA',CIDADE: 'GOIANIA',ESTADO: 'GO'},
                      {AEROPORTO:  'AEROPORTO DE CALDAS NOVAS',CIDADE: 'CALDAS NOVAS',ESTADO: 'GO'},
                      {AEROPORTO:  'AEROPORTO DAS CATARATAS',CIDADE: 'FOZ DO IGUACU',ESTADO: 'PR'},
                      {AEROPORTO:  'AEROPORTO PREFEITO RENATO MOREIRA',CIDADE: 'IMPERATRIZ',ESTADO: 'MA'},
                      {AEROPORTO:  'AEROPORTO DE ILHEUS',CIDADE: 'ILHEUS',ESTADO: 'BA'},
                      {AEROPORTO:  'AEROPORTO DO CARIRI',CIDADE: 'JUAZEIRO DO NORTE',ESTADO: 'CE'},
                      {AEROPORTO:  'AEROPORTO DE JOINVILLE',CIDADE: 'JOINVILLE',ESTADO: 'SC'},
                      {AEROPORTO:  'AEROPORTO PRES. CASTRO PINTO',CIDADE: 'JOAO PESSOA',ESTADO: 'PB'},
                      {AEROPORTO:  'AEROPORTO DE LONDRINA',CIDADE: 'LONDRINA',ESTADO: 'PR'},
                      {AEROPORTO:  'AEROPORTO DE LAGES',CIDADE: 'LAGES',ESTADO: 'RS'},
                      {AEROPORTO:  'AEROPORTO EDUARDO GOMES',CIDADE: 'MANAUS',ESTADO: 'AM'},
                      {AEROPORTO:  'AEROPORTO ZUMBI DOS PALMARES',CIDADE: 'MACEIO',ESTADO: "AL"},
                      {AEROPORTO:  'AEROPORTO DE MARINGA',CIDADE: 'MARINGA',ESTADO: 'PR'},
                      {AEROPORTO:  'AEROPORTO DE MOSSORO',CIDADE: 'MOSSORO',ESTADO: 'RN'},
                      {AEROPORTO:  'AEROPORTO AUGUSTO SEVERO',CIDADE: 'NATAL',ESTADO: 'RN'},
                      {AEROPORTO:  'AEROPORTO DE PELOTAS',CIDADE: 'PELOTAS',ESTADO: 'RS'},
                      {AEROPORTO:  'AEROPORTO DA PAMPULHA',CIDADE: 'BELO HORIZONTE',ESTADO: 'MG'},
                      {AEROPORTO:  'AEROPORTO DE PARNAIBA',CIDADE: 'PARNAIBA',ESTADO: 'PI'},
                      {AEROPORTO:  'AEROPORTO DE PASSO FUNDO',CIDADE: 'PASSO FUNDO',ESTADO: 'RS'},
                      {AEROPORTO:  'AEROPORTO DE PALMAS',CIDADE: 'PALMAS',ESTADO: 'TO'},
                      {AEROPORTO:  'AEROPORTO DE PETROLINA',CIDADE: 'PETROLINA',ESTADO: 'PE'},
                      {AEROPORTO:  'AEROPORTO SALGADO FILHO',CIDADE: 'PORTO ALEGRE',ESTADO: 'RS'},
                      {AEROPORTO:  'AEROPORTO DOS GUARARAPES',CIDADE: 'RECIFE',ESTADO: 'PE'},
                      {AEROPORTO:  'AEROPORTO DE SANTA MARIA',CIDADE: 'SANTA MARIA',ESTADO: 'RS'},
                      {AEROPORTO:  'AEROPORTO SANTOS DUMONT',CIDADE: 'SANTOS DUMONT-RIO DE JANEIRO',ESTADO: 'RJ'},
                      {AEROPORTO:  'AEROPORTO MARECHAL CUNHA MACHADO',CIDADE: 'SAO LUIS',ESTADO: 'MA'},
                      {AEROPORTO:  'AEROPORTO DE SOROCABA',CIDADE: 'SOROCABA',ESTADO: 'SP'},
                      {AEROPORTO:  'AEROPORTO DE SALVADOR',CIDADE: 'SALVADOR',ESTADO: 'BA'},
                      {AEROPORTO:  'AEROPORTO SENADOR PETRÔNIO PORTELA',CIDADE: 'TERESINA',ESTADO: "PI"},
                      {AEROPORTO:  'AEROPORTO DE VIRACOPOS',CIDADE: 'CAMPINAS',ESTADO: 'SP'},
                      {AEROPORTO:  'AEROPORTO DE UBERLÂNDIA',CIDADE: 'UBERLANDIA',ESTADO: 'MG'},
                      {AEROPORTO:  'AEROPORTO DE VITORIA DA CONQUISTA',CIDADE: 'VITORIA DA CONQUISTA',ESTADO: 'BA'},
                      {AEROPORTO:  'AEROPORTO DE VITORIA',CIDADE: 'VITORIA',ESTADO: 'ES'},
                      {AEROPORTO:  'AEROPORTO DE MONTES CLAROS',CIDADE: 'MONTES CLAROS',ESTADO: 'MG'},
                      {AEROPORTO:  'AEROPORTO DE CHAPECO',CIDADE: 'CHAPECO',ESTADO: 'SC'}
                 ];

     
   
   
    if(dados != null){
              for(var i in dados){
                     
                     if(filtro != null && (dados[i].AEROPORTO.toUpperCase().indexOf(filtro.toUpperCase())  > -1 || dados[i].CIDADE.toUpperCase().indexOf(filtro.toUpperCase())  > -1)){
                           dataset.addRow([dados[i].AEROPORTO, dados[i].CIDADE, dados[i].ESTADO]);
                     }
                     if(filtro == null){
                           dataset.addRow([dados[i].AEROPORTO, dados[i].CIDADE, dados[i].ESTADO]);
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