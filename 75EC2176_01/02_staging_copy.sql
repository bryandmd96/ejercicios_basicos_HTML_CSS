-- Creacion de tabla employees.empleoyee_raw
CREATE TABLE employees.employee_raw (
    id INT,
    name TEXT,
    age INT,
    gender TEXT,
    department TEXT,
    job_title TEXT,
    experience_years INT,
    edu_level TEXT,
    location TEXT,
    salary NUMERIC(10,2)
);

-- Carga de employers_data.csv
COPY employees.employee_raw
FROM '/data/employers_data.csv' -- mi fichero base es data
WITH (FORMAT csv, HEADER true);

-- Recuento de filas cargada del .csv
SELECT COUNT(*) FROM employees.employee_raw;