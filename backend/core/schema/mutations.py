import graphene
from django.utils import timezone
from .types import ProjectType, TaskType, TaskCommentType
from ..models import Project, Task, TaskComment

class CreateProject(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String(default_value="ACTIVE")
        due_date = graphene.Date()
    project = graphene.Field(ProjectType)
    @classmethod
    def mutate(cls, root, info, name, description="", status="ACTIVE", due_date=None):
        org = getattr(info.context, "org", None)
        project = Project.objects.create(organization=org, name=name, description=description, status=status, due_date=due_date)
        return CreateProject(project=project)

class UpdateProject(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()
    project = graphene.Field(ProjectType)
    @classmethod
    def mutate(cls, root, info, id, **kwargs):
        org = getattr(info.context, "org", None)
        project = Project.objects.get(id=id, organization=org)
        for k,v in kwargs.items():
            if v is not None: setattr(project, k, v)
        project.save()
        return UpdateProject(project=project)

class CreateTask(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String(default_value="TODO")
        assignee_email = graphene.String()
        due_date = graphene.DateTime()
    task = graphene.Field(TaskType)
    @classmethod
    def mutate(cls, root, info, project_id, title, description="", status="TODO", assignee_email="", due_date=None):
        org = getattr(info.context, "org", None)
        project = Project.objects.get(id=project_id, organization=org)
        task = Task.objects.create(project=project, title=title, description=description, status=status, assignee_email=assignee_email, due_date=due_date)
        return CreateTask(task=task)

class UpdateTaskStatus(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        status = graphene.String(required=True)
    task = graphene.Field(TaskType)
    @classmethod
    def mutate(cls, root, info, id, status):
        org = getattr(info.context, "org", None)
        task = Task.objects.get(id=id, project__organization=org)
        task.status = status
        task.save()
        return UpdateTaskStatus(task=task)

class AddTaskComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)
    comment = graphene.Field(TaskCommentType)
    @classmethod
    def mutate(cls, root, info, task_id, content, author_email):
        org = getattr(info.context, "org", None)
        task = Task.objects.get(id=task_id, project__organization=org)
        comment = TaskComment.objects.create(task=task, content=content, author_email=author_email, timestamp=timezone.now())
        return AddTaskComment(comment=comment)

class Mutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    create_task = CreateTask.Field()
    update_task_status = UpdateTaskStatus.Field()
    add_task_comment = AddTaskComment.Field()
