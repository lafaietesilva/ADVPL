#include 'protheus.ch'
#include "totvs.ch"
#Include "rwmake.ch"

User Function  MT097APR() //-- Atualiza��es / valida��es do usuario
	Local cCnpj
	Local cRet
	//chama funcao que conecta com fluig e envia cancelamento de tarefas pendentes

	cCnpj 	:= U_WSSeekFil()
	cRet    := U_CancPed(SC7->C7_NUM,cCnpj) //Tive que transformar a fun��o em user funcion -> estava como static funcion

	IF !Empty(cRet)
		IF !"SUCCESS" $ Upper(cRet)

			Return
		Endif
	Endif
Return
