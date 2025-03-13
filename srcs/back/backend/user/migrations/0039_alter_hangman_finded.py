from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0038_hangman_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hangman',
            name='finded',
            field=models.BooleanField(default=False),
        ),
    ]
