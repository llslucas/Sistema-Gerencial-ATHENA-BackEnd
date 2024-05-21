import { ClienteController } from "./Controllers/ClienteController";
const controller = new ClienteController();

document.querySelector("form").addEventListener('submit', e => {
  e.preventDefault();
  controller.cadastra();
})