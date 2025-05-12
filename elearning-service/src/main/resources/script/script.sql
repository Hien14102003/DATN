drop database if exists `elearning_db`;
create database if not exists `elearning_db`;
use `elearning_db`;
drop table if exists `system_settings`;
create table if not exists `system_settings`
(
    `setting_id` int(11)      not null auto_increment,
    `name`       varchar(255) not null,
    `value`      text,
    `created_at` timestamp default current_timestamp,
    `updated_at` timestamp default current_timestamp on update current_timestamp,
    primary key (`setting_id`),
    unique key `name` (`name`),
    index (`name`)
) engine = InnoDB
  default charset = utf8;
drop table if exists `enrollments`;
drop table if exists `results_detail`;
drop table if exists `results`;
drop table if exists `questions`;
drop table if exists `quizzes`;
drop table if exists `media`;
drop table if exists `lessons`;
drop table if exists `courses`;
drop table if exists `levels`;
drop table if exists `users`;


create table if not exists `users`
(
    `user_id`    int auto_increment,
    `email`      varchar(255) unique not null,
    `password`   varchar(255)        not null,
    `first_name` varchar(255),
    `last_name`  varchar(255),
    `gender`     enum ('male', 'female'),
    `phone`      varchar(20),
    `address`    text,
    `dob`        date,
    `avatar`     longtext,
    `role`       enum ('admin', 'student')   default 'student',
    `status`     enum ('active', 'inactive', 'block') default 'active',
    `created_at` timestamp                   default current_timestamp,
    `updated_at` timestamp                   default current_timestamp on update current_timestamp,
    primary key (`user_id`)
);

create table if not exists `levels`
(
    `level_id`   int auto_increment,
    `name`       varchar(255) unique not null,
    `status`     enum ('active', 'inactive') default 'active',
    `created_at` timestamp                   default current_timestamp,
    `updated_at` timestamp                   default current_timestamp on update current_timestamp,
    primary key (`level_id`)
);


create table if not exists `courses`
(
    `course_id`          int auto_increment,
    `name`               varchar(255) unique not null,
    `description`        text,
    `level_id`           int,
    `thumbnail`          longtext,
    `status`             enum ('active', 'inactive') default 'active',
    `start_date`         date,
    `end_date`           date,
    `number_of_students` int                                    default 0,
    `created_at`         timestamp                              default current_timestamp,
    `updated_at`         timestamp                              default current_timestamp on update current_timestamp,
    primary key (`course_id`),
    foreign key (`level_id`) references `levels` (`level_id`)
);

create table if not exists `lessons`
(
    `lesson_id`   int auto_increment,
    `course_id`   int,
    `title`       varchar(255) not null,
    `description` text,
    `sequence`    int,
    `status`      enum ('active', 'inactive') default 'active',
    `created_at`  timestamp                   default current_timestamp,
    `updated_at`  timestamp                   default current_timestamp on update current_timestamp,
    primary key (`lesson_id`),
    foreign key (`course_id`) references `courses` (`course_id`)
);

create table if not exists `media`
(
    `media_id`   int auto_increment,
    `lesson_id`  int,
    `title`      varchar(255) not null,
    `url`        longtext,
    `type`       varchar(255),
    `sequence`   int,
    `status`     enum ('active', 'inactive') default 'active',
    `created_at` timestamp                   default current_timestamp,
    `updated_at` timestamp                   default current_timestamp on update current_timestamp,
    primary key (`media_id`),
    foreign key (`lesson_id`) references `lessons` (`lesson_id`)
);


create table if not exists `quizzes`
(
    `quiz_id`             int auto_increment,
    `lesson_id`           int,
    `title`               varchar(255) not null,
    `description`         text,
    `number_of_questions` int,
    `status`              enum ('active', 'inactive') default 'active',
    `created_at`          timestamp                   default current_timestamp,
    `updated_at`          timestamp                   default current_timestamp on update current_timestamp,
    primary key (`quiz_id`),
    foreign key (`lesson_id`) references `lessons` (`lesson_id`)
);


create table if not exists `questions`
(
    `question_id` int auto_increment,
    `quiz_id`     int,
    `no`          int,
    `content`     text,
    `option_a`    text,
    `option_b`    text,
    `option_c`    text,
    `option_d`    text,
    `answer`      enum ('a', 'b', 'c', 'd'),
    `status`      enum ('active', 'inactive') default 'active',
    `created_at`  timestamp                   default current_timestamp,
    `updated_at`  timestamp                   default current_timestamp on update current_timestamp,
    primary key (`question_id`),
    foreign key (`quiz_id`) references `quizzes` (`quiz_id`)
);


create table if not exists `results`
(
    `result_id`  int auto_increment,
    `user_id`    int,
    `quiz_id`    int,
    `score`      int,
    `score_str`  varchar(255),
    `status`     enum ('done', 'in_progress') default 'in_progress',
    `created_at` timestamp                    default current_timestamp,
    `updated_at` timestamp                    default current_timestamp on update current_timestamp,
    primary key (`result_id`),
    foreign key (`user_id`) references `users` (`user_id`),
    foreign key (`quiz_id`) references `quizzes` (`quiz_id`)
);

create table if not exists `results_detail`
(
    `result_detail_id` int auto_increment,
    `result_id`        int,
    `question_id`      int,
    `answer`           enum ('a', 'b', 'c', 'd'),
    `correct_str`      enum ('yes', 'no'),
    `correct`          tinyint(1),
    `correct_answer`   enum ('a', 'b', 'c', 'd'),
    `created_at`       timestamp default current_timestamp,
    `updated_at`       timestamp default current_timestamp on update current_timestamp,
    primary key (`result_detail_id`),
    foreign key (`result_id`) references `results` (`result_id`),
    foreign key (`question_id`) references `questions` (`question_id`)
);

create table if not exists `enrollments`
(
    `enrollment_id` int auto_increment,
    `user_id`       int,
    `course_id`     int,
    `status`        enum ('pending', 'rejected', 'approved', 'deleted') default 'pending',
    `created_at`    timestamp                                           default current_timestamp,
    `updated_at`    timestamp                                           default current_timestamp on update current_timestamp,
    primary key (`enrollment_id`),
    foreign key (`user_id`) references `users` (`user_id`),
    foreign key (`course_id`) references `courses` (`course_id`)
);
