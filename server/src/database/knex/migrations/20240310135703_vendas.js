/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("vendas", table => {
        table.increments("id");
        table.integer("id_revendedor").references("id").inTable("revendedores");
        table.integer("id_cliente").references("id").inTable("clientes");
        table.text("tipo_pagamento");

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("vendas");
};
