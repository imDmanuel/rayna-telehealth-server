DO $$ BEGIN
 CREATE TYPE "public"."auth_method" AS ENUM('EMAIL', 'GOOGLE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."otp_for" AS ENUM('SIGNUP', 'FORGOT_PASSWORD');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."sent_by" AS ENUM('PATIENT', 'DOCTOR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appointments" (
	"sn" serial NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"date" timestamp,
	"start_time" varchar(255),
	"end_time" varchar(255),
	"location" varchar,
	"topic" varchar NOT NULL,
	"doctor_id" uuid,
	"hospital_id" uuid,
	"cancelled" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "appointments_sn_unique" UNIQUE("sn")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth" (
	"sn" serial NOT NULL,
	"user_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"auth_method" "auth_method" DEFAULT 'EMAIL',
	"otp_hash" varchar DEFAULT null,
	"otp_expiry" timestamp DEFAULT null,
	"otp_for" "otp_for" DEFAULT null,
	CONSTRAINT "auth_sn_unique" UNIQUE("sn"),
	CONSTRAINT "auth_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "consultations" (
	"sn" serial NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"date" timestamp,
	"start_time" time,
	"end_time" time,
	"location" varchar,
	"topic" text,
	"doctor_id" uuid,
	"ongoing" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "consultations_sn_unique" UNIQUE("sn")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversations" (
	"sn" serial NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"consultation_id" uuid NOT NULL,
	"date" timestamp,
	"message" text,
	"sent_by" "sent_by" DEFAULT 'PATIENT' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "conversations_sn_unique" UNIQUE("sn")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "doctors" (
	"sn" serial NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"specialty" varchar(255) NOT NULL,
	"is_verified" boolean DEFAULT true,
	"profile_pic" varchar(255),
	CONSTRAINT "doctors_sn_unique" UNIQUE("sn")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hospitals" (
	"sn" serial NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar,
	"address" varchar,
	"phone" varchar,
	"ratings" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "hospitals_sn_unique" UNIQUE("sn")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"sn" serial NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"profile_image" varchar,
	"age" integer,
	"weight" varchar,
	"height" varchar(255),
	"date_of_birth" date,
	"hmo_id" varchar,
	"hmoPlan" varchar,
	"blood_pressure" varchar(100),
	"cholesterol_levels" varchar(100),
	"glucose_levels" varchar(100),
	"expires_on" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "users_sn_unique" UNIQUE("sn")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE set null;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_hospital_id_hospitals_id_fk" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospitals"("id") ON DELETE set null ON UPDATE set null;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth" ADD CONSTRAINT "auth_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "consultations" ADD CONSTRAINT "consultations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "consultations" ADD CONSTRAINT "consultations_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE set null;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversations" ADD CONSTRAINT "conversations_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
