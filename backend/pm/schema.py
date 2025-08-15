import graphene
from core.schema.queries import Query as CoreQuery
from core.schema.mutations import Mutation as CoreMutation

class Query(CoreQuery, graphene.ObjectType): ...
class Mutation(CoreMutation, graphene.ObjectType): ...

schema = graphene.Schema(query=Query, mutation=Mutation)
