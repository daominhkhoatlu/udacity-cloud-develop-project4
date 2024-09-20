import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodoAccess {
    constructor(
        documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
        todosTable = process.env.TODOS_TABLE
    ) {
        this.documentClient = documentClient
        this.todosTable = todosTable
        this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
    }

    async getAllTodos(userId) {

        const result = await this.dynamoDbClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        })

        return result.Items
    }

    async createTodo(todo) {
        await this.dynamoDbClient.put({
            TableName: this.todosTable,
            Item: todo
        })

        return todo
    }

    async updateTodo(updatedTodoItem) {
        const newUpdatedTodoItem = await this.dynamoDbClient
            .update({
                TableName: this.todosTable,
                Key: {
                    'userId': updatedTodoItem.userId,
                    'todoId': updatedTodoItem.todoId
                },

                UpdateExpression: 'set #task_name = :name, \
                              dueDate = :dueDate, \
                              done = :done',

                ConditionExpression: "(#task_name <> :name) or \
                              (dueDate <> :dueDate) or \
                              (done <> :done)",

                ExpressionAttributeValues: {
                    ':name': updatedTodoItem.name,
                    ':dueDate': updatedTodoItem.dueDate,
                    ':done': updatedTodoItem.done
                },

                ExpressionAttributeNames: {
                    '#task_name': 'name'
                },

                ReturnValues: 'UPDATED_NEW'
            })

        return newUpdatedTodoItem
    }

    async deleteTodo(deletedTodo) {
        const deletedItem = await this.dynamoDbClient.delete({
            TableName: this.todosTable,
            Key: {
                'userId': deletedTodo.userId,
                'todoId': deletedTodo.todoId
            },
            ReturnValues: 'ALL_OLD'
        })

        return deletedItem
    }

    async updateTodoAttachmentUrl(updatedTodoAttachment) {

        const newUpdatedTodoAttachmentUrl = await this.dynamoDbClient.update({
            TableName: this.todosTable,
            Key: {
                'userId': updatedTodoAttachment.userId,
                'todoId': updatedTodoAttachment.todoId
            },

            UpdateExpression: 'set attachmentUrl = :attachmentUrl',

            ExpressionAttributeValues: {
                ':attachmentUrl': updatedTodoAttachment.attachmentUrl
            },

            ReturnValues: 'UPDATED_NEW'
        })

        return newUpdatedTodoAttachmentUrl
    }
}