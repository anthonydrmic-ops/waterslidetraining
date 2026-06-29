-- SlideSure Schema v3 - team seat distribution (run AFTER v1 and v2)
--
-- Lets a purchaser buy seats (even without an account) and distribute them: each
-- licence gets a shareable join code; staff claim a seat with that code. The
-- buyer's email is stored so that, if they bought without signing in, their later
-- sign-up is linked to the licence as the org admin.

alter table licenses add column if not exists join_code text unique;
alter table licenses add column if not exists buyer_email text;

create index if not exists idx_licenses_join_code on licenses(join_code);
create index if not exists idx_licenses_buyer_email on licenses(buyer_email);
