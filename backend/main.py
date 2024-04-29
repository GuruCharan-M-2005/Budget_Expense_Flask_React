from flask import Flask, request, jsonify,render_template
from pymongo import MongoClient
from flask_cors import CORS  
import json
from bson import json_util

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['Budgets']  
collection1 = db['Budget']  
collection2 = db['Expense']  
collection3 = db['History']  
collection4 = db['Amounts']  


def calculate():
    current, expense, income = 0, 0, 0
    items1 = list(collection1.find())
    items2 = list(collection2.find())
    # print(current,"$$$$",expense,"$$$$$$$$$$",income)
    for i in items1:
        current += int(i['amount'])
        income += int(i['amount'])
    for i in items2:
        current -= int(i['amount'])
        expense += int(i['amount'])
    # print(current,"$$$$",expense,"$$$$$$$$$$",income)

    collection4.update_one({'id': '1a2b3c'}, {'$set': {
        'current': current,
        'expense': expense,
        'income': income
    }})


#=========================================================================


# Budget
@app.route('/budget', methods=['POST'])
def create_budget():
    data = request.json 
    collection1.insert_one(data)
    calculate()
    return jsonify({"message": "Item created successfully"}), 201

@app.route('/budget', methods=['GET'])
def get_all_budget():
    items=list(collection1.find())
    for i in items:
        i['_id']=str(i['_id'])
    if items:
        return jsonify(items), 200
    else:
        return jsonify({"error": "Item not found"}), 404

@app.route('/budget/<id>', methods=['GET'])
def get_budget(id):
    item = collection1.find_one({'_id': id})
    if item:
        return jsonify(item), 200
    else:
        return jsonify({"error": "Item not found"}), 404

@app.route('/budget/<id>', methods=['PUT'])
def update_budget(id):
    data = request.json
    result = collection1.update_one({'id': id}, {'$set': data})
    if result.modified_count:
        return jsonify({"message": "Item updated successfully"}), 200
    else:
        return jsonify({"error": "Item not found"}), 404

@app.route('/budget/<id>', methods=['DELETE'])
def delete_budget(id):
    print(id)
    result = collection1.delete_one({'id': id})
    calculate()
    if result.deleted_count:
        return jsonify({"message": "Item deleted successfully"}), 200
    else:
        return jsonify({"error": "Item not found"}), 404


#=========================================================================




@app.route('/expense', methods=['POST'])
def create_expense():
    data = request.json
    collection2.insert_one(data)
    calculate()
    return jsonify({"message": "Item created successfully"}), 201

@app.route('/expense', methods=['GET'])
def get_all_expense():
    items=list(collection2.find())
    for i in items:
        i['_id']=str(i['_id'])
    if items:
        return jsonify(items), 200
    else:
        return jsonify({"error": "Item not found"}), 404

@app.route('/expense/<id>', methods=['GET'])
def get_expense(id):
    item = collection2.find_one({'_id': id})
    if item:
        return jsonify(item), 200
    else:
        return jsonify({"error": "Item not found"}), 404

@app.route('/expense/<id>', methods=['PUT'])
def update_expense(id):
    data = request.json
    result = collection2.update_one({'id': id}, {'$set': data})
    if result.modified_count:
        return jsonify({"message": "Item updated successfully"}), 200
    else:
        return jsonify({"error": "Item not found"}), 404

@app.route('/expense/<id>', methods=['DELETE'])
def delete_expense(id):
    print(id)
    result = collection2.delete_one({'id': id})
    calculate()
    if result.deleted_count:
        return jsonify({"message": "Item deleted successfully"}), 200
    else:
        return jsonify({"error": "Item not found"}), 404




#=========================================================================




@app.route('/history', methods=['POST'])
def create_history():
    data = request.json
    collection3.insert_one(data)
    return jsonify({"message": "Item created successfully"}), 201

@app.route('/history', methods=['GET'])
def get_all_history():
    items=list(collection3.find())
    items.reverse()
    items=items[:10]
    for i in items:
        i['_id']=str(i['_id'])
    if items:
        return jsonify(items), 200
    else:
        return jsonify({"error": "Item not found"}), 404

# @app.route('/history/<id>', methods=['GET'])
# def get_history(id):
#     item = collection3.find_one({'_id': id})
#     if item:
#         return jsonify(item), 200
#     else:
#         return jsonify({"error": "Item not found"}), 404

# @app.route('/history/<id>', methods=['PUT'])
# def update_history(id):
#     data = request.json
#     result = collection3.update_one({'_id': id}, {'$set': data})
#     if result.modified_count:
#         return jsonify({"message": "Item updated successfully"}), 200
#     else:
#         return jsonify({"error": "Item not found"}), 404

# @app.route('/history/<id>', methods=['DELETE'])
# def delete_history(id):
#     print(id)
#     result = collection3.delete_one({'_id': id})
#     if result.deleted_count:
#         return jsonify({"message": "Item deleted successfully"}), 200
#     else:
#         return jsonify({"error": "Item not found"}), 404



#=========================================================================



# @app.route('/amount', methods=['POST'])
# def create_amount():
#     data = request.json
#     collection4.insert_one(data)
#     return jsonify({"message": "Item created successfully"}), 201

@app.route('/amount', methods=['GET'])
def get_all_amount():
    calculate()
    items=list(collection4.find())
    for i in items:
        i['_id']=str(i['_id'])
    if items:
        return jsonify(items), 200
    else:
        return jsonify({"error": "Item not found"}), 404

# @app.route('/amount/<id>', methods=['GET'])
# def get_amount(id):
#     item = collection4.find_one({'_id': id})
#     if item:
#         return jsonify(item), 200
#     else:
#         return jsonify({"error": "Item not found"}), 404

@app.route('/amount/<id>', methods=['PUT'])
def update_amount(id):
    data = request.json
    result = collection4.update_one({'_id': id}, {'$set': data})
    if result.modified_count:
        return jsonify({"message": "Item updated successfully"}), 200
    else:
        return jsonify({"error": "Item not found"}), 404

# @app.route('/amount/<id>', methods=['DELETE'])
# def delete_amount(id):
#     print(id)
#     result = collection4.delete_one({'_id': id})
#     if result.deleted_count:
#         return jsonify({"message": "Item deleted successfully"}), 200
#     else:
#         return jsonify({"error": "Item not found"}), 404



#=========================================================================







if __name__ == '__main__':
    app.run(debug=True)









'''
^^^^^   WARNING   ^^^^^
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
'''