#Include "PROTHEUS.ch"
#Include "TBICONN.ch"

User Function MT120FIM()
	Local nOpcao := PARAMIXB[1]   // Opção Escolhida pelo usuario
	Local cNumPC := PARAMIXB[2]   // Numero do Pedido de Compras
	Local nOpcA  := PARAMIXB[3]   // Indica se a ação foi Cancelada = 0  ou Confirmada = 1.

    If nOpcA == 1
        If nOpcao == 3 .or. nOpcao == 4 .or. nOpcao == 5 .or. nOpcao == 9 //Incluir ou Alterar ou Excluir ou Copiar
            U_APROVAWF(cNumPC,nOpcao)
        EndIf
    EndIf

Return
