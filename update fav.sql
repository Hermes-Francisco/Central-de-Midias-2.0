SET @alterar = 22;
SET @novo = 11;
SET @velho = (SELECT numero FROM favoritos WHERE midia = @alterar);
UPDATE favoritos SET numero = numero -1 WHERE numero > @velho;
UPDATE favoritos SET numero = numero +1 WHERE numero >= @novo;
UPDATE favoritos SET numero = @novo WHERE midia = @alterar;
SELECT * FROM favoritos ORDER BY numero;