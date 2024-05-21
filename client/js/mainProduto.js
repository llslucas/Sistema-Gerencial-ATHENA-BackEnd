import { ProdutoController } from "./Controllers/ProdutoController";
const controller = new ProdutoController();

document.querySelector("form").addEventListener('submit', e => {
  e.preventDefault();
  controller.cadastra();
})