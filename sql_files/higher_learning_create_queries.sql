DROP TABLE IF EXISTS incarceration;
DROP TABLE IF EXISTS ed_enroll_exp;
DROP TABLE IF EXISTS prisoner_exp;
DROP TABLE IF EXISTS fourth_grade_read;
DROP TABLE IF EXISTS ed_corr_data;



CREATE TABLE incarceration (
  state character varying(50),
  year integer,
  prisoner_count integer,
  state_population integer,
  year_state character varying(100) PRIMARY KEY
);


CREATE TABLE ed_enroll_exp (
  year_state character varying(100) PRIMARY KEY,
  state character varying(50),
  year integer,
  enrollment integer,
  total_expenditure integer
);


CREATE TABLE prisoner_exp (
  state character varying(50),
  year integer,
  total_expenditure integer,
  year_state character varying(100) PRIMARY KEY
);


CREATE TABLE fourth_grade_read (
  state character varying(50),
  achievement_level character varying(50),
  year integer,
  data integer,
  year_state_ach_lvl character varying(100) PRIMARY KEY
);




CREATE TABLE ed_corr_data (
year_state character varying(100) PRIMARY KEY,
state character varying(50),
year integer,
ed_enrollment integer,
ed_total_exp_1k integer,
prisoner_count integer,
corr_total_exp_1k integer,
state_population integer,
cost_per_stu float,
stu_to_pop_percent float,
cost_per_prisoner float,
prisoner_to_pop_percent float
);


SELECT * FROM incarceration;
SELECT * FROM ed_enroll_exp;
SELECT * FROM prisoner_exp;
SELECT * FROM fourth_grade_read;
SELECT * FROM ed_corr_data;



