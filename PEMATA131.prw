#Include 'Protheus.ch'
#include 'topconn.ch'
#include 'totvs.ch'


/*
#---------------------------------------------------------------#
| Programa:|                                   Data:05/01/2022  |
|---------------------------------------------------------------|
| Autor:   | NP3 Tecnologia                                     |
|---------------------------------------------------------------|
| Objetivo:| Pontos de entrada na Gera Cotações                 |
|---------------------------------------------------------------|
|                        ALTERAÇÕES                             |
|---------------------------------------------------------------|
|     Analista      |   Data     |  Motivo                      |
|---------------------------------------------------------------|
|                   |            |                              |
|                   |            |                              |
#---------------------------------------------------------------#

LINK TDN: 

https://tdn.totvs.com/display/public/PROT/TVOX63_DT_PONTO_DE_ENTRADA_MT131MNU
https://tdn.totvs.com/pages/releaseview.action?pageId=536709258
https://centraldeatendimento.totvs.com/hc/pt-br/articles/360021507611-MP-ADVPL-Utiliza%C3%A7%C3%A3o-do-MsDocument-no-ponto-MTA094RO-

*/

//PONTO DE ENTRADA DOS BOTÕES "Exibir Anexo" NA GERAÇÃO DE COTAÇAÕ
User Function MT131MNU()

AAdd( aRotina , { "Exibir Anexo", "U_NP3F0202()", 0, 3, 0, nil} )	

Return (aRotina)

//ROTINA DE ABERTURA DE CONHECIMETO
User Function NP3F0202()

MsDocument('SC1',SC1->(RecNo()), 4)

return


//ROTINA DE ENVIO DE EMAIL
User Function MT131WF()

Local cNumCot :=  PARAMIXB[1]
Local aDados := {}

If !Empty(cNumCot)

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
        WHERE C8.C8_NUM = %Exp:cNumCot%
            AND C8.C8_FILIAL = %XFilial:SC8%
            AND C8.%notDel%

    ENDSQL

    //ALIMENTA O ARRAY DE TRABALHO

    While QSC8->(!Eof())
        Aadd(aDados,{QSC8->C8_FORNECE,;
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
    ASORT(aDados, , , { | x,y | x[2] < y[2] } )

    //CHAMA ROTINA DE DISPARA EMAIL
    If Len(aDados) > 0
        U_NP3F0203(aDados)
    EndIf

    QSC8->(DbCloseAre())
EndIf
RETURN

User Function NP3F0203(aDados)

Local nH := 1
Local cFornec := "" 
Local cProcesso,cAssunto,cArqHtml,cDestinatario	
Local oProcess, oHtml
Local lEnv := .F.
Local cUser := ""
Local cCotacao ,cEmissao  ,cFor  ,cEnd  ,cCond   := ""
Local cItem ,cProduto, cDescri, cQuant ,cValor ,cTotal ,cPref  := ""


cAssunto    := "Email de cotação"
cArqHtml    := "\workflow\cotacao.html"
cProcesso 	:= "EMAILCOTACAO"	

//Inicialize a classe de processo
oProcess := TWFProcess():New( cProcesso, cAssunto )
oProcess:NewTask(cProcesso,cArqHtml)

oHtml   := oProcess:oHtml

oHtml:ValByName( "it.item"  ,{} )
oHtml:ValByName( "it.produto"  ,{} )
oHtml:ValByName( "it.descricao"  ,{} )
oHtml:ValByName( "it.quantidade"  ,{} )
oHtml:ValByName( "it.vlrunit"  ,{} )
oHtml:ValByName( "it.total"  ,{} )
oHtml:ValByName( "it.preferencia"  ,{} )

For nH := 1 to Len(aDados)
    
    If cFornec != aDados[nH,1] 

        If lEnv
            //Dados da mensagem
            cUser := Subs(cUsuario,7,15)
	        oProcess:ClientName(cUser)
	        oProcess:cTo := cDestinatario
            oProcess:cSubject := cAssunto

            //Envia mensagem aos destinatários
	        oProcess:Start()

            //Crie uma nova tarefa, informando o html template a ser utilizado
            oProcess:NewTask( cProcesso, cArqHtml )

            //Inicializa o html
            oHtml := oProcess:oHTML

            oHtml:ValByName( "it.item"          ,{} )
            oHtml:ValByName( "it.produto"       ,{} )
            oHtml:ValByName( "it.descricao"     ,{} )
            oHtml:ValByName( "it.quantidade"    ,{} )
            oHtml:ValByName( "it.vlrunit"       ,{} )
            oHtml:ValByName( "it.total"         ,{} )
            oHtml:ValByName( "it.preferencia"   ,{} )
        EndIf        

        

        cCotacao    :=aDados[nH,10]
        cEmissao    :=DToC(Stod(aDados[nH,11]))
        cFor        :=AllTrim(aDados[nH,1]) + '-' + AllTrim(aDados[nH,2]) 
        cEnd        :=""
        cCond       :=Alltrim(aDados[nH,13])

        oHtml:ValByName( "cEmpresa"       ,AllTrim(SM0->M0_CODIGO) + '-' + AllTrim(SM0->M0_NOME) )
        oHtml:ValByName( "cFilial"        ,AllTrim(SM0->M0_CODFIL) + '-' + AllTrim(SM0->M0_FILIAL) )
        oHtml:ValByName( "cCotacao"       ,cCotacao )
        oHtml:ValByName( "cEmissao"       ,cEmissao )
        oHtml:ValByName( "cFornecedor"    ,cFor )
        oHtml:ValByName( "cEndereco"      ,cEnd )
        oHtml:ValByName( "cCondicao"      ,cCond )
        
        cFornec := aDados[nH,1]
        cDestinatario :=  aDados[nH,3]

        lEnv := .T.

    EndIf


    cItem       := Alltrim(aDados[nH,4]) 
    cProduto    := Alltrim(aDados[nH,5])
    cDescri     := Alltrim(aDados[nH,6]) 
    cQuant      := TRANSFORM(aDados[nH,7],'@E 999,99') 
    cValor      := TRANSFORM( aDados[nH,8],'@E 999,999.99')
    cTotal      := TRANSFORM(aDados[nH,9],'@E 999,999.99') 
    cPref       := ""

    AAdd(  (oHtml:ValByName( "it.item" ))           ,cItem)
    AAdd(  (oHtml:ValByName( "it.produto") )        ,cProduto)
    AAdd(  (oHtml:ValByName( "it.descricao") )      ,cDescri)
    AAdd(  (oHtml:ValByName( "it.quantidade") )     ,cQuant)
    AAdd(  (oHtml:ValByName( "it.vlrunit" ))        ,cValor)
    AAdd(  (oHtml:ValByName( "it.total" ))          ,cTotal)
    AAdd(  (oHtml:ValByName( "it.preferencia" ))    ,cPref)
    
Next

If lEnv
     //Dados da mensagem
    cUser := Subs(cUsuario,7,15)
    oProcess:ClientName(cUser)
    oProcess:cTo := cDestinatario
    oProcess:cSubject := cAssunto

    //Envia mensagem aos destinatários
    oProcess:Start()
EndIf

return

