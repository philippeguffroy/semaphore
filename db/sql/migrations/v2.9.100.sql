alter table `project__inventory` add `repository_id` int null references project__repository(`id`) on delete set null;