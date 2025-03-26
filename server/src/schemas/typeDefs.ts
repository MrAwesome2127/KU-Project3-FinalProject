// const typeDefs = []

// export default typeDefs


const typeDefs = `

    type User {
        _id: ID
        username: String
        email: String
        savedTasks: [Task]
    }

    type Task {
        _id: String
        title: String
        description: String
        stressLevel: String
        dueDate: String
        statusTask: String
    }

    type Auth {
        token: ID!
        user: User
    }

    input AddUserArgs {
        username: String!
        email: String!
        passwordWife: String!
        passwordHusband: String!
    }

    input AddTaskArgs {
        title: String
        description: String
        stressLevel: String
        dueDate: String
        statusTask: String
    }

    type Query {
        me: User
    }

    type Mutation {
        addProfile(input: AddUserArgs): Auth
        login(email: String!, password: String!): Auth
        addTask(task: AddTaskArgs): User
        updateTask(taskId: String!, task: AddTaskArgs): User
    }
`


export default typeDefs;