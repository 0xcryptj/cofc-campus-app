-- ============================================================
-- CofC Campus App — Auth Hooks
-- Paste into Supabase SQL Editor and Run AFTER schema.sql.
-- Then configure the hook in:
--   Dashboard → Authentication → Hooks → "Send Email"
--   → Hook function: public.hook_cofc_email_guard
-- ============================================================

-- Domain-gate hook: fires before every magic-link email is sent.
-- Returns an error object if the email is not @g.cofc.edu,
-- which causes Supabase to reject the OTP request and return
-- a 422 to the client instead of sending the email.
create or replace function public.hook_cofc_email_guard(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not ((event ->> 'email') ilike '%@g.cofc.edu') then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'http_status', 422,
        'message',     'Only @g.cofc.edu email addresses are permitted.'
      )
    );
  end if;

  -- Email is valid — let Supabase send it normally
  return event;
end;
$$;

-- Allow the Supabase auth service to call this function
grant execute
  on function public.hook_cofc_email_guard
  to supabase_auth_admin;

-- Prevent regular users/anon from calling it directly
revoke execute
  on function public.hook_cofc_email_guard
  from authenticated, anon, public;
