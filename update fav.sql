SET @novo = 5;
SET @velho = 7;
UPDATE favoritos SET numero = numero -1 WHERE numero > @velho;
UPDATE favoritos SET numero = numero +1 WHERE numero >= @novo;
UPDATE favoritos SET numero = @novo WHERE id = 7;
SELECT * FROM favoritos ORDER BY numero;