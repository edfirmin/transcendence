# Generated by Django 5.1.1 on 2025-01-28 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_alter_user_mfa_secret'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='is2FA',
            field=models.BooleanField(default=False, null=True),
        ),
    ]
