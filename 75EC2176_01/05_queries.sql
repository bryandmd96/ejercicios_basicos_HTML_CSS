-- 07
-- 7.1 JOINS & ORDER BY
SELECT
    employee_id,
    name,
    department,
    job_title,
    salary
FROM employees.v_employee_dim
ORDER BY salary DESC, name ASC;

-- 7.2 GROUP BY ... HAVING
SELECT
    department,
    COUNT(*) AS employee_count,
    ROUND(AVG(salary), 2) AS avg_salary,
    ROUND(
        percentile_cont(0.5) WITHIN GROUP (ORDER BY salary)::numeric,
        2
    ) AS median_salary
FROM employees.v_employee_dim
GROUP BY department
HAVING
    COUNT(*) >= 10
    AND AVG(salary) >= (
        SELECT AVG(salary)
        FROM employees.v_employee_dim
    );

-- 7.3 Subconsulta escalar
SELECT
    name,
    salary,
    ROUND((
        SELECT AVG(salary)
        FROM employees.v_employee_dim
    ), 2) AS global_avg_salary,
    salary > (
        SELECT AVG(salary)
        FROM employees.v_employee_dim
    ) AS is_above_avg
FROM employees.v_employee_dim;

-- 7.4 Subconsulta con IN
SELECT *
FROM employees.v_employee_dim
WHERE location IN (
    SELECT location
    FROM employees.v_employee_dim
    GROUP BY location
    ORDER BY COUNT(*) DESC
    LIMIT 3
);

-- 7.5 Subconsulta en FROM (tabla derivada)
SELECT
    e.name,
    e.job_title,
    ROUND(e.salary, 2) AS salary,
    ROUND(jt_stats.avg_salary, 2) AS avg_salary,
    ROUND(jt_stats.avg_experience_years, 2) AS avg_experience_years
FROM employees.v_employee_dim e
JOIN (
    SELECT
        job_title,
        AVG(salary)::numeric AS avg_salary,
        AVG(experience_years)::numeric AS avg_experience_years
    FROM employees.v_employee_dim
    WHERE job_title IS NOT NULL
    GROUP BY job_title
) jt_stats ON e.job_title = jt_stats.job_title
WHERE e.salary > jt_stats.avg_salary;

-- 7.6 Calidad de datos 
SELECT *
FROM employees.employee
WHERE gender_id IS NULL
   OR department_id IS NULL
   OR job_title_id IS NULL
   OR edu_level_id IS NULL
   OR location_id IS NULL
LIMIT 50;

-- 08 
-- Creación de validaciones 
-- Asegura que el salario no sea negativo
ALTER TABLE employees.employee
ADD CONSTRAINT chk_salary_non_negative
CHECK (salary >= 0);

-- Asegura que la edad esté dentro del dominio (ya está en dom_age, pero se refuerza aquí si se desea)
ALTER TABLE employees.employee
ADD CONSTRAINT chk_age_range
CHECK (age BETWEEN 18 AND 80);

-- Asegura que los años de experiencia estén en rango válido
ALTER TABLE employees.employee
ADD CONSTRAINT chk_experience_range
CHECK (experience_years BETWEEN 0 AND 80);

-- Regla de negocio opcional: si no hay job_title_id, el salario debe ser 0
ALTER TABLE employees.employee
ADD CONSTRAINT chk_salary_requires_job_title
CHECK (job_title_id IS NOT NULL OR salary = 0);
--
-- Verifico los constraints hechos en el sesquema employees
SELECT constraint_name, table_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'employees';