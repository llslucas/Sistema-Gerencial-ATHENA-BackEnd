/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("panos", table => {
      table.increments("id");
      table.integer("revendedor_id").references("id").inTable("revendedor");
      table.text("observacoes");
  
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export function down(knex){
      return knex.schema.dropTable("panos");
  };
  