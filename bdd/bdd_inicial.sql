-- MySQL Script generated by MySQL Workbench
-- Fri Feb 21 19:56:13 2025
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema areitoDB
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema areitoDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `areitoDB` DEFAULT CHARACTER SET utf8 ;
USE `areitoDB` ;

-- -----------------------------------------------------
-- Table `areitoDB`.`Marcas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `areitoDB`.`Marcas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(255) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_Marcas_UNIQUE` (`id` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `areitoDB`.`Modelos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `areitoDB`.`Modelos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(255) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  `id_marca` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_Modelos_UNIQUE` (`id` ASC),
  INDEX `id_marca_idx` (`id_marca` ASC),
  CONSTRAINT `id_marca_fk`
    FOREIGN KEY (`id_marca`)
    REFERENCES `areitoDB`.`Marcas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `areitoDB`.`TipoVehiculo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `areitoDB`.`TipoVehiculo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(255) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_TipoVehiculo_UNIQUE` (`id` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `areitoDB`.`TiposCombustible`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `areitoDB`.`TiposCombustible` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(255) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_TiposCombustible_UNIQUE` (`id` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `areitoDB`.`Vehiculos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `areitoDB`.`Vehiculos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(255) NULL,
  `no_chasis` VARCHAR(17) NOT NULL,
  `no_motor` VARCHAR(20) NOT NULL,
  `no_placa` VARCHAR(10) NOT NULL,
  `id_tipoVehiculo` INT NOT NULL,
  `id_marca` INT NOT NULL,
  `id_modelo` INT NOT NULL,
  `id_tipo_combustible` INT NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idVehiculos_UNIQUE` (`id` ASC),
  UNIQUE INDEX `no_chasis_UNIQUE` (`no_chasis` ASC),
  UNIQUE INDEX `no_motor_UNIQUE` (`no_motor` ASC),
  UNIQUE INDEX `no_placa_UNIQUE` (`no_placa` ASC),
  INDEX `id_TipoVehiculo_idx` (`id_tipoVehiculo` ASC),
  INDEX `id_Modelo_idx` (`id_modelo` ASC),
  INDEX `id_TipoCombustible_idx` (`id_tipo_combustible` ASC),
  INDEX `id_marca_idx` (`id_marca` ASC),
  CONSTRAINT `id_marca_fk`
    FOREIGN KEY (`id_marca`)
    REFERENCES `areitoDB`.`Marcas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_tipo_vehiculo_fk`
    FOREIGN KEY (`id_tipoVehiculo`)
    REFERENCES `areitoDB`.`TipoVehiculo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_modelo_fk`
    FOREIGN KEY (`id_modelo`)
    REFERENCES `areitoDB`.`Modelos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_tipo_combustible_fk`
    FOREIGN KEY (`id_tipo_combustible`)
    REFERENCES `areitoDB`.`TiposCombustible` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `areitoDB`.`Clientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `areitoDB`.`Clientes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `cedula` VARCHAR(12) NOT NULL,
  `no_tarjeta_cr` VARCHAR(16) NOT NULL,
  `limite_credito` DECIMAL(15,2) NOT NULL,
  `tipo_persona` VARCHAR(45) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_Clientes_UNIQUE` (`id` ASC),
  UNIQUE INDEX `cedula_UNIQUE` (`cedula` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `areitoDB`.`Empleados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `areitoDB`.`Empleados` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `cedula` VARCHAR(12) NOT NULL,
  `tanda_labor` VARCHAR(100) NOT NULL,
  `porciento_comision` DECIMAL(5,2) NULL,
  `fecha_ingreso` DATE NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_Empleados_UNIQUE` (`id` ASC),
  UNIQUE INDEX `cedula_UNIQUE` (`cedula` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `areitoDB`.`Inspecciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `areitoDB`.`Inspecciones` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_vehiculos` INT NOT NULL,
  `id_clientes` INT NOT NULL,
  `tiene_ralladuras` TINYINT NOT NULL,
  `cantidad_combustible` VARCHAR(45) NOT NULL,
  `tiene_gomas_repuesto` TINYINT NOT NULL,
  `tiene_gato` TINYINT NOT NULL,
  `tiene_roturas_cristal` TINYINT NOT NULL,
  `estado_gomas` VARCHAR(45) NOT NULL,
  `fecha` DATE NOT NULL,
  `id_empleado` INT NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_Inspecciones_UNIQUE` (`id` ASC),
  INDEX `id_Vehiculos_idx` (`id_vehiculos` ASC),
  INDEX `id_Clientes_idx` (`id_clientes` ASC),
  INDEX `id_Empleados_idx` (`id_empleado` ASC),
  CONSTRAINT `id_vehiculo_fk`
    FOREIGN KEY (`id_vehiculos`)
    REFERENCES `areitoDB`.`Vehiculos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_cliente_fk`
    FOREIGN KEY (`id_clientes`)
    REFERENCES `areitoDB`.`Clientes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_empleado_fk`
    FOREIGN KEY (`id_empleado`)
    REFERENCES `areitoDB`.`Empleados` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `areitoDB`.`RentaDevolucion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `areitoDB`.`RentaDevolucion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_empleados` INT NOT NULL,
  `id_vehiculo` INT NOT NULL,
  `id_cliente` INT NOT NULL,
  `fecha_renta` DATE NOT NULL,
  `fecha_devolucion` DATE NOT NULL,
  `monto_por_dia` DECIMAL(20,2) NOT NULL,
  `cantidad_dias` INT NOT NULL,
  `comentario` TEXT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_Renta_UNIQUE` (`id` ASC),
  INDEX `id_Empleados_idx` (`id_empleados` ASC),
  INDEX `id_Vehiculos_idx` (`id_vehiculo` ASC),
  INDEX `id_Clientes_idx` (`id_cliente` ASC),
  CONSTRAINT `id_empleado_renta_fk`
    FOREIGN KEY (`id_empleados`)
    REFERENCES `areitoDB`.`Empleados` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_vehiculo_renta_fk`
    FOREIGN KEY (`id_vehiculo`)
    REFERENCES `areitoDB`.`Vehiculos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_cliente_renta_fk`
    FOREIGN KEY (`id_cliente`)
    REFERENCES `areitoDB`.`Clientes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
