# Generated by Django 5.1.5 on 2025-01-19 14:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0003_category_transaction_type'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='category',
            unique_together=set(),
        ),
    ]
