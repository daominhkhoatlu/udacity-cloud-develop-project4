import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'


export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async event => {
    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)

    /* Get userId */
    const userId = getUserId(event)
    const updatedItem = await updateTodo(todoId, updatedTodo, userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    }
  })