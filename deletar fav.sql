SET @deletar = 4;
SET @velho = (SELECT numero FROM favoritos WHERE midia = @deletar);
UPDATE favoritos SET numero = numero - 1 WHERE numero > @velho;
DELETE FROM favoritos WHERE midia = @deletar;
SELECT * FROM favoritos;
