import pandas as pd
import json
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import func

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/species_complete.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
# Samples_Metadata = Base.classes.sample_metadata
Species = Base.classes.species


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/species")
def names():
    """Return a list of unique species names."""
    sps = db.session.query(Species.index).group_by(Species.index)
    species_list = []
    for sp in sps:
        species_list.append(sp[0])
    
    return jsonify(species_list)


@app.route('/species/<sp>')
def species(sp):
    species_data = db.session.query(Species.latitude, Species.longitude, Species.Locality, Species.DepthInMeters, Species.VernacularNameCategory).filter(Species.index == sp)
    
    lat_list = []
    long_list = []
    loc_list = []
    dep_list = []

    for row in species_data:
        lat_list.append(row[0])
        long_list.append(row[1])
        loc_list.append(row[2])
        dep_list.append(row[3]) 
        vernac = row[4]
    
    data = {
        'species': sp,
        'latitude': lat_list,
        'longitude': long_list,
        'locality': loc_list,
        'depth': dep_list,
        'vernac': vernac
    }

    return jsonify(data)


@app.route('/<taxa>/<sp>')
def get_taxa(taxa, sp):

    # Get taxonomic info for given sp at given taxa level -- ie: look up 'Family' for sp 'Aaptos aaptos', results = Suberitidae
    tx = "'"+ taxa + "'"

    sel = ['Species.'+tx]
    sp_taxa = db.session.query(*sel).filter(Species.index == sp).first()[0]
    
    # Get coordinates of all other sp that share same taxonomic level
    sel2 = ['Species.'+ tx +'=='+ "'"+ sp_taxa + "'"]
    taxa_data = db.session.query(Species.latitude, Species.longitude).filter(*sel2)

    lat_list = []
    long_list = []

    for row in taxa_data:
        lat_list.append(row[0])
        long_list.append(row[1])

    data ={
        'latitude': lat_list,
        'longitude': long_list,
        'taxa_rank': taxa,
        'taxa_value': sp_taxa
    }

    return jsonify(data)   

@app.route('/vernacular')
def vernacular_data():
    sl = db.session.query(Species.VernacularNameCategory, func.count(Species.index), func.avg(Species.DepthInMeters)).filter(Species.DepthInMeters<200).group_by(Species.VernacularNameCategory)
    tw= db.session.query(Species.VernacularNameCategory, func.count(Species.index), func.avg(Species.DepthInMeters)).filter(Species.DepthInMeters>200).filter(Species.DepthInMeters<1000).group_by(Species.VernacularNameCategory)
    mid = db.session.query(Species.VernacularNameCategory, func.count(Species.index), func.avg(Species.DepthInMeters)).filter(Species.DepthInMeters>1000).filter(Species.DepthInMeters<4000).group_by(Species.VernacularNameCategory)
    abyss = db.session.query(Species.VernacularNameCategory, func.count(Species.index), func.avg(Species.DepthInMeters)).filter(Species.DepthInMeters>4000).group_by(Species.VernacularNameCategory)
    ver_names = db.session.query(Species.VernacularNameCategory).group_by(Species.VernacularNameCategory)

    ver_dict = {}
    i=1
    for v in ver_names:
        ver_dict[v[0]]=i
        i=i+1

    final_dict = {'sunlight':{},'twilight':{}, 'midnight':{}, 'abyss':{}}
    
    temp_dict_arr = []
    for row in sl:
        temp_dict = {}
        temp_dict['category'] = row[0]
        temp_dict['cat_num'] = ver_dict[row[0]]
        temp_dict['avg_depth'] = row[2]
        temp_dict['count'] = row[1]
        temp_dict_arr.append(temp_dict)
    
    a = list(set(range(1,18)) - set([i['cat_num'] for i in temp_dict_arr]))
    for i in a:
        cat_a = (list(ver_dict.keys())[list(ver_dict.values()).index(i)])
        tt_d = {'category': cat_a, 'cat_num':i, 'avg_depth':0,'count':0}
        temp_dict_arr.append(tt_d)
    temp_dict_arr = sorted(temp_dict_arr, key = lambda i: i['cat_num'])
    final_dict['sunlight'] = temp_dict_arr

    temp_dict_arr = []
    for row in tw:
        temp_dict = {}
        temp_dict['category'] = row[0]
        temp_dict['cat_num'] = ver_dict[row[0]]
        temp_dict['avg_depth'] = row[2]
        temp_dict['count'] = row[1]
        temp_dict_arr.append(temp_dict)
    
    a = list(set(range(1,18)) - set([i['cat_num'] for i in temp_dict_arr]))
    for i in a:
        cat_a = (list(ver_dict.keys())[list(ver_dict.values()).index(i)])
        tt_d = {'category': cat_a, 'cat_num':i, 'avg_depth':0,'count':0}
        temp_dict_arr.append(tt_d)
    temp_dict_arr = sorted(temp_dict_arr, key = lambda i: i['cat_num'])
    final_dict['twilight'] = temp_dict_arr

    temp_dict_arr = []
    for row in mid:
        temp_dict = {}
        temp_dict['category'] = row[0]
        temp_dict['cat_num'] = ver_dict[row[0]]
        temp_dict['avg_depth'] = row[2]
        temp_dict['count'] = row[1]
        temp_dict_arr.append(temp_dict)

    a = list(set(range(1,18)) - set([i['cat_num'] for i in temp_dict_arr]))
    for i in a:
        cat_a = (list(ver_dict.keys())[list(ver_dict.values()).index(i)])
        tt_d = {'category': cat_a, 'cat_num':i, 'avg_depth':0,'count':0}
        temp_dict_arr.append(tt_d)
    temp_dict_arr = sorted(temp_dict_arr, key = lambda i: i['cat_num'])
    final_dict['midnight'] = temp_dict_arr

    temp_dict_arr = []
    for row in abyss:
        temp_dict = {}
        temp_dict['category'] = row[0]
        temp_dict['cat_num'] = ver_dict[row[0]]
        temp_dict['avg_depth'] = row[2]
        temp_dict['count'] = row[1]
        temp_dict_arr.append(temp_dict)
    
    a = list(set(range(1,18)) - set([i['cat_num'] for i in temp_dict_arr]))
    for i in a:
        cat_a = (list(ver_dict.keys())[list(ver_dict.values()).index(i)])
        tt_d = {'category': cat_a, 'cat_num':i, 'avg_depth':0,'count':0}
        temp_dict_arr.append(tt_d)
    temp_dict_arr = sorted(temp_dict_arr, key = lambda i: i['cat_num'])
    final_dict['abyss'] = temp_dict_arr


    return jsonify(final_dict)


if __name__ == "__main__":
    app.run()
