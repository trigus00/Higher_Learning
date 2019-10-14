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



@app.route("/ed_corr_data", methods=['GET'])
def ed_corr_data():
    """Return a list of sample names."""
    sql_query = 'SELECT * "FROM ed_corr_data"'



    # Use Pandas to perform the sql query
    # x = db.session.query(Ed_Corr_Data)
    # df = pd.read_sql_query(x, db.session.bind)
    # x = pd.read_sql_query('SELECT * "FROM ed_corr_data"', db.session.bind)

    # Return a list of the column names (sample names)
    # return jsonify(list(df.columns))
    # return jsonify(x)

    #out = cur.execute(sql_query)
    #context_records = cur.fetchall() 
    #ContextRootKeys = []
    #outp ="Print each row and it's columns values"
    #for row in context_records:
    #    ContextRootKeys.append(row[1])
    #conn.commit()
    #print(ContextRootKeys)
    #return outp

    results = pd.read_sql_query(sql_query, db.session.bind)
    return jsonify(results)




# @app.route("/names")
# def names():
#     """Return a list of sample names."""

    # Use Pandas to perform the sql query
#     stmt = db.session.query(Samples).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
#     return jsonify(list(df.columns)[2:])


# @app.route("/metadata/<sample>")
# def sample_metadata(sample):
#     """Return the MetaData for a given sample."""
#     sel = [
#         Samples_Metadata.sample,
#         Samples_Metadata.ETHNICITY,
#         Samples_Metadata.GENDER,
#         Samples_Metadata.AGE,
#         Samples_Metadata.LOCATION,
#         Samples_Metadata.BBTYPE,
#         Samples_Metadata.WFREQ,
#     ]

#     results = db.session.query(*sel).filter(Samples_Metadata.sample == sample).all()

    # Create a dictionary entry for each row of metadata information
#     sample_metadata = {}
#     for result in results:
#         sample_metadata["sample"] = result[0]
#         sample_metadata["ETHNICITY"] = result[1]
#         sample_metadata["GENDER"] = result[2]
#         sample_metadata["AGE"] = result[3]
#         sample_metadata["LOCATION"] = result[4]
#         sample_metadata["BBTYPE"] = result[5]
#         sample_metadata["WFREQ"] = result[6]

#     print(sample_metadata)
#     return jsonify(sample_metadata)


# @app.route("/samples/<sample>")
# def samples(sample):
#     """Return `otu_ids`, `otu_labels`,and `sample_values`."""
#     stmt = db.session.query(Samples).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the sample number and
    # only keep rows with values above 1
#     sample_data = df.loc[df[sample] > 1, ["otu_id", "otu_label", sample]]

    # Sort by sample
#     sample_data.sort_values(by=sample, ascending=False, inplace=True)

    # Format the data to send as json
#     data = {
#         "otu_ids": sample_data.otu_id.values.tolist(),
#         "sample_values": sample_data[sample].values.tolist(),
#         "otu_labels": sample_data.otu_label.tolist(),
#     }
#     return jsonify(data)







if __name__ == "__main__":
    app.run()
