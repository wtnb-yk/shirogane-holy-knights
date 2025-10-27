--liquibase formatted sql

--changeset shirogane:037-drop-special-events-tables
--comment: Drop all special events related tables

-- Drop tables in reverse order of creation due to foreign key constraints
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS special_event_special_event_types;
DROP TABLE IF EXISTS special_event_types;
DROP TABLE IF EXISTS special_events;

--rollback CREATE TABLE special_events (...);
--rollback CREATE TABLE special_event_types (...);
--rollback CREATE TABLE special_event_special_event_types (...);
--rollback CREATE TABLE messages (...);
