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