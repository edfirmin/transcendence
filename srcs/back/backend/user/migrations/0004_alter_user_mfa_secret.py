# Generated by Django 5.1.1 on 2024-12-11 12:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_alter_user_mfa_secret'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='mfa_secret',
            field=models.CharField(blank=True, max_length=16, null=True),
        ),
    ]