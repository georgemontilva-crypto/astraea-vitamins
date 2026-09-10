-- Wave-one rescope (2026-08-26): sachet/pouch formats + variety-pack flag.
--
-- Hand-written on purpose. drizzle-kit generated a duplicate of 0005 here
-- (0005's committed snapshot does not reflect the columns 0005 actually adds),
-- so the generated file would have re-run `ADD family_key` / `ADD published_by`
-- against a database where those columns already exist and failed the deploy.
-- The 0006 snapshot is correct, so generation is consistent again from here.
ALTER TABLE `products` MODIFY COLUMN `format` enum('capsule','tablet','powder','stick','gummy','sachet','pouch') NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `is_variety_pack` boolean DEFAULT false;
