import { ModalView } from "./ModalView";

export class ModalRevendedores extends ModalView{
    constructor(){
        super(
        'Cadastro/Edição de Revendedor',
        'Visualização de Revendedor',
        `
            <div class="p-6">
                <form>
                <div class="flex space-x-4 mb-4">
                    <input id="id" type="text" placeholder="ID" class="w-1/5 bg-gray-200 border border-gray-300 p-2 rounded" readonly>
                    <input id="nome" type="text" placeholder="Nome do Revendedor" class="w-4/5 border border-gray-300 p-2 rounded">
                </div>
                <div class="flex space-x-4 mb-4">
                    <input id="contato" type="text" placeholder="Contato" class="w-1/2 border border-gray-300 p-2 rounded">
                    <input id="comissao" type="text" placeholder="Comissão" class="w-1/2 border border-gray-300 p-2 rounded">
                </div>
                <div class="flex justify-end">
                    <button type="submit" class="button-padrao background1 px-4 py-2 rounded">Salvar</button>
                </div>
                </form>
            </div>
        `)
    }

    preencheCampos(Revendedor){
        document.querySelector('#id').value = Revendedor.id;
        document.querySelector('#nome').value = Revendedor.nome;
        document.querySelector('#contato').value = Revendedor.contato;
        document.querySelector('#comissao').value = Revendedor.comissao;
    }
}