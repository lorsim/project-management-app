import graphene
from graphene_django import DjangoObjectType
from ..models import Organization, Project, Task, TaskComment

class OrganizationType(DjangoObjectType):
    class Meta: model = Organization; fields = ("id","name","slug","contact_email","created_at")

class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_tasks = graphene.Int()
    class Meta: model = Project; fields = ("id","name","description","status","due_date","created_at")
    def resolve_task_count(self, info): return self.tasks.count()
    def resolve_completed_tasks(self, info): return self.tasks.filter(status="DONE").count()

class TaskType(DjangoObjectType):
    class Meta: model = Task; fields = ("id","title","description","status","assignee_email","due_date","created_at","project")

class TaskCommentType(DjangoObjectType):
    class Meta: model = TaskComment; fields = ("id","content","author_email","timestamp","task")
