-- Create one-time bootstrap function to grant admin to first authenticated user
create or replace function public.bootstrap_admin_if_none(_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_count int;
begin
  select count(*) into admin_count from public.user_roles where role = 'admin'::app_role;
  if admin_count = 0 then
    insert into public.user_roles (user_id, role) values (_user_id, 'admin');
    return true;
  end if;
  return false;
end;
$$;

-- Ensure function is callable by authenticated users
revoke all on function public.bootstrap_admin_if_none(uuid) from public;
grant execute on function public.bootstrap_admin_if_none(uuid) to authenticated;