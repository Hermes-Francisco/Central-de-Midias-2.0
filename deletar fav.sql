SET @deletar = 4;
SET @velho = (SELECT numero FROM favoritos WHERE id = @deletar);
UPDATE favoritos SET numero = numero - 1 WHERE numero > @velho;
DELETE FROM favoritos WHERE id = @deletar;
SELECT * FROM favoritos;
