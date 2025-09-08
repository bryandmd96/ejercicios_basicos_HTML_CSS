-- 03
-- Estandarización de tabla employee_raw
UPDATE employees.employee_raw
SET
    gender = regexp_replace(trim(lower(gender)), '\s+', ' ', 'g'),
    department = regexp_replace(trim(lower(department)), '\s+', ' ', 'g'),
    job_title = regexp_replace(trim(lower(job_title)), '\s+', ' ', 'g'),
    edu_level = regexp_replace(trim(lower(edu_level)), '\s+', ' ', 'g'),
    location = regexp_replace(trim(lower(location)), '\s+', ' ', 'g');

-- Creacion de tablas de dimension dim_gender, dim_department, dim_job_title, dim_edu_level, dim_location
-- Cada dimensión con id serial y valor único
CREATE TABLE employees.dim_gender (
    id SERIAL PRIMARY KEY,
    value TEXT UNIQUE
);

CREATE TABLE employees.dim_department (
    id SERIAL PRIMARY KEY,
    value TEXT UNIQUE
);

CREATE TABLE employees.dim_job_title (
    id SERIAL PRIMARY KEY,
    value TEXT UNIQUE
);

CREATE TABLE employees.dim_edu_level (
    id SERIAL PRIMARY KEY,
    value TEXT UNIQUE
);

CREATE TABLE employees.dim_location (
    id SERIAL PRIMARY KEY,
    value TEXT UNIQUE
);

-- Poblamos cada dimension con los datos desde employees.employee_raw
INSERT INTO employees.dim_gender(value)
SELECT DISTINCT gender FROM employees.employee_raw
WHERE gender IS NOT NULL ON CONFLICT DO NOTHING;

INSERT INTO employees.dim_department(value)
SELECT DISTINCT department FROM employees.employee_raw
WHERE department IS NOT NULL ON CONFLICT DO NOTHING;

INSERT INTO employees.dim_job_title(value)
SELECT DISTINCT job_title FROM employees.employee_raw
WHERE job_title IS NOT NULL ON CONFLICT DO NOTHING;

INSERT INTO employees.dim_edu_level(value)
SELECT DISTINCT edu_level FROM employees.employee_raw
WHERE edu_level IS NOT NULL ON CONFLICT DO NOTHING;

INSERT INTO employees.dim_location(value)
SELECT DISTINCT location FROM employees.employee_raw
WHERE location IS NOT NULL ON CONFLICT DO NOTHING;

-- 04
-- Creacion de la tabla employees.employes con la relacion de DOMINIOS
CREATE TABLE employees.employee (
    employee_id SERIAL PRIMARY KEY,
    src_id INT UNIQUE,  -- ID original del CSV
    name TEXT NOT NULL,
    age employees.dom_age NOT NULL,
    experience_years INT CHECK (experience_years BETWEEN 0 AND 80),
    salary employees.dom_money NOT NULL,

    gender_id INT,
    department_id INT,
    job_title_id INT,
    edu_level_id INT,
    location_id INT
);

-- Población desde mapeo de tablas dimencionadas y employees.employee_raw.
INSERT INTO employees.employee (
    src_id, name, age, experience_years, salary,
    gender_id, department_id, job_title_id, edu_level_id, location_id
)
SELECT
    er.id,
    er.name,
    er.age,
    er.experience_years,
    er.salary,
    dg.id,
    dd.id,
    dj.id,
    de.id,
    dl.id
FROM employees.employee_raw er
LEFT JOIN employees.dim_gender dg
    ON er.gender = dg.value
LEFT JOIN employees.dim_department dd
    ON er.department = dd.value
LEFT JOIN employees.dim_job_title dj
    ON er.job_title = dj.value
LEFT JOIN employees.dim_edu_level de
    ON er.edu_level = de.value
LEFT JOIN employees.dim_location dl
    ON er.location = dl.value;

-- Incorporación de llaves foraneas a las tablas dimensionadas
ALTER TABLE employees.employee
ADD CONSTRAINT fk_gender FOREIGN KEY (gender_id) REFERENCES employees.dim_gender(id);

ALTER TABLE employees.employee
ADD CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES employees.dim_department(id);

ALTER TABLE employees.employee
ADD CONSTRAINT fk_job_title FOREIGN KEY (job_title_id) REFERENCES employees.dim_job_title(id);

ALTER TABLE employees.employee
ADD CONSTRAINT fk_edu_level FOREIGN KEY (edu_level_id) REFERENCES employees.dim_edu_level(id);

ALTER TABLE employees.employee
ADD CONSTRAINT fk_location FOREIGN KEY (location_id) REFERENCES employees.dim_location(id);

-- Verifico los constraints hechos 
SELECT constraint_name, table_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'employees';
