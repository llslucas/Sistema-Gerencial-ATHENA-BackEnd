/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("itens_da_compra", table => {
        table.increments("id");
        table.integer("id_produto").references("id").inTable("produtos");
        table.integer("id_compra").references("id").inTable("compras").onDelete("CASCADE");
        table.integer("quantidade");
        table.float("valor_unitario");

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("itens_da_compra");
};
