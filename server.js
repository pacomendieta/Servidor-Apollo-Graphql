let bdcursos = require('./cursos')
const {ApolloServer } = require('apollo-server')
const { makeExecutableSchema } = require('@graphql-tools/schema')



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//DEFINICION DEL SCHEMA (TYPES Y RESOLVERS)
// ESCHEMA TYPES
const typeDefs = `
input CursoInput {
    title: String!
    views: Int
}
type Curso {
    id: ID
    title: String!
    views: Int
}
type Mensaje {
    mensaje: String
}
type Query {
    getCursos(pagina:Int=0,porpagina:Int=5): [Curso]
    getCurso(id:ID):Curso
    getAll:[Curso]
}
type Mutation {
    addCurso(input:CursoInput):Curso
    updateCurso(id:ID, input:CursoInput):Curso
    deleteCurso(id:ID):Mensaje
}
` //end typeDefs
//ESCHEMA RESOLVERS
const resolvers = {
    Query:{
        getCursos(rootvalue, args) {
            return bdcursos.slice(args.pagina*args.porpagina, (args.pagina+1)*args.porpagina)
        },
        getCurso(rootvalue, {id} ) {
            return bdcursos.find((curso)=>curso.id ==id )
        },
        getAll(rootvalue) {
            return bdcursos
        }
    },
    Mutation:{
        addCurso(rootvalue, {input}) {
            const {title,views} = input
            const curso = {title,views,id:String(bdcursos.length +1)}
            bdcursos.push(curso)
            return curso
        },
        updateCurso(rootvalue, {id,input} ){
            const {title, views} = input
            const pos = bdcursos.findIndex((curso)=>curso.id==id )
            if (!pos) return null;
            const curso = {id, ...input}
            bdcursos[pos] = curso
            return curso
        },
        deleteCurso(rootvalue,{id}) {
            bdcursos = bdcursos.filter((curso)=>curso.id != id )
            return { mensaje: `El curso con id=${id} ha sido eliminado`}
        }
    } //end Mutation
}  //end resolvers


//ESCHEMA
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

//INICIAR APOLLO SERVER
const server = new ApolloServer( {
    schema: schema
})
server.listen()
.then (({url})=>{
    console.log("Servidor http Apollo iniciado en ",url)
})