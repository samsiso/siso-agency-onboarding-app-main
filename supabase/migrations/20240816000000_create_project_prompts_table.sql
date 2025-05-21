-- Create project_prompts table
create table project_prompts (
  id serial primary key,
  project text not null,
  page text not null,
  domain text not null check (domain in ('Frontend', 'Backend', 'Research')),
  prompt_cycle_number integer not null check (prompt_cycle_number >= 1 and prompt_cycle_number <= 9),
  prompt text not null,
  times_used integer not null default 0,
  is_done boolean not null default false,
  last_used timestamp with time zone,
  unique (project, page, domain, prompt_cycle_number)
);

-- Add comment to the table for better documentation
comment on table project_prompts is 'Stores prompts used in the project development cycle';

-- Add comments to columns for better documentation
comment on column project_prompts.project is 'The project being worked on (e.g., "Loft", "SuperCrypt")';
comment on column project_prompts.page is 'The specific page or component being worked on (e.g., "LoginForm", "PaymentAPI")';
comment on column project_prompts.domain is 'Indicates whether the work is frontend, backend, or research';
comment on column project_prompts.prompt_cycle_number is 'The position in the 9-prompt cycle (1 to 9)';
comment on column project_prompts.prompt is 'The specific prompt text for the cycle number';
comment on column project_prompts.times_used is 'Tracks how many times the prompt has been executed';
comment on column project_prompts.is_done is 'Checkmark indicating if the prompt is completed';
comment on column project_prompts.last_used is 'Timestamp of when the prompt was last executed';

-- Create indexes for better query performance
create index idx_project_prompts_project on project_prompts(project);
create index idx_project_prompts_page on project_prompts(page);
create index idx_project_prompts_domain on project_prompts(domain);
create index idx_project_prompts_prompt_cycle_number on project_prompts(prompt_cycle_number);
create index idx_project_prompts_is_done on project_prompts(is_done); 