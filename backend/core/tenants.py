from typing import Optional
from .models import Organization

def get_org_from_request(request) -> Optional[Organization]:
    slug = request.headers.get("X-Org-Slug") or request.GET.get("org")
    if not slug: return None
    try:
        return Organization.objects.get(slug=slug)
    except Organization.DoesNotExist:
        return None
