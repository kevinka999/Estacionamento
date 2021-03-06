import React, {useEffect, useState} from 'react';
import DialogNovoPreco from './NovoPreco';
import DialogAtualizarPreco from './AtualizarPreco';
import DialogDeletarPreco from './DeletarPreco';
import api from '../../services/api';

import {format} from 'date-fns';
import {Alert} from '@material-ui/lab';
import {TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper, Button, Fab, ButtonGroup, Collapse} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';

export default function Preco(){
  const [precosEstacionamento, setPrecosEstacionamento] = useState([])
  const [updateTable, setUpdateTable] = useState(false);

  const [dialogAdicionar, setDialogAdicionar] = useState(false)

  const [dialogEditar, setDialogEditar] = useState(false)
  const [idPrecoEditar, setIdPrecoEditar] = useState(0)

  const [dialogDeletar, setDialogDeletar] = useState(false)
  const [idPrecoDeletar, setIdPrecoDeletar] = useState(0)

  const [alertSucesso, setAlertSucesso] = useState(false)
  const [mensagemAlertSucesso, setMensagemAlertSucesso] = useState("")

  useEffect(() => {
    async function fetch(){
      await api.get("/Preco/Index").then(({data}) => setPrecosEstacionamento(data))
    }

    fetch()
  }, [updateTable])

  const handleAlertSucesso = (mensagem) => {
    setAlertSucesso(true)
    setMensagemAlertSucesso(mensagem)
    setTimeout(() => setAlertSucesso(false), 3000)
  }

  const AlertAdicionadoSucesso = () => {
    return(
      <Collapse in={alertSucesso}>
        <Alert severity="success">{mensagemAlertSucesso}</Alert>
      </Collapse>
    );
  }

  const TabelaPreco = () => {
    return(
      <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <Fab color="primary" aria-label="Add" onClick={() => setDialogAdicionar(true)}>
                <AddIcon />
              </Fab>
            </TableCell>
            <TableCell align="center">Valor Inicial</TableCell>
            <TableCell align="center">Data Inicial Valida</TableCell>
            <TableCell align="center">Data Final Valida</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {precosEstacionamento.map((preco) => (
            <TableRow key={preco.id}>
              <TableCell align="center">{preco.id}</TableCell>
              <TableCell align="center">{preco.valorInicial}</TableCell>
              <TableCell align="center">{format(new Date(preco.dataInicial), 'dd/MM/yyyy HH:mm')}</TableCell>
              <TableCell align="center">{format(new Date(preco.dataFinal), 'dd/MM/yyyy HH:mm')}</TableCell>
              <TableCell align="center">
                <ButtonGroup disableElevation variant="contained" color="primary">
                  <Button onClick={() => {
                    setIdPrecoEditar(preco.id)
                    setDialogEditar(true)
                  }}>
                    <CreateIcon/>
                  </Button>
                  <Button onClick={() => {
                    setIdPrecoDeletar(preco.id)
                    setDialogDeletar(true)
                  }}>
                    <DeleteIcon/>
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}     
        </TableBody>
      </Table>
    </TableContainer>
    );
  }

  return (
    <React.Fragment>
      <AlertAdicionadoSucesso/>
      <DialogNovoPreco
        valorDialog={dialogAdicionar}
        alertSucesso={() => handleAlertSucesso("Preco adicionado ao estacionamento com sucesso!")} 
        fecharDialog={() => {
          setDialogAdicionar(false)
          setUpdateTable(!updateTable)
        }}
      />
      {idPrecoEditar !== 0 && (
        <DialogAtualizarPreco
          idPreco={idPrecoEditar}
          valorDialog={dialogEditar}
          alertSucesso={() => handleAlertSucesso("Preco do estacionamento atualizado com sucesso!")} 
          fecharDialog={() => {
            setDialogEditar(false)
            setIdPrecoEditar(0)
            setUpdateTable(!updateTable)
          }}
        />
      )}
      {idPrecoDeletar !== 0 && (
        <DialogDeletarPreco
          idPreco={idPrecoDeletar}
          valorDialog={dialogDeletar}
          alertSucesso={() => handleAlertSucesso("Preco do estacionamento excluido com sucesso!")} 
          fecharDialog={() => {
            setDialogDeletar(false)
            setIdPrecoDeletar(0)
            setUpdateTable(!updateTable)
          }}
        />
      )}
    <TabelaPreco/>
  </React.Fragment>
  )
}