CREATE TABLE `analyses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer NOT NULL,
	`candidate_name` text NOT NULL,
	`file_name` text,
	`linkedin_url` text,
	`model` text,
	`score` real,
	`result_json` text,
	`error` text
);
