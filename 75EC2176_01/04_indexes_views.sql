-- 05
-- Creación de indices en las tablas dimensiones
CREATE INDEX idx_gender_value ON employees.dim_gender(value);
-- Mejora búsquedas por etiqueta al mapear desde employee_raw a dim_gender.

CREATE INDEX idx_department_value ON employees.dim_department(value);
-- Optimiza joins por nombre de departamento en inserciones y vistas.

CREATE INDEX idx_job_title_value ON employees.dim_job_title(value);
-- Acelera el mapeo de títulos de trabajo desde texto a ID.

CREATE INDEX idx_edu_level_value ON employees.dim_edu_level(value);
-- Facilita la normalización y búsqueda por nivel educativo.

CREATE INDEX idx_location_value ON employees.dim_location(value);
-- Mejora el rendimiento en joins por ubicación.

-- Creación de indices para llaves foreaneas en employees.employee
CREATE INDEX idx_employee_department_id ON employees.employee(department_id);
-- Mejora agrupaciones y filtros por departamento (consultas 7.2, 7.6).

CREATE INDEX idx_employee_job_title_id ON employees.employee(job_title_id);
-- Acelera análisis por título de trabajo (consultas 7.5, brecha salarial).

CREATE INDEX idx_employee_location_id ON employees.employee(location_id);
-- Optimiza subconsultas por ubicación (consulta 7.4).

CREATE INDEX idx_employee_salary ON employees.employee(salary);
-- Mejora ordenamientos y comparaciones por salario (consultas 7.1, 7.3, 7.5).

CREATE INDEX idx_employee_age ON employees.employee(age);
-- Aporta rendimiento en filtros por edad y posibles análisis demográficos.

-- 06
-- Creacion de vista amigable
CREATE VIEW employees.v_employee_dim AS
SELECT
    e.employee_id,
    e.src_id,
    e.name,
    e.age,
    e.experience_years,
    e.salary,
    dg.value AS gender,
    dd.value AS department,
    dj.value AS job_title,
    de.value AS edu_level,
    dl.value AS location
FROM employees.employee e
LEFT JOIN employees.dim_gender dg ON e.gender_id = dg.id
LEFT JOIN employees.dim_department dd ON e.department_id = dd.id
LEFT JOIN employees.dim_job_title dj ON e.job_title_id = dj.id
LEFT JOIN employees.dim_edu_level de ON e.edu_level_id = de.id
LEFT JOIN employees.dim_location dl ON e.location_id = dl.id;

-- Creacion de vista analitica (Tamaño del departamento vs nivel salarial (mediana))
CREATE VIEW employees.v_salary_by_department AS
SELECT
    dd.value AS department,
    COUNT(*) AS employee_count,
    ROUND(AVG(e.salary), 2) AS avg_salary,
    ROUND(
        percentile_cont(0.5) WITHIN GROUP (ORDER BY e.salary)::numeric,
        2
    ) AS median_salary
FROM employees.employee e
JOIN employees.dim_department dd ON e.department_id = dd.id
GROUP BY dd.value;
