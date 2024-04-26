from flask import Flask, request, jsonify,render_template
from pymongo import MongoClient
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['Budgets']  
collection = db['Budget']  

@app.route('/track_budget', methods=["GET", "PUT"]) 
def track_item():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['Budgets']  
    collection = db['Budget']  
    expenses = list(collection.find())
    expense=0
    for i in expenses:
        if i['id']!="1234567890":
            expense+=int(i['amount'])
    a=collection.find_one({"id":"1234567890"})
    a['expense']=expense
    a['remaining']=a['budget']-expense
    # print(a)
    collection.update_one({"id":"1234567890"},{"$set":a})

@app.route('/expense')
def greet():
    client = MongoClient('mongodb://localhost:27017/')
    track_item()
    db = client['Budgets']  
    collection = db['Budget']  
    expenses = list(collection.find())
    data=collection.find_one({"id":"1234567890"})
    return render_template('expense.html', expense=expenses,data=data,leng=len(expenses))  #return a rendered HTML


@app.route('/items', methods=['POST'])
def create_item():
    data = request.json
    # print(data)
    collection.insert_one(data)
    return jsonify({"message": "Item created successfully"}), 201

@app.route('/items/<id>', methods=['GET'])
def get_item(id):
    item = collection.find_one({'_id': id})
    if item:
        return jsonify(item), 200
    else:
        return jsonify({"error": "Item not found"}), 404

@app.route('/items/<id>', methods=['PUT'])
def update_item(id):
    data = request.json
    result = collection.update_one({'_id': id}, {'$set': data})
    if result.modified_count:
        return jsonify({"message": "Item updated successfully"}), 200
    else:
        return jsonify({"error": "Item not found"}), 404

@app.route('/items/<id>', methods=['DELETE'])
def delete_item(id):
    print(id)
    result = collection.delete_one({'id': id})
    if result.deleted_count:
        return jsonify({"message": "Item deleted successfully"}), 200
    else:
        return jsonify({"error": "Item not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)