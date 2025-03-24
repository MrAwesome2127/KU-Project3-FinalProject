// const typeDefs = []

// export default typeDefs


const typeDefs = `

    type User {
        _id: ID
        username: String
        email: String
        savedTasks: [Task]
    }
    
    type Auth {
        token: String
        user: User
    }
    
    type Query {
        me: User
    }
    
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, passwordWife: String!, passwordHusband: String!): Auth
        saveTask(task: TaskInput!): User
    }
    
    input TaskInput {
        title: String
        description: String
        status: String
    }
`


export default typeDefs;