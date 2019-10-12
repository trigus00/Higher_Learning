DROP TABLE IF EXISTS incarceration;
DROP TABLE IF EXISTS fourth_grade_read;
DROP TABLE IF EXISTS prisoner_exp;
DROP TABLE IF EXISTS education_enroll_exp;


CREATE TABLE incarceration (
  yr_state PRIMARY KEY,
  state character varying(250),
  year character varying(350),
  year integer,
  citation_journal_title character varying(100),
  description character varying(3000),
  keywords character varying(1000)
);













SELECT * FROM incarceration;
SELECT * FROM fourth_grade_read;
SELECT * FROM prisoner_exp;
SELECT * FROM education_enroll_exp;

