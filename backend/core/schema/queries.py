import graphene
from django.db.models import Count, Q
from .types import ProjectType, TaskType, TaskCommentType
from ..models import Project, Task, TaskComment

class Query(graphene.ObjectType):
    projects = graphene.List(ProjectType, search=graphene.String())
    project_tasks = graphene.List(TaskType, project_id=graphene.ID(required=True))
    project_stats = graphene.Field(graphene.JSONString, project_id=graphene.ID(required=True))
    task_comments = graphene.List(TaskCommentType, task_id=graphene.ID(required=True))

    def resolve_projects(self, info, search=None):
        org = getattr(info.context, "org", None)
        qs = Project.objects.filter(organization=org).order_by("-created_at")
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search))
        return qs

    def resolve_project_tasks(self, info, project_id):
        org = getattr(info.context, "org", None)
        return Task.objects.filter(project__id=project_id, project__organization=org).order_by("-created_at")

    def resolve_project_stats(self, info, project_id):
        org = getattr(info.context, "org", None)
        base = Task.objects.filter(project__id=project_id, project__organization=org)
        total = base.count()
        done = base.filter(status="DONE").count()
        by_status = base.values("status").annotate(c=Count("id"))
        completion_rate = (done / total) * 100 if total else 0
        return {"total": total, "done": done, "completionRate": round(completion_rate, 2),
                "byStatus": {row["status"]: row["c"] for row in by_status}}

    def resolve_task_comments(self, info, task_id):
        org = getattr(info.context, "org", None)
        return TaskComment.objects.filter(task__id=task_id, task__project__organization=org).order_by("-timestamp")