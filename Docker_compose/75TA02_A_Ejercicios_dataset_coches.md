# 75TA02_A Ejercicios dataset coches

## Solución NIVEL 1

### 1 
```sql
-- Cantidad de registros en segunada_mano
SELECT COUNT(*) FROM coches.segunda_mano;
```

### 2

```sql
--Cantidad de autos AUDI en los resgistros de segunda_mano
SELECT make, model, price
FROM coches.segunda_mano
WHERE make ILIKE 'Audi';
```

### 3

```sql
-- marca y módelo de autos que usan gasolina en Madrid
SELECT make, model, fuel, province
FROM coches.segunda_mano
WHERE fuel ILIKE 'gasolina'
	AND province ILIKE 'madrid';
```

### 4
```sql
-- url y modelo de vehiculos sin precio 
SELECT url, model
FROM coches.segunda_mano
WHERE price IS NULL;
-- No me da ningun vehiculo null
```

### 5
```sql
-- Coches con 50000 kms exactos
SELECT make, model
FROM coches.segunda_mano
WHERE kms = 50000;
```
## Solución NIVEL 2

### 1
```sql
-- Precio promedio de cada marca redondeado en 2 decimales ordenada de la marca mas cara a mas economica
SELECT make,
       ROUND(AVG(price)::numeric, 2) AS precio_promedio
FROM coches.segunda_mano
WHERE price IS NOT NULL
GROUP BY make
ORDER BY precio_promedio DESC;
```

### 2
```sql
-- Coches mas economicos del 2020 o posterior 
SELECT make, model, price, year
FROM coches.segunda_mano
WHERE year >= 2020
  AND price IS NOT NULL
ORDER BY price ASC
LIMIT 10;
```

### 3
```sql
-- Coches con nombres con mayor cantidad de 15 caracteres
SELECT model, LENGTH(model) AS longitud_nombre
FROM coches.segunda_mano
WHERE LENGTH(model) > 15;
```

### 4
```sql
-- Mostrar url y precio de coches de forma descendiente y los nulos al final
SELECT url, price
FROM coches.segunda_mano
WHERE price_financed IS NULL
ORDER BY price DESC NULLS LAST;
-- No me muestra precios nulos
```

### 5
```sql
-- Clasificacion de kilometraje
SELECT model,
       kms,
       CASE
           WHEN kms < 50000 THEN 'Bajo'
           WHEN kms BETWEEN 50000 AND 100000 THEN 'Moderado'
           WHEN kms > 100000 THEN 'Alto'
           ELSE 'Sin dato'
       END AS categoria_kms
FROM coches.segunda_mano;
```


## Solución NIVEL 3

### 1
```sql
-- Cantidad de coches por categoria de precios
SELECT
  CASE
    WHEN price < 10000 THEN 'Económico'
    WHEN price >= 10000 AND price <= 30000 THEN 'Medio'
    WHEN price > 30000 AND price <= 60000 THEN 'Premium'
    WHEN price > 60000 THEN 'Lujo'
    ELSE 'Sin precio'
  END AS categoria_precio,
  COUNT(*) AS cantidad
FROM coches.segunda_mano
WHERE price IS NOT NULL
GROUP BY categoria_precio
ORDER BY cantidad DESC;
```

### 2
```sql
-- Tercera paguinade los 10 coches mas costosos
SELECT model, price, year
FROM coches.segunda_mano
WHERE price IS NOT NULL
ORDER BY price DESC
LIMIT 10 OFFSET 20;
```

### 3
```sql
-- Coches con precio y precio financiado distinto
SELECT make, model, price, price_financed
FROM coches.segunda_mano
WHERE price IS NOT NULL
  AND price_financed IS NOT NULL
  AND price <> price_financed;
```

### 4
```sql
-- Coches AUDI con campo de power vacio o nulo
SELECT make, model
FROM coches.segunda_mano
WHERE make ILIKE 'audi' and power IS NULL;
```

### 5
```sql
-- lista de coches sin precio nulo y con el strign de la marca sin espacios al final y al inicio
SELECT 
  TRIM(make) AS marca_limpia,
  TRIM(model) AS modelo_limpio,
  COALESCE(price, price_financed, 0) AS precio_final
FROM coches.segunda_mano
ORDER BY precio_final; -- Ordenarlos de forma ascendente
```
## Solución NIVEL 4

### 1
```sql
-- diferencia de precio por marca entre cada vehiculo
-- subconsulta
WITH promedio_por_marca AS (
  SELECT make, AVG(price) AS precio_promedio
  FROM coches.segunda_mano
  WHERE price IS NOT NULL
  GROUP BY make
)

--Consulta
SELECT 
  s.make,
  s.model,
  s.price,
  ROUND(s.price - p.precio_promedio, 2) AS diferencia_precio
FROM coches.segunda_mano s
JOIN promedio_por_marca p ON s.make = p.make
WHERE s.price IS NOT NULL
ORDER BY diferencia_precio DESC;
```

### 2
```sql
-- Cantidad de coches sin fotos en la provencia de Barcelona
SELECT COUNT(*) AS coches_sin_fotos
FROM coches.segunda_mano
WHERE province ILIKE 'barcelona'
  AND (photos IS NULL OR photos = 0);
```

### 3
```sql
-- conteo de palabras en el cambio "version"  de cada coche
SELECT 
  model,
  version,
  CASE 
    WHEN version IS NULL THEN 0
    ELSE array_length(string_to_array(TRIM(version), ' '), 1)
  END AS cantidad_palabras
FROM coches.segunda_mano;
```

### 4
```sql
-- coches con fecha de publicacion superior a 180 dias extrayendo la cantidad de dias del date-time
SELECT 
  make,
  model,
  CURRENT_DATE - publish_date AS antiguedad_dias
FROM coches.segunda_mano
WHERE publish_date IS NOT NULL
  AND EXTRACT(DAY FROM CURRENT_DATE - publish_date) > 180;
```

### 5
```sql
--Conteo de cohes por rango de 5 años agrupados
SELECT 
  CONCAT(
    (year / 5) * 5, 
    ' - ', 
    ((year / 5) * 5 + 4)
  ) AS rango_anios,
  COUNT(*) AS cantidad
FROM coches.segunda_mano
WHERE year IS NOT NULL
GROUP BY rango_anios
ORDER BY rango_anios;
```

## Solución NIVEL 5

### 1
```sql
-- Top 3 de los coches mas caros agrupados por modelo
-- Subconsulta con ROW_NUMBER
WITH modelos_rankeados AS (
  SELECT 
    fuel,
    make,
    model,
    price,
    ROW_NUMBER() OVER (
      PARTITION BY fuel 
      ORDER BY price DESC
    ) AS posicion
  FROM coches.segunda_mano
  WHERE price IS NOT NULL
)

-- Consulta
SELECT 
  fuel,
  make,
  model,
  price
FROM modelos_rankeados
WHERE posicion <= 3
ORDER BY fuel, posicion;
```

### 2
```sql
-- Coches duplicados por modelo y año 
SELECT model, year, COUNT(*) AS cantidad
FROM coches.segunda_mano
WHERE model IS NOT NULL AND year IS NOT NULL
GROUP BY model, year
HAVING COUNT(*) > 1
ORDER BY cantidad DESC;
```

### 3
```sql
-- precio/km de coches 
SELECT 
  make,
  model,
  price,
  kms,
  CASE 
    WHEN price IS NULL OR kms IS NULL OR kms = 0 THEN NULL
    ELSE ROUND(price::numeric / kms, 2)
  END AS precio_por_km
FROM coches.segunda_mano;
```

### 4
```sql
-- Coches sin version y/o con kilometraje superior al promedio de todos los coches
--Subconsulta del promedio de kms de todos los coches
WITH promedio_kms AS (
  SELECT AVG(kms) AS kms_promedio
  FROM coches.segunda_mano
  WHERE kms IS NOT NULL
)

--Consulta
SELECT 
  make,
  model,
  kms
FROM coches.segunda_mano, promedio_kms
WHERE version IS NULL
   AND kms IS NOT NULL
   AND kms > promedio_kms.kms_promedio
ORDER BY kms DESC;
-- No hay vehiculos con version <null> y con un kilometraje mayor al promedio
```

### 5
```sql
-- promedio de precio de cada uno de los anuncios agrupado en consesionario o particulares
SELECT 
  is_professional,
  CASE 
    WHEN is_professional THEN 'Concesionario'
    ELSE 'Particulares'
  END AS tipo_anunciante,
  ROUND(AVG(price)::numeric, 2) AS precio_promedio
FROM coches.segunda_mano
WHERE price IS NOT NULL
GROUP BY is_professional;
```