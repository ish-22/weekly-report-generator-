-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` ENUM('TEAM_MEMBER', 'MANAGER', 'ADMIN') NOT NULL,
    `description` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `fullName` VARCHAR(100) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `avatarUrl` VARCHAR(255) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_roleId_idx`(`roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `description` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `projects_name_key`(`name`),
    UNIQUE INDEX `projects_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `weekStartDate` DATE NOT NULL,
    `weekEndDate` DATE NOT NULL,
    `status` ENUM('DRAFT', 'SUBMITTED', 'NEEDS_CORRECTION', 'APPROVED') NOT NULL DEFAULT 'DRAFT',
    `currentVersionNumber` INTEGER NOT NULL DEFAULT 1,
    `tasksPlannedNextWeek` TEXT NULL,
    `blockers` TEXT NULL,
    `isKeyBlocker` BOOLEAN NOT NULL DEFAULT false,
    `achievements` TEXT NULL,
    `isKeyAchievement` BOOLEAN NOT NULL DEFAULT false,
    `optionalNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `reports_userId_idx`(`userId`),
    INDEX `reports_projectId_idx`(`projectId`),
    INDEX `reports_status_idx`(`status`),
    INDEX `reports_weekStartDate_idx`(`weekStartDate`),
    UNIQUE INDEX `reports_userId_weekStartDate_projectId_key`(`userId`, `weekStartDate`, `projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report_tasks` (
    `id` VARCHAR(191) NOT NULL,
    `reportId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    `taskType` ENUM('DEVELOPMENT', 'TESTING', 'MEETING', 'DOCUMENTATION', 'DESIGN', 'RESEARCH', 'OTHER') NOT NULL DEFAULT 'DEVELOPMENT',
    `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED') NOT NULL DEFAULT 'IN_PROGRESS',
    `plannedPercentage` DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
    `actualPercentage` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `plannedHours` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `timeSpentHours` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `outputDeliverable` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `report_tasks_reportId_idx`(`reportId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report_versions` (
    `id` VARCHAR(191) NOT NULL,
    `reportId` VARCHAR(191) NOT NULL,
    `versionNumber` INTEGER NOT NULL,
    `snapshotData` JSON NOT NULL,
    `statusAtSubmission` ENUM('DRAFT', 'SUBMITTED', 'NEEDS_CORRECTION', 'APPROVED') NOT NULL DEFAULT 'SUBMITTED',
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `submittedByUserId` VARCHAR(191) NOT NULL,

    INDEX `report_versions_reportId_idx`(`reportId`),
    UNIQUE INDEX `report_versions_reportId_versionNumber_key`(`reportId`, `versionNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_histories` (
    `id` VARCHAR(191) NOT NULL,
    `reportId` VARCHAR(191) NOT NULL,
    `reportVersionId` VARCHAR(191) NOT NULL,
    `reviewerId` VARCHAR(191) NOT NULL,
    `action` ENUM('APPROVED', 'REQUESTED_CHANGES') NOT NULL,
    `comment` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `review_histories_reportId_idx`(`reportId`),
    INDEX `review_histories_reportVersionId_idx`(`reportVersionId`),
    INDEX `review_histories_reviewerId_idx`(`reviewerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report_tasks` ADD CONSTRAINT `report_tasks_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report_versions` ADD CONSTRAINT `report_versions_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report_versions` ADD CONSTRAINT `report_versions_submittedByUserId_fkey` FOREIGN KEY (`submittedByUserId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_histories` ADD CONSTRAINT `review_histories_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_histories` ADD CONSTRAINT `review_histories_reportVersionId_fkey` FOREIGN KEY (`reportVersionId`) REFERENCES `report_versions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_histories` ADD CONSTRAINT `review_histories_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
