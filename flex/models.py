from tabnanny import verbose
from django.db import models
from wagtail.models import Page
from wagtail.admin.edit_handlers import FieldPanel
from wagtail.core.fields import RichTextField

# Create your models here.
class FlexPage(Page):
    """flexible page class"""
    template = 'flex/flex_page.html'
    subtitle = models.CharField(max_length=100, null=True, blank=True)
    
    content_panels = Page.content_panels + [
        FieldPanel('subtitle')
    ]
    
    parent_page_type = [
        'HomePage.Page'
    ]
    subpage_types = []
    
    class Meta:
        verbose_name = 'Flex Page'
        verbose_name_plural = 'Flex Pages'