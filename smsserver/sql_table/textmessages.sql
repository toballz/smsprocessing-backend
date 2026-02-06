-- Table: public.textmessages

-- DROP TABLE IF EXISTS public.textmessages;

CREATE TABLE IF NOT EXISTS public.textmessages
(
    id_ai bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    phonenumber text COLLATE pg_catalog."default" NOT NULL,
    country text COLLATE pg_catalog."default",
    shortcountry text COLLATE pg_catalog."default",
    countryphonecode text COLLATE pg_catalog."default",
    message text COLLATE pg_catalog."default" NOT NULL,
    status textmessage_status DEFAULT 'pending'::textmessage_status,
    created_at timestamp without time zone DEFAULT now(),
    updated_on timestamp without time zone DEFAULT now(),
    updated_comment text COLLATE pg_catalog."default",
    CONSTRAINT textmessages_pkey PRIMARY KEY (id_ai)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.textmessages
    OWNER to appuser;