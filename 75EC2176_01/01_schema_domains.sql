-- Creacion de ESQUEMA exclusivo de employees
CREATE SCHEMA IF NOT EXISTS employees;

-- Creacion de dominios
-- 1 DOMINIO para verificacion de edad
CREATE DOMAIN employees.dom_age INT
    CHECK (VALUE BETWEEN 18 AND 80);
-- 2 DOMINIO para verificacion de valor mayor a 0
CREATE DOMAIN employees.dom_money NUMERIC(10,2)
    CHECK (VALUE >= 0);
