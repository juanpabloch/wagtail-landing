# Generated by Django 4.1.1 on 2022-10-18 16:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0005_sections'),
    ]

    operations = [
        migrations.RenameField(
            model_name='sections',
            old_name='carrousel_body',
            new_name='card_body',
        ),
        migrations.RenameField(
            model_name='sections',
            old_name='carrousel_cta',
            new_name='card_cta',
        ),
        migrations.RenameField(
            model_name='sections',
            old_name='carousel_link',
            new_name='card_link',
        ),
    ]
