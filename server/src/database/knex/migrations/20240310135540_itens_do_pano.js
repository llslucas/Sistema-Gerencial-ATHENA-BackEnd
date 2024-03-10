/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("itens_do_pano", table => {
        table.increments("id");
        table.integer("id_produto").references("id").inTable("produtos");
        table.integer("id_pano").references("id").inTable("panos").onDelete("CASCADE");
        table.integer("quantidade");
        table.float("valor_venda");

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  
};
