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


@app.route("/species/<sp>")
def species(sp):
    stmt = db.session.query(Species).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    species_data = df.loc[df['index']==sp,['latitude','longitude', 'DepthInMeters','Locality','VernacularNameCategory']]
    vernac = species_data.iloc[0,4]
    print(vernac)
    data = {
        "species": sp,
        "latitude": species_data['latitude'].tolist(),
        "longitude": species_data['longitude'].tolist(),
        'locality': species_data['Locality'].tolist(),
        "depth": species_data['DepthInMeters'].tolist(),
        'vernac': vernac
    }
    return jsonify(data)

@app.route('/<taxa>/<sp>')
def get_taxa(taxa, sp):

    tx = "'"+ taxa + "'"

    sel = ['Species.'+tx]
    sp_taxa = db.session.query(*sel).filter(Species.index == sp).first()[0]
    
    stmt = f"SELECT * FROM species WHERE `{taxa}` = '{sp_taxa}'"
    df = pd.read_sql_query(stmt, db.session.bind)
    data ={
        'latitude': df['latitude'].tolist(),
        'longitude': df['longitude'].tolist(),
        'taxa_rank': taxa,
        'taxa_value': sp_taxa
    }

    return jsonify(data)

@app.route('/vernacular')
def vernacular_data():
    tw= db.session.query(Species.VernacularNameCategory, func.count(Species.index), func.avg(Species.DepthInMeters)).filter(Species.DepthInMeters<1000).group_by(Species.VernacularNameCategory)
    mid = db.session.query(Species.VernacularNameCategory, func.count(Species.index), func.avg(Species.DepthInMeters)).filter(Species.DepthInMeters>1000).filter(Species.DepthInMeters<4000).group_by(Species.VernacularNameCategory)
    abyss = db.session.query(Species.VernacularNameCategory, func.count(Species.index), func.avg(Species.DepthInMeters)).filter(Species.DepthInMeters>4000).group_by(Species.VernacularNameCategory)
    
    twil_depth ={}
    for row in tw:
        twil_depth[row[0]]={'count': row[1], 'avg_depth':row[2]}

    
    mid_depth = {}
    for row in mid:
        mid_depth[row[0]]={'count': row[1], 'avg_depth':row[2]}
    
    abyss_depth = {}
    for row in abyss:
        abyss_depth[row[0]]={'count': row[1], 'avg_depth':row[2]}
    
    depth_data={'twilight':twil_depth,'midnight': mid_depth,'abyss': abyss_depth}
    
    print(depth_data)
    json_depth = json.dumps(depth_data)
    return json_depth


if __name__ == "__main__":
    app.run()
