import pytest
from django.test import Client
from core.models import Organization, Project
pytestmark = pytest.mark.django_db

def test_org_isolation():
    a = Organization.objects.create(name="A", slug="a", contact_email="a@x.com")
    b = Organization.objects.create(name="B", slug="b", contact_email="b@x.com")
    Project.objects.create(organization=a, name="P1", status="ACTIVE")
    Project.objects.create(organization=b, name="P2", status="ACTIVE")
    c = Client()
    q = '{"query":"{ projects { name } }"}'
    r1 = c.post("/graphql", data=q, content_type="application/json", **{"HTTP_X_ORG_SLUG":"a"})
    r2 = c.post("/graphql", data=q, content_type="application/json", **{"HTTP_X_ORG_SLUG":"b"})
    assert r1.json()["data"]["projects"] == [{"name":"P1"}]
    assert r2.json()["data"]["projects"] == [{"name":"P2"}]