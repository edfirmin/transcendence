# Generated by Django 5.1.1 on 2025-02-26 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0017_tourney_tourney_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tourney',
            name='tourney_id',
            field=models.CharField(unique=True),
        ),
    ]
