import graphene
from django.db.models import Count, Q
from .types import ProjectType, TaskType
from ..models import Project, Task

class Query(graphene.ObjectType):
    projects = graphene.List(
        ProjectType,
        search=graphene.String(),
        status=graphene.String(),
        first=graphene.Int(),
        offset=graphene.Int(),
        due_before=graphene.Date(),
        due_after=graphene.Date(),
    )
    project_tasks = graphene.List(
        TaskType,
        project_id=graphene.ID(required=True),
        status=graphene.String(),
        assignee_email=graphene.String(),
        first=graphene.Int(),
        offset=graphene.Int(),
        due_before=graphene.DateTime(),
        due_after=graphene.DateTime(),
    )
    project_stats = graphene.Field(graphene.JSONString, project_id=graphene.ID(required=True))

    def resolve_projects(self, info, search=None, status=None, first=None, offset=None, due_before=None, due_after=None):
        org = getattr(info.context, "org", None)
        qs = Project.objects.filter(organization=org).order_by("-created_at")
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search))
        if status:
            qs = qs.filter(status=status)
        if due_before:
            qs = qs.filter(due_date__lte=due_before)
        if due_after:
            qs = qs.filter(due_date__gte=due_after)
        # pagination
        if offset:
            qs = qs[offset:]
        if first:
            qs = qs[:first]
        return qs

    def resolve_project_tasks(self, info, project_id, status=None, assignee_email=None, first=None, offset=None, due_before=None, due_after=None):
        org = getattr(info.context, "org", None)
        qs = (Task.objects
              .select_related("project", "project__organization")  # perf
              .filter(project__id=project_id, project__organization=org)
              .order_by("-created_at"))
        if status:
            qs = qs.filter(status=status)
        if assignee_email:
            qs = qs.filter(assignee_email__iexact=assignee_email)
        if due_before:
            qs = qs.filter(due_date__lte=due_before)
        if due_after:
            qs = qs.filter(due_date__gte=due_after)
        if offset:
            qs = qs[offset:]
        if first:
            qs = qs[:first]
        return qs

    def resolve_project_stats(self, info, project_id):
        org = getattr(info.context, "org", None)
        base = Task.objects.filter(project__id=project_id, project__organization=org)
        total = base.count()
        done = base.filter(status="DONE").count()
        by_status = base.values("status").annotate(c=Count("id"))
        completion_rate = (done / total) * 100 if total else 0
        return {"total": total, "done": done, "completionRate": round(completion_rate, 2),
                "byStatus": {row["status"]: row["c"] for row in by_status}}
