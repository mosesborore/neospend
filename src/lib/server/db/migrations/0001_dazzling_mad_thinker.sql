ALTER TABLE "categories" ALTER COLUMN "type" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "type" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "type_check" CHECK ("categories"."type" IN ('expense', 'income', 'transfer'));--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "type_check" CHECK ("transactions"."type" IN ('expense', 'income', 'transfer'));--> statement-breakpoint
DROP TYPE "public"."transactionType";