# Generated by Django 5.1.1 on 2025-02-24 11:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0012_user_win_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='lose_count',
            field=models.BigIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='user',
            name='win_count',
            field=models.BigIntegerField(default=0),
        ),
    ]
