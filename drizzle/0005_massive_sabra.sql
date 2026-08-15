ALTER TABLE `batches` ADD `published_by` varchar(191);--> statement-breakpoint
ALTER TABLE `batches` ADD `published_at` timestamp;--> statement-breakpoint
ALTER TABLE `products` ADD `family_key` varchar(100);