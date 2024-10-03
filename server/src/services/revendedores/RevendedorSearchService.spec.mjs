import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import RevendedorSearchService from "./RevendedorSearchService.js";
import AppError from "../../utils/AppError.js";

describe("RevendedorSearchService", () =>{
  /** @type {RevendedoresRepository} */
  let repository = null;

  /** @type {RevendedorSearchService} */
  let revendedorSearchService = null;

  beforeAll( async() => {
    repository = new RevendedoresRepository();        
    revendedorSearchService = new RevendedorSearchService(repository); 
    await repository.deleteAll();
  });  

  beforeEach( async() => {
    const revendedorTeste1 = {           
      nome: "Revendedor Teste",
      contato: "123456",
      comissao: 20
    }

    const revendedorTeste2 = {           
      nome: "Outro Teste",
      contato: "987654",
      comissao: 20
    }

    await repository.create(revendedorTeste1);    
    await repository.create(revendedorTeste2);    
  });

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async () => { 
    await repository.disconnect();
  });


  it("Uma busca em branco deve retornar todos os revendedores.", async () => {
    const revendedores = await revendedorSearchService.execute({search: ""});

    expect(revendedores).toHaveLength(2);
  });

  it("Uma busca com valores em comum deve retornar todos os revendedores com o valor.", async () => {
    const revendedores = await revendedorSearchService.execute({search: "Teste"});

    expect(revendedores).toHaveLength(2);
  });

  it("A busca deve retornar o revendedor esperado.", async () => {
    const [revendedor] = await revendedorSearchService.execute({search: "Revendedor Teste"});

    const revendedorEsperado = {           
      nome: "Revendedor Teste",
      contato: "123456",
      comissao: 20    
    }

    revendedorEsperado.id = revendedor.id;
    revendedorEsperado.created_at = revendedor.created_at;
    revendedorEsperado.updated_at = revendedor.updated_at;

    expect(revendedor).toEqual(revendedorEsperado);
  }); 
});