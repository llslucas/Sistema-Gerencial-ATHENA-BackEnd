export function formatCompra(compra){     
  const itensCompra = compra.itens.map(item => {
    return{
      id: item.id,
      quantidade: item.quantidade,
      valor_unitario: item.valor_unitario,
      valor_total: item.valor_total
    }
  });

  return {
    numero_nota: compra.numero_nota,
    fornecedor: compra.fornecedor,
    data_compra: compra.data_compra,
    itens: itensCompra
  };  
}

export function FormatPano(movimentacao){  
  const itensMovimentacao = movimentacao.itens.map(item => {
    return {
      id_produto: item.id,
      quantidade: item.quantidade,
      valor_venda: item.valor_venda
    }
  });

  return{
    observacoes: movimentacao.observacoes,
    id_revendedor: movimentacao.revendedor.id,
    itens: itensMovimentacao
  };
}

function formatVenda(venda){     
  const itensVenda = venda.itens.map(item => {
    return{
      id_produto: item.id,
      quantidade: item.quantidade,
      valor_unitario: item.valor_unitario,
      valor_total: item.valor_total,
      valor_comissao: item.valor_comissao
    }
  });

  return {
    id: venda.id,
    tipo_pagamento: venda.tipo_pagamento,
    data_venda: venda.data_venda,
    id_revendedor: venda.revendedor.id,
    id_cliente: venda.cliente.id,
    itens: itensVenda
  };        
};

export function FormatMovimentacao(movimentacao){  
  const itensMovimentacao = movimentacao.itens.map(item => {
    return {
      id_produto: item.id,
      tipo_movimentacao: item.tipo_movimentacao,
      quantidade: item.quantidade,
      valor_unitario: item.valor_unitario,
      valor_total: item.valor_total
    }
  });

  return{
    descricao: movimentacao.descricao,
    data_movimentacao: movimentacao.data_movimentacao,
    itens: itensMovimentacao
  };
}