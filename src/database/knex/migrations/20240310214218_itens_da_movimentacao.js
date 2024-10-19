/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("itens_da_movimentacao", table => {
        table.increments("id");
        table.integer("id_produto").references("id").inTable("produtos").onDelete("CASCADE");
        table.integer("id_movimentacao").references("id").inTable("movimentacoes").onDelete("CASCADE");
        table.enum("tipo_movimentacao", ["ENTRADA", "SAÍDA"], { useNative: true, enumName: "tipos" }).notNullable();
        table.integer("quantidade");    
        table.float("valor_unitario");
        table.float("valor_total");

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("itens_da_movimentacao");
};
