import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todoAccess.mjs'
import { getUploadUrl, getAttachmentUrl } from '../fileStorage/attachmentUtils.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('businessLogic/todos.mjs')

const todoAccess = new TodoAccess()

export async function getAllTodos(userId) {
    logger.debug('Get todos for userid ${userId}')
    return todoAccess.getAllTodos(userId)
}

export async function createTodo({ dueDate, name }, userId) {

    const todoId = uuid.v4()

    const createdAt = new Date().toISOString()

    return await todoAccess.createTodo({
        todoId: todoId,
        userId: userId,
        attachmentUrl: "",
        dueDate,
        createdAt: createdAt,
        name,
        done: false
    })
}

export async function updateTodo(todoId, updateTodoRequest, userId) {

    return await todoAccess.updateTodo({
        todoId,
        userId,
        ...updateTodoRequest
    })
}


export async function deleteTodo(todoId, userId) {

    return await todoAccess.deleteTodo({
        todoId,
        userId
    })
}

export async function getTodoFileUploadUrl(todoId, userId) {

    const fileId = uuid.v4()
    const uploadUrl = await getUploadUrl(fileId)

    if (uploadUrl) {
        const attachmentUrl = await todoAccess.updateTodoAttachmentUrl({
            userId,
            todoId,
            attachmentUrl: getAttachmentUrl(fileId)
        })

    }

    return uploadUrl
}