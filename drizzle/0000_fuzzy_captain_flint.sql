CREATE TABLE `batches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`lot` varchar(32) NOT NULL,
	`manufactured_at` varchar(32),
	`tested_at` varchar(32),
	`best_by` varchar(32),
	`pass` boolean NOT NULL DEFAULT true,
	`lab_name` varchar(191),
	`report_number` varchar(64),
	`panels` json,
	`coa_pdf_url` varchar(500),
	`supplier_coa_url` varchar(500),
	`published` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `batches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(191) NOT NULL,
	`items` json,
	`subtotal` decimal(10,2),
	`status` enum('pending','paid','fulfilled','cancelled') DEFAULT 'pending',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`handle` varchar(191) NOT NULL,
	`sku` varchar(32) NOT NULL,
	`name` varchar(191) NOT NULL,
	`line` enum('Wellness','Sport') NOT NULL,
	`category` enum('Core','On-the-Go','Gummy') NOT NULL,
	`format` enum('capsule','tablet','powder','stick','gummy') NOT NULL,
	`serving_supply` varchar(191),
	`headline` varchar(255),
	`blurb` text,
	`why_this_form` text,
	`free_from_tags` varchar(500),
	`supplement_facts` json,
	`other_ingredients` text,
	`suggested_use` text,
	`price_one_time` decimal(10,2),
	`price_subscribe` decimal(10,2),
	`stock` int DEFAULT 0,
	`image_url` varchar(500),
	`label_pdf_url` varchar(500),
	`active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_handle_unique` UNIQUE(`handle`),
	CONSTRAINT `products_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `waitlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(191) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `waitlist_id` PRIMARY KEY(`id`),
	CONSTRAINT `waitlist_email_unique` UNIQUE(`email`)
);
