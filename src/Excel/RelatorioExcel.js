import ExcelJS from 'exceljs';

export default class RelatorioExcel{  
  #workbook;
  #sheet;
  /** @type ExcelJS.Table */
  #tabela;

  constructor(){
    this.#workbook = new ExcelJS.Workbook();
    this.#workbook.creator = "ATHENA - Sistema Gerencial";
    
    this.#sheet = this.#workbook.addWorksheet('Planilha1');        
  }

  addTabela({headers = [], values = [], totalsRowFunctions}){
    const columns = headers.map(value => {      
      return {name: value, filterButton: true}
    });

    if(totalsRowFunctions){
      totalsRowFunctions.forEach((fn) => {
        columns[fn.column - 1].totalsRowFunction = fn.function;
      });
    };    

    this.#tabela = this.#sheet.addTable({
      name: "Relatorio",
      ref: "A1",
      headerRow: true,
      style: {
        theme: "TableStyleMedium4", 
        showRowStripes: true
      },
      columns,
      rows: values,
      totalsRow: Boolean(totalsRowFunctions)
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

  getRowCount(){
    return this.#sheet.actualRowCount;
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