export default defineEventHandler(async() =>{
    await new Promise(resolve => setTimeout(resolve, 300000))
    return {message: 'Mock completed'}
})