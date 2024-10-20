import ExcelJS from 'exceljs';

export default class RelatorioExcel{  
  #workbook;
  #sheet;
  #tabela;

  constructor(){
    this.#workbook = new ExcelJS.Workbook();
    this.#workbook.creator = "ATHENA - Sistema Gerencial";
    
    this.#sheet = this.#workbook.addWorksheet('Planilha1');        
  }

  addTabela({headers, values}){
    const columns = headers.map(value => {
      return {name: value, filterButton: true}
    });    

    this.#tabela = this.#sheet.addTable({
      name: "Relatorio",
      ref: "A1",
      headerRow: true,
      style: {
        theme: "TableStyleMedium4", 
        showRowStripes: true
      },
      columns,
      rows: values
    });    
  }

  setFormat({ column, format }){
    this.#sheet.getColumn(column).numFmt = format;
  }

  setColumnsWidth(values = []){
    let i = 1;
    for(const value of values){
      this.#sheet.getColumn(i).width = value;
      i++;
    }
  }

  async export(caminho){
    await this.#workbook.xlsx.writeFile(caminho);
  }

  async send(res, nome){
    const date = new Date();

    const filename = `${nome} - ${date.getDate()}_${date.getMonth()}_${date.getFullYear()} - ${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" + filename + '.xlsx');
    await this.#workbook.xlsx.write(res);
  }
}