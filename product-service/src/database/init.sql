CREATE extension IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS stock;
DROP TABLE IF EXISTS product;

CREATE TABLE product (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text,
    price int
);

CREATE TABLE stocks (
    product_id uuid,
    count int,
    foreign key ("product_id") references "product" ("id")
);

INSERT INTO product (title, description, price) VALUES
	('Метод стартапа', 'Метод стартапа. Предпринимательские принципы управления для долгосрочного роста компании.', 24),
	('Одураченные случайностью', 'Одураченные случайностью. О скрытой роли шанса в бизнесе и в жизни.', 10),
	('Человеческий фактор', 'Человеческий фактор. Успешные проекты и команды.', 23),
	('Поток', 'Поток: Психология оптимального переживания.', 15),
	('На крючке', 'На крючке. Как создавать продукты, формирующие привычки.', 23),
	('К черту всё!', 'К черту всё! Берись и делай!', 15),
	('Черный лебедь', 'Черный лебедь. Под знаком непредсказуемости.', 23),
	('Гибкое сознание', 'Гибкое сознание. Новый взгляд на психологию развития взрослых и детей.', 15)

INSERT INTO stock (product_id, count) VALUES
	('bfc79d2f-81f3-4eea-bfc3-cd111d8664df', 4),
	('44d41530-63ac-4257-a7bc-baaa42b32685', 2),
	('f78bb364-e4b4-484d-88cb-a4cc2911bd98', 5),
	('49a3ae5b-7054-44db-a681-6e869698b0ea', 2),
	('b3358bcd-8b8d-4bfb-a9e6-cd9c38480fbb', 4),
	('07486ed5-d990-48ef-ac76-422fa6545e5f', 3),
	('1a0cd9b4-3a62-4309-af56-31b141aa10bd', 1),
	('4fc7fca1-fd8a-42aa-9cf2-495b9e2bd6d2', 5)