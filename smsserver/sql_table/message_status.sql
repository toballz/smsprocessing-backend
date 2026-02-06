-- Type: textmessage_status

-- DROP TYPE IF EXISTS public.textmessage_status;

CREATE TYPE public.textmessage_status AS ENUM
    ('pending', 'processing', 'sent', 'failed');

ALTER TYPE public.textmessage_status
    OWNER TO appuser;
