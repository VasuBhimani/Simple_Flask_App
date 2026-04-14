import os
from flask import Flask, request, jsonify
import boto3
import uuid
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

TABLE_NAME = os.environ.get('DYNAMODB_TABLE', 'Tasks')  # default = Tasks
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table(TABLE_NAME)

# CREATE
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    task_id = str(uuid.uuid4())

    table.put_item(Item={
        'task_id': task_id,
        'title': data['title'],
        'status': 'pending'
    })

    return jsonify({"message": "Task created", "task_id": task_id})

# READ
@app.route('/tasks', methods=['GET'])
def get_tasks():
    response = table.scan()
    return jsonify(response['Items'])

# UPDATE
@app.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json

    table.update_item(
        Key={'task_id': task_id},
        UpdateExpression="set title=:t, status=:s",
        ExpressionAttributeValues={
            ':t': data['title'],
            ':s': data['status']
        }
    )

    return jsonify({"message": "Task updated"})

# DELETE
@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    table.delete_item(Key={'task_id': task_id})
    return jsonify({"message": "Task deleted"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)