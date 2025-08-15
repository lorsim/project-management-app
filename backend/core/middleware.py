from django.http import JsonResponse
from .tenants import get_org_from_request

class OrganizationContextMiddleware:
    def __init__(self, get_response): self.get_response = get_response
    def __call__(self, request):
        if request.path.endswith("/graphql"):
            org = get_org_from_request(request)
            if not org:
                return JsonResponse({"errors":[{"message":"Missing or invalid X-Org-Slug"}]}, status=400)
            request.org = org
        return self.get_response(request)
