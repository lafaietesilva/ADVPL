#Include 'Protheus.ch'
#include 'topconn.ch'
#include 'totvs.ch'


User Function MT150ROT()
//Define Array contendo as Rotinas a executar do programa     
// ----------- Elementos contidos por dimensao ------------    
// 1. Nome a aparecer no cabecalho                             
// 2. Nome da Rotina associada                                
 // 3. Usado pela rotina                                        
 // 4. Tipo de Transa‡„o a ser efetuada                         
 //    1 - Pesquisa e Posiciona em um Banco de Dados            
 //    2 - Simplesmente Mostra os Campos                        
 //    3 - Inclui registros no Bancos de Dados                  
 //    4 - Altera o registro corrente                           
 //    5 - Remove o registro corrente do Banco de Dados         
 //    6 - Altera determinados campos sem incluir novos Regs     
//  AAdd( aRotina, { 'Documento', 'MsDocument(SC8, SC8->(recno()), 4)', 0, 4 } )
 aAdd( aRotina , { "Reenviar Cotação" , " U_NP3F0201()", 0,1,0,Nil } )
 
 Return aRotina 


//REEVIO DE EMAIL AO FORNECEDOR
User Function NP3F0201()

Local lSair := .f.
Local nH := 1
Local cFornec := ""
Local cNomeF := ""
Local aDados := {}

Local aPergs   := {}
Local cC1NUM  := Space(TamSX3('C1_NUM')[01])
Local aRet := {}

Local aSC8 := {}
Local aCodFor := {}
Local cCodFor := ""


aAdd(aPergs, {1, "Solicitação de Compra",  cC1NUM,  "", ".T.", "SC1", ".T.", 80,  .F.})

// digita o pedido de compra
If ParamBox(aPergs, "Informe a Solicitação de compra",@aRet)
    cC1NUM := aRet[1]    
Else
    lSair := .t.   
EndIf

If !lSair

    BEGINSQL ALIAS 'QSC8'
        SELECT C8.C8_NUM as C8_NUM
            ,C8.C8_EMISSAO as C8_EMISSAO
            ,C8.C8_FORNECE as C8_FORNECE
            ,C8.C8_FORNOME as C8_FORNOME
            ,C8.C8_FORMAIL as C8_FORMAIL
            //END
            ,C8.C8_COND as C8_COND
            ,C8.C8_ITEM as C8_ITEM
            ,C8.C8_PRODUTO as C8_PRODUTO
            ,B1.B1_DESC as B1_DESC
            ,C8.C8_QUANT as C8_QUANT
            ,C8.C8_PRECO as C8_PRECO
            ,C8.C8_TOTAL as C8_TOTAL
            //PREFERENCIAL
            ,C8_OBS
        
        FROM %table:SC8% C8 
        INNER JOIN %table:SB1% B1 ON B1.B1_COD = C8.C8_PRODUTO
            AND B1.B1_FILIAL = %XFilial:SB1%
            AND B1.%notDel%
        WHERE C8.C8_NUMSC = %Exp:cC1NUM%
            AND C8.C8_FILIAL = %XFilial:SC8%
            AND C8.%notDel%

    ENDSQL

    If QSC8->(!Eof())

        //ALIMENTA O ARRAY DE TRABALHO
        While QSC8->(!Eof())
            Aadd(aSC8,{QSC8->C8_FORNECE,;
                QSC8->C8_FORNOME,;
                QSC8->C8_FORMAIL,;
                QSC8->C8_ITEM,;
                QSC8->C8_PRODUTO,;
                QSC8->B1_DESC,;
                QSC8->C8_QUANT,;
                QSC8->C8_PRECO,;
                QSC8->C8_TOTAL,;
                QSC8->C8_NUM,;
                QSC8->C8_EMISSAO,;
                QSC8->C8_OBS,;
                QSC8->C8_COND})
            QSC8->(DbSkip())
        EndDo
        

        
        //ORDERNA POR CODIGO DO FORNECEDOR
        ASORT(aSC8, , , { | x,y | x[2] < y[2] } )

        //MONTA O CHECKBOX PARA ESCOLAR DO FORNECEDOR

        aPergs   := {}
        aRet   := {}
        nH := 1

        For nH := 1 to Len(aSC8)        
            If Alltrim(cFornec) != AllTrim(aSC8[nH,1]) 
                cNomeF := AllTrim(aSC8[nH,1]) + '-'+ AllTrim(aSC8[nH,2])
                aAdd(aPergs,{5,cNomeF,.F.,100,"",.F.})
                aAdd(aCodFor,AllTrim(aSC8[nH,1]))
            EndIf
            cFornec := AllTrim(aSC8[nH,1]) 
        Next
        
        //CHECKBOX PARA ESCOLAR DO FORNECEDOR
        If ParamBox(aPergs, "Informe os fornecedores",@aRet)
            For nH := 1 to Len(aRet)
                If aRet[nH] 
                    cCodFor += AllTrim(aCodFor[nH]) + "/"
                EndIf
            Next
            
        ENDIF

        //FILTRA FORNECEDORES
        For nH := 1 to Len(aSC8)
            If Alltrim(aSC8[nH,1]) $ cCodFor
                aAdd(aDados,aSC8[nH])
            EndIf
        Next

        //ROTINA DE ENVIO DE EMAIL
        If Len(aDados) > 0
            U_NP3F0203(aDados)
        EndIf 
        
    EndIf
    QSC8->(DbCloseAre())
EndIf

return
