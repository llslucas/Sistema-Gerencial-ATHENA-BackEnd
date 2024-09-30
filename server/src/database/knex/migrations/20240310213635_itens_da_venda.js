/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("itens_da_venda", table => {
        table.increments("id");
        table.integer("id_produto").references("id").inTable("produtos");
        table.integer("id_venda").references("id").inTable("vendas").onDelete("CASCADE");
        table.integer("quantidade");
        table.float("valor_unitario");
        table.float("valor_total");
        table.float("valor_comissao");        

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("itens_da_venda");
};
