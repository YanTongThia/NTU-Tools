from flask import Flask, render_template, request, jsonify
from cs50 import SQL
from helpers import processing, plot

db = SQL("sqlite:///courses_actual.db")
app = Flask(__name__)

columns = ["Mon","Tue","Wed","Thu","Fri","Sat"]

filtered_list = []
current_index = 0

global s
     
   
@app.route("/")
def index():          
    return render_template("index.html")

             
@app.route("/timetable")
def timetable():
    code = db.execute("select DISTINCT code from courses")
    list_code = []
    for each in code:
        list_code.append(each['code'])
    return render_template("timetable.html",list_code=list_code)

@app.route("/query", methods=['GET'])
def query():
    code = db.execute("select DISTINCT code from courses")
    list_code = []
    for each in code:
        list_code.append(each['code'])
    return jsonify({"success":list_code})

@app.route("/process", methods=['POST'])
def process():
    req_data = request.form
    requested = []
    for each in range(len(req_data)):
        requested.append(req_data[str(each)])

    global current_index
    current_index = 0
 
    global filtered_list
    filtered_list = processing(requested)

    plot_s = plot(filtered_list[current_index])
        
    return jsonify({"plot":plot_s,"length":len(filtered_list),"index":current_index})

@app.route("/increment_decrement",methods=['POST'])
def increment_decrement():
    global current_index
    global filtered_list
               
    length = len(filtered_list)
    req_data = request.form.get("req_type")

    if req_data == "increment":
        if current_index + 1 <= length:
            current_index += 1
    elif req_data == "decrement":
        if current_index - 1 >= 0:
            current_index -= 1

    plot_s = plot(filtered_list[current_index])
    return jsonify({"plot":plot_s,"length":length,"index":current_index})
    

    
if __name__ == "__main__": 
    app.run(debug=True) 
 
  