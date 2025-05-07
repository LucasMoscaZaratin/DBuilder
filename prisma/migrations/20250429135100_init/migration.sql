-- CreateTable
CREATE TABLE `finance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estimate_cost` DOUBLE NOT NULL,
    `real_cost` DOUBLE NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `projectId` INTEGER NOT NULL,

    INDEX `Finance_projectId_fkey`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `document_id` VARCHAR(191) NOT NULL,
    `rg` VARCHAR(191) NULL,
    `ie` VARCHAR(191) NULL,
    `state_registration` VARCHAR(191) NULL,
    `birth_date` DATETIME(3) NULL,
    `gender` VARCHAR(191) NULL,
    `marital_status` VARCHAR(191) NULL,
    `occupation` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `fantasy_name` VARCHAR(191) NULL,
    `nationality` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `address_number` VARCHAR(191) NOT NULL,
    `complement` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `zip_code` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `role` ENUM('ADMIN', 'GERENTE', 'CLIENTE', 'FUNCIONARIO', 'ENGENHEIRO') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Profile_email_key`(`email`),
    UNIQUE INDEX `Profile_document_id_key`(`document_id`),
    UNIQUE INDEX `Profile_rg_key`(`rg`),
    UNIQUE INDEX `Profile_ie_key`(`ie`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `initial_date` DATETIME(3) NOT NULL,
    `final_date` DATETIME(3) NULL,
    `budget` DOUBLE NULL,
    `status` ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD') NOT NULL DEFAULT 'PLANNED',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projectsupplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `supplierId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProjectSupplier_projectId_fkey`(`projectId`),
    INDEX `ProjectSupplier_supplierId_fkey`(`supplierId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `zip_code` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `cnpj` VARCHAR(191) NULL,
    `document_id` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Supplier_email_key`(`email`),
    UNIQUE INDEX `Supplier_cnpj_key`(`cnpj`),
    UNIQUE INDEX `Supplier_document_id_key`(`document_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `due_date` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `initial_percent` DOUBLE NOT NULL DEFAULT 0,
    `final_percent` DOUBLE NOT NULL DEFAULT 0,
    `value` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `projectId` INTEGER NOT NULL,
    `assignedToId` INTEGER NULL,

    INDEX `Task_assignedToId_fkey`(`assignedToId`),
    INDEX `Task_projectId_fkey`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `function` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `projectId` INTEGER NOT NULL,
    `workerId` INTEGER NOT NULL,

    INDEX `Team_projectId_fkey`(`projectId`),
    INDEX `Team_workerId_fkey`(`workerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `finance` ADD CONSTRAINT `Finance_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `Profile_email_fkey` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projectsupplier` ADD CONSTRAINT `ProjectSupplier_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projectsupplier` ADD CONSTRAINT `ProjectSupplier_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `Task_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `profile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `Task_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team` ADD CONSTRAINT `Team_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team` ADD CONSTRAINT `Team_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
