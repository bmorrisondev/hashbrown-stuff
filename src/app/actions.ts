'use server'
import { api } from "../../convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { auth } from '@clerk/nextjs/server'

async function getClerkToken() {
  const { getToken } = await auth()
  const token = await getToken({
    template: 'convex'
  })
  return token || undefined
}

export async function getMessages() {
  const token = await getClerkToken()
  console.log(token)
  return await fetchQuery(api.messages.get, {}, { token })
}

export async function putMessage(message: string) {
  const token = await getClerkToken()
  return await fetchMutation(api.messages.insert, {
    content: message
  }, { token })
}