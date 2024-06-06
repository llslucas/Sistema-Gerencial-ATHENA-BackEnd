import { ModalView } from "./ModalView";

export class ModalClientes extends ModalView{
    constructor(){
        super(
        'Cadastro/Edição de Cliente',
        'Visualização de Cliente',
        `
            <div class="p-6">
                <form>
                    <div class="flex space-x-4 mb-4">
                        <input id="id" type="text" placeholder="ID" class="w-1/5 bg-gray-200 border border-gray-300 p-2 rounded" readonly>
                        <input id="nome" type="text" placeholder="Nome do Cliente" class="w-4/5 border border-gray-300 p-2 rounded">
                    </div>
                    <div class="flex space-x-4 mb-4">
                        <input id="telefone" type="text" placeholder="Telefone" class="w-1/2 border border-gray-300 p-2 rounded">
                        <input id="email" type="text" placeholder="Email" class="w-1/2 border border-gray-300 p-2 rounded">
                    </div>
                    <div class="flex justify-end">
                        <button type="submit" class="button-padrao background1 px-4 py-2 rounded">Salvar</button>
                    </div>
                </form>
            </div>
        `)
    }

    preencheCampos(Cliente){
        document.querySelector('#id').value = Cliente.id;
        document.querySelector('#nome').value = Cliente.nome;
        document.querySelector('#telefone').value = Cliente.telefone;
        document.querySelector('#email').value = Cliente.email;
    }
}