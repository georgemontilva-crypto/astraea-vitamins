CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`line` enum('Wellness','Sport','Both') NOT NULL DEFAULT 'Both',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `site_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(500) NOT NULL,
	`url` varchar(500) NOT NULL,
	`label` varchar(191),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `site_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `category` varchar(100) NOT NULL;