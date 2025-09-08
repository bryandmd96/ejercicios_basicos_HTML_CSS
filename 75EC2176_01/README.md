# README — Proyecto: Normalización y Análisis de Datos de Empleados (PostgreSQL)
## Suposiciones y decisiones de diseño
- Se asume que el archivo CSV contiene datos limpios en cuanto a estructura, pero con posibles inconsistencias en campos textuales (mayúsculas, espacios).
- La normalización se realiza directamente sobre la tabla employee_raw para simplificar el flujo y evitar duplicidad de vistas.
- Se crean cinco tablas de dimensión (dim_gender, dim_department, etc.) con valores únicos normalizados para garantizar consistencia y facilitar análisis.
- La tabla de hechos employee incluye claves foráneas hacia las dimensiones, y se refuerza con dominios (dom_age, dom_money) y CHECK para asegurar calidad.
- Se permite NULL en claves foráneas para detectar errores de mapeo, pero se limita el salario si no hay job_title_id como regla de negocio.
## Justificación de índices
- Índices en columnas value de dimensiones permiten búsquedas rápidas al poblar dimensiones y al hacer joins descriptivos.
- Índices en employee sobre department_id, job_title_id, location_id, salary, age mejoran el rendimiento en:
- Agrupaciones por departamento (7.2)
- Comparaciones salariales por cargo (7.5)
- Filtros geográficos (7.4)
- Ordenamientos por salario y edad (7.1, 7.3)
## Cómo ejecutar el proyecto (orden de scripts)
- 01_schema_domains.sql — Crea el esquema employees y define dominios.
- 02_staging_copy.sql — Crea tabla employee_raw, carga CSV y verifica filas.
- 03_dims_fact.sql — Normaliza textos, crea dimensiones, tabla de hechos y constraints.
- 04_indexes_views.sql — Crea índices y vistas analíticas.
- 05_queries.sql — Ejecuta las consultas obligatorias del apartado 7.
