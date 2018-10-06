import { GraphQLServer } from 'graphql-yoga';

// Demo user data
const users = [
    {
        id: '1',
        name: 'Silverwing',
        email: 'silverwings@icloud.com',
        age: 23
    },
    {
        id: '2',
        name: 'Soyas',
        email: 'silverwingsw@icloud.com',
        age: 22
    },
    {
        id: '3',
        name: 'Mike',
        email: 'silverwingsdw@icloud.com',
        age: 21
    }
];

const comments = [
    {
        id: "1",
        text: "This a a very useful course for me. Thanks a lot!",
        author: "1",
        post: "1"
    },
    {
        id: "2",
        text: "Awsome! Very Very useful for me!",
        author: "2",
        post: "2"
    }
]

const  posts = [
    {
        id: '1',
        title: 'There is first post title 1',
        body: 'There is first post body',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'There is second post title',
        body: 'There is second post body 1',
        published: false,
        author: '2'
    },
    {
        id: '3',
        title: 'There is third post title',
        body: 'There is third post body',
        published: true,
        author: '3'
    },

]

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
        me: User!
        post: Post!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
    },
`

const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }
            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }
            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return isTitleMatch || isBodyMatch;
            });
        },
        comments(parent, args, ctx, info) {
            if (!args.query) {
                return comments;
            }
            return comments.filter((comment) => {
                return comment.text.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        me() {
            return {
                id: '12345',
                name: 'Silverrqwing',
                email: 'silverwingsw@icloud.com',
                age: 23
            }
        },
        post() {
            return {
                id: '123456',
                title: 'There is a title',
                body: 'There is a body',
                published: true
            }
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            console.log(args)
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.author;
            });
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id;
            });
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author;
            });
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.id;
            });
        }
    }
}


const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('The server is up!');
});