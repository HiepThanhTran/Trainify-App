def generate_code(sender, instance, created, **kwargs):
    if not instance.code:
        instance.code = instance.generate_code()
        instance.save()
