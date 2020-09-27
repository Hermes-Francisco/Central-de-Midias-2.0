SET @num = (SELECT COUNT(*) FROM favoritos) + 1;
INSERT INTO favoritos (midia, numero) VALUES
(19, @num);
