import { ModalView } from "./ModalView";

export class ModalProdutos extends ModalView{
    constructor(){
        super(
        'Cadastro/Edição de Produto',
        'Visualização de Produto',
        `
            <div class="p-6">
                <form>
                <div class="flex space-x-4 mb-4">
                    <input id="id" type="text" placeholder="ID" class="w-1/5 bg-gray-200 border border-gray-300 p-2 rounded" readonly>
                    <input id="nome" type="text" placeholder="Nome do Produto" class="w-4/5 border border-gray-300 p-2 rounded">
                </div>
                <div class="flex space-x-4 mb-4">
                    <input id="descricao" type="text" placeholder="Descrição"  class="w-full border border-gray-300 p-6 rounded">
                </div>
                <div class="flex space-x-4 mb-4">
                    <select id="categoria" class="w-1/2 border border-gray-300 p-2 rounded">
                        <option value="" selected  hidden>Categoria</option>
                        <option value="Colares">Colares</option>
                        <option value="Alianças">Alianças</option>
                        <option value="Anéis" >Anéis</option>
                        <option value="Braceletes">Braceletes</option>
                    </select>
                    <input id="tamanho" type="text" placeholder="Tamanho" class="w-1/2 border border-gray-300 p-2 rounded">
                    <input id="estoque_atual" type="number" placeholder="Estoque" class="w-1/2 border border-gray-300 p-2 rounded">
                </div>
                <div class="flex justify-end">
                    <button type="submit" class="button-padrao background1 px-4 py-2 rounded">Salvar</button>
                </div>
                </form>
            </div>
        `)
    }

    preencheCampos(Produto){
        document.querySelector('#id').value = Produto.id;
        document.querySelector('#nome').value = Produto.nome;
        document.querySelector('#descricao').value = Produto.descricao;
        document.querySelector('#categoria').value = Produto.categoria;
        document.querySelector('#tamanho').value = Produto.tamanho;
        document.querySelector('#estoque_atual').value = Produto.estoque_atual;        
    }
}