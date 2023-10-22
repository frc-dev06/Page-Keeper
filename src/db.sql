create table usuarios(
idUsuario int primary key auto_increment,
name varchar(60) not null,
email varchar(60) unique not null,
password varchar(255) not null
);

create table libros(
idLibro int primary key auto_increment,
nombreLibro text(100) not null
);

create table usuariosLibros(
idUsuariosLibros int primary key auto_increment,
precio double not null,
idUsuario int,
idLibro int,
foreign key (idUsuario) references usuarios(idUsuario),
foreign key (idLibro) references libros(idLibro)
);

create table usuarios(
idUsuario int primary key auto_increment,
nombre varchar(60) not null,
correo varchar(60) unique not null,
contraseña varchar(50) not null
);

create table libros(
idLibro int primary key auto_increment,
nombreLibro text(100) not null
);

create table usuariosLibros(
idUsuariosLibros int primary key auto_increment,
precio double not null,
idUsuario int,
idLibro int,
foreign key (idUsuario) references usuarios(idUsuario),
foreign key (idLibro) references libros(idLibro)
);

create table generos(
idGenero int primary key auto_increment,
nombreGenero text(60)
);

create table librosGenero(
idLibrosGenero int primary key auto_increment,
idGenero int,
idLibro int,
foreign key (idGenero) references generos(idGenero),
foreign key (idLibro) references libros(idLibro)
);

create table ventas(
idVenta int primary key auto_increment,
fecha datetime not null
);

create table librosVentas(
idLibrosVentas int primary key auto_increment,
cantidad int not null,
valorVenta double not null,
idVenta int,
idLibro int,
foreign key (idVenta) references ventas(idVenta),
foreign key (idLibro) references libros(idLibro)
);

alter table ventas
add idUsuario int,
add foreign key (idUsuario) references usuarios(idUsuario);

alter table usuarioslibros
add cantidad int not null;


ALTER TABLE usuariosLibros
ADD FOREIGN KEY (idLibro) REFERENCES libros(idLibro) ON DELETE CASCADE;

ALTER TABLE librosGenero
ADD FOREIGN KEY (idLibro) REFERENCES libros(idLibro) ON DELETE CASCADE;

ALTER TABLE librosAutores
ADD FOREIGN KEY (idLibro) REFERENCES libros(idLibro) ON DELETE CASCADE;