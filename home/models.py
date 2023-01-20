from django.db import models

from wagtail.models import Page
from wagtail.admin.edit_handlers import FieldPanel
from wagtail.core.fields import RichTextField

from flex.models import FlexPage

class HomePage(Page):
    max_count = 1
    def get_context(self, request, *args, **kwargs):
        context = super().get_context(request, *args, **kwargs)
        
        context['hero'] = (
            self.get_children().type(HeroPage).specific()
                if self.get_children().type(HeroPage).first()
                else None
        )

        context['highlights'] = (
            self.get_children().type(CarrouselPage).first().get_children().specific()
                if self.get_children().type(CarrouselPage).first()
                else None
        )

        context['cards_sections'] = (
            self.get_children().type(CardSectionPage).first().get_children().specific()
                if self.get_children().type(CardSectionPage).first()
                else None
        )

        context['flex_pages'] = (
            self.get_children().type(FlexPage).specific() 
                if self.get_children().type(FlexPage) 
                else None
        )

        return context

    subpage_types = [
        'home.CarrouselPage',  # appname.ModelName
        'home.CardSectionPage',
        'home.HeroPage',
        'flex.FlexPage'
    ]
    parent_page_type = [
        'wagtailcore.Page'
    ]


class CarrouselPage(Page):
    max_count = 1
    # definimos que tipos de hijos puede tener
    subpage_types = [
        'home.Carrousel',  # appname.ModelName
    ]
    # definimos el tipo de padre
    parent_page_type = [
        'HomePage.Page'
    ]


class CardSectionPage(Page):
    max_count = 1
    # definimos que tipos de hijos puede tener
    subpage_types = [
        'home.Sections',  # appname.ModelName
    ]
    # definimos el tipo de padre
    parent_page_type = [
        'HomePage.Page'
    ]


class HeroPage(Page):
    max_count = 1
    hero_body = RichTextField(features=['h1', 'h2', 'bold', 'italic'])
    hero_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='hero_img'
    )
    
    content_panels = Page.content_panels + [
        FieldPanel('hero_body'),
        FieldPanel('hero_image', classname='full')
    ]
    subpage_types = []
    

class Carrousel(Page):
    max_count = 5
    carrousel_body = RichTextField(features=['bold', 'italic'])
    carrousel_cta = models.CharField(max_length=100)
    carousel_image_url = models.URLField()
    carousel_link = models.URLField()
    
    content_panels = Page.content_panels + [
        FieldPanel('carrousel_body'),
        FieldPanel('carrousel_cta'),
        FieldPanel('carousel_image_url'),
        FieldPanel('carousel_link')
    ]
    subpage_types = []
    


class Sections(Page):
    max_count = 6
    card_body = RichTextField(features=['bold', 'italic'])
    card_cta = models.CharField(max_length=100)
    card_link = models.URLField()
    card_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='card_img'
    )
    
    content_panels = Page.content_panels + [
        FieldPanel('card_body'),
        FieldPanel('card_cta'),
        FieldPanel('card_link'),
        FieldPanel('card_image', classname='full')
    ]
    subpage_types = []
    