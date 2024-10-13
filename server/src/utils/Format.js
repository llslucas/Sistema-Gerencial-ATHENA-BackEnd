export function FormatPano(pano){  
  const itensPano = pano.itens.map(item => {
    return {
      id_produto: item.id,
      quantidade: item.quantidade,
      valor_venda: item.valor_venda
    }
  });

  return{
    observacoes: pano.observacoes,
    id_revendedor: pano.revendedor.id,
    itens: itensPano
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