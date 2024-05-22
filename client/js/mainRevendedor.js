import { RevendedorController } from "./Controllers/RevendedorController";
const controller = new RevendedorController();

document.querySelector("form").addEventListener('submit', e => {
  e.preventDefault();
  controller.cadastra();
})