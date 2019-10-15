# Dependencies
# ----------------------------------

import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template, url_for
from flask_sqlalchemy import SQLAlchemy

import psycopg2 as pg

# Imports the methods needed to abstract classes into tables
from sqlalchemy.ext.declarative import declarative_base

# Allow us to declare column types
from sqlalchemy import Column, Integer, String, Float 

#from flask_heroku import Heroku

#heroku = Heroku(app)

import sys
import json
sys.path.append("..")
from cred.cred_user import username
from cred.cred_p import pgpass
from cred.cred_host import host_loc
from cred.cred_port import cred_port


app = Flask(__name__)



#################################################
# Database Setup
#################################################

# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bellybutton.sqlite"


DB_URL = 'postgresql+psycopg2://'+ username +':' + pgpass + '@' +host_loc + ':' + cred_port + '/' + 'higher_learning'
#app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning


#db = "higher_learning"
db = SQLAlchemy(app)
#eng = create_engine('postgresql+psycopg2://'+ username +':' + pgpass + '@' +host_loc + ':' + cred_port + '/' + db)
#conn = eng.connect()


# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Incarceration = Base.classes.incarceration
Ed_Enroll_Exp = Base.classes.ed_enroll_exp
Prisoner_Exp = Base.classes.prisoner_exp
Fourth_Grade_Read = Base.classes.fourth_grade_read
Ed_Corr_Data = Base.classes.ed_corr_data




@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")



@app.route("/incarceration", methods=['GET'])
def incarceration():
    """Return incareceration data"""
    sql_query1 = 'SELECT * FROM incarceration'
    results1 = pd.read_sql_query(sql_query1, db.session.bind).to_json(orient='records')

    return jsonify(results1)


@app.route("/ed_enroll_exp", methods=['GET'])
def ed_enroll_exp():
    """Return education enrollment expenditure data"""
    sql_query2 = 'SELECT * FROM ed_enroll_exp'
    results2 = pd.read_sql_query(sql_query2, db.session.bind).to_json(orient='records')

    return jsonify(results2)


@app.route("/prisoner_exp", methods=['GET'])
def prisoner_exp():
    """Return prisoner expenditure data"""
    sql_query3 = 'SELECT * FROM prisoner_exp'
    results3 = pd.read_sql_query(sql_query3, db.session.bind).to_json(orient='records')

    return jsonify(results3)


@app.route("/fourth_grade_read", methods=['GET'])
def fourth_grade_read():
    """Return fourth grade read data"""
    sql_query4 = 'SELECT * FROM fourth_grade_read'
    results4 = pd.read_sql_query(sql_query4, db.session.bind).to_json(orient='records')

    return jsonify(results4)



@app.route("/ed_corr_data", methods=['GET'])
def ed_corr_data():
    """Return a list of sample names."""
    sql_query5 = 'SELECT * FROM ed_corr_data'
    results5 = pd.read_sql_query(sql_query5, db.session.bind).to_json(orient='records')

    return jsonify(results5)


if __name__ == "__main__":
    app.run(debug=True)
