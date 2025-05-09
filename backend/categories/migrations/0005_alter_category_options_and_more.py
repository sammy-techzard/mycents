# Generated by Django 5.1.5 on 2025-01-19 14:12

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0004_alter_category_unique_together'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='category',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterUniqueTogether(
            name='category',
            unique_together={('user', 'name')},
        ),
        migrations.AddField(
            model_name='category',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='category',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.RemoveField(
            model_name='category',
            name='icon',
        ),
        migrations.RemoveField(
            model_name='category',
            name='transaction_type',
        ),
    ]
